"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Download, Upload, Scissors, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ToolsNavbar from "@/components/ToolsNavbar";
import { useSharedImage } from "@/components/SharedImageContext";

type HandlePosition = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'move' | null;

export default function CropImagePage() {
    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);
    const { sharedImage, setSharedImage, clearSharedImage } = useSharedImage();
    const [image, setImage] = useState<string | null>(null);
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [cropArea, setCropArea] = useState({ x: 50, y: 50, width: 200, height: 200 });
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [activeHandle, setActiveHandle] = useState<HandlePosition>(null);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0, cropX: 0, cropY: 0, cropW: 0, cropH: 0 });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const MIN_SIZE = 30; // Minimum crop area size

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
        setSharedImage(url);
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

    const handleMouseDown = (e: React.MouseEvent, handle: HandlePosition) => {
        e.preventDefault();
        e.stopPropagation();
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        setActiveHandle(handle);
        setDragStart({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            cropX: cropArea.x,
            cropY: cropArea.y,
            cropW: cropArea.width,
            cropH: cropArea.height,
        });
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!activeHandle || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        const deltaX = currentX - dragStart.x;
        const deltaY = currentY - dragStart.y;

        setCropArea((prev) => {
            let { x, y, width, height } = prev;
            const startX = dragStart.cropX;
            const startY = dragStart.cropY;
            const startW = dragStart.cropW;
            const startH = dragStart.cropH;

            switch (activeHandle) {
                case 'move':
                    x = Math.max(0, Math.min(startX + deltaX, imageSize.width - startW));
                    y = Math.max(0, Math.min(startY + deltaY, imageSize.height - startH));
                    width = startW;
                    height = startH;
                    break;
                case 'nw':
                    x = Math.max(0, Math.min(startX + deltaX, startX + startW - MIN_SIZE));
                    y = Math.max(0, Math.min(startY + deltaY, startY + startH - MIN_SIZE));
                    width = startW - (x - startX);
                    height = startH - (y - startY);
                    break;
                case 'n':
                    y = Math.max(0, Math.min(startY + deltaY, startY + startH - MIN_SIZE));
                    height = startH - (y - startY);
                    break;
                case 'ne':
                    y = Math.max(0, Math.min(startY + deltaY, startY + startH - MIN_SIZE));
                    width = Math.max(MIN_SIZE, Math.min(startW + deltaX, imageSize.width - startX));
                    height = startH - (y - startY);
                    break;
                case 'e':
                    width = Math.max(MIN_SIZE, Math.min(startW + deltaX, imageSize.width - startX));
                    break;
                case 'se':
                    width = Math.max(MIN_SIZE, Math.min(startW + deltaX, imageSize.width - startX));
                    height = Math.max(MIN_SIZE, Math.min(startH + deltaY, imageSize.height - startY));
                    break;
                case 's':
                    height = Math.max(MIN_SIZE, Math.min(startH + deltaY, imageSize.height - startY));
                    break;
                case 'sw':
                    x = Math.max(0, Math.min(startX + deltaX, startX + startW - MIN_SIZE));
                    width = startW - (x - startX);
                    height = Math.max(MIN_SIZE, Math.min(startH + deltaY, imageSize.height - startY));
                    break;
                case 'w':
                    x = Math.max(0, Math.min(startX + deltaX, startX + startW - MIN_SIZE));
                    width = startW - (x - startX);
                    break;
            }

            return { x, y, width, height };
        });
    }, [activeHandle, dragStart, imageSize]);

    const handleMouseUp = useCallback(() => {
        setActiveHandle(null);
    }, []);

    useEffect(() => {
        if (activeHandle) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
            return () => {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("mouseup", handleMouseUp);
            };
        }
    }, [activeHandle, handleMouseMove, handleMouseUp]);

    const cropImage = () => {
        if (!image || !canvasRef.current || !imageRef.current) return;
        const img = imageRef.current;
        const scaleX = img.naturalWidth / img.clientWidth;
        const scaleY = img.naturalHeight / img.clientHeight;
        const canvas = canvasRef.current;
        canvas.width = cropArea.width * scaleX;
        canvas.height = cropArea.height * scaleY;
        canvas.getContext("2d")!.drawImage(
            img,
            cropArea.x * scaleX,
            cropArea.y * scaleY,
            canvas.width,
            canvas.height,
            0, 0,
            canvas.width,
            canvas.height
        );
        setCroppedImage(canvas.toDataURL("image/png"));
    };

    const downloadImage = () => {
        if (!croppedImage) return;
        const link = document.createElement("a");
        link.download = `cropped-${originalFile?.name || "image.png"}`;
        link.href = croppedImage;
        link.click();
    };

    const handleReset = () => {
        setImage(null);
        setCroppedImage(null);
        setOriginalFile(null);
        clearSharedImage();
    };

    const presets = [
        { name: "Free", r: null },
        { name: "1:1", r: 1 },
        { name: "4:3", r: 4 / 3 },
        { name: "16:9", r: 16 / 9 },
        { name: "9:16", r: 9 / 16 },
    ];

    const applyRatio = (r: number | null) => {
        if (!r) return;
        const newH = cropArea.width / r;
        if (newH <= imageSize.height - cropArea.y) {
            setCropArea((p) => ({ ...p, height: newH }));
        } else {
            const newW = cropArea.height * r;
            setCropArea((p) => ({ ...p, width: Math.min(newW, imageSize.width - cropArea.x) }));
        }
    };

    // Handle styles for cursor and appearance
    const getHandleCursor = (handle: HandlePosition): string => {
        switch (handle) {
            case 'nw': case 'se': return 'nwse-resize';
            case 'ne': case 'sw': return 'nesw-resize';
            case 'n': case 's': return 'ns-resize';
            case 'e': case 'w': return 'ew-resize';
            case 'move': return 'move';
            default: return 'default';
        }
    };

    if (!mounted) return null;

    return (
        <div className={`h-screen flex flex-col overflow-hidden ${isDark ? "bg-zinc-950 text-white" : "bg-white text-zinc-900"}`}>
            <canvas ref={canvasRef} className="hidden" />
            <ToolsNavbar isDark={isDark} onThemeToggle={() => setIsDark(!isDark)} />

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
                            <div className="flex gap-2 mb-2 flex-wrap">
                                {presets.map((p) => (
                                    <button
                                        key={p.name}
                                        onClick={() => applyRatio(p.r)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isDark ? "bg-zinc-800 hover:bg-zinc-700" : "bg-zinc-200 hover:bg-zinc-300"}`}
                                    >
                                        {p.name}
                                    </button>
                                ))}
                            </div>
                            <div
                                className="relative flex-1 overflow-hidden rounded-lg select-none"
                                ref={containerRef}
                                style={{ maxHeight: "55vh", cursor: activeHandle ? getHandleCursor(activeHandle) : 'default' }}
                            >
                                <img
                                    ref={imageRef}
                                    src={image}
                                    alt="Crop"
                                    className="max-w-full max-h-full"
                                    onLoad={handleImageLoad}
                                    style={{ display: "block", pointerEvents: 'none' }}
                                    draggable={false}
                                />
                                {/* Dark overlay outside crop area */}
                                <div
                                    className="absolute inset-0 bg-black/50 pointer-events-none"
                                    style={{
                                        clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${cropArea.x}px ${cropArea.y}px, ${cropArea.x}px ${cropArea.y + cropArea.height}px, ${cropArea.x + cropArea.width}px ${cropArea.y + cropArea.height}px, ${cropArea.x + cropArea.width}px ${cropArea.y}px, ${cropArea.x}px ${cropArea.y}px)`
                                    }}
                                />
                                {/* Crop selection box */}
                                <div
                                    className="absolute border-2 border-white"
                                    style={{
                                        left: cropArea.x,
                                        top: cropArea.y,
                                        width: cropArea.width,
                                        height: cropArea.height,
                                        cursor: 'move'
                                    }}
                                    onMouseDown={(e) => handleMouseDown(e, 'move')}
                                >
                                    {/* Grid lines */}
                                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                                        {[...Array(9)].map((_, i) => (
                                            <div key={i} className="border border-white/30" />
                                        ))}
                                    </div>

                                    {/* Corner handles */}
                                    {/* NW */}
                                    <div
                                        className="absolute -left-2 -top-2 w-4 h-4 bg-white rounded-sm shadow-md cursor-nwse-resize"
                                        onMouseDown={(e) => handleMouseDown(e, 'nw')}
                                    />
                                    {/* NE */}
                                    <div
                                        className="absolute -right-2 -top-2 w-4 h-4 bg-white rounded-sm shadow-md cursor-nesw-resize"
                                        onMouseDown={(e) => handleMouseDown(e, 'ne')}
                                    />
                                    {/* SE */}
                                    <div
                                        className="absolute -right-2 -bottom-2 w-4 h-4 bg-white rounded-sm shadow-md cursor-nwse-resize"
                                        onMouseDown={(e) => handleMouseDown(e, 'se')}
                                    />
                                    {/* SW */}
                                    <div
                                        className="absolute -left-2 -bottom-2 w-4 h-4 bg-white rounded-sm shadow-md cursor-nesw-resize"
                                        onMouseDown={(e) => handleMouseDown(e, 'sw')}
                                    />

                                    {/* Edge handles */}
                                    {/* N */}
                                    <div
                                        className="absolute left-1/2 -translate-x-1/2 -top-2 w-8 h-4 bg-white rounded-sm shadow-md cursor-ns-resize"
                                        onMouseDown={(e) => handleMouseDown(e, 'n')}
                                    />
                                    {/* S */}
                                    <div
                                        className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-8 h-4 bg-white rounded-sm shadow-md cursor-ns-resize"
                                        onMouseDown={(e) => handleMouseDown(e, 's')}
                                    />
                                    {/* W */}
                                    <div
                                        className="absolute top-1/2 -translate-y-1/2 -left-2 w-4 h-8 bg-white rounded-sm shadow-md cursor-ew-resize"
                                        onMouseDown={(e) => handleMouseDown(e, 'w')}
                                    />
                                    {/* E */}
                                    <div
                                        className="absolute top-1/2 -translate-y-1/2 -right-2 w-4 h-8 bg-white rounded-sm shadow-md cursor-ew-resize"
                                        onMouseDown={(e) => handleMouseDown(e, 'e')}
                                    />
                                </div>
                            </div>
                            {/* Crop dimensions display */}
                            <div className={`mt-2 text-xs ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                                Selection: {Math.round(cropArea.width)} × {Math.round(cropArea.height)} px
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
                            <Button onClick={handleReset} variant="outline" className={`h-9 rounded-lg mt-auto ${isDark ? "border-zinc-700" : ""}`}>
                                <Trash2 className="w-4 h-4 mr-1" /> Reset
                            </Button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
