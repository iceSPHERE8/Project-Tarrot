import ModelCard from "@/scenes/TarotCard";

export default function CelticCross() {
    return (
        <>
            <group position={[-2, 0, -1.25]}>
                <ModelCard position={[0, 0, 0]} />
                <group rotation={[0, Math.PI / 2, 0]}>
                    <ModelCard position={[-0.5, 1.3, 0]} />
                </group>

                <ModelCard position={[0, 0, -6.25]} />
                <ModelCard position={[0, 0, 6.25]} />
                <ModelCard position={[4.25, 0, 0]} />
                <ModelCard position={[-4.25, 0, 0]} />

                <group position={[8, 0, 2]}>
                    <ModelCard position={[0, 0, 4.25]} />
                    <ModelCard position={[0, 0, 0]} />
                    <ModelCard position={[0, 0, -4.25]} />
                    <ModelCard position={[0, 0, -8.5]} />
                </group>
            </group>
        </>
    );
}

const spreadList = [
    { id: "daily", name: "单张" },
    { id: "three-card", name: "三张" },
    { id: "celtic-cross", name: "凯尔特十字" },
    { id: "relationship", name: "关系" },
    { id: "decision", name: "决策" },
    { id: "monthly", name: "月度" },
];
