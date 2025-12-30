"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Download,
    Upload,
    Minimize2,
    Sun,
    Moon,
    Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export default function CompressImagePage() {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem("theme");
            return saved ? saved === "dark" : true;
        }
        return true;
    });
    const [mounted, setMounted] = useState(() => typeof window !== 'undefined');
    const [image, setImage] = useState<string | null>(null);
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [quality, setQuality] = useState(80);
    const [compressedImage, setCompressedImage] = useState<string | null>(null);
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);
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
        setOriginalSize(file.size);
        setImage(URL.createObjectURL(file));
        setCompressedImage(null);
    };

    const compressImage = useCallback(() => {
        if (!image || !canvasRef.current) return;
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = canvasRef.current!;
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext("2d")!.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
                if (blob) {
                    setCompressedImage(URL.createObjectURL(blob));
                    setCompressedSize(blob.size);
                }
            }, "image/jpeg", quality / 100);
        };
        img.src = image;
    }, [image, quality]);

    useEffect(() => {
        if (image) {
            const timer = setTimeout(compressImage, 300);
            return () => clearTimeout(timer);
        }
    }, [image, quality, compressImage]);

    const downloadImage = () => {
        if (!compressedImage) return;
        const link = document.createElement("a");
        link.download = `compressed-${originalFile?.name || "image.jpg"}`;
        link.href = compressedImage;
        link.click();
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const savings = originalSize > 0 ? Math.round((1 - compressedSize / originalSize) * 100) : 0;

    if (!mounted) return null;

    return (
        <div className={`h-screen flex flex-col overflow-hidden ${isDark ? "bg-zinc-950 text-white" : "bg-white text-zinc-900"}`}>
            <canvas ref={canvasRef} className="hidden" />

            {/* Navbar */}
            <nav className={`shrink-0 border-b ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
                <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className={`flex items-center gap-2 text-sm ${isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-zinc-900"}`}>
                            <ArrowLeft className="w-4 h-4" /> Back
                        </Link>
                        <div className="w-px h-5 bg-zinc-700" />
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                                <Minimize2 className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="font-semibold text-sm">Compress Image</span>
                        </div>
                    </div>
                    <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-lg ${isDark ? "hover:bg-zinc-800" : "hover:bg-zinc-100"}`}>
                        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4 overflow-hidden">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

                {!image ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full max-w-2xl border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${isDark ? "border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-500/5" : "border-zinc-300 hover:border-emerald-500/50 hover:bg-emerald-50"
                            }`}
                    >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 ${isDark ? "bg-zinc-900" : "bg-zinc-100"}`}>
                            <Upload className="w-8 h-8 text-emerald-500" />
                        </div>
                        <p className="text-lg font-medium mb-1">Upload an image</p>
                        <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>PNG, JPG, WEBP</p>
                    </div>
                ) : (
                    <div className="w-full max-w-4xl flex flex-col gap-4">
                        {/* Quality Slider */}
                        <div className={`p-4 rounded-xl ${isDark ? "bg-zinc-900" : "bg-zinc-100"}`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Quality</span>
                                <span className={`text-xl font-bold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>{quality}%</span>
                            </div>
                            <Slider value={[quality]} onValueChange={([v]) => setQuality(v)} min={10} max={100} step={5} />
                        </div>

                        {/* Image Previews */}
                        <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
                            <div className={`p-3 rounded-xl ${isDark ? "bg-zinc-900" : "bg-zinc-100"} flex flex-col`}>
                                <div className="flex justify-between mb-2">
                                    <span className={`text-xs font-medium ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>Original</span>
                                    <span className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>{formatSize(originalSize)}</span>
                                </div>
                                <div className="flex-1 rounded-lg overflow-hidden bg-black/20 flex items-center justify-center" style={{ maxHeight: "35vh" }}>
                                    <img src={image} alt="Original" className="max-w-full max-h-full object-contain" />
                                </div>
                            </div>
                            <div className={`p-3 rounded-xl ${isDark ? "bg-zinc-900" : "bg-zinc-100"} flex flex-col`}>
                                <div className="flex justify-between mb-2">
                                    <span className={`text-xs font-medium ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>Compressed</span>
                                    <div className="flex gap-2">
                                        <span className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>{formatSize(compressedSize)}</span>
                                        {savings > 0 && <span className="text-xs font-medium text-emerald-500">-{savings}%</span>}
                                    </div>
                                </div>
                                <div className="flex-1 rounded-lg overflow-hidden bg-black/20 flex items-center justify-center" style={{ maxHeight: "35vh" }}>
                                    {compressedImage ? (
                                        <img src={compressedImage} alt="Compressed" className="max-w-full max-h-full object-contain" />
                                    ) : (
                                        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button onClick={downloadImage} disabled={!compressedImage} className="flex-1 h-10 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-sm">
                                <Download className="w-4 h-4 mr-2" /> Download
                            </Button>
                            <Button onClick={() => { setImage(null); setCompressedImage(null); }} variant="outline" className={`h-10 rounded-xl ${isDark ? "border-zinc-700" : "border-zinc-300"}`}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
