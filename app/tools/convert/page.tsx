"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Upload, FileType, Sun, Moon, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type ImageFormat = "png" | "jpg" | "webp" | "avif";

interface FormatOption {
    value: ImageFormat;
    label: string;
    mime: string;
}

const FORMAT_OPTIONS: FormatOption[] = [
    { value: "png", label: "PNG", mime: "image/png" },
    { value: "jpg", label: "JPG", mime: "image/jpeg" },
    { value: "webp", label: "WEBP", mime: "image/webp" },
    { value: "avif", label: "AVIF", mime: "image/avif" },
];

// Format conversion rules
const ALLOWED_CONVERSIONS: Record<string, ImageFormat[]> = {
    "image/png": ["jpg", "webp", "avif"],
    "image/jpeg": ["png", "webp", "avif"],
    "image/webp": ["png", "jpg"],
    "image/heic": ["jpg", "png"],
    "image/gif": ["png"],
    "image/svg+xml": ["png", "jpg"],
};

export default function ConvertImagePage() {
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
    const [sourceFormat, setSourceFormat] = useState<string>("");
    const [targetFormat, setTargetFormat] = useState<ImageFormat>("jpg");
    const [convertedImage, setConvertedImage] = useState<string | null>(null);
    const [quality, setQuality] = useState(90);
    const [isConverting, setIsConverting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (mounted) {
            document.documentElement.classList.remove("light", "dark");
            document.documentElement.classList.add(isDark ? "dark" : "light");
        }
    }, [isDark, mounted]);

    const getFormatFromMime = (mime: string): string => {
        const formats: Record<string, string> = {
            "image/png": "PNG",
            "image/jpeg": "JPG",
            "image/webp": "WEBP",
            "image/avif": "AVIF",
            "image/heic": "HEIC",
            "image/gif": "GIF",
            "image/svg+xml": "SVG",
        };
        return formats[mime] || mime.split("/")[1]?.toUpperCase() || "Unknown";
    };

    const getAllowedFormats = (mime: string): ImageFormat[] => {
        return ALLOWED_CONVERSIONS[mime] || ["png", "jpg", "webp"];
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setOriginalFile(file);
        setSourceFormat(file.type);
        setImage(URL.createObjectURL(file));
        setConvertedImage(null);

        // Set default target format
        const allowed = getAllowedFormats(file.type);
        if (allowed.length > 0) {
            setTargetFormat(allowed[0]);
        }
    };

    const convertImage = useCallback(async () => {
        if (!image || !canvasRef.current) return;

        setIsConverting(true);

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = canvasRef.current!;
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d")!;

            // For JPG, fill with white background (no transparency)
            if (targetFormat === "jpg") {
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.drawImage(img, 0, 0);

            const format = FORMAT_OPTIONS.find((f) => f.value === targetFormat);
            const mimeType = format?.mime || "image/png";
            const qualityValue = ["jpg", "webp", "avif"].includes(targetFormat) ? quality / 100 : undefined;

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        setConvertedImage(URL.createObjectURL(blob));
                    }
                    setIsConverting(false);
                },
                mimeType,
                qualityValue
            );
        };
        img.src = image;
    }, [image, targetFormat, quality]);

    useEffect(() => {
        if (image && targetFormat) {
            const timer = setTimeout(convertImage, 300);
            return () => clearTimeout(timer);
        }
    }, [image, targetFormat, quality, convertImage]);

    const downloadImage = () => {
        if (!convertedImage) return;
        const link = document.createElement("a");
        const baseName = originalFile?.name.split(".")[0] || "converted";
        link.download = `${baseName}.${targetFormat}`;
        link.href = convertedImage;
        link.click();
    };

    const allowedFormats = sourceFormat ? getAllowedFormats(sourceFormat) : [];

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
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                <FileType className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="font-semibold text-sm">Convert Format</span>
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
                    <div onClick={() => fileInputRef.current?.click()} className={`w-full max-w-2xl border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer ${isDark ? "border-zinc-800 hover:border-indigo-500/50" : "border-zinc-300 hover:border-indigo-500/50"}`}>
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 ${isDark ? "bg-zinc-900" : "bg-zinc-100"}`}>
                            <Upload className="w-8 h-8 text-indigo-500" />
                        </div>
                        <p className="text-lg font-medium mb-1">Upload an image</p>
                        <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>PNG, JPG, WEBP, HEIC, GIF, SVG</p>
                    </div>
                ) : (
                    <div className="w-full max-w-4xl flex gap-4">
                        {/* Controls */}
                        <div className={`w-64 shrink-0 p-4 rounded-xl ${isDark ? "bg-zinc-900" : "bg-zinc-100"} flex flex-col gap-4`}>
                            {/* Format Selector */}
                            <div className="flex items-center gap-2">
                                <div className={`flex-1 p-3 rounded-lg text-center ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`}>
                                    <p className={`text-xs mb-1 ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>From</p>
                                    <p className="font-bold text-lg">{getFormatFromMime(sourceFormat)}</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-indigo-500 shrink-0" />
                                <div className={`flex-1 p-3 rounded-lg text-center ${isDark ? "bg-indigo-500/20" : "bg-indigo-100"}`}>
                                    <p className={`text-xs mb-1 ${isDark ? "text-indigo-400" : "text-indigo-600"}`}>To</p>
                                    <p className="font-bold text-lg text-indigo-500">{targetFormat.toUpperCase()}</p>
                                </div>
                            </div>

                            {/* Target Format Options */}
                            <div>
                                <p className={`text-xs font-medium mb-2 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>Convert to:</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {allowedFormats.map((fmt) => (
                                        <button
                                            key={fmt}
                                            onClick={() => setTargetFormat(fmt)}
                                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${targetFormat === fmt
                                                ? "bg-indigo-500 text-white"
                                                : isDark
                                                    ? "bg-zinc-800 hover:bg-zinc-700"
                                                    : "bg-zinc-200 hover:bg-zinc-300"
                                                }`}
                                        >
                                            {fmt.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quality (for lossy formats) */}
                            {["jpg", "webp", "avif"].includes(targetFormat) && (
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className={`text-xs ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>Quality</span>
                                        <span className={`text-xs font-bold ${isDark ? "text-indigo-400" : "text-indigo-600"}`}>{quality}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="10"
                                        max="100"
                                        step="5"
                                        value={quality}
                                        onChange={(e) => setQuality(Number(e.target.value))}
                                        className="w-full accent-indigo-500"
                                    />
                                </div>
                            )}

                            <Button onClick={downloadImage} disabled={!convertedImage || isConverting} className="h-10 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-sm mt-auto">
                                <Download className="w-4 h-4 mr-1" /> Download {targetFormat.toUpperCase()}
                            </Button>
                            <Button onClick={() => { setImage(null); setConvertedImage(null); }} variant="outline" className={`h-9 rounded-lg ${isDark ? "border-zinc-700" : ""}`}>
                                <Trash2 className="w-4 h-4 mr-1" /> Reset
                            </Button>
                        </div>

                        {/* Preview */}
                        <div className={`flex-1 p-3 rounded-xl ${isDark ? "bg-zinc-900" : "bg-zinc-100"} flex flex-col`}>
                            <div className="flex justify-between mb-2">
                                <span className={`text-xs font-medium ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>Preview</span>
                                {isConverting && <span className="text-xs text-indigo-500">Converting...</span>}
                            </div>
                            <div className="flex-1 rounded-lg overflow-hidden bg-black/20 flex items-center justify-center" style={{ maxHeight: "60vh" }}>
                                {convertedImage ? (
                                    <img src={convertedImage} alt="Converted" className="max-w-full max-h-full object-contain" />
                                ) : isConverting ? (
                                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <img src={image} alt="Original" className="max-w-full max-h-full object-contain" />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
