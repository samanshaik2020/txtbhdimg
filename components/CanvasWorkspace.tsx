"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Stage, Layer, Text, Transformer, Rect, Line } from "react-konva";
import type { Stage as StageType } from "konva/lib/Stage";
import type { Text as TextType } from "konva/lib/shapes/Text";
import type { Transformer as TransformerType } from "konva/lib/shapes/Transformer";
import { useEditorStore, type TextElement } from "@/lib/store";
import { useTheme } from "@/components/ThemeProvider";
import { URLImage } from "./URLImage";

// Snapping threshold in pixels
const SNAP_THRESHOLD = 8;

export function CanvasWorkspace() {
    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<StageType>(null);
    const transformerRef = useRef<TransformerType>(null);
    const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [guides, setGuides] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });
    const { theme } = useTheme();

    const {
        image,
        foregroundImage,
        imageOpacity,
        backgroundVisible,
        foregroundVisible,
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
    } = useEditorStore();

    const isDark = theme === "dark";

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
            // Undo: Ctrl/Cmd + Z
            if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
                e.preventDefault();
                undo();
            }
            // Redo: Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
            if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
                e.preventDefault();
                redo();
            }
            // Delete selected text
            if ((e.key === "Delete" || e.key === "Backspace") && selectedTextId) {
                const activeElement = document.activeElement;
                if (activeElement?.tagName !== "INPUT" && activeElement?.tagName !== "TEXTAREA") {
                    e.preventDefault();
                    deleteText(selectedTextId);
                }
            }
            // Duplicate: Ctrl/Cmd + D
            if ((e.ctrlKey || e.metaKey) && e.key === "d" && selectedTextId) {
                e.preventDefault();
                duplicateText(selectedTextId);
            }
            // Arrow key movement
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

    // Handle image load to get natural dimensions
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

    // Attach transformer to selected text
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

    // Click on stage background to deselect
    const handleStageClick = (e: { target: { getStage: () => StageType | null } }) => {
        if (e.target === e.target.getStage()) {
            setSelectedTextId(null);
        }
    };

    // Calculate image position to center it
    const imageX = (stageSize.width - imageSize.width) / 2;
    const imageY = (stageSize.height - imageSize.height) / 2;

    // Calculate snapping guides
    const handleDrag = (textId: string, node: TextType) => {
        const x = node.x();
        const y = node.y();
        const width = node.width() * node.scaleX();
        const height = node.height() * node.scaleY();

        const centerX = x + width / 2;
        const centerY = y + height / 2;

        const canvasCenterX = imageX + imageSize.width / 2;
        const canvasCenterY = imageY + imageSize.height / 2;

        let snapX: number | null = null;
        let snapY: number | null = null;

        // Snap to center X
        if (Math.abs(centerX - canvasCenterX) < SNAP_THRESHOLD) {
            node.x(canvasCenterX - width / 2);
            snapX = canvasCenterX;
        }

        // Snap to center Y
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

    // Export canvas as image
    const exportCanvas = useCallback(() => {
        if (!stageRef.current || !image) return;

        if (transformerRef.current) {
            transformerRef.current.hide();
        }

        const stage = stageRef.current;
        const dataUrl = stage.toDataURL({
            pixelRatio: 2,
            x: imageX,
            y: imageY,
            width: imageSize.width,
            height: imageSize.height,
        });

        if (transformerRef.current) {
            transformerRef.current.show();
        }

        const link = document.createElement("a");
        link.download = "text-behind-image.png";
        link.href = dataUrl;
        link.click();
    }, [image, imageX, imageY, imageSize]);

    useEffect(() => {
        (window as unknown as { exportCanvas: () => void }).exportCanvas = exportCanvas;
    }, [exportCanvas]);

    const checkerColor1 = isDark ? "#1a1a1a" : "#f0f0f0";
    const checkerColor2 = isDark ? "#252525" : "#e0e0e0";

    // Get text shadow/stroke config for Konva
    const getTextConfig = (text: TextElement) => ({
        shadowColor: text.shadowEnabled ? text.shadowColor : undefined,
        shadowBlur: text.shadowEnabled ? text.shadowBlur : 0,
        shadowOffsetX: text.shadowEnabled ? text.shadowOffsetX : 0,
        shadowOffsetY: text.shadowEnabled ? text.shadowOffsetY : 0,
        shadowOpacity: text.shadowEnabled ? 1 : 0,
        stroke: text.strokeEnabled ? text.strokeColor : undefined,
        strokeWidth: text.strokeEnabled ? text.strokeWidth : 0,
    });

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
                    {/* Canvas background */}
                    {image && (
                        <Rect
                            x={imageX}
                            y={imageY}
                            width={imageSize.width}
                            height={imageSize.height}
                            fill="#000"
                            cornerRadius={8}
                            shadowColor="rgba(0,0,0,0.4)"
                            shadowBlur={40}
                            shadowOffset={{ x: 0, y: 15 }}
                            shadowOpacity={0.6}
                        />
                    )}

                    {/* Layer 1: Background image */}
                    {image && backgroundVisible && (
                        <URLImage
                            src={image}
                            x={imageX}
                            y={imageY}
                            width={imageSize.width}
                            height={imageSize.height}
                            onLoad={handleImageLoad}
                        />
                    )}

                    {/* Layer 2: Text elements */}
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
                            fill={text.fill}
                            align={text.align}
                            letterSpacing={text.letterSpacing}
                            lineHeight={text.lineHeight}
                            rotation={text.rotation}
                            scaleX={text.scaleX}
                            scaleY={text.scaleY}
                            draggable
                            {...getTextConfig(text)}
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

                    {/* Layer 3: Foreground */}
                    {foregroundImage && foregroundVisible && (
                        <URLImage
                            src={foregroundImage}
                            x={imageX}
                            y={imageY}
                            width={imageSize.width}
                            height={imageSize.height}
                            opacity={imageOpacity}
                            listening={false}
                        />
                    )}

                    {/* Snapping guides */}
                    {guides.x !== null && (
                        <Line
                            points={[guides.x, imageY, guides.x, imageY + imageSize.height]}
                            stroke="#8b5cf6"
                            strokeWidth={1}
                            dash={[4, 4]}
                        />
                    )}
                    {guides.y !== null && (
                        <Line
                            points={[imageX, guides.y, imageX + imageSize.width, guides.y]}
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
            {!image && (
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
                            Upload an image
                        </p>
                        <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                            Your text will magically appear behind the subject
                        </p>
                    </div>
                </div>
            )}

            {/* Keyboard shortcuts hint */}
            <div className={`absolute bottom-4 left-4 text-xs ${isDark ? "text-zinc-600" : "text-zinc-400"
                }`}>
                <span className="opacity-60">Ctrl+Z: Undo • Ctrl+D: Duplicate • Del: Delete</span>
            </div>
        </div>
    );
}
