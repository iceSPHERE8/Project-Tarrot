import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

const MEANINGS_FILE = path.join(process.cwd(), "data", "tarot-cards.json");

let meaningCache = null;

async function getMeanings() {
    if (!meaningCache) {
        const json = await fs.readFile(MEANINGS_FILE, "utf-8");
        meaningCache = JSON.parse(json);
    }
    return meaningCache;
}

export async function POST(request) {
    try {
        const { cardId, isReversed } = await request.json();

        if (cardId === null || typeof cardId !== "number") {
            return NextResponse.json(
                { error: "Invalid cardId" },
                { status: 400 }
            );
        }

        const meanings = await getMeanings();
        const cardData = meanings[cardId];

        if (!cardData) {
            return NextResponse.json(
                { error: "Card not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: cardId,
            name: cardData.name,
            meaning: isReversed ? cardData.reversed : cardData.upright,
            keywords: cardData.keywords || [],
            isReversed,
        });
    } catch (error) {
        console.error("Tarot meaning API error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
