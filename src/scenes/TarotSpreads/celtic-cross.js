import ModelCard from "@/scenes/TarotCard";

import Tooltip from "@/utils/tooltip";
import celticCrossRoles from "@/lib/celtic-cross-roles";

export default function CelticCross() {
    return (
        <>
            <group position={[-2, 0, -2]}>
                <ModelCard position={[0, 0, 0]} />

                <group rotation={[0, Math.PI / 2, 0]}>
                    <ModelCard position={[-0.5, 1.3, 0]} />
                </group>

                <ModelCard position={[0, 0, -6.25]} />
                <ModelCard position={[0, 0, 6.25]} />
                <ModelCard position={[4.25, 0, 0]} />
                <ModelCard position={[-4.25, 0, 0]} />

                <ModelCard position={[8, 0, 6.25]} />
                <ModelCard position={[8, 0, 2]} />
                <ModelCard position={[8, 0, -2.25]} />
                <ModelCard position={[8, 0, -6.5]} />
            </group>
        </>
    );
}
