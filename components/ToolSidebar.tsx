"use client";

import { useRef, useState, useCallback } from "react";
import { removeBackground } from "@imgly/background-removal";
import { useEditorStore, type TextElement, CANVAS_PRESETS, type CanvasPreset } from "@/lib/store";
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
    ChevronDown,
    ChevronUp,
    Undo2,
    Redo2,
    Monitor,
} from "lucide-react";

export function ToolSidebar() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState("image");
    const [showEffects, setShowEffects] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const {
        image,
        foregroundImage,
        isProcessing,
        texts,
        selectedTextId,
        imageOpacity,
        backgroundVisible,
        foregroundVisible,
        canvasPreset,
        setImage,
        setForegroundImage,
        setIsProcessing,
        setImageOpacity,
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
    } = useEditorStore();

    const selectedText = texts.find((t) => t.id === selectedTextId);
    const availableWeights = selectedText ? getFontWeights(selectedText.fontFamily) : [400, 700];

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

    const isDark = theme === "dark";

    // Common styles
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
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h1 className={`text-sm font-semibold ${isDark ? "text-white" : "text-zinc-900"}`}>
                            Text Behind Image
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
                            { value: "settings", icon: Sliders, label: "Adjust" },
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
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

                    {/* Canvas Preset */}
                    <div className={`${cardStyle} p-3`}>
                        <div className="flex items-center gap-2 mb-2">
                            <Monitor className="w-3.5 h-3.5 text-violet-500" />
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

                    {!image ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`group border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDark ? "border-zinc-800 hover:border-violet-500/50 hover:bg-violet-500/5" : "border-zinc-300 hover:border-violet-500/50 hover:bg-violet-50"
                                }`}
                        >
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors ${isDark ? "bg-zinc-900 group-hover:bg-violet-500/20" : "bg-zinc-100 group-hover:bg-violet-100"
                                }`}>
                                <Upload className={`w-6 h-6 ${isDark ? "text-zinc-500 group-hover:text-violet-400" : "text-zinc-400 group-hover:text-violet-500"}`} />
                            </div>
                            <p className={`text-sm font-medium mb-1 ${isDark ? "text-white" : "text-zinc-900"}`}>Upload your image</p>
                            <p className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>PNG, JPG, WEBP</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className={`relative aspect-video rounded-lg overflow-hidden ${isDark ? "bg-zinc-900" : "bg-zinc-100"}`}>
                                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                {isProcessing && (
                                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                                        <div className="text-center">
                                            <Loader2 className="w-8 h-8 text-violet-500 animate-spin mx-auto" />
                                            <p className="text-xs text-white mt-2">AI Processing...</p>
                                        </div>
                                    </div>
                                )}
                                {foregroundImage && !isProcessing && (
                                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500/90 text-[10px] font-medium text-white">
                                        Ready
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className={`h-8 rounded-lg text-xs ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
                                    <ImageIcon className="w-3 h-3 mr-1" /> Replace
                                </Button>
                                <Button variant="outline" onClick={reset} className={`h-8 rounded-lg text-xs ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
                                    <RotateCcw className="w-3 h-3 mr-1" /> Reset
                                </Button>
                            </div>
                        </div>
                    )}
                </TabsContent>

                {/* Text Tab */}
                <TabsContent value="text" className="flex-1 p-3 space-y-3 overflow-y-auto mt-0">
                    <Button onClick={addText} className="w-full h-9 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-xs font-medium" disabled={!image}>
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
                                    <label className={labelStyle}>Size</label>
                                    <Input type="number" value={selectedText.fontSize} onChange={(e) => updateTextProperty("fontSize", Number(e.target.value))} className={`${inputStyle} mt-1`} min={12} max={2000} />
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

                            {/* Color */}
                            <div>
                                <label className={labelStyle}>Color</label>
                                <div className="flex gap-1.5 mt-1 flex-wrap">
                                    {["#ffffff", "#000000", "#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"].map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => updateTextProperty("fill", color)}
                                            className={`w-6 h-6 rounded-md transition-transform hover:scale-110 ${selectedText.fill === color ? "ring-2 ring-violet-500 ring-offset-1" : ""}`}
                                            style={{ backgroundColor: color, border: color === "#ffffff" ? "1px solid #e4e4e7" : "none" }}
                                        />
                                    ))}
                                    <div className="relative">
                                        <input type="color" value={selectedText.fill} onChange={(e) => updateTextProperty("fill", e.target.value)} className="absolute inset-0 w-6 h-6 opacity-0 cursor-pointer" />
                                        <div className={`w-6 h-6 rounded-md border-2 border-dashed flex items-center justify-center ${isDark ? "border-zinc-700" : "border-zinc-300"}`}>
                                            <Plus className="w-3 h-3 text-zinc-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>

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

                            {/* Effects Toggle */}
                            <button onClick={() => setShowEffects(!showEffects)} className={`w-full flex items-center justify-between p-2 rounded-lg ${isDark ? "bg-zinc-900 hover:bg-zinc-800" : "bg-zinc-100 hover:bg-zinc-200"}`}>
                                <span className={`text-xs font-medium ${isDark ? "text-white" : "text-zinc-900"}`}>Text Effects</span>
                                {showEffects ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            {showEffects && (
                                <div className="space-y-3 pt-2">
                                    {/* Shadow */}
                                    <div className={`p-2.5 rounded-lg ${isDark ? "bg-zinc-900" : "bg-zinc-100"}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-xs font-medium ${isDark ? "text-white" : "text-zinc-900"}`}>Shadow</span>
                                            <button onClick={() => updateTextProperty("shadowEnabled", !selectedText.shadowEnabled)} className={`w-8 h-4 rounded-full transition-colors ${selectedText.shadowEnabled ? "bg-violet-500" : isDark ? "bg-zinc-700" : "bg-zinc-300"}`}>
                                                <div className={`w-3 h-3 rounded-full bg-white transition-transform ${selectedText.shadowEnabled ? "translate-x-4" : "translate-x-0.5"}`} />
                                            </button>
                                        </div>
                                        {selectedText.shadowEnabled && (
                                            <div className="space-y-2">
                                                <div className="flex gap-2 items-center">
                                                    <input type="color" value={selectedText.shadowColor} onChange={(e) => updateTextProperty("shadowColor", e.target.value)} className="w-6 h-6 rounded cursor-pointer" />
                                                    <div className="flex-1">
                                                        <Slider value={[selectedText.shadowBlur]} onValueChange={([v]) => updateTextProperty("shadowBlur", v)} min={0} max={50} step={1} />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className={`${labelStyle} text-[9px]`}>X Offset</label>
                                                        <Slider value={[selectedText.shadowOffsetX]} onValueChange={([v]) => updateTextProperty("shadowOffsetX", v)} min={-30} max={30} step={1} />
                                                    </div>
                                                    <div>
                                                        <label className={`${labelStyle} text-[9px]`}>Y Offset</label>
                                                        <Slider value={[selectedText.shadowOffsetY]} onValueChange={([v]) => updateTextProperty("shadowOffsetY", v)} min={-30} max={30} step={1} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Stroke */}
                                    <div className={`p-2.5 rounded-lg ${isDark ? "bg-zinc-900" : "bg-zinc-100"}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-xs font-medium ${isDark ? "text-white" : "text-zinc-900"}`}>Stroke</span>
                                            <button onClick={() => updateTextProperty("strokeEnabled", !selectedText.strokeEnabled)} className={`w-8 h-4 rounded-full transition-colors ${selectedText.strokeEnabled ? "bg-violet-500" : isDark ? "bg-zinc-700" : "bg-zinc-300"}`}>
                                                <div className={`w-3 h-3 rounded-full bg-white transition-transform ${selectedText.strokeEnabled ? "translate-x-4" : "translate-x-0.5"}`} />
                                            </button>
                                        </div>
                                        {selectedText.strokeEnabled && (
                                            <div className="flex gap-2 items-center">
                                                <input type="color" value={selectedText.strokeColor} onChange={(e) => updateTextProperty("strokeColor", e.target.value)} className="w-6 h-6 rounded cursor-pointer" />
                                                <div className="flex-1">
                                                    <Slider value={[selectedText.strokeWidth]} onValueChange={([v]) => updateTextProperty("strokeWidth", v)} min={1} max={20} step={1} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {texts.length === 0 && image && (
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
                        <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-violet-400">FG</span>
                        </div>
                        <span className={`text-xs flex-1 ${isDark ? "text-white" : "text-zinc-900"}`}>Foreground (Subject)</span>
                    </div>

                    {/* Text Layers */}
                    {[...texts].reverse().map((text) => (
                        <div
                            key={text.id}
                            onClick={() => setSelectedTextId(text.id)}
                            className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-all ${text.id === selectedTextId
                                ? isDark ? "bg-violet-500/20 ring-1 ring-violet-500/50" : "bg-violet-50 ring-1 ring-violet-500/50"
                                : isDark ? "bg-zinc-900 hover:bg-zinc-800" : "bg-zinc-50 hover:bg-zinc-100"
                                }`}
                        >
                            <button onClick={(e) => { e.stopPropagation(); setTextVisible(text.id, !text.visible); }} className="w-5 h-5 flex items-center justify-center">
                                {text.visible ? <Eye className="w-3.5 h-3.5 text-emerald-500" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-500" />}
                            </button>
                            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: text.fill + "30" }}>
                                <Type className="w-3 h-3" style={{ color: text.fill }} />
                            </div>
                            <span className={`text-xs flex-1 truncate ${isDark ? "text-white" : "text-zinc-900"}`}>{text.content || "Text"}</span>
                            <div className="flex gap-1">
                                <button onClick={(e) => { e.stopPropagation(); duplicateText(text.id); }} className="w-5 h-5 flex items-center justify-center hover:text-violet-500">
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

                {/* Settings Tab */}
                <TabsContent value="settings" className="flex-1 p-3 space-y-3 overflow-y-auto mt-0">
                    {/* Subject Opacity */}
                    <div className={`${cardStyle} p-3`}>
                        <div className="flex items-center gap-2 mb-2">
                            <Layers className="w-3.5 h-3.5 text-violet-500" />
                            <span className={labelStyle}>Subject Opacity</span>
                            <span className={`ml-auto text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>{Math.round(imageOpacity * 100)}%</span>
                        </div>
                        <Slider value={[imageOpacity * 100]} onValueChange={([v]) => setImageOpacity(v / 100)} min={0} max={100} step={1} />
                    </div>

                    {/* Export */}
                    <div className={`${cardStyle} p-3`}>
                        <div className="flex items-center gap-2 mb-3">
                            <Download className="w-3.5 h-3.5 text-emerald-500" />
                            <span className={labelStyle}>Export</span>
                        </div>
                        <Button onClick={handleExport} disabled={!image} className="w-full h-9 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-xs font-medium">
                            <Download className="w-3.5 h-3.5 mr-1.5" /> Download PNG (2x)
                        </Button>
                    </div>

                    {/* Tips */}
                    <div className={`${cardStyle} p-3`}>
                        <p className={`${labelStyle} mb-2`}>Shortcuts</p>
                        <div className={`space-y-1.5 text-[10px] ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                            <div className="flex justify-between"><span>Undo</span><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">Ctrl+Z</kbd></div>
                            <div className="flex justify-between"><span>Redo</span><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">Ctrl+Shift+Z</kbd></div>
                            <div className="flex justify-between"><span>Duplicate</span><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">Ctrl+D</kbd></div>
                            <div className="flex justify-between"><span>Delete</span><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">Del</kbd></div>
                            <div className="flex justify-between"><span>Move (fast)</span><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">Shift+Arrows</kbd></div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
