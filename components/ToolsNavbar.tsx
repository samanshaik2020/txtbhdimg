"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    ArrowLeft,
    Sun,
    Moon,
    Maximize2,
    Minimize2,
    FileType,
    Scissors,
    RotateCw,
    ImageMinus,
    LucideIcon,
} from "lucide-react";

interface Tool {
    name: string;
    path: string;
    icon: LucideIcon;
    gradient: string;
    hoverBg: string;
}

const tools: Tool[] = [
    {
        name: "Resize",
        path: "/tools/resize",
        icon: Maximize2,
        gradient: "from-blue-500 to-cyan-500",
        hoverBg: "hover:bg-blue-500/10",
    },
    {
        name: "Compress",
        path: "/tools/compress",
        icon: Minimize2,
        gradient: "from-emerald-500 to-teal-500",
        hoverBg: "hover:bg-emerald-500/10",
    },
    {
        name: "Convert",
        path: "/tools/convert",
        icon: FileType,
        gradient: "from-indigo-500 to-purple-500",
        hoverBg: "hover:bg-indigo-500/10",
    },
    {
        name: "Crop",
        path: "/tools/crop",
        icon: Scissors,
        gradient: "from-orange-500 to-amber-500",
        hoverBg: "hover:bg-orange-500/10",
    },
    {
        name: "Rotate",
        path: "/tools/rotate",
        icon: RotateCw,
        gradient: "from-pink-500 to-rose-500",
        hoverBg: "hover:bg-pink-500/10",
    },
    {
        name: "Remove BG",
        path: "/tools/remove-background",
        icon: ImageMinus,
        gradient: "from-violet-500 to-purple-500",
        hoverBg: "hover:bg-violet-500/10",
    },
];

interface ToolsNavbarProps {
    isDark: boolean;
    onThemeToggle: () => void;
}

export default function ToolsNavbar({ isDark, onThemeToggle }: ToolsNavbarProps) {
    const pathname = usePathname();

    return (
        <nav className={`shrink-0 border-b ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                {/* Left: Back button */}
                <Link
                    href="/"
                    className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-colors ${isDark
                            ? "text-zinc-400 hover:text-white hover:bg-zinc-800"
                            : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                        }`}
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Back</span>
                </Link>

                {/* Center: Tools navigation */}
                <div className="flex items-center gap-1 sm:gap-2">
                    {tools.map((tool) => {
                        const isActive = pathname === tool.path;
                        const Icon = tool.icon;

                        return (
                            <Link
                                key={tool.path}
                                href={tool.path}
                                className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg transition-all duration-200 ${isActive
                                        ? `bg-gradient-to-r ${tool.gradient} text-white shadow-lg`
                                        : isDark
                                            ? `text-zinc-400 ${tool.hoverBg} hover:text-white`
                                            : `text-zinc-600 ${tool.hoverBg} hover:text-zinc-900`
                                    }`}
                            >
                                <div
                                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center ${isActive
                                            ? "bg-white/20"
                                            : `bg-gradient-to-br ${tool.gradient}`
                                        }`}
                                >
                                    <Icon
                                        className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isActive ? "text-white" : "text-white"
                                            }`}
                                    />
                                </div>
                                <span
                                    className={`text-xs sm:text-sm font-medium hidden md:inline ${isActive ? "text-white" : ""
                                        }`}
                                >
                                    {tool.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* Right: Theme toggle */}
                <button
                    onClick={onThemeToggle}
                    className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-zinc-800" : "hover:bg-zinc-100"
                        }`}
                >
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
            </div>
        </nav>
    );
}
