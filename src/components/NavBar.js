"use client";

import Link from "next/link";

export default function Navbar() {
    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
                <nav className="container mx-auto px-6 py-6">
                    <div className="flex z-99 justify-center items-center pointer-events-auto">
                        {/* 左边导航 */}
                        <div className="text-white flex justify-center w-4/12 font-mono">
                            <Link href="/">tarot.</Link>
                        </div>
                        <div className="flex gap-16 w-8/12 justify-center items-center text-[#d8d3d7] text-[12px] font-bold">
                            <Link
                                href="/guide"
                                className="underline"
                            >
                                Daily Tarot
                            </Link>
                            <Link href="/guide" className="hover:underline">
                                Tarot Guide
                            </Link>
                            <Link href="/about" className="hover:underline">
                                About
                            </Link>
                        </div>

                        {/* 右边语言切换（先占位） */}
                        {/* <div className="text-white">中文</div> */}
                    </div>
                </nav>
            </header>
        </>
    );
}
