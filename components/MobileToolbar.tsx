"use client";

import { useRef, useState, useCallback } from "react";
import { removeBackground } from "@imgly/background-removal";
import { useEditorStore, type TextElement } from "@/lib/store";
import { useTheme } from "@/components/ThemeProvider";
import { FONTS, getFontWeights } from "@/lib/fonts";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
    Plus,
    Type,
    Palette,
    Layers,
    X,
    Download,
    Undo2,
    Redo2,
    Eye,
    EyeOff,
    Trash2,
    Copy,
    ChevronDown,
    Upload,
    Loader2,
    AlignLeft,
    AlignCenter,
    AlignRight,
} from "lucide-react";

type ActivePanel = "none" | "add" | "style" | "color" | "layers";

export function MobileToolbar() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activePanel, setActivePanel] = useState<ActivePanel>("none");
    const { theme } = useTheme();

    const {
        image,
        foregroundImage,
        isProcessing,
        texts,
        selectedTextId,
        imageOpacity,
        foregroundVisible,
        backgroundVisible,
        setImage,
        setForegroundImage,
        setIsProcessing,
        setImageOpacity,
        setForegroundVisible,
        setBackgroundVisible,
        addText,
        updateText,
        deleteText,
        duplicateText,
        setSelectedTextId,
        setTextVisible,
        undo,
        redo,
    } = useEditorStore();

    const selectedText = texts.find((t) => t.id === selectedTextId);
    const availableWeights = selectedText ? getFontWeights(selectedText.fontFamily) : [400, 700];
    const isDark = theme === "dark";

    // Handle image upload
    const handleImageUpload = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
            setIsProcessing(true);

            try {
                const blob = await removeBackground(file, {
                    progress: (key, current, total) => {
                        console.log(`Processing ${key}: ${Math.round((current / total) * 100)}%`);
                    },
                });

                const foregroundUrl = URL.createObjectURL(blob);
                setForegroundImage(foregroundUrl);
            } catch (error) {
                console.error("Background removal failed:", error);
            } finally {
                setIsProcessing(false);
            }
        },
        [setImage, setForegroundImage, setIsProcessing]
    );

    const handleExport = () => {
        const exportFn = (window as unknown as { exportCanvas?: () => void }).exportCanvas;
        if (exportFn) {
            exportFn();
        }
    };

    const updateTextProperty = <K extends keyof TextElement>(
        key: K,
        value: TextElement[K]
    ) => {
        if (selectedTextId) {
            updateText(selectedTextId, { [key]: value });
        }
    };

    const togglePanel = (panel: ActivePanel) => {
        setActivePanel(activePanel === panel ? "none" : panel);
    };

    const handleAddText = () => {
        addText();
        setActivePanel("style");
    };

    // Common colors for quick selection
    const colorSwatches = [
        "#ffffff", "#000000", "#ef4444", "#f97316", "#eab308",
        "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6",
        "#f43f5e", "#6366f1", "#84cc16", "#06b6d4", "#a855f7",
    ];

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
            />

            {/* Mobile Header */}
            <div className={`fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 md:hidden ${isDark ? "bg-zinc-950/95 border-zinc-800" : "bg-white/95 border-zinc-200"
                } backdrop-blur-lg border-b`}>
                <div className="flex items-center gap-2">
                    <a
                        href="/"
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? "bg-zinc-900 text-zinc-400" : "bg-zinc-100 text-zinc-600"
                            }`}
                    >
                        <X className="w-5 h-5" />
                    </a>
                    <div className="flex items-center gap-1 ml-1">
                        <button
                            onClick={undo}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? "bg-zinc-900 text-zinc-400" : "bg-zinc-100 text-zinc-600"
                                }`}
                        >
                            <Undo2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={redo}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? "bg-zinc-900 text-zinc-400" : "bg-zinc-100 text-zinc-600"
                                }`}
                        >
                            <Redo2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <Button
                    onClick={handleExport}
                    disabled={!image}
                    className="h-9 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white text-sm font-medium"
                >
                    <Download className="w-4 h-4 mr-1.5" />
                    Export
                </Button>
            </div>

            {/* Bottom Sheet Panels */}
            <div
                className={`fixed bottom-16 left-0 right-0 z-40 transition-all duration-300 ease-out md:hidden ${activePanel !== "none" ? "translate-y-0" : "translate-y-full"
                    }`}
            >
                <div className={`rounded-t-3xl ${isDark ? "bg-zinc-900" : "bg-white"} shadow-2xl max-h-[50vh] overflow-hidden`}>
                    {/* Sheet Handle */}
                    <div className="flex justify-center pt-3 pb-2">
                        <div className={`w-10 h-1 rounded-full ${isDark ? "bg-zinc-700" : "bg-zinc-300"}`} />
                    </div>

                    {/* Upload Panel - Show when no image */}
                    {!image && activePanel === "add" && (
                        <div className="px-4 pb-6">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${isDark ? "border-zinc-700 hover:border-violet-500/50" : "border-zinc-300 hover:border-violet-500/50"
                                    }`}
                            >
                                {isProcessing ? (
                                    <div className="flex flex-col items-center">
                                        <Loader2 className="w-10 h-10 text-violet-500 animate-spin mb-3" />
                                        <p className={`text-sm ${isDark ? "text-white" : "text-zinc-900"}`}>Processing image...</p>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className={`w-10 h-10 mx-auto mb-3 ${isDark ? "text-zinc-500" : "text-zinc-400"}`} />
                                        <p className={`text-sm font-medium mb-1 ${isDark ? "text-white" : "text-zinc-900"}`}>Upload an image</p>
                                        <p className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>PNG, JPG, WEBP</p>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Add Text Panel */}
                    {image && activePanel === "add" && (
                        <div className="px-4 pb-6 space-y-4">
                            <Button
                                onClick={handleAddText}
                                className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Add Text Layer
                            </Button>
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                variant="outline"
                                className={`w-full h-12 rounded-xl ${isDark ? "bg-zinc-800 border-zinc-700" : "bg-zinc-50 border-zinc-200"}`}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Replace Image
                            </Button>
                        </div>
                    )}

                    {/* Style Panel */}
                    {activePanel === "style" && selectedText && (
                        <div className="px-4 pb-6 space-y-5 max-h-[45vh] overflow-y-auto">
                            {/* Font Selector Chips */}
                            <div>
                                <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Font</p>
                                <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                                    {FONTS.slice(0, 12).map((font) => (
                                        <button
                                            key={font.value}
                                            onClick={() => updateTextProperty("fontFamily", font.value)}
                                            className={`flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${selectedText.fontFamily === font.value
                                                ? "bg-violet-600 text-white"
                                                : isDark
                                                    ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                                                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                                                }`}
                                            style={{ fontFamily: font.value }}
                                        >
                                            {font.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Text Content */}
                            <div>
                                <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Text</p>
                                <input
                                    type="text"
                                    value={selectedText.content}
                                    onChange={(e) => updateTextProperty("content", e.target.value)}
                                    className={`w-full h-12 px-4 rounded-xl text-base ${isDark ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                                        } border`}
                                    placeholder="Enter text..."
                                />
                            </div>

                            {/* Size & Weight */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Size</p>
                                    <input
                                        type="number"
                                        value={selectedText.fontSize}
                                        onChange={(e) => updateTextProperty("fontSize", Number(e.target.value))}
                                        className={`w-full h-12 px-4 rounded-xl text-base ${isDark ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                                            } border`}
                                        min={12}
                                        max={400}
                                    />
                                </div>
                                <div>
                                    <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Weight</p>
                                    <select
                                        value={selectedText.fontWeight}
                                        onChange={(e) => updateTextProperty("fontWeight", Number(e.target.value))}
                                        className={`w-full h-12 px-4 rounded-xl text-base ${isDark ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                                            } border`}
                                    >
                                        {availableWeights.map((w) => (
                                            <option key={w} value={w}>{w}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Text Alignment */}
                            <div>
                                <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Alignment</p>
                                <div className={`grid grid-cols-3 gap-1 p-1 rounded-xl ${isDark ? "bg-zinc-800" : "bg-zinc-100"}`}>
                                    {[
                                        { value: "left", icon: AlignLeft },
                                        { value: "center", icon: AlignCenter },
                                        { value: "right", icon: AlignRight },
                                    ].map(({ value, icon: Icon }) => (
                                        <button
                                            key={value}
                                            onClick={() => updateTextProperty("align", value as "left" | "center" | "right")}
                                            className={`h-10 rounded-lg flex items-center justify-center transition-colors ${selectedText.align === value
                                                ? isDark
                                                    ? "bg-zinc-700 text-white"
                                                    : "bg-white text-zinc-900 shadow-sm"
                                                : isDark
                                                    ? "text-zinc-400"
                                                    : "text-zinc-500"
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Letter Spacing & Line Height */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Spacing</p>
                                        <span className="text-xs font-medium text-violet-500">{selectedText.letterSpacing}</span>
                                    </div>
                                    <Slider
                                        value={[selectedText.letterSpacing]}
                                        onValueChange={([v]) => updateTextProperty("letterSpacing", v)}
                                        min={-10}
                                        max={50}
                                        step={1}
                                        className="py-2"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Line Height</p>
                                        <span className="text-xs font-medium text-violet-500">{selectedText.lineHeight.toFixed(1)}</span>
                                    </div>
                                    <Slider
                                        value={[selectedText.lineHeight * 10]}
                                        onValueChange={([v]) => updateTextProperty("lineHeight", v / 10)}
                                        min={5}
                                        max={30}
                                        step={1}
                                        className="py-2"
                                    />
                                </div>
                            </div>

                            {/* Subject Opacity */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Subject Opacity</p>
                                    <span className="text-sm font-medium text-violet-500">{Math.round(imageOpacity * 100)}%</span>
                                </div>
                                <Slider
                                    value={[imageOpacity * 100]}
                                    onValueChange={([v]) => setImageOpacity(v / 100)}
                                    min={0}
                                    max={100}
                                    step={1}
                                    className="py-2"
                                />
                            </div>

                            {/* Text Effects - Shadow */}
                            <div className={`p-3 rounded-xl ${isDark ? "bg-zinc-800" : "bg-zinc-100"}`}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`text-sm font-medium ${isDark ? "text-white" : "text-zinc-900"}`}>Shadow</span>
                                    <button
                                        onClick={() => updateTextProperty("shadowEnabled", !selectedText.shadowEnabled)}
                                        className={`w-10 h-5 rounded-full transition-colors ${selectedText.shadowEnabled ? "bg-violet-500" : isDark ? "bg-zinc-700" : "bg-zinc-300"}`}
                                    >
                                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${selectedText.shadowEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
                                    </button>
                                </div>
                                {selectedText.shadowEnabled && (
                                    <div className="space-y-3">
                                        <div className="flex gap-3 items-center">
                                            <input
                                                type="color"
                                                value={selectedText.shadowColor}
                                                onChange={(e) => updateTextProperty("shadowColor", e.target.value)}
                                                className="w-10 h-10 rounded-lg cursor-pointer border-0"
                                            />
                                            <div className="flex-1">
                                                <p className={`text-[10px] uppercase tracking-wider mb-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Blur</p>
                                                <Slider
                                                    value={[selectedText.shadowBlur]}
                                                    onValueChange={([v]) => updateTextProperty("shadowBlur", v)}
                                                    min={0}
                                                    max={50}
                                                    step={1}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <p className={`text-[10px] uppercase tracking-wider mb-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>X Offset</p>
                                                <Slider
                                                    value={[selectedText.shadowOffsetX]}
                                                    onValueChange={([v]) => updateTextProperty("shadowOffsetX", v)}
                                                    min={-30}
                                                    max={30}
                                                    step={1}
                                                />
                                            </div>
                                            <div>
                                                <p className={`text-[10px] uppercase tracking-wider mb-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Y Offset</p>
                                                <Slider
                                                    value={[selectedText.shadowOffsetY]}
                                                    onValueChange={([v]) => updateTextProperty("shadowOffsetY", v)}
                                                    min={-30}
                                                    max={30}
                                                    step={1}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Text Effects - Stroke */}
                            <div className={`p-3 rounded-xl ${isDark ? "bg-zinc-800" : "bg-zinc-100"}`}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`text-sm font-medium ${isDark ? "text-white" : "text-zinc-900"}`}>Stroke</span>
                                    <button
                                        onClick={() => updateTextProperty("strokeEnabled", !selectedText.strokeEnabled)}
                                        className={`w-10 h-5 rounded-full transition-colors ${selectedText.strokeEnabled ? "bg-violet-500" : isDark ? "bg-zinc-700" : "bg-zinc-300"}`}
                                    >
                                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${selectedText.strokeEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
                                    </button>
                                </div>
                                {selectedText.strokeEnabled && (
                                    <div className="flex gap-3 items-center">
                                        <input
                                            type="color"
                                            value={selectedText.strokeColor}
                                            onChange={(e) => updateTextProperty("strokeColor", e.target.value)}
                                            className="w-10 h-10 rounded-lg cursor-pointer border-0"
                                        />
                                        <div className="flex-1">
                                            <p className={`text-[10px] uppercase tracking-wider mb-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Width</p>
                                            <Slider
                                                value={[selectedText.strokeWidth]}
                                                onValueChange={([v]) => updateTextProperty("strokeWidth", v)}
                                                min={1}
                                                max={20}
                                                step={1}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Style Panel - No text selected */}
                    {activePanel === "style" && !selectedText && (
                        <div className="px-4 pb-6 text-center py-8">
                            <Type className={`w-12 h-12 mx-auto mb-3 ${isDark ? "text-zinc-700" : "text-zinc-300"}`} />
                            <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Select a text layer to edit</p>
                        </div>
                    )}

                    {/* Color Panel */}
                    {activePanel === "color" && selectedText && (
                        <div className="px-4 pb-6 space-y-4">
                            <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Text Color</p>
                            <div className="grid grid-cols-5 gap-3">
                                {colorSwatches.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => updateTextProperty("fill", color)}
                                        className={`aspect-square rounded-xl transition-transform active:scale-95 ${selectedText.fill === color
                                            ? `ring-2 ring-violet-500 ${isDark ? "ring-offset-zinc-900" : "ring-offset-white"} ring-offset-2`
                                            : ""
                                            }`}
                                        style={{
                                            backgroundColor: color,
                                            border: color === "#ffffff" ? "1px solid #e4e4e7" : "none",
                                        }}
                                    />
                                ))}
                            </div>
                            <div className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? "bg-zinc-800" : "bg-zinc-100"}`}>
                                <input
                                    type="color"
                                    value={selectedText.fill}
                                    onChange={(e) => updateTextProperty("fill", e.target.value)}
                                    className="w-10 h-10 rounded-lg cursor-pointer border-0"
                                />
                                <span className={`text-sm font-medium ${isDark ? "text-white" : "text-zinc-900"}`}>{selectedText.fill}</span>
                            </div>
                        </div>
                    )}

                    {/* Color Panel - No text selected */}
                    {activePanel === "color" && !selectedText && (
                        <div className="px-4 pb-6 text-center py-8">
                            <Palette className={`w-12 h-12 mx-auto mb-3 ${isDark ? "text-zinc-700" : "text-zinc-300"}`} />
                            <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Select a text layer to change color</p>
                        </div>
                    )}

                    {/* Layers Panel */}
                    {activePanel === "layers" && (
                        <div className="px-4 pb-6 space-y-2 max-h-[45vh] overflow-y-auto">
                            <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Layer Stack</p>

                            {/* Foreground Layer */}
                            <div className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? "bg-zinc-800" : "bg-zinc-100"}`}>
                                <button
                                    onClick={() => setForegroundVisible(!foregroundVisible)}
                                    className="w-8 h-8 flex items-center justify-center"
                                >
                                    {foregroundVisible ? (
                                        <Eye className="w-5 h-5 text-emerald-500" />
                                    ) : (
                                        <EyeOff className="w-5 h-5 text-zinc-500" />
                                    )}
                                </button>
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 flex items-center justify-center">
                                    <span className="text-xs font-bold text-violet-400">FG</span>
                                </div>
                                <span className={`text-sm flex-1 ${isDark ? "text-white" : "text-zinc-900"}`}>Subject</span>
                            </div>

                            {/* Text Layers */}
                            {[...texts].reverse().map((text) => (
                                <div
                                    key={text.id}
                                    onClick={() => setSelectedTextId(text.id)}
                                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${text.id === selectedTextId
                                        ? isDark
                                            ? "bg-violet-500/20 ring-1 ring-violet-500/50"
                                            : "bg-violet-50 ring-1 ring-violet-500/50"
                                        : isDark
                                            ? "bg-zinc-800"
                                            : "bg-zinc-100"
                                        }`}
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setTextVisible(text.id, !text.visible);
                                        }}
                                        className="w-8 h-8 flex items-center justify-center"
                                    >
                                        {text.visible ? (
                                            <Eye className="w-5 h-5 text-emerald-500" />
                                        ) : (
                                            <EyeOff className="w-5 h-5 text-zinc-500" />
                                        )}
                                    </button>
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: text.fill + "30" }}
                                    >
                                        <Type className="w-4 h-4" style={{ color: text.fill }} />
                                    </div>
                                    <span className={`text-sm flex-1 truncate ${isDark ? "text-white" : "text-zinc-900"}`}>
                                        {text.content || "Text"}
                                    </span>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                duplicateText(text.id);
                                            }}
                                            className="w-8 h-8 flex items-center justify-center hover:text-violet-500"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteText(text.id);
                                            }}
                                            className="w-8 h-8 flex items-center justify-center hover:text-red-500"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Background Layer */}
                            <div className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? "bg-zinc-800" : "bg-zinc-100"}`}>
                                <button
                                    onClick={() => setBackgroundVisible(!backgroundVisible)}
                                    className="w-8 h-8 flex items-center justify-center"
                                >
                                    {backgroundVisible ? (
                                        <Eye className="w-5 h-5 text-emerald-500" />
                                    ) : (
                                        <EyeOff className="w-5 h-5 text-zinc-500" />
                                    )}
                                </button>
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-500/30 to-zinc-600/30 flex items-center justify-center">
                                    <span className="text-xs font-bold text-zinc-400">BG</span>
                                </div>
                                <span className={`text-sm flex-1 ${isDark ? "text-white" : "text-zinc-900"}`}>Background</span>
                            </div>

                            {texts.length === 0 && (
                                <div className="text-center py-4">
                                    <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>No text layers yet</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Navigation Bar */}
            <div className={`fixed bottom-0 left-0 right-0 z-50 md:hidden ${isDark ? "bg-zinc-950/95 border-zinc-800" : "bg-white/95 border-zinc-200"
                } backdrop-blur-lg border-t safe-area-bottom`}>
                <div className="flex items-center justify-around h-16">
                    {[
                        { id: "add", icon: Plus, label: "Add" },
                        { id: "style", icon: Type, label: "Style" },
                        { id: "color", icon: Palette, label: "Color" },
                        { id: "layers", icon: Layers, label: "Layers" },
                    ].map(({ id, icon: Icon, label }) => (
                        <button
                            key={id}
                            onClick={() => togglePanel(id as ActivePanel)}
                            className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all ${activePanel === id
                                ? "bg-violet-600 text-white"
                                : isDark
                                    ? "text-zinc-400 active:bg-zinc-800"
                                    : "text-zinc-500 active:bg-zinc-100"
                                }`}
                        >
                            <Icon className="w-5 h-5 mb-0.5" />
                            <span className="text-[10px] font-medium">{label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}
