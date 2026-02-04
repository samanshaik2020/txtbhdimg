"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Stage, Layer, Text, Transformer, Rect, Line, Group } from "react-konva";
import type { Stage as StageType } from "konva/lib/Stage";
import type { Text as TextType } from "konva/lib/shapes/Text";
import type { Transformer as TransformerType } from "konva/lib/shapes/Transformer";
import { useTextInsideStore, type TextInsideElement } from "@/lib/text-inside-store";
import { useTheme } from "@/components/ThemeProvider";
import { URLImage } from "./URLImage";

const SNAP_THRESHOLD = 8;

export function TextInsideCanvas() {
    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<StageType>(null);
    const transformerRef = useRef<TransformerType>(null);
    const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [guides, setGuides] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });
    const [fillPattern, setFillPattern] = useState<HTMLImageElement | null>(null);
    const { theme } = useTheme();

    const {
        backgroundImage,
        backgroundColor,
        fillImage,
        foregroundImage,
        backgroundVisible,
        foregroundVisible,
        canvasWidth,
        canvasHeight,
        texts,
        selectedTextId,
        setSelectedTextId,
        updateText,
        setCanvasDimensions,
        deleteText,
        duplicateText,
        undo,
        redo,
        pushHistory,
    } = useTextInsideStore();

    const isDark = theme === "dark";

    // Load fill pattern image
    useEffect(() => {
        if (fillImage) {
            const img = new window.Image();
            img.crossOrigin = "anonymous";
            img.src = fillImage;
            img.onload = () => {
                setFillPattern(img);
            };
        } else {
            setFillPattern(null);
        }
    }, [fillImage]);

    // Calculate responsive stage size
    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const container = containerRef.current;
                const width = container.clientWidth;
                const height = container.clientHeight;
                setStageSize({ width, height });
            }
        };

        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
                e.preventDefault();
                undo();
            }
            if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
                e.preventDefault();
                redo();
            }
            if ((e.key === "Delete" || e.key === "Backspace") && selectedTextId) {
                const activeElement = document.activeElement;
                if (activeElement?.tagName !== "INPUT" && activeElement?.tagName !== "TEXTAREA") {
                    e.preventDefault();
                    deleteText(selectedTextId);
                }
            }
            if ((e.ctrlKey || e.metaKey) && e.key === "d" && selectedTextId) {
                e.preventDefault();
                duplicateText(selectedTextId);
            }
            if (selectedTextId && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
                const activeElement = document.activeElement;
                if (activeElement?.tagName !== "INPUT" && activeElement?.tagName !== "TEXTAREA") {
                    e.preventDefault();
                    const delta = e.shiftKey ? 10 : 1;
                    const text = texts.find((t) => t.id === selectedTextId);
                    if (text) {
                        let { x, y } = text;
                        switch (e.key) {
                            case "ArrowUp": y -= delta; break;
                            case "ArrowDown": y += delta; break;
                            case "ArrowLeft": x -= delta; break;
                            case "ArrowRight": x += delta; break;
                        }
                        updateText(selectedTextId, { x, y });
                    }
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedTextId, texts, undo, redo, deleteText, duplicateText, updateText]);

    // Handle image load
    const handleImageLoad = useCallback((img: HTMLImageElement) => {
        const { width: containerWidth, height: containerHeight } = stageSize;
        const padding = 40;
        const availableWidth = containerWidth - padding * 2;
        const availableHeight = containerHeight - padding * 2;

        const imgRatio = img.width / img.height;
        const containerRatio = availableWidth / availableHeight;

        let newWidth, newHeight;
        if (imgRatio > containerRatio) {
            newWidth = availableWidth;
            newHeight = availableWidth / imgRatio;
        } else {
            newHeight = availableHeight;
            newWidth = availableHeight * imgRatio;
        }

        setImageSize({ width: newWidth, height: newHeight });
        setCanvasDimensions(newWidth, newHeight);
    }, [stageSize, setCanvasDimensions]);

    // Attach transformer
    useEffect(() => {
        if (!transformerRef.current || !stageRef.current) return;

        const stage = stageRef.current;
        const transformer = transformerRef.current;

        if (selectedTextId) {
            const selectedNode = stage.findOne(`#${selectedTextId}`);
            if (selectedNode) {
                transformer.nodes([selectedNode]);
                transformer.getLayer()?.batchDraw();
            }
        } else {
            transformer.nodes([]);
            transformer.getLayer()?.batchDraw();
        }
    }, [selectedTextId, texts]);

    const handleStageClick = (e: { target: { getStage: () => StageType | null } }) => {
        if (e.target === e.target.getStage()) {
            setSelectedTextId(null);
        }
    };

    // Use imageSize if available, otherwise calculate from canvasWidth/Height
    const effectiveWidth = imageSize.width || canvasWidth * 0.8;
    const effectiveHeight = imageSize.height || canvasHeight * 0.8;
    const imageX = (stageSize.width - effectiveWidth) / 2;
    const imageY = (stageSize.height - effectiveHeight) / 2;

    const handleDrag = (textId: string, node: TextType) => {
        const x = node.x();
        const y = node.y();
        const width = node.width() * node.scaleX();
        const height = node.height() * node.scaleY();

        const centerX = x + width / 2;
        const centerY = y + height / 2;

        const canvasCenterX = imageX + effectiveWidth / 2;
        const canvasCenterY = imageY + effectiveHeight / 2;

        let snapX: number | null = null;
        let snapY: number | null = null;

        if (Math.abs(centerX - canvasCenterX) < SNAP_THRESHOLD) {
            node.x(canvasCenterX - width / 2);
            snapX = canvasCenterX;
        }

        if (Math.abs(centerY - canvasCenterY) < SNAP_THRESHOLD) {
            node.y(canvasCenterY - height / 2);
            snapY = canvasCenterY;
        }

        setGuides({ x: snapX, y: snapY });
    };

    const handleDragEnd = (textId: string, node: TextType) => {
        pushHistory();
        updateText(textId, {
            x: node.x() - imageX,
            y: node.y() - imageY,
        });
        setGuides({ x: null, y: null });
    };

    // Export canvas
    const exportCanvas = useCallback(() => {
        if (!stageRef.current || (!backgroundImage && !backgroundColor)) return;

        if (transformerRef.current) {
            transformerRef.current.hide();
        }

        const stage = stageRef.current;
        const dataUrl = stage.toDataURL({
            pixelRatio: 2,
            x: imageX,
            y: imageY,
            width: effectiveWidth,
            height: effectiveHeight,
        });

        if (transformerRef.current) {
            transformerRef.current.show();
        }

        const link = document.createElement("a");
        link.download = "text-inside-image.png";
        link.href = dataUrl;
        link.click();
    }, [backgroundImage, backgroundColor, imageX, imageY, effectiveWidth, effectiveHeight]);

    useEffect(() => {
        (window as unknown as { exportCanvas: () => void }).exportCanvas = exportCanvas;
    }, [exportCanvas]);

    const checkerColor1 = isDark ? "#1a1a1a" : "#f0f0f0";
    const checkerColor2 = isDark ? "#252525" : "#e0e0e0";

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full overflow-hidden rounded-2xl transition-colors ${isDark ? "bg-zinc-900" : "bg-zinc-100"
                }`}
            style={{
                backgroundImage: `
          linear-gradient(45deg, ${checkerColor2} 25%, transparent 25%),
          linear-gradient(-45deg, ${checkerColor2} 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, ${checkerColor2} 75%),
          linear-gradient(-45deg, transparent 75%, ${checkerColor2} 75%)
        `,
                backgroundSize: "24px 24px",
                backgroundPosition: "0 0, 0 12px, 12px -12px, -12px 0px",
                backgroundColor: checkerColor1,
            }}
        >
            <Stage
                ref={stageRef}
                width={stageSize.width}
                height={stageSize.height}
                onClick={handleStageClick}
                onTap={handleStageClick}
            >
                <Layer>
                    {/* Canvas background rectangle */}
                    {(backgroundImage || backgroundColor) && (
                        <Rect
                            x={imageX}
                            y={imageY}
                            width={effectiveWidth}
                            height={effectiveHeight}
                            fill={backgroundImage ? "#000" : backgroundColor}
                            cornerRadius={8}
                            shadowColor="rgba(0,0,0,0.4)"
                            shadowBlur={40}
                            shadowOffset={{ x: 0, y: 15 }}
                            shadowOpacity={0.6}
                        />
                    )}

                    {/* Background image */}
                    {backgroundImage && backgroundVisible && (
                        <URLImage
                            src={backgroundImage}
                            x={imageX}
                            y={imageY}
                            width={imageSize.width}
                            height={imageSize.height}
                            onLoad={handleImageLoad}
                        />
                    )}

                    {/* Text elements with image fill pattern */}
                    {texts.filter(t => t.visible).map((text) => (
                        <Text
                            key={text.id}
                            id={text.id}
                            x={text.x + imageX}
                            y={text.y + imageY}
                            text={text.content}
                            fontSize={text.fontSize}
                            fontFamily={text.fontFamily}
                            fontStyle={`${text.fontStyle}${text.fontWeight >= 600 ? " bold" : ""}`}
                            fill={text.useImageFill && fillPattern ? undefined : text.fill}
                            fillPatternImage={text.useImageFill ? fillPattern || undefined : undefined}
                            fillPatternRepeat="no-repeat"
                            fillPatternScale={{ x: 0.5, y: 0.5 }}
                            align={text.align}
                            letterSpacing={text.letterSpacing}
                            lineHeight={text.lineHeight}
                            rotation={text.rotation}
                            scaleX={text.scaleX}
                            scaleY={text.scaleY}
                            draggable
                            onClick={() => setSelectedTextId(text.id)}
                            onTap={() => setSelectedTextId(text.id)}
                            onDragMove={(e) => handleDrag(text.id, e.target as TextType)}
                            onDragEnd={(e) => handleDragEnd(text.id, e.target as TextType)}
                            onTransformEnd={(e) => {
                                const node = e.target as TextType;
                                pushHistory();
                                updateText(text.id, {
                                    x: node.x() - imageX,
                                    y: node.y() - imageY,
                                    rotation: node.rotation(),
                                    scaleX: node.scaleX(),
                                    scaleY: node.scaleY(),
                                });
                            }}
                        />
                    ))}

                    {/* Foreground layer */}
                    {foregroundImage && foregroundVisible && (
                        <URLImage
                            src={foregroundImage}
                            x={imageX}
                            y={imageY}
                            width={imageSize.width}
                            height={imageSize.height}
                            listening={false}
                        />
                    )}

                    {/* Snapping guides */}
                    {guides.x !== null && (
                        <Line
                            points={[guides.x, imageY, guides.x, imageY + effectiveHeight]}
                            stroke="#8b5cf6"
                            strokeWidth={1}
                            dash={[4, 4]}
                        />
                    )}
                    {guides.y !== null && (
                        <Line
                            points={[imageX, guides.y, imageX + effectiveWidth, guides.y]}
                            stroke="#8b5cf6"
                            strokeWidth={1}
                            dash={[4, 4]}
                        />
                    )}

                    {/* Transformer */}
                    <Transformer
                        ref={transformerRef}
                        borderStroke="#8b5cf6"
                        borderStrokeWidth={2}
                        anchorStroke="#8b5cf6"
                        anchorFill="#ffffff"
                        anchorSize={10}
                        anchorCornerRadius={5}
                        boundBoxFunc={(oldBox, newBox) => {
                            if (newBox.width < 20 || newBox.height < 20) {
                                return oldBox;
                            }
                            return newBox;
                        }}
                        rotateEnabled={true}
                        enabledAnchors={[
                            "top-left",
                            "top-right",
                            "bottom-left",
                            "bottom-right",
                        ]}
                    />
                </Layer>
            </Stage>

            {/* Empty state */}
            {!backgroundImage && !backgroundColor && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className={`text-center max-w-xs px-8 py-10 rounded-3xl ${isDark ? "bg-zinc-900/80" : "bg-white/80"
                        } backdrop-blur-sm`}>
                        <div className={`w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center ${isDark ? "bg-zinc-800" : "bg-zinc-100"
                            }`}>
                            <svg
                                className={`h-10 w-10 ${isDark ? "text-zinc-600" : "text-zinc-400"}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <p className={`text-lg font-semibold mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}>
                            Set a background
                        </p>
                        <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                            Upload an image or choose a color
                        </p>
                    </div>
                </div>
            )}

            {/* Keyboard hints */}
            <div className={`absolute bottom-4 left-4 text-xs hidden md:block ${isDark ? "text-zinc-600" : "text-zinc-400"
                }`}>
                <span className="opacity-60">Ctrl+Z: Undo • Ctrl+D: Duplicate • Del: Delete</span>
            </div>
        </div>
    );
}
