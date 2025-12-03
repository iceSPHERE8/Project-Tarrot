"use client";

import { useRouter, useSearchParams } from "next/navigation";

const spreadList = [
    { id: "daily", name: "单张" },
    { id: "three-card", name: "三张" },
    { id: "celtic-cross", name: "凯尔特十字" },
    { id: "relationship", name: "关系" },
    { id: "decision", name: "决策" },
    // { id: "monthly", name: "月度" },
];

export default function SpreadSelector() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const current = searchParams.get("spread") || "daily";

    const handleClick = (id) => {
        const params = new URLSearchParams(searchParams);
        params.set("spread", id);
        router.push(`/?${params.toString()}`);
    };

    return (
        <>
            <div className="z-99 fixed bottom-6 w-full flex justify-center">
                <ul className="flex gap-4 text-[12px]">
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
                </ul>
            </div>
        </>
    );
}
