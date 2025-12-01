"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import ModelCard from "@/scenes/ModelCard";

export default function HomeScene() {
    return (
        <>
            <div className="fixed inset-0 bg-black">
                <Canvas camera={{ position: [0, 8, 0], fov: 45 }}>
                    <pointLight intensity={15} position={[0, 5, 0]} />
                    <pointLight intensity={15} position={[1, 5, 1]} />
                    <ModelCard position={[0, 0, 0]} />
                    {/* <ModelCard position={[3, 0, 0]} />
                    <ModelCard position={[-3, 0, 0]} /> */}

                    <OrbitControls />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                </Canvas>
            </div>
        </>
    );
}
