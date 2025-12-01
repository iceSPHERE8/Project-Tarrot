import { useGLTF, Float, Html } from "@react-three/drei";

export default function ModelCard({ position }) {
    const { scene } = useGLTF("/models/tarrot_deck.glb");

    const sceneInstance = scene.clone();

    return (
        <Float>
            <primitive object={sceneInstance} scale={2} position={position} />
            <Html>
                <div className="bg-white">
                    点击抽取
                </div>
            </Html>
        </Float>
    );
}
