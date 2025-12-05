import * as THREE from "three";
import { TAROT_CARD_IMAGES } from "@/lib/tarot-images.generated";

const loader = new THREE.TextureLoader();

export const preloadTarotTextures = () => {
    return Promise.all(
        TAROT_CARD_IMAGES.map((url) => {
            return loader.loadAsync(url).then((texture) => {
                return texture;
            });
        })
    );
};

export const TAROT_TEXTURES = [];