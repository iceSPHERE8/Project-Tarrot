"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import {
    EffectComposer,
    Vignette,
    Bloom,
    ToneMapping,
} from "@react-three/postprocessing";

import ModelCard from "@/scenes/TarotCard";

export default function HomeScene() {

    return (
        <>
            <div className="fixed inset-0 bg-black">
                <Canvas camera={{ position: [0, 10, 0], fov: 50 }}>
                    <pointLight intensity={25} position={[0, 5, 0]} />
                    <pointLight intensity={15} position={[1, 5, 1]} />

                    <ModelCard position={[0, 0, 0]} />

                    <OrbitControls />
                    <Environment files={"/hdr/studio_small_04_1k.hdr"} background blur={0.6} />

                    <EffectComposer>
                        <Vignette
                            offset={0.3}
                            darkness={0.9} 
                            color="rgb(120, 50, 150)"
                        />

                        <Bloom
                            intensity={0.8} 
                            luminanceThreshold={0.6} 
                            luminanceSmoothing={0.9}
                            radius={0.8}
                        />

                        <ToneMapping
                            mode={1}
                            exposure={1.2}
                            whitePoint={5}
                        />
                    </EffectComposer>
                </Canvas>
            </div>
        </>
    );
}
