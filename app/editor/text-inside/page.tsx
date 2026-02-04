"use client";

import dynamic from "next/dynamic";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";
import { TextInsideSidebar } from "@/components/TextInsideSidebar";
import { TextInsideMobileToolbar } from "@/components/TextInsideMobileToolbar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Dynamic import for react-konva (requires client-side rendering)
const TextInsideCanvas = dynamic(
    () => import("@/components/TextInsideCanvas").then((mod) => mod.TextInsideCanvas),
    {
        ssr: false,
        loading: () => (
            <div className="flex-1 flex items-center justify-center bg-zinc-900">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-zinc-400 font-medium">Loading canvas...</p>
                </div>
            </div>
        ),
    }
);

function EditorContent() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div className={`flex h-screen overflow-hidden transition-colors ${isDark ? "bg-zinc-950" : "bg-zinc-50"}`}>
            {/* Left Sidebar - Hidden on mobile */}
            <TextInsideSidebar />

            {/* Main Canvas Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar - Hidden on mobile (MobileToolbar has its own header) */}
                <div className={`h-12 hidden md:flex items-center justify-between px-6 border-b transition-colors ${isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200"
                    }`}>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isDark ? "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800" : "bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200"
                                }`}
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Back
                        </Link>
                        <div className={`px-3 py-1 rounded-lg text-xs font-medium ${isDark ? "bg-zinc-900 text-zinc-400" : "bg-zinc-100 text-zinc-600"
                            }`}>
                            Text Inside Image
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-xs ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
                            Drag to move • Corners to resize • Click empty area to deselect
                        </span>
                    </div>
                </div>

                {/* Canvas Container - Adjusted padding for mobile */}
                <div className="flex-1 p-1 md:p-4 pt-14 pb-1 md:pt-4 md:pb-4">
                    <TextInsideCanvas />
                </div>
            </div>

            {/* Mobile Toolbar - Only visible on mobile */}
            <TextInsideMobileToolbar />
        </div>
    );
}

export default function TextInsideEditorPage() {
    return (
        <ThemeProvider>
            <EditorContent />
        </ThemeProvider>
    );
}
