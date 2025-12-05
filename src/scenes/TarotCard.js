import * as THREE from "three";
import { useEffect, useRef, useState, useMemo } from "react"; // Added useMemo for cloning optimization
import { useGLTF, Float, Html } from "@react-three/drei";

import { TAROT_CARD_IMAGES } from "@/lib/tarot-images.generated";
import { useFrame } from "@react-three/fiber";

import { addClickEntropy, getTrueRandomInt } from "@/utils/trueRandom";

import { TAROT_TEXTURES } from "@/lib/tarot-textures";

/* ===================================================================
   ModelCard Component
   Renders a single interactive tarot card model with flip animation
   and dynamic front-face texture swapping on click.
   =================================================================== */

export default function ModelCard({ position }) {
    /* ---------------------------------------------------------------
       Load the GLTF model (shared across instances, cached by drei)
       --------------------------------------------------------------- */
    const { scene } = useGLTF("/models/tarrot_deck_2.glb");

    /* ---------------------------------------------------------------
       Create a unique clone of the scene for this card instance.
       - Clones geometry and structure.
       - Explicitly clones the front-face material to prevent sharing
         across multiple card instances.
       --------------------------------------------------------------- */
    const sceneInstance = useMemo(() => {
        const clone = scene.clone();

        clone.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                if (
                    child.name.toLowerCase().includes("front") ||
                    child.material?.name === "card_front"
                ) {
                    // Clone material to ensure texture changes are isolated
                    child.material = child.material.clone();
                }
            }
        });

        return clone;
    }, [scene]);

    /* ---------------------------------------------------------------
       State Management
       - isFlipping: Prevents multiple flips during animation
       - targetRotation: Target Z-rotation for flip (adds π each click)
       - currentCardId: Index of the tarot image to display on front
       - isReversed: State to manage the tarot reverse and display
       --------------------------------------------------------------- */
    const [isFlipping, setIsFlipping] = useState(false);
    const [targetRotation, setTargetRotation] = useState(0);
    const [currentCardId, setCurrentCardId] = useState(null);
    const [isReversed, setIsReversed] = useState(false);

    const [cardMeaning, setCardMeaning] = useState(null);

    /* ---------------------------------------------------------------
       Reference to the group for rotation animation in useFrame
       --------------------------------------------------------------- */
    const groupRef = useRef();

    /* ---------------------------------------------------------------
       Click Handler
       - Stops event propagation to avoid camera interference
       - Generates random card ID
       - Triggers flip by incrementing rotation target by 180° (π radians)
       --------------------------------------------------------------- */
    const handleClick = (e) => {
        e.stopPropagation();

        if (isFlipping) {
            return;
        }

        setIsFlipping(true);

        let clientX = 256;
        let clientY = 256;

        if (e.clientX !== undefined) clientX = e.clientX;
        else if (e.touches && e.touches[0]) clientX = e.touches[0].clientX;

        if (e.clientY !== undefined) clientY = e.clientY;
        else if (e.touches && e.touches[0]) clientY = e.touches[0].clientY;

        addClickEntropy(clientX, clientY);

        const newId = getTrueRandomInt(TAROT_CARD_IMAGES.length);
        const reversed = getTrueRandomInt(2) === 1;

        setCurrentCardId(newId);
        setIsReversed(reversed);

        setTargetRotation((prev) => prev + Math.PI);
    };

    /* ---------------------------------------------------------------
       Animation Loop (useFrame)
       - Smoothly lerps current rotation toward target
       - Flip completion detection (optional: uncomment setIsFlipping)
       --------------------------------------------------------------- */
    useFrame(() => {
        if (!groupRef.current) return;

        groupRef.current.rotation.z = THREE.MathUtils.lerp(
            groupRef.current.rotation.z,
            targetRotation,
            0.1 // Lower = slower & smoother (0.08–0.15 recommended)
        );

        // Detect near-completion of flip
        if (Math.abs(groupRef.current.rotation.z - targetRotation) < 0.01) {
            // setIsFlipping(false); // Uncomment to re-enable clicks after flip
        }
    });

    /* ---------------------------------------------------------------
       Texture Update Effect
       - Runs when currentCardId changes
       - Loads new texture and applies it only to front-face meshes
       - Marks material for update to trigger re-render
       --------------------------------------------------------------- */
    useEffect(() => {
        if (currentCardId == null) return;

        if (TAROT_TEXTURES[currentCardId]) {
            const texture = TAROT_TEXTURES[currentCardId].clone();

            // While ieReversed is true, change the rotation
            if (isReversed) {
                texture.center.set(0.5, 0.5);
                texture.rotation = Math.PI;
            } else {
                texture.rotation = 0;
            }

            texture.needsUpdate = true;

            // Traverse only this card's cloned instance
            sceneInstance.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    const mat = child.material;

                    if (
                        child.name.includes("front") ||
                        child.material.name === "card_front"
                    ) {
                        mat.map = texture;
                        mat.metalness = 1.0;
                        mat.roughness = 0.2;
                        mat.needsUpdate = true;
                    }
                }
            });
        }
    }, [sceneInstance, currentCardId, isReversed]);

    useEffect(() => {
        if (currentCardId == null) {
            return;
        }
        async function fetchMeaning() {
            try {
                const res = await fetch("/api/tarot/meaning", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        cardId: currentCardId,
                        isReversed,
                    }),
                });

                if (!res.ok) throw new Error("Failed to fetch meaning");

                const data = await res.json();
                console.log(data);
                setCardMeaning(data);
            } catch (error) {
                console.error("Failed to fetch meaning:", error);
                setCardMeaning({ meaning: "网络波动，请稍后重试" });
            }
        }

        fetchMeaning();
    }, [currentCardId]);

    /* ---------------------------------------------------------------
       Render
       - Group with position and click handler
       - Primitive renders the cloned GLTF scene
       --------------------------------------------------------------- */
    return (
        <>
            <Float
                speed={0.25}
                rotationIntensity={0.5}
                floatIntensity={0.25}
                floatingRange={[-0.25, 0.25]}
            >
                <group position={position} onClick={handleClick} ref={groupRef}>
                    <primitive object={sceneInstance} scale={2} />
                    {/* <Html>
                    <div className="bg-white bg-opacity-45 w-48 backdrop-blur-sm rounded-2xl shadow-xl p-4 max-w-lg mx-auto text-[12px] leading-relaxed text-gray-800 border border-white/20">
                        与教会、宗教、教派、神职人员相关的事物，有时甚至是将要与问卜者结婚的牧师；也代表分离、不幸的结合、竞争的利益。
                    </div>
                </Html> */}
                </group>
            </Float>
        </>
    );
}

/* ===================================================================
   End of ModelCard Component
   =================================================================== */
