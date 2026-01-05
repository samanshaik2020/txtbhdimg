"use client";

import { useState, useEffect, useRef } from "react";
import { removeBackground } from "@imgly/background-removal";
import { Download, Upload, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ToolsNavbar from "@/components/ToolsNavbar";
import { useSharedImage } from "@/components/SharedImageContext";

export default function RemoveBackgroundPage() {
    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);
    const { sharedImage, setSharedImage, clearSharedImage } = useSharedImage();
    const [image, setImage] = useState<string | null>(null);
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            // Note: We don't auto-process shared images to avoid unexpected processing
        }
    }, [mounted, sharedImage, image]);

    useEffect(() => {
        if (mounted) {
            document.documentElement.classList.remove("light", "dark");
            document.documentElement.classList.add(isDark ? "dark" : "light");
            localStorage.setItem("theme", isDark ? "dark" : "light");
        }
    }, [isDark, mounted]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setOriginalFile(file);
        const url = URL.createObjectURL(file);
        setImage(url);
        setSharedImage(url); // Share the image with other tools
        setResultImage(null);
        setIsProcessing(true);
        try {
            const blob = await removeBackground(file, {
                progress: (key, current, total) => setProgress(Math.round((current / total) * 100)),
            });
            setResultImage(URL.createObjectURL(blob));
        } catch (error) {
            console.error("Background removal failed:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadImage = () => {
        if (!resultImage) return;
        const link = document.createElement("a");
        link.download = `no-bg-${originalFile?.name || "image.png"}`;
        link.href = resultImage;
        link.click();
    };

    if (!mounted) return null;

    return (
        <div className={`h-screen flex flex-col overflow-hidden ${isDark ? "bg-zinc-950 text-white" : "bg-white text-zinc-900"}`}>
            <ToolsNavbar isDark={isDark} onThemeToggle={() => setIsDark(!isDark)} />

            <main className="flex-1 flex items-center justify-center p-4 overflow-hidden">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

                {!image ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full max-w-2xl border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${isDark ? "border-zinc-800 hover:border-violet-500/50 hover:bg-violet-500/5" : "border-zinc-300 hover:border-violet-500/50 hover:bg-violet-50"
                            }`}
                    >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 ${isDark ? "bg-zinc-900" : "bg-zinc-100"}`}>
                            <Upload className="w-8 h-8 text-violet-500" />
                        </div>
                        <p className="text-lg font-medium mb-1">Upload an image</p>
                        <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>PNG, JPG, WEBP</p>
                    </div>
                ) : (
                    <div className="w-full max-w-4xl flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4 flex-1">
                            <div className={`p-3 rounded-xl ${isDark ? "bg-zinc-900" : "bg-zinc-100"} flex flex-col`}>
                                <span className={`text-xs font-medium mb-2 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>Original</span>
                                <div className="flex-1 rounded-lg overflow-hidden bg-black/20 flex items-center justify-center" style={{ maxHeight: "50vh" }}>
                                    <img src={image} alt="Original" className="max-w-full max-h-full object-contain" />
                                </div>
                            </div>
                            <div className={`p-3 rounded-xl ${isDark ? "bg-zinc-900" : "bg-zinc-100"} flex flex-col`}>
                                <span className={`text-xs font-medium mb-2 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>Result</span>
                                <div
                                    className="flex-1 rounded-lg overflow-hidden flex items-center justify-center"
                                    style={{
                                        maxHeight: "50vh",
                                        backgroundImage: `linear-gradient(45deg, ${isDark ? "#333" : "#ddd"} 25%, transparent 25%), linear-gradient(-45deg, ${isDark ? "#333" : "#ddd"} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${isDark ? "#333" : "#ddd"} 75%), linear-gradient(-45deg, transparent 75%, ${isDark ? "#333" : "#ddd"} 75%)`,
                                        backgroundSize: "16px 16px",
                                        backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
                                        backgroundColor: isDark ? "#222" : "#eee",
                                    }}
                                >
                                    {isProcessing ? (
                                        <div className="text-center">
                                            <Loader2 className="w-8 h-8 text-violet-500 animate-spin mx-auto mb-2" />
                                            <p className="text-sm text-violet-500">{progress}%</p>
                                        </div>
                                    ) : resultImage ? (
                                        <img src={resultImage} alt="Result" className="max-w-full max-h-full object-contain" />
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button onClick={downloadImage} disabled={!resultImage} className="flex-1 h-10 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-sm">
                                <Download className="w-4 h-4 mr-2" /> Download PNG
                            </Button>
                            <Button onClick={() => { setImage(null); setResultImage(null); clearSharedImage(); }} variant="outline" className={`h-10 rounded-xl ${isDark ? "border-zinc-700" : "border-zinc-300"}`}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
