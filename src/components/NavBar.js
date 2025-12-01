"use client";

import Link from "next/link";

export default function Navbar() {
    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
                <nav className="container mx-auto px-6 py-4">
                    <div className="flex justify-center items-center pointer-events-auto">
                        {/* 左边导航 */}
                        <div className="flex gap-12 z-99">
                            <Link
                                href="/"
                                className="text-white text-sm font-medium"
                            >
                                首页
                            </Link>
                            <Link
                                href="/guide"
                                className="text-white text-sm font-medium"
                            >
                                秘仪指南
                            </Link>
                            <Link
                                href="/about"
                                className="text-white text-sm font-medium"
                            >
                                关于我们
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
