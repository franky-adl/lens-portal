import {
    Sky,
    Environment,
    useFBO,
    ContactShadows,
    MeshTransmissionMaterial,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const Lens = () => {
    const meshDodeca = useRef();
    const meshTorus = useRef();
    const meshBall1 = useRef();
    const meshBall2 = useRef();
    const meshLens = useRef();
    const renderTarget = useFBO();

    useFrame((state) => {
        const { gl, clock, scene, camera, pointer } = state;

        const viewport = state.viewport.getCurrentViewport(camera, [0, 0, 2]);

        meshLens.current.position.x = THREE.MathUtils.lerp(
            meshLens.current.position.x,
            (pointer.x * viewport.width) / 2,
            0.1
        );
        meshLens.current.position.y = THREE.MathUtils.lerp(
            meshLens.current.position.y,
            (pointer.y * viewport.height) / 2,
            0.1
        );

        // First, we render the underlying scene to the FBO (renderTarget)
        const oldMaterialmeshBall1 = meshBall1.current.material;
        const oldMaterialmeshBall2 = meshBall2.current.material;

        meshDodeca.current.visible = false;
        meshTorus.current.visible = true;

        meshBall1.current.material = new THREE.MeshBasicMaterial();
        meshBall1.current.material.color = new THREE.Color("#000000");
        meshBall1.current.material.wireframe = true;

        meshBall2.current.material = new THREE.MeshBasicMaterial();
        meshBall2.current.material.color = new THREE.Color("#000000");
        meshBall2.current.material.wireframe = true;

        gl.setRenderTarget(renderTarget);
        gl.render(scene, camera);

        // Then we render the front scene
        meshDodeca.current.visible = true;
        meshTorus.current.visible = false;

        meshBall1.current.material = oldMaterialmeshBall1;
        meshBall1.current.material.wireframe = false;

        meshBall2.current.material = oldMaterialmeshBall2;
        meshBall2.current.material.wireframe = false;

        meshDodeca.current.rotation.x = Math.cos(clock.elapsedTime / 2);
        meshDodeca.current.rotation.y = Math.sin(clock.elapsedTime / 2);
        meshDodeca.current.rotation.z = Math.sin(clock.elapsedTime / 2);

        meshTorus.current.rotation.x = Math.cos(clock.elapsedTime / 2);
        meshTorus.current.rotation.y = Math.sin(clock.elapsedTime / 2);
        meshTorus.current.rotation.z = Math.sin(clock.elapsedTime / 2);

        gl.setRenderTarget(null);
    });

    return (
        <>
            <Sky sunPosition={[10, 10, 0]} />
            <Environment preset="sunset" />
            <directionalLight args={[10, 10, 0]} intensity={1} />
            <ambientLight intensity={0.5} />
            <ContactShadows
                frames={1}
                scale={10}
                position={[0, -2, 0]}
                blur={4}
                opacity={0.2}
            />
            <mesh
                ref={meshLens}
                scale={0.5}
                position={[0, 0, 2.5]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <sphereGeometry args={[1, 128]} />
                <MeshTransmissionMaterial
                    buffer={renderTarget.texture}
                    ior={1.025}
                    thickness={0.5}
                    chromaticAberration={0.05}
                    backside
                />
            </mesh>
            <group>
                <mesh ref={meshTorus}>
                    <torusGeometry args={[1, 0.25, 16, 100]} />
                    <meshPhysicalMaterial
                        roughness={0}
                        clearcoat={1}
                        clearcoatRoughness={0}
                        color="#d7e7f5"
                    />
                </mesh>
                <mesh ref={meshDodeca}>
                    <dodecahedronGeometry args={[1]} />
                    <meshPhysicalMaterial
                        roughness={0}
                        clearcoat={1}
                        clearcoatRoughness={0}
                        color="#73B9ED"
                    />
                </mesh>
                <mesh ref={meshBall1} position={[-3, 1, -2]}>
                    <icosahedronGeometry args={[1, 8, 8]} />
                    <meshPhysicalMaterial
                        roughness={0}
                        clearcoat={1}
                        clearcoatRoughness={0}
                        color="#73B9ED"
                    />
                </mesh>
                <mesh ref={meshBall2} position={[3, -1, -2]}>
                    <icosahedronGeometry args={[1, 8, 8]} />
                    <meshPhysicalMaterial
                        roughness={0}
                        clearcoat={1}
                        clearcoatRoughness={0}
                        color="#73B9ED"
                    />
                </mesh>
            </group>
        </>
    );
};

const App = () => {
    return <Lens />;
};

export default App;
