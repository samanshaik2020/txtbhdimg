"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Upload, Maximize2, Sun, Moon, Trash2, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResizeImagePage() {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem("theme");
            return saved ? saved === "dark" : true;
        }
        return true;
    });
    const [mounted, setMounted] = useState(() => typeof window !== 'undefined');
    const [image, setImage] = useState<string | null>(null);
    const [, setOriginalFile] = useState<File | null>(null);
    const [originalWidth, setOriginalWidth] = useState(0);
    const [originalHeight, setOriginalHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [lockAspect, setLockAspect] = useState(true);
    const [resizedImage, setResizedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (mounted) {
            document.documentElement.classList.remove("light", "dark");
            document.documentElement.classList.add(isDark ? "dark" : "light");
        }
    }, [isDark, mounted]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setOriginalFile(file);
        const url = URL.createObjectURL(file);
        setImage(url);
        const img = new Image();
        img.onload = () => {
            setOriginalWidth(img.width);
            setOriginalHeight(img.height);
            setWidth(img.width);
            setHeight(img.height);
        };
        img.src = url;
    };

    const handleWidthChange = (newWidth: number) => {
        setWidth(newWidth);
        if (lockAspect && originalWidth > 0) setHeight(Math.round(newWidth * (originalHeight / originalWidth)));
    };

    const handleHeightChange = (newHeight: number) => {
        setHeight(newHeight);
        if (lockAspect && originalHeight > 0) setWidth(Math.round(newHeight * (originalWidth / originalHeight)));
    };

    useEffect(() => {
        if (image && width > 0 && height > 0 && canvasRef.current) {
            const timer = setTimeout(() => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => {
                    const canvas = canvasRef.current!;
                    canvas.width = width;
                    canvas.height = height;
                    canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
                    setResizedImage(canvas.toDataURL("image/png"));
                };
                img.src = image;
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [image, width, height]);

    const downloadImage = () => {
        if (!resizedImage) return;
        const link = document.createElement("a");
        link.download = `resized-${width}x${height}.png`;
        link.href = resizedImage;
        link.click();
    };

    const presets = [
        { name: "Instagram", w: 1080, h: 1080 },
        { name: "YouTube", w: 1280, h: 720 },
        { name: "Twitter", w: 1200, h: 675 },
    ];

    if (!mounted) return null;

    return (
        <div className={`h-screen flex flex-col overflow-hidden ${isDark ? "bg-zinc-950 text-white" : "bg-white text-zinc-900"}`}>
            <canvas ref={canvasRef} className="hidden" />
            <nav className={`shrink-0 border-b ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
                <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className={`flex items-center gap-2 text-sm ${isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-zinc-900"}`}>
                            <ArrowLeft className="w-4 h-4" /> Back
                        </Link>
                        <div className="w-px h-5 bg-zinc-700" />
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                <Maximize2 className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="font-semibold text-sm">Resize Image</span>
                        </div>
                    </div>
                    <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-lg ${isDark ? "hover:bg-zinc-800" : "hover:bg-zinc-100"}`}>
                        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                </div>
            </nav>

            <main className="flex-1 flex items-center justify-center p-4 overflow-hidden">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

                {!image ? (
                    <div onClick={() => fileInputRef.current?.click()} className={`w-full max-w-2xl border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer ${isDark ? "border-zinc-800 hover:border-blue-500/50" : "border-zinc-300 hover:border-blue-500/50"}`}>
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 ${isDark ? "bg-zinc-900" : "bg-zinc-100"}`}>
                            <Upload className="w-8 h-8 text-blue-500" />
                        </div>
                        <p className="text-lg font-medium mb-1">Upload an image</p>
                        <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>PNG, JPG, WEBP</p>
                    </div>
                ) : (
                    <div className="w-full max-w-4xl flex gap-4">
                        {/* Controls */}
                        <div className={`w-64 shrink-0 p-4 rounded-xl ${isDark ? "bg-zinc-900" : "bg-zinc-100"} flex flex-col gap-4`}>
                            <div className="flex items-center gap-2">
                                <div className="flex-1">
                                    <label className={`text-xs mb-1 block ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>Width</label>
                                    <Input type="number" value={width} onChange={(e) => handleWidthChange(Number(e.target.value))} className={`h-9 ${isDark ? "bg-zinc-800 border-zinc-700" : ""}`} />
                                </div>
                                <button onClick={() => setLockAspect(!lockAspect)} className={`mt-5 p-2 rounded ${lockAspect ? "bg-blue-500 text-white" : isDark ? "bg-zinc-800" : "bg-zinc-200"}`}>
                                    {lockAspect ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                                </button>
                                <div className="flex-1">
                                    <label className={`text-xs mb-1 block ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>Height</label>
                                    <Input type="number" value={height} onChange={(e) => handleHeightChange(Number(e.target.value))} className={`h-9 ${isDark ? "bg-zinc-800 border-zinc-700" : ""}`} />
                                </div>
                            </div>
                            <p className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>Original: {originalWidth}×{originalHeight}</p>
                            <div className="flex flex-wrap gap-1">
                                {presets.map((p) => (
                                    <button key={p.name} onClick={() => { setWidth(p.w); setHeight(p.h); setLockAspect(false); }} className={`px-2 py-1 rounded text-xs ${isDark ? "bg-zinc-800 hover:bg-zinc-700" : "bg-zinc-200 hover:bg-zinc-300"}`}>
                                        {p.name}
                                    </button>
                                ))}
                            </div>
                            <Button onClick={downloadImage} disabled={!resizedImage} className="h-9 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-sm mt-auto">
                                <Download className="w-4 h-4 mr-1" /> Download
                            </Button>
                            <Button onClick={() => { setImage(null); setResizedImage(null); }} variant="outline" className={`h-9 rounded-lg ${isDark ? "border-zinc-700" : ""}`}>
                                <Trash2 className="w-4 h-4 mr-1" /> Reset
                            </Button>
                        </div>
                        {/* Preview */}
                        <div className={`flex-1 p-3 rounded-xl ${isDark ? "bg-zinc-900" : "bg-zinc-100"} flex flex-col`}>
                            <span className={`text-xs font-medium mb-2 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>Preview ({width}×{height})</span>
                            <div className="flex-1 rounded-lg overflow-hidden bg-black/20 flex items-center justify-center" style={{ maxHeight: "60vh" }}>
                                {resizedImage ? <img src={resizedImage} alt="Resized" className="max-w-full max-h-full object-contain" /> : <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
