"use client";

import { useState, useEffect, useRef } from "react";
import { Download, Upload, RotateCw, Trash2, RotateCcw, FlipHorizontal, FlipVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import ToolsNavbar from "@/components/ToolsNavbar";
import { useSharedImage } from "@/components/SharedImageContext";

export default function RotateImagePage() {
    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);
    const { sharedImage, setSharedImage, clearSharedImage } = useSharedImage();
    const [image, setImage] = useState<string | null>(null);
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [rotation, setRotation] = useState(0);
    const [flipH, setFlipH] = useState(false);
    const [flipV, setFlipV] = useState(false);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Handle mounting and theme initialization
    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("theme");
        if (saved) {
            setIsDark(saved === "dark");
        }
    }, []);

    // Load shared image on mount
    useEffect(() => {
        if (mounted && sharedImage && !image) {
            setImage(sharedImage);
        }
    }, [mounted, sharedImage, image]);

    useEffect(() => {
        if (mounted) {
            document.documentElement.classList.remove("light", "dark");
            document.documentElement.classList.add(isDark ? "dark" : "light");
            localStorage.setItem("theme", isDark ? "dark" : "light");
        }
    }, [isDark, mounted]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setOriginalFile(file);
        const url = URL.createObjectURL(file);
        setImage(url);
        setSharedImage(url); // Share the image with other tools
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
            <ToolsNavbar isDark={isDark} onThemeToggle={() => setIsDark(!isDark)} />

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
                            <Button onClick={() => { setImage(null); setResultImage(null); clearSharedImage(); }} variant="outline" className={`h-9 rounded-lg ${isDark ? "border-zinc-700" : ""}`}>
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
