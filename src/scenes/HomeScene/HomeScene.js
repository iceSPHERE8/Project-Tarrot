"use client";

import { useSearchParams } from "next/navigation";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import {
    EffectComposer,
    Vignette,
    Bloom,
    ToneMapping,
} from "@react-three/postprocessing";

import * as THREE from "three";
import { lazy, Suspense, useEffect } from "react";

import { preloadTarotTextures, TAROT_TEXTURES } from "@/lib/tarot-textures";

const Daily = lazy(() => import("@/scenes/TarotSpreads/daily"));
const ThreeCard = lazy(() => import("@/scenes/TarotSpreads/three-card"));
const CelticCross = lazy(() => import("@/scenes/TarotSpreads/celtic-cross"));
const Relationship = lazy(() => import("@/scenes/TarotSpreads/relationship"));
const Decision = lazy(() => import("@/scenes/TarotSpreads/decision"));
// const Monthly = lazy(() => import("@/scenes/TarotSpreads/monthly"));

const SPREAD_COMPONENTS = {
    daily: Daily,
    "three-card": ThreeCard,
    "celtic-cross": CelticCross,
    relationship: Relationship,
    decision: Decision,
    // monthly: Monthly,
};

const CAMERA_PRESETS = {
    daily: { position: [0, 7, 1.25], fov: 50 }, // 单张：近距离特写
    "three-card": { position: [0, 9, 2], fov: 50 }, // 三张：稍微拉远
    "celtic-cross": { position: [0, 16, 4], fov: 60 }, // 10张：高空俯瞰
    relationship: { position: [0, 11, 3], fov: 50 }, // 6~8张：中等距离
    decision: { position: [0, 15, 5], fov: 50 }, // 决策：清晰对比
};

const targetPosition = new THREE.Vector3(0, 10, 0);
const targetFov = { value: 50 };

function AnimatedCamera({ preset }) {
    const { camera } = useThree();

    targetPosition.set(...preset.position);
    targetFov.value = preset.fov;

    // 每帧平滑插值（真正的丝滑！）
    useFrame(() => {
        camera.position.lerp(targetPosition, 0.1); // 0.1 = 速度，越小越缓
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        camera.fov += (targetFov.value - camera.fov) * 0.1;
        camera.updateProjectionMatrix();
    });

    return null;
}

export default function HomeScene() {
    const searchParams = useSearchParams();
    const spread = searchParams.get("spread") || "daily";
    const SpreadComponent = SPREAD_COMPONENTS[spread] || Daily;

    const cameraPreset = CAMERA_PRESETS[spread] || CAMERA_PRESETS.daily;

    // preload tarot textures
    useEffect(() => {
        preloadTarotTextures().then((textures) => {
            TAROT_TEXTURES.length = 0;
            TAROT_TEXTURES.push(...textures);
            console.log("所有塔罗图纹理预加载完成");
        });
    }, []);

    return (
        <>
            <Canvas
                // camera={{ position: cameraPreset.position, fov: cameraPreset.fov }}
                dpr={[1, 2]}
                gl={{ antialias: true, samples: 4 }}
            >
                <pointLight intensity={15} position={[3, 6, 1]} />
                <pointLight
                    color={"#bad0ff"}
                    intensity={25}
                    position={[-3, 6, 1]}
                />
                <pointLight
                    color={"#efbaff"}
                    intensity={45}
                    position={[3, 2, 1]}
                />

                <AnimatedCamera preset={cameraPreset} />

                <Suspense fallback={<LoadingPlaceholder />}>
                    <SpreadComponent />
                </Suspense>

                {/* <OrbitControls /> */}
                <Environment
                    files={"/hdr/rooftop_night_2k.hdr"}
                    environmentIntensity={1}
                    rotation={[0, Math.PI * 2, 0]}
                />

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

                    <ToneMapping mode={1} exposure={1.2} whitePoint={5} />
                </EffectComposer>
            </Canvas>
        </>
    );
}

function LoadingPlaceholder() {
    return (
        <mesh>
            <boxGeometry args={[4, 6, 0.1]} />
            <meshStandardMaterial
                color="#2a1540"
                emissive="#6e39b0"
                emissiveIntensity={0.5}
            />
        </mesh>
    );
}
