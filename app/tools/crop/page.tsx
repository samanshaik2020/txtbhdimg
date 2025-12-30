"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Upload, Scissors, Sun, Moon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CropImagePage() {
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
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [cropArea, setCropArea] = useState({ x: 50, y: 50, width: 200, height: 200 });
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

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
        setCroppedImage(null);
    };

    const handleImageLoad = () => {
        if (imageRef.current) {
            const imgW = imageRef.current.clientWidth;
            const imgH = imageRef.current.clientHeight;
            setImageSize({ width: imgW, height: imgH });
            setCropArea({ x: imgW * 0.1, y: imgH * 0.1, width: imgW * 0.8, height: imgH * 0.8 });
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        setIsDragging(true);
        const rect = containerRef.current.getBoundingClientRect();
        setDragStart({ x: e.clientX - rect.left - cropArea.x, y: e.clientY - rect.top - cropArea.y });
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left - dragStart.x, imageSize.width - cropArea.width));
        const y = Math.max(0, Math.min(e.clientY - rect.top - dragStart.y, imageSize.height - cropArea.height));
        setCropArea((prev) => ({ ...prev, x, y }));
    }, [isDragging, dragStart, imageSize, cropArea.width, cropArea.height]);

    const handleMouseUp = useCallback(() => setIsDragging(false), []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
            return () => { window.removeEventListener("mousemove", handleMouseMove); window.removeEventListener("mouseup", handleMouseUp); };
        }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const cropImage = () => {
        if (!image || !canvasRef.current || !imageRef.current) return;
        const img = imageRef.current;
        const scaleX = img.naturalWidth / img.clientWidth;
        const scaleY = img.naturalHeight / img.clientHeight;
        const canvas = canvasRef.current;
        canvas.width = cropArea.width * scaleX;
        canvas.height = cropArea.height * scaleY;
        canvas.getContext("2d")!.drawImage(img, cropArea.x * scaleX, cropArea.y * scaleY, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
        setCroppedImage(canvas.toDataURL("image/png"));
    };

    const downloadImage = () => {
        if (!croppedImage) return;
        const link = document.createElement("a");
        link.download = `cropped-${originalFile?.name || "image.png"}`;
        link.href = croppedImage;
        link.click();
    };

    const presets = [{ name: "Free", r: null }, { name: "1:1", r: 1 }, { name: "4:3", r: 4 / 3 }, { name: "16:9", r: 16 / 9 }];
    const applyRatio = (r: number | null) => {
        if (!r) return;
        const newH = cropArea.width / r;
        if (newH <= imageSize.height) setCropArea((p) => ({ ...p, height: newH }));
        else setCropArea((p) => ({ ...p, width: cropArea.height * r }));
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
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                                <Scissors className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="font-semibold text-sm">Crop Image</span>
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
                    <div onClick={() => fileInputRef.current?.click()} className={`w-full max-w-2xl border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer ${isDark ? "border-zinc-800 hover:border-orange-500/50" : "border-zinc-300 hover:border-orange-500/50"}`}>
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 ${isDark ? "bg-zinc-900" : "bg-zinc-100"}`}>
                            <Upload className="w-8 h-8 text-orange-500" />
                        </div>
                        <p className="text-lg font-medium mb-1">Upload an image</p>
                        <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>PNG, JPG, WEBP</p>
                    </div>
                ) : (
                    <div className="w-full max-w-5xl flex gap-4">
                        {/* Crop Area */}
                        <div className={`flex-1 p-3 rounded-xl ${isDark ? "bg-zinc-900" : "bg-zinc-100"} flex flex-col`}>
                            <div className="flex gap-2 mb-2">
                                {presets.map((p) => (
                                    <button key={p.name} onClick={() => applyRatio(p.r)} className={`px-2 py-1 rounded text-xs ${isDark ? "bg-zinc-800 hover:bg-zinc-700" : "bg-zinc-200 hover:bg-zinc-300"}`}>
                                        {p.name}
                                    </button>
                                ))}
                            </div>
                            <div className="relative flex-1 overflow-hidden rounded-lg" ref={containerRef} style={{ maxHeight: "55vh" }}>
                                <img ref={imageRef} src={image} alt="Crop" className="max-w-full max-h-full" onLoad={handleImageLoad} style={{ display: "block" }} />
                                <div className="absolute inset-0 bg-black/50" style={{ clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${cropArea.x}px ${cropArea.y}px, ${cropArea.x}px ${cropArea.y + cropArea.height}px, ${cropArea.x + cropArea.width}px ${cropArea.y + cropArea.height}px, ${cropArea.x + cropArea.width}px ${cropArea.y}px, ${cropArea.x}px ${cropArea.y}px)` }} />
                                <div className="absolute border-2 border-white cursor-move" style={{ left: cropArea.x, top: cropArea.y, width: cropArea.width, height: cropArea.height }} onMouseDown={handleMouseDown}>
                                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">{[...Array(9)].map((_, i) => <div key={i} className="border border-white/30" />)}</div>
                                </div>
                            </div>
                        </div>
                        {/* Actions */}
                        <div className={`w-48 shrink-0 p-4 rounded-xl ${isDark ? "bg-zinc-900" : "bg-zinc-100"} flex flex-col gap-3`}>
                            <Button onClick={cropImage} className="h-9 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 text-sm">
                                <Scissors className="w-4 h-4 mr-1" /> Crop
                            </Button>
                            {croppedImage && (
                                <>
                                    <div className="rounded-lg overflow-hidden bg-black/20" style={{ maxHeight: "120px" }}>
                                        <img src={croppedImage} alt="Cropped" className="w-full h-full object-contain" />
                                    </div>
                                    <Button onClick={downloadImage} className="h-9 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-sm">
                                        <Download className="w-4 h-4 mr-1" /> Download
                                    </Button>
                                </>
                            )}
                            <Button onClick={() => { setImage(null); setCroppedImage(null); }} variant="outline" className={`h-9 rounded-lg mt-auto ${isDark ? "border-zinc-700" : ""}`}>
                                <Trash2 className="w-4 h-4 mr-1" /> Reset
                            </Button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
