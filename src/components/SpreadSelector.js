"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { PrevArrow, NextArrow } from "./ui/arrow-icon";

const spreadList = [
    { id: "daily", name: "Daily-Single", enDesc: "One card for your day" },
    { id: "three-card", name: "Three-Card", enDesc: "Past · Present · Future" },
    { id: "celtic-cross", name: "Celtic-Cross", enDesc: "Full 10-card in-depth reading" },
    { id: "relationship", name: "Releationship", enDesc: "Complete relationship analysis" },
    { id: "decision", name: "Decision", enDesc: "Best choice between two paths" },
    // { id: "monthly", name: "月度" },
];

export default function SpreadSelector() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentSpreadId = searchParams.get("spread") || "daily";

    let currentIndex = spreadList.findIndex(
        (item) => item.id === currentSpreadId
    );
    if (currentIndex === -1) currentIndex = 0;

    const currentName = spreadList[currentIndex].name;

    const changeSpread = (direction) => {
        let newIndex;
        if (direction === "next") {
            newIndex = (currentIndex + 1) % spreadList.length;
        } else {
            newIndex =
                (currentIndex - 1 + spreadList.length) % spreadList.length;
        }

        const newSpreadId = spreadList[newIndex].id;

        const params = new URLSearchParams(searchParams);
        params.set("spread", newSpreadId);

        router.push(`/?${params.toString()}`);
    };

    return (
        <>
            <div className="z-99 fixed bottom-16 flex flex-col w-full justify-center items-center">
                {/* <ul className="flex gap-4 text-[12px]">
                    {spreadList.map((item) => {
                        return (
                            <li
                                key={item.id}
                                onClick={() => handleClick(item.id)}
                            >
                                <div className="bg-white">{item.name}</div>
                            </li>
                        );
                    })}
                </ul> */}

                <div className="flex gap-2">
                    <PrevArrow handleClick={() => changeSpread("prev")} />
                    <div className="text-[#08060b] text-sm font-bold px-4 bg-linear-to-r from-transparent via-[#d8d3d7] to-transparent bg-size-[100%_100%] w-36 text-center">
                        { spreadList[currentIndex].name }
                    </div>
                    <NextArrow handleClick={() => changeSpread("next")} />
                </div>
                <div className="text-[#d8d3d7] text-[12px] mt-2 opacity-75">
                    { spreadList[currentIndex].enDesc }
                </div>
            </div>
        </>
    );
}
