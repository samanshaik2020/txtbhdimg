"use client";

import { create } from "zustand";

// Canvas preset definitions
export const CANVAS_PRESETS = {
  "youtube-thumbnail": { name: "YouTube Thumbnail", width: 1280, height: 720, ratio: "16:9" },
  "instagram-post": { name: "Instagram Post", width: 1080, height: 1080, ratio: "1:1" },
  "instagram-story": { name: "Instagram Story", width: 1080, height: 1920, ratio: "9:16" },
  "twitter-post": { name: "Twitter Post", width: 1200, height: 675, ratio: "16:9" },
  "linkedin-post": { name: "LinkedIn Post", width: 1200, height: 627, ratio: "1.91:1" },
  "facebook-cover": { name: "Facebook Cover", width: 820, height: 312, ratio: "2.63:1" },
  "custom": { name: "Custom", width: 800, height: 600, ratio: "4:3" },
} as const;

export type CanvasPreset = keyof typeof CANVAS_PRESETS;

export interface TextElement {
  id: string;
  content: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  fontStyle: "normal" | "italic";
  fill: string;
  align: "left" | "center" | "right";
  letterSpacing: number;
  lineHeight: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  visible: boolean;
  // Text Effects
  shadowEnabled: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  strokeEnabled: boolean;
  strokeColor: string;
  strokeWidth: number;
}

// History state for undo/redo
interface HistoryState {
  texts: TextElement[];
  selectedTextId: string | null;
}

interface EditorState {
  // Images
  image: string | null;
  foregroundImage: string | null;
  imageOpacity: number;
  isProcessing: boolean;
  backgroundVisible: boolean;
  foregroundVisible: boolean;

  // Canvas
  canvasWidth: number;
  canvasHeight: number;
  canvasPreset: CanvasPreset;

  // Text elements
  texts: TextElement[];
  selectedTextId: string | null;

  // History
  history: HistoryState[];
  historyIndex: number;

  // Actions - Images
  setImage: (url: string | null) => void;
  setForegroundImage: (url: string | null) => void;
  setImageOpacity: (opacity: number) => void;
  setIsProcessing: (processing: boolean) => void;
  setCanvasDimensions: (width: number, height: number) => void;
  setCanvasPreset: (preset: CanvasPreset) => void;
  setBackgroundVisible: (visible: boolean) => void;
  setForegroundVisible: (visible: boolean) => void;

  // Actions - Texts
  addText: () => void;
  updateText: (id: string, updates: Partial<TextElement>) => void;
  deleteText: (id: string) => void;
  duplicateText: (id: string) => void;
  setSelectedTextId: (id: string | null) => void;
  setTextVisible: (id: string, visible: boolean) => void;
  reorderTexts: (fromIndex: number, toIndex: number) => void;

  // Actions - History
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;

  // Actions - Reset
  reset: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const defaultTextElement: Omit<TextElement, "id"> = {
  content: "Your Text Here",
  x: 100,
  y: 100,
  fontSize: 72,
  fontFamily: "Bebas Neue",
  fontWeight: 400,
  fontStyle: "normal",
  fill: "#ffffff",
  align: "center",
  letterSpacing: 2,
  lineHeight: 1,
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
  visible: true,
  // Default shadow
  shadowEnabled: true,
  shadowColor: "rgba(0, 0, 0, 0.5)",
  shadowBlur: 10,
  shadowOffsetX: 4,
  shadowOffsetY: 4,
  // Default stroke
  strokeEnabled: false,
  strokeColor: "#000000",
  strokeWidth: 2,
};

const MAX_HISTORY = 50;

export const useEditorStore = create<EditorState>((set, get) => ({
  // Initial state
  image: null,
  foregroundImage: null,
  imageOpacity: 1,
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
  setImage: (url) => set({ image: url }),
  setForegroundImage: (url) => set({ foregroundImage: url }),
  setImageOpacity: (opacity) => set({ imageOpacity: opacity }),
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
    const newText: TextElement = {
      ...defaultTextElement,
      id: generateId(),
      x: canvasWidth / 2 - 150,
      y: canvasHeight / 2 - 36,
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
    const newText: TextElement = {
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

  reorderTexts: (fromIndex, toIndex) => {
    const { texts, pushHistory } = get();
    pushHistory();
    const newTexts = [...texts];
    const [removed] = newTexts.splice(fromIndex, 1);
    newTexts.splice(toIndex, 0, removed);
    set({ texts: newTexts });
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

    // Save current state if we're at the end
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
      image: null,
      foregroundImage: null,
      imageOpacity: 1,
      isProcessing: false,
      backgroundVisible: true,
      foregroundVisible: true,
      texts: [],
      selectedTextId: null,
      history: [],
      historyIndex: -1,
    }),
}));
