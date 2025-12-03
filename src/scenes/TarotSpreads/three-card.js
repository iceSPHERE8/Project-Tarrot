import ModelCard from "@/scenes/TarotCard"

export default function ThreeCard() {
    return <>
        <ModelCard position={[0, 0, 0]} />
        <ModelCard position={[3, 0, 0]} />
        <ModelCard position={[-3, 0, 0]} />
    </>
}