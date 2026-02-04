"use client";

import { create } from "zustand";

export interface TextInsideElement {
    id: string;
    content: string;
    x: number;
    y: number;
    fontSize: number;
    fontFamily: string;
    fontWeight: number;
    fontStyle: "normal" | "italic";
    align: "left" | "center" | "right";
    letterSpacing: number;
    lineHeight: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
    visible: boolean;
    // For normal mode
    fill: string;
    // For image mode
    useImageFill: boolean;
}

// Canvas preset definitions
export const CANVAS_PRESETS = {
    "youtube-thumbnail": { name: "YouTube Thumbnail", width: 1280, height: 720, ratio: "16:9" },
    "instagram-post": { name: "Instagram Post", width: 1080, height: 1080, ratio: "1:1" },
    "instagram-story": { name: "Instagram Story", width: 1080, height: 1920, ratio: "9:16" },
    "twitter-post": { name: "Twitter Post", width: 1200, height: 675, ratio: "16:9" },
    "custom": { name: "Custom", width: 800, height: 600, ratio: "4:3" },
} as const;

export type CanvasPreset = keyof typeof CANVAS_PRESETS;

interface HistoryState {
    texts: TextInsideElement[];
    selectedTextId: string | null;
}

interface TextInsideState {
    // Images
    backgroundImage: string | null;
    backgroundColor: string; // Solid color background
    fillImage: string | null; // Image used to fill text
    foregroundImage: string | null;
    isProcessing: boolean;
    backgroundVisible: boolean;
    foregroundVisible: boolean;

    // Canvas
    canvasWidth: number;
    canvasHeight: number;
    canvasPreset: CanvasPreset;

    // Text elements
    texts: TextInsideElement[];
    selectedTextId: string | null;

    // History
    history: HistoryState[];
    historyIndex: number;

    // Actions - Images
    setBackgroundImage: (url: string | null) => void;
    setBackgroundColor: (color: string) => void;
    setFillImage: (url: string | null) => void;
    setForegroundImage: (url: string | null) => void;
    setIsProcessing: (processing: boolean) => void;
    setCanvasDimensions: (width: number, height: number) => void;
    setCanvasPreset: (preset: CanvasPreset) => void;
    setBackgroundVisible: (visible: boolean) => void;
    setForegroundVisible: (visible: boolean) => void;

    // Actions - Texts
    addText: () => void;
    updateText: (id: string, updates: Partial<TextInsideElement>) => void;
    deleteText: (id: string) => void;
    duplicateText: (id: string) => void;
    setSelectedTextId: (id: string | null) => void;
    setTextVisible: (id: string, visible: boolean) => void;

    // Actions - History
    undo: () => void;
    redo: () => void;
    pushHistory: () => void;

    // Actions - Reset
    reset: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const defaultTextElement: Omit<TextInsideElement, "id"> = {
    content: "YOUR TEXT",
    x: 100,
    y: 100,
    fontSize: 120,
    fontFamily: "Bebas Neue",
    fontWeight: 400,
    fontStyle: "normal",
    align: "center",
    letterSpacing: 5,
    lineHeight: 1,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    visible: true,
    fill: "#ffffff",
    useImageFill: true,
};

const MAX_HISTORY = 50;

export const useTextInsideStore = create<TextInsideState>((set, get) => ({
    // Initial state
    backgroundImage: null,
    backgroundColor: "#1a1a2e",
    fillImage: null,
    foregroundImage: null,
    isProcessing: false,
    backgroundVisible: true,
    foregroundVisible: true,
    canvasWidth: 1280,
    canvasHeight: 720,
    canvasPreset: "youtube-thumbnail",
    texts: [],
    selectedTextId: null,
    history: [],
    historyIndex: -1,

    // Image actions
    setBackgroundImage: (url) => set({ backgroundImage: url }),
    setBackgroundColor: (color) => set({ backgroundColor: color }),
    setFillImage: (url) => set({ fillImage: url }),
    setForegroundImage: (url) => set({ foregroundImage: url }),
    setIsProcessing: (processing) => set({ isProcessing: processing }),
    setCanvasDimensions: (width, height) => set({ canvasWidth: width, canvasHeight: height }),
    setCanvasPreset: (preset) => {
        const presetConfig = CANVAS_PRESETS[preset];
        set({
            canvasPreset: preset,
            canvasWidth: presetConfig.width,
            canvasHeight: presetConfig.height,
        });
    },
    setBackgroundVisible: (visible) => set({ backgroundVisible: visible }),
    setForegroundVisible: (visible) => set({ foregroundVisible: visible }),

    // Text actions
    addText: () => {
        const { canvasWidth, canvasHeight, pushHistory } = get();
        pushHistory();
        const newText: TextInsideElement = {
            ...defaultTextElement,
            id: generateId(),
            x: canvasWidth / 2 - 200,
            y: canvasHeight / 2 - 60,
        };
        set((state) => ({
            texts: [...state.texts, newText],
            selectedTextId: newText.id,
        }));
    },

    updateText: (id, updates) => {
        set((state) => ({
            texts: state.texts.map((text) =>
                text.id === id ? { ...text, ...updates } : text
            ),
        }));
    },

    deleteText: (id) => {
        const { pushHistory } = get();
        pushHistory();
        set((state) => ({
            texts: state.texts.filter((text) => text.id !== id),
            selectedTextId: state.selectedTextId === id ? null : state.selectedTextId,
        }));
    },

    duplicateText: (id) => {
        const { texts, pushHistory } = get();
        const textToDuplicate = texts.find((t) => t.id === id);
        if (!textToDuplicate) return;

        pushHistory();
        const newText: TextInsideElement = {
            ...textToDuplicate,
            id: generateId(),
            x: textToDuplicate.x + 20,
            y: textToDuplicate.y + 20,
        };
        set((state) => ({
            texts: [...state.texts, newText],
            selectedTextId: newText.id,
        }));
    },

    setSelectedTextId: (id) => set({ selectedTextId: id }),

    setTextVisible: (id, visible) => {
        set((state) => ({
            texts: state.texts.map((text) =>
                text.id === id ? { ...text, visible } : text
            ),
        }));
    },

    // History actions
    pushHistory: () => {
        const { texts, selectedTextId, history, historyIndex } = get();
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({ texts: JSON.parse(JSON.stringify(texts)), selectedTextId });
        if (newHistory.length > MAX_HISTORY) {
            newHistory.shift();
        }
        set({
            history: newHistory,
            historyIndex: newHistory.length - 1,
        });
    },

    undo: () => {
        const { history, historyIndex, texts, selectedTextId } = get();
        if (historyIndex < 0) return;

        if (historyIndex === history.length - 1) {
            const newHistory = [...history];
            newHistory.push({ texts: JSON.parse(JSON.stringify(texts)), selectedTextId });
            set({ history: newHistory });
        }

        const prevState = history[historyIndex];
        set({
            texts: prevState.texts,
            selectedTextId: prevState.selectedTextId,
            historyIndex: historyIndex - 1,
        });
    },

    redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex >= history.length - 2) return;

        const nextState = history[historyIndex + 2];
        if (nextState) {
            set({
                texts: nextState.texts,
                selectedTextId: nextState.selectedTextId,
                historyIndex: historyIndex + 1,
            });
        }
    },

    // Reset
    reset: () =>
        set({
            backgroundImage: null,
            backgroundColor: "#1a1a2e",
            fillImage: null,
            foregroundImage: null,
            isProcessing: false,
            backgroundVisible: true,
            foregroundVisible: true,
            texts: [],
            selectedTextId: null,
            history: [],
            historyIndex: -1,
        }),
}));
