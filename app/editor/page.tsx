"use client";

import dynamic from "next/dynamic";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";
import { ToolSidebar } from "@/components/ToolSidebar";
import { TourGuide } from "@/components/TourGuide";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Dynamic import for react-konva (requires client-side rendering)
const CanvasWorkspace = dynamic(
    () => import("@/components/CanvasWorkspace").then((mod) => mod.CanvasWorkspace),
    {
        ssr: false,
        loading: () => (
            <div className="flex-1 flex items-center justify-center bg-zinc-900">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
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
            {/* Left Sidebar */}
            <ToolSidebar />

            {/* Main Canvas Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <div className={`h-12 flex items-center justify-between px-6 border-b transition-colors ${isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200"
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
                            Canvas
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-xs ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
                            Drag to move • Corners to resize • Click empty area to deselect
                        </span>
                    </div>
                </div>

                {/* Canvas Container */}
                <div className="flex-1 p-4">
                    <CanvasWorkspace />
                </div>
            </div>

            {/* Tour Guide */}
            <TourGuide />
        </div>
    );
}

export default function EditorPage() {
    return (
        <ThemeProvider>
            <EditorContent />
        </ThemeProvider>
    );
}
