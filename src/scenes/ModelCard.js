import * as THREE from "three";
import { useEffect, useRef, useState, useMemo } from "react";  // Added useMemo for cloning optimization
import { useGLTF, Float } from "@react-three/drei";

import { TAROT_CARD_IMAGES } from "@/lib/tarot-images.generated";
import { useFrame } from "@react-three/fiber";

import { addClickEntropy, getTrueRandomInt } from "@/utils/trueRandom";

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

        if(e.clientX !== undefined) clientX = e.clientX;
        else if(e.touches && e.touches[0]) clientX = e.touches[0].clientX;

        if(e.clientY !== undefined) clientY = e.clientY;
        else if(e.touches && e.touches[0]) clientY = e.touches[0].clientY;

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
        if (currentCardId === null) return;

        // Traverse only this card's cloned instance
        sceneInstance.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const mat = child.material;

                if (
                    child.name.includes("front") ||
                    child.material.name === "card_front"
                ) {
                    // Load and apply new tarot card texture
                    const texture = new THREE.TextureLoader().load(
                        TAROT_CARD_IMAGES[currentCardId]
                    );

                    // While ieReversed is true, change the rotation
                    if(isReversed) {
                        texture.center.set(0.5, 0.5);
                        texture.rotation = Math.PI;
                    } else {
                        texture.rotation = 0;
                    }

                    mat.map = texture;
                    mat.metalnessMap = texture;
                    mat.normalMap = texture;
                    mat.metalness = 1.0;
                    mat.roughness = 0.25;
                    mat.normalScale.set(0.5, 0.5);
                    // mat.envMapIntensity = 2.0;

                    mat.needsUpdate = true;
                }
            }
        });
    }, [sceneInstance, currentCardId]);

    /* ---------------------------------------------------------------
       Render
       - Group with position and click handler
       - Primitive renders the cloned GLTF scene
       --------------------------------------------------------------- */
    return (
        <>
            <Float>
            <group position={position} onClick={handleClick} ref={groupRef}>
                <primitive
                    object={sceneInstance}
                    scale={2}
                />
            </group>
            </Float>
        </>
    );
}

/* ===================================================================
   End of ModelCard Component
   =================================================================== */