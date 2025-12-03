import ModelCard from "@/scenes/TarotCard";

export default function Relationship() {
    return (
        <>
            <group position={[0, 0, 1.8]}>
                <ModelCard position={[-4, 0, 0]} />
                <ModelCard position={[4, 0, 0]} />
                <ModelCard position={[0, 0, 0]} />
                <ModelCard position={[0, 0, -5]} />
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
