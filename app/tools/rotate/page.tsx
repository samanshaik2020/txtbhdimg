"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Upload, RotateCw, Sun, Moon, Trash2, RotateCcw, FlipHorizontal, FlipVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export default function RotateImagePage() {
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
    const [rotation, setRotation] = useState(0);
    const [flipH, setFlipH] = useState(false);
    const [flipV, setFlipV] = useState(false);
    const [resultImage, setResultImage] = useState<string | null>(null);
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
        setImage(URL.createObjectURL(file));
        setRotation(0);
        setFlipH(false);
        setFlipV(false);
    };

    useEffect(() => {
        if (image && canvasRef.current) {
            const timer = setTimeout(() => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => {
                    const canvas = canvasRef.current!;
                    const ctx = canvas.getContext("2d")!;
                    const rad = (rotation * Math.PI) / 180;
                    const sin = Math.abs(Math.sin(rad));
                    const cos = Math.abs(Math.cos(rad));
                    canvas.width = img.width * cos + img.height * sin;
                    canvas.height = img.width * sin + img.height * cos;
                    ctx.translate(canvas.width / 2, canvas.height / 2);
                    ctx.rotate(rad);
                    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
                    ctx.drawImage(img, -img.width / 2, -img.height / 2);
                    setResultImage(canvas.toDataURL("image/png"));
                };
                img.src = image;
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [image, rotation, flipH, flipV]);

    const downloadImage = () => {
        if (!resultImage) return;
        const link = document.createElement("a");
        link.download = `rotated-${originalFile?.name || "image.png"}`;
        link.href = resultImage;
        link.click();
    };

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
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                                <RotateCw className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="font-semibold text-sm">Rotate Image</span>
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
                    <div onClick={() => fileInputRef.current?.click()} className={`w-full max-w-2xl border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer ${isDark ? "border-zinc-800 hover:border-pink-500/50" : "border-zinc-300 hover:border-pink-500/50"}`}>
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 ${isDark ? "bg-zinc-900" : "bg-zinc-100"}`}>
                            <Upload className="w-8 h-8 text-pink-500" />
                        </div>
                        <p className="text-lg font-medium mb-1">Upload an image</p>
                        <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>PNG, JPG, WEBP</p>
                    </div>
                ) : (
                    <div className="w-full max-w-4xl flex gap-4">
                        {/* Controls */}
                        <div className={`w-56 shrink-0 p-4 rounded-xl ${isDark ? "bg-zinc-900" : "bg-zinc-100"} flex flex-col gap-3`}>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs font-medium">Rotation</span>
                                    <span className={`text-sm font-bold ${isDark ? "text-pink-400" : "text-pink-600"}`}>{rotation}°</span>
                                </div>
                                <Slider value={[rotation]} onValueChange={([v]) => setRotation(v)} min={-180} max={180} step={1} />
                            </div>
                            <div className="flex gap-1">
                                <Button variant="outline" onClick={() => setRotation((r) => r - 90)} size="sm" className={`flex-1 h-8 ${isDark ? "border-zinc-700" : ""}`}>
                                    <RotateCcw className="w-3 h-3 mr-1" /> -90°
                                </Button>
                                <Button variant="outline" onClick={() => setRotation(0)} size="sm" className={`flex-1 h-8 ${isDark ? "border-zinc-700" : ""}`}>0°</Button>
                                <Button variant="outline" onClick={() => setRotation((r) => r + 90)} size="sm" className={`flex-1 h-8 ${isDark ? "border-zinc-700" : ""}`}>
                                    <RotateCw className="w-3 h-3 mr-1" /> +90°
                                </Button>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setFlipH(!flipH)} size="sm" className={`flex-1 h-8 ${flipH ? "bg-pink-500 text-white border-pink-500" : isDark ? "border-zinc-700" : ""}`}>
                                    <FlipHorizontal className="w-3 h-3 mr-1" /> H
                                </Button>
                                <Button variant="outline" onClick={() => setFlipV(!flipV)} size="sm" className={`flex-1 h-8 ${flipV ? "bg-pink-500 text-white border-pink-500" : isDark ? "border-zinc-700" : ""}`}>
                                    <FlipVertical className="w-3 h-3 mr-1" /> V
                                </Button>
                            </div>
                            <Button onClick={downloadImage} disabled={!resultImage} className="h-9 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 text-sm mt-auto">
                                <Download className="w-4 h-4 mr-1" /> Download
                            </Button>
                            <Button onClick={() => { setImage(null); setResultImage(null); }} variant="outline" className={`h-9 rounded-lg ${isDark ? "border-zinc-700" : ""}`}>
                                <Trash2 className="w-4 h-4 mr-1" /> Reset
                            </Button>
                        </div>
                        {/* Preview */}
                        <div className={`flex-1 p-3 rounded-xl ${isDark ? "bg-zinc-900" : "bg-zinc-100"} flex flex-col`}>
                            <span className={`text-xs font-medium mb-2 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>Preview</span>
                            <div className="flex-1 rounded-lg overflow-hidden bg-black/20 flex items-center justify-center" style={{ maxHeight: "60vh" }}>
                                {resultImage ? <img src={resultImage} alt="Rotated" className="max-w-full max-h-full object-contain" /> : <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
