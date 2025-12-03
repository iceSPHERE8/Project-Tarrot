import ModelCard from "@/scenes/TarotCard"

export default function Monthly() {
    return <>
        <ModelCard position={[0, 0, 0]} />
        <ModelCard position={[3, 0, 0]} />
        <ModelCard position={[-3, 0, 0]} />
    </>
}

const spreadList = [
    { id: "daily", name: "单张" },
    { id: "three-card", name: "三张" },
    { id: "celtic-cross", name: "凯尔特十字" },
    { id: "relationship", name: "关系" },
    { id: "decision", name: "决策" },
    { id: "monthly", name: "月度" },
];