"use client";

import { useRef, useState, useCallback } from "react";
import { removeBackground } from "@imgly/background-removal";
import { useTextInsideStore, type TextInsideElement, CANVAS_PRESETS, type CanvasPreset } from "@/lib/text-inside-store";
import { useTheme } from "@/components/ThemeProvider";
import { FONTS, getFontWeights } from "@/lib/fonts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
    ImageIcon,
    Type,
    Sliders,
    Layers,
    Plus,
    Trash2,
    Download,
    RotateCcw,
    Loader2,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Sun,
    Moon,
    Sparkles,
    Upload,
    Eye,
    EyeOff,
    Copy,
    Undo2,
    Redo2,
    Monitor,
    Image,
} from "lucide-react";

export function TextInsideSidebar() {
    const bgInputRef = useRef<HTMLInputElement>(null);
    const fillInputRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState("image");
    const { theme, toggleTheme } = useTheme();

    const {
        backgroundImage,
        backgroundColor,
        fillImage,
        foregroundImage,
        isProcessing,
        texts,
        selectedTextId,
        backgroundVisible,
        foregroundVisible,
        canvasPreset,
        setBackgroundImage,
        setBackgroundColor,
        setFillImage,
        setForegroundImage,
        setIsProcessing,
        setBackgroundVisible,
        setForegroundVisible,
        setCanvasPreset,
        addText,
        updateText,
        deleteText,
        duplicateText,
        setSelectedTextId,
        setTextVisible,
        undo,
        redo,
        reset,
    } = useTextInsideStore();

    const selectedText = texts.find((t) => t.id === selectedTextId);
    const availableWeights = selectedText ? getFontWeights(selectedText.fontFamily) : [400, 700];

    const handleBackgroundUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const imageUrl = URL.createObjectURL(file);
        setBackgroundImage(imageUrl);
    }, [setBackgroundImage]);

    const handleFillImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const imageUrl = URL.createObjectURL(file);
        setFillImage(imageUrl);
    }, [setFillImage]);

    const handleExport = () => {
        const exportFn = (window as unknown as { exportCanvas?: () => void }).exportCanvas;
        if (exportFn) {
            exportFn();
        }
    };

    const updateTextProperty = <K extends keyof TextInsideElement>(
        key: K,
        value: TextInsideElement[K]
    ) => {
        if (selectedTextId) {
            updateText(selectedTextId, { [key]: value });
        }
    };

    const isDark = theme === "dark";

    const cardStyle = isDark
        ? "bg-zinc-900/50 border border-zinc-800 rounded-xl"
        : "bg-zinc-50 border border-zinc-200 rounded-xl";
    const labelStyle = `text-[10px] font-semibold uppercase tracking-wider ${isDark ? "text-zinc-500" : "text-zinc-400"}`;
    const inputStyle = `h-9 rounded-lg text-sm ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`;

    return (
        <div className={`w-[380px] h-full hidden md:flex flex-col border-r transition-colors duration-200 ${isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200"
            }`}>
            {/* Header */}
            <div className={`px-4 py-3 border-b flex items-center justify-between ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-fuchsia-500/20">
                        <Type className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h1 className={`text-sm font-semibold ${isDark ? "text-white" : "text-zinc-900"}`}>
                            Text Inside Image
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={undo} className="w-7 h-7 rounded-lg">
                        <Undo2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={redo} className="w-7 h-7 rounded-lg">
                        <Redo2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={toggleTheme} className="w-7 h-7 rounded-lg">
                        {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <div className={`px-2 pt-2 ${isDark ? "bg-zinc-950" : "bg-white"}`}>
                    <TabsList className={`w-full grid grid-cols-4 h-9 p-0.5 rounded-lg ${isDark ? "bg-zinc-900" : "bg-zinc-100"}`}>
                        {[
                            { value: "image", icon: ImageIcon, label: "Image" },
                            { value: "text", icon: Type, label: "Text" },
                            { value: "layers", icon: Layers, label: "Layers" },
                            { value: "settings", icon: Sliders, label: "Export" },
                        ].map(({ value, icon: Icon, label }) => (
                            <TabsTrigger
                                key={value}
                                value={value}
                                className={`rounded-md text-[10px] font-medium h-8 ${isDark
                                    ? "data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-500"
                                    : "data-[state=active]:bg-white data-[state=active]:text-zinc-900 text-zinc-500 data-[state=active]:shadow-sm"
                                    }`}
                            >
                                <Icon className="w-3.5 h-3.5 mr-1" />
                                {label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {/* Image Tab */}
                <TabsContent value="image" className="flex-1 p-3 space-y-3 overflow-y-auto mt-0">
                    <input ref={bgInputRef} type="file" accept="image/*" onChange={handleBackgroundUpload} className="hidden" />
                    <input ref={fillInputRef} type="file" accept="image/*" onChange={handleFillImageUpload} className="hidden" />

                    {/* Canvas Preset */}
                    <div className={`${cardStyle} p-3`}>
                        <div className="flex items-center gap-2 mb-2">
                            <Monitor className="w-3.5 h-3.5 text-fuchsia-500" />
                            <span className={labelStyle}>Canvas Size</span>
                        </div>
                        <select
                            value={canvasPreset}
                            onChange={(e) => setCanvasPreset(e.target.value as CanvasPreset)}
                            className={`w-full h-9 rounded-lg text-sm px-3 ${isDark ? "bg-zinc-900 border border-zinc-800 text-white" : "bg-white border border-zinc-200 text-zinc-900"}`}
                        >
                            {Object.entries(CANVAS_PRESETS).map(([key, preset]) => (
                                <option key={key} value={key}>
                                    {preset.name} ({preset.ratio})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Background Image */}
                    <div className={`${cardStyle} p-3`}>
                        <div className="flex items-center gap-2 mb-2">
                            <ImageIcon className="w-3.5 h-3.5 text-fuchsia-500" />
                            <span className={labelStyle}>Background Image</span>
                        </div>
                        {!backgroundImage ? (
                            <div
                                onClick={() => bgInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${isDark ? "border-zinc-800 hover:border-fuchsia-500/50" : "border-zinc-300 hover:border-fuchsia-500/50"
                                    }`}
                            >
                                <Upload className={`w-8 h-8 mx-auto mb-2 ${isDark ? "text-zinc-600" : "text-zinc-400"}`} />
                                <p className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>Upload background</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className={`relative aspect-video rounded-lg overflow-hidden ${isDark ? "bg-zinc-900" : "bg-zinc-100"}`}>
                                    <img src={backgroundImage} alt="Background" className="w-full h-full object-cover" />
                                </div>
                                <Button variant="outline" size="sm" onClick={() => bgInputRef.current?.click()} className="w-full h-8 text-xs">
                                    <ImageIcon className="w-3 h-3 mr-1" /> Replace
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Background Color */}
                    <div className={`${cardStyle} p-3`}>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: backgroundColor }} />
                            <span className={labelStyle}>Background Color</span>
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                            {["#1a1a2e", "#16213e", "#0f3460", "#1a1a1a", "#2d3436", "#000000", "#ffffff", "#f8f9fa", "#e9ecef"].map((color) => (
                                <button
                                    key={color}
                                    onClick={() => setBackgroundColor(color)}
                                    className={`w-7 h-7 rounded-lg transition-transform hover:scale-110 ${backgroundColor === color ? "ring-2 ring-fuchsia-500 ring-offset-1" : ""}`}
                                    style={{ backgroundColor: color, border: color === "#ffffff" || color === "#f8f9fa" || color === "#e9ecef" ? "1px solid #e4e4e7" : "none" }}
                                />
                            ))}
                            <input
                                type="color"
                                value={backgroundColor}
                                onChange={(e) => setBackgroundColor(e.target.value)}
                                className="w-7 h-7 rounded-lg cursor-pointer border-0"
                                title="Custom color"
                            />
                        </div>
                    </div>

                    {/* Fill Image (for text) */}
                    <div className={`${cardStyle} p-3`}>
                        <div className="flex items-center gap-2 mb-2">
                            <Image className="w-3.5 h-3.5 text-pink-500" />
                            <span className={labelStyle}>Text Fill Image</span>
                        </div>
                        {!fillImage ? (
                            <div
                                onClick={() => fillInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${isDark ? "border-zinc-800 hover:border-pink-500/50" : "border-zinc-300 hover:border-pink-500/50"
                                    }`}
                            >
                                <Upload className={`w-8 h-8 mx-auto mb-2 ${isDark ? "text-zinc-600" : "text-zinc-400"}`} />
                                <p className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>Upload image for text fill</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className={`relative aspect-video rounded-lg overflow-hidden ${isDark ? "bg-zinc-900" : "bg-zinc-100"}`}>
                                    <img src={fillImage} alt="Fill" className="w-full h-full object-cover" />
                                </div>
                                <Button variant="outline" size="sm" onClick={() => fillInputRef.current?.click()} className="w-full h-8 text-xs">
                                    <Image className="w-3 h-3 mr-1" /> Replace Fill
                                </Button>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* Text Tab */}
                <TabsContent value="text" className="flex-1 p-3 space-y-3 overflow-y-auto mt-0">
                    <Button onClick={addText} className="w-full h-9 rounded-lg bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-xs font-medium" disabled={!backgroundImage}>
                        <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Text Layer
                    </Button>

                    {selectedText && (
                        <div className={`${cardStyle} p-3 space-y-3`}>
                            {/* Content */}
                            <div>
                                <label className={labelStyle}>Content</label>
                                <Input value={selectedText.content} onChange={(e) => updateTextProperty("content", e.target.value)} className={`${inputStyle} mt-1`} />
                            </div>

                            {/* Font & Size */}
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className={labelStyle}>Font</label>
                                    <select value={selectedText.fontFamily} onChange={(e) => updateTextProperty("fontFamily", e.target.value)} className={`w-full ${inputStyle} px-2 mt-1`}>
                                        {FONTS.map((font) => (
                                            <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>{font.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelStyle}>Size (px)</label>
                                    <div className="relative mt-1">
                                        <Input type="number" value={selectedText.fontSize} onChange={(e) => updateTextProperty("fontSize", Number(e.target.value))} className={`${inputStyle} pr-8`} min={12} max={2000} />
                                        <span className={`absolute right-2 top-1/2 -translate-y-1/2 text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>px</span>
                                    </div>
                                </div>
                            </div>

                            {/* Weight & Style */}
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className={labelStyle}>Weight</label>
                                    <select value={selectedText.fontWeight} onChange={(e) => updateTextProperty("fontWeight", Number(e.target.value))} className={`w-full ${inputStyle} px-2 mt-1`}>
                                        {availableWeights.map((w) => (
                                            <option key={w} value={w}>{w}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelStyle}>Style</label>
                                    <select value={selectedText.fontStyle} onChange={(e) => updateTextProperty("fontStyle", e.target.value as "normal" | "italic")} className={`w-full ${inputStyle} px-2 mt-1`}>
                                        <option value="normal">Normal</option>
                                        <option value="italic">Italic</option>
                                    </select>
                                </div>
                            </div>

                            {/* Fill Mode Toggle */}
                            <div className={`p-2.5 rounded-lg ${isDark ? "bg-zinc-900" : "bg-zinc-100"}`}>
                                <div className="flex items-center justify-between">
                                    <span className={`text-xs font-medium ${isDark ? "text-white" : "text-zinc-900"}`}>Use Image Fill</span>
                                    <button
                                        onClick={() => updateTextProperty("useImageFill", !selectedText.useImageFill)}
                                        className={`w-8 h-4 rounded-full transition-colors ${selectedText.useImageFill ? "bg-fuchsia-500" : isDark ? "bg-zinc-700" : "bg-zinc-300"}`}
                                    >
                                        <div className={`w-3 h-3 rounded-full bg-white transition-transform ${selectedText.useImageFill ? "translate-x-4" : "translate-x-0.5"}`} />
                                    </button>
                                </div>
                            </div>

                            {/* Color (only when not using image fill) */}
                            {!selectedText.useImageFill && (
                                <div>
                                    <label className={labelStyle}>Color</label>
                                    <div className="flex gap-1.5 mt-1 flex-wrap">
                                        {["#ffffff", "#000000", "#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"].map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => updateTextProperty("fill", color)}
                                                className={`w-6 h-6 rounded-md transition-transform hover:scale-110 ${selectedText.fill === color ? "ring-2 ring-fuchsia-500 ring-offset-1" : ""}`}
                                                style={{ backgroundColor: color, border: color === "#ffffff" ? "1px solid #e4e4e7" : "none" }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Alignment */}
                            <div>
                                <label className={labelStyle}>Alignment</label>
                                <div className={`grid grid-cols-3 gap-1 p-0.5 rounded-lg mt-1 ${isDark ? "bg-zinc-900" : "bg-zinc-100"}`}>
                                    {[{ value: "left", icon: AlignLeft }, { value: "center", icon: AlignCenter }, { value: "right", icon: AlignRight }].map(({ value, icon: Icon }) => (
                                        <Button key={value} size="sm" variant="ghost" onClick={() => updateTextProperty("align", value as "left" | "center" | "right")}
                                            className={`h-7 rounded-md ${selectedText.align === value ? (isDark ? "bg-zinc-800 text-white" : "bg-white text-zinc-900 shadow-sm") : ""}`}>
                                            <Icon className="w-3.5 h-3.5" />
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Letter Spacing & Line Height */}
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <div className="flex justify-between items-center">
                                        <label className={labelStyle}>Spacing</label>
                                        <span className={`text-[10px] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>{selectedText.letterSpacing}</span>
                                    </div>
                                    <Slider value={[selectedText.letterSpacing]} onValueChange={([v]) => updateTextProperty("letterSpacing", v)} min={-10} max={50} step={1} className="mt-1" />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center">
                                        <label className={labelStyle}>Line Height</label>
                                        <span className={`text-[10px] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>{selectedText.lineHeight.toFixed(1)}</span>
                                    </div>
                                    <Slider value={[selectedText.lineHeight * 10]} onValueChange={([v]) => updateTextProperty("lineHeight", v / 10)} min={5} max={30} step={1} className="mt-1" />
                                </div>
                            </div>
                        </div>
                    )}

                    {texts.length === 0 && backgroundImage && (
                        <div className={`text-center py-6 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                            <Type className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p className="text-xs">No text layers yet</p>
                        </div>
                    )}
                </TabsContent>

                {/* Layers Tab */}
                <TabsContent value="layers" className="flex-1 p-3 space-y-2 overflow-y-auto mt-0">
                    <p className={labelStyle}>Layer Stack</p>

                    {/* Foreground Layer */}
                    <div className={`flex items-center gap-2 p-2.5 rounded-lg ${isDark ? "bg-zinc-900" : "bg-zinc-50"}`}>
                        <button onClick={() => setForegroundVisible(!foregroundVisible)} className="w-5 h-5 flex items-center justify-center">
                            {foregroundVisible ? <Eye className="w-3.5 h-3.5 text-emerald-500" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-500" />}
                        </button>
                        <div className="w-6 h-6 rounded bg-gradient-to-br from-fuchsia-500/30 to-pink-500/30 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-fuchsia-400">FG</span>
                        </div>
                        <span className={`text-xs flex-1 ${isDark ? "text-white" : "text-zinc-900"}`}>Foreground</span>
                    </div>

                    {/* Text Layers */}
                    {[...texts].reverse().map((text) => (
                        <div
                            key={text.id}
                            onClick={() => setSelectedTextId(text.id)}
                            className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-all ${text.id === selectedTextId
                                ? isDark ? "bg-fuchsia-500/20 ring-1 ring-fuchsia-500/50" : "bg-fuchsia-50 ring-1 ring-fuchsia-500/50"
                                : isDark ? "bg-zinc-900 hover:bg-zinc-800" : "bg-zinc-50 hover:bg-zinc-100"
                                }`}
                        >
                            <button onClick={(e) => { e.stopPropagation(); setTextVisible(text.id, !text.visible); }} className="w-5 h-5 flex items-center justify-center">
                                {text.visible ? <Eye className="w-3.5 h-3.5 text-emerald-500" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-500" />}
                            </button>
                            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: text.useImageFill ? "#f0abfc30" : text.fill + "30" }}>
                                <Type className="w-3 h-3" style={{ color: text.useImageFill ? "#f0abfc" : text.fill }} />
                            </div>
                            <span className={`text-xs flex-1 truncate ${isDark ? "text-white" : "text-zinc-900"}`}>{text.content || "Text"}</span>
                            <div className="flex gap-1">
                                <button onClick={(e) => { e.stopPropagation(); duplicateText(text.id); }} className="w-5 h-5 flex items-center justify-center hover:text-fuchsia-500">
                                    <Copy className="w-3 h-3" />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); deleteText(text.id); }} className="w-5 h-5 flex items-center justify-center hover:text-red-500">
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Background Layer */}
                    <div className={`flex items-center gap-2 p-2.5 rounded-lg ${isDark ? "bg-zinc-900" : "bg-zinc-50"}`}>
                        <button onClick={() => setBackgroundVisible(!backgroundVisible)} className="w-5 h-5 flex items-center justify-center">
                            {backgroundVisible ? <Eye className="w-3.5 h-3.5 text-emerald-500" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-500" />}
                        </button>
                        <div className="w-6 h-6 rounded bg-gradient-to-br from-zinc-500/30 to-zinc-600/30 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-zinc-400">BG</span>
                        </div>
                        <span className={`text-xs flex-1 ${isDark ? "text-white" : "text-zinc-900"}`}>Background</span>
                    </div>
                </TabsContent>

                {/* Settings/Export Tab */}
                <TabsContent value="settings" className="flex-1 p-3 space-y-3 overflow-y-auto mt-0">
                    <div className={`${cardStyle} p-3`}>
                        <div className="flex items-center gap-2 mb-3">
                            <Download className="w-3.5 h-3.5 text-emerald-500" />
                            <span className={labelStyle}>Export</span>
                        </div>
                        <Button onClick={handleExport} disabled={!backgroundImage} className="w-full h-9 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-xs font-medium">
                            <Download className="w-3.5 h-3.5 mr-1.5" /> Download PNG (2x)
                        </Button>
                    </div>

                    <div className={`${cardStyle} p-3`}>
                        <div className="flex items-center gap-2 mb-3">
                            <RotateCcw className="w-3.5 h-3.5 text-red-500" />
                            <span className={labelStyle}>Reset</span>
                        </div>
                        <Button onClick={reset} variant="outline" className="w-full h-9 rounded-lg text-xs">
                            <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reset All
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
