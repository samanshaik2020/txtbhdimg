"use client";

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import {
    X,
    ArrowRight,
    ArrowLeft,
    Upload,
    Type,
    Layers,
    Download,
    Sparkles,
    MousePointer,
    Move,
    RotateCw,
} from "lucide-react";

interface TourStep {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    position: "center" | "left" | "right";
    highlight?: string;
}

const TOUR_STEPS: TourStep[] = [
    {
        id: "welcome",
        title: "Welcome to Text Behind Image! 🎨",
        description: "Create stunning designs where text appears behind your subject. This quick tour will show you how to use all the features.",
        icon: <Sparkles className="w-6 h-6" />,
        position: "center",
    },
    {
        id: "upload",
        title: "Step 1: Upload Your Image",
        description: "Start by uploading an image with a clear subject. Our AI will automatically separate the subject from the background.",
        icon: <Upload className="w-6 h-6" />,
        position: "left",
        highlight: "image-tab",
    },
    {
        id: "add-text",
        title: "Step 2: Add Text",
        description: "Switch to the Text tab and click 'Add Text Layer'. Your text will appear on the canvas, magically behind the subject!",
        icon: <Type className="w-6 h-6" />,
        position: "left",
        highlight: "text-tab",
    },
    {
        id: "customize",
        title: "Step 3: Customize Text",
        description: "Choose from 15+ Google Fonts, adjust size, color, and add effects like shadows and strokes to make your text pop.",
        icon: <MousePointer className="w-6 h-6" />,
        position: "left",
    },
    {
        id: "drag",
        title: "Step 4: Position & Transform",
        description: "Drag text anywhere on the canvas. Use corner handles to resize and rotate. The text stays behind the subject!",
        icon: <Move className="w-6 h-6" />,
        position: "center",
    },
    {
        id: "layers",
        title: "Step 5: Manage Layers",
        description: "Use the Layers tab to toggle visibility, duplicate, or delete text layers. Stack multiple text elements for complex designs.",
        icon: <Layers className="w-6 h-6" />,
        position: "left",
        highlight: "layers-tab",
    },
    {
        id: "export",
        title: "Step 6: Export Your Design",
        description: "When you're happy with your design, go to Settings and click 'Download PNG' to save a high-quality image.",
        icon: <Download className="w-6 h-6" />,
        position: "left",
        highlight: "settings-tab",
    },
    {
        id: "shortcuts",
        title: "Pro Tips: Keyboard Shortcuts ⌨️",
        description: "Use Ctrl+Z to undo, Ctrl+D to duplicate, Delete to remove, and arrow keys to nudge text position precisely.",
        icon: <RotateCw className="w-6 h-6" />,
        position: "center",
    },
];

const TOUR_STORAGE_KEY = "text-behind-image-tour-completed";

export function TourGuide() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const { theme } = useTheme();

    const isDark = theme === "dark";
    const step = TOUR_STEPS[currentStep];
    const isLastStep = currentStep === TOUR_STEPS.length - 1;
    const isFirstStep = currentStep === 0;

    // Define handleClose first since it's used by other callbacks
    const handleClose = useCallback(() => {
        setIsOpen(false);
        localStorage.setItem(TOUR_STORAGE_KEY, "true");
    }, []);

    // Check if user has seen the tour
    useEffect(() => {
        const seen = localStorage.getItem(TOUR_STORAGE_KEY);
        if (!seen) {
            // Small delay to let the page render first
            const timer = setTimeout(() => setIsOpen(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleNext = useCallback(() => {
        if (isLastStep) {
            handleClose();
        } else {
            setCurrentStep((prev) => prev + 1);
        }
    }, [isLastStep, handleClose]);

    const handlePrev = useCallback(() => {
        if (!isFirstStep) {
            setCurrentStep((prev) => prev - 1);
        }
    }, [isFirstStep]);

    const handleSkip = useCallback(() => {
        handleClose();
    }, [handleClose]);

    const startTour = useCallback(() => {
        setCurrentStep(0);
        setIsOpen(true);
    }, []);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
            if (e.key === "ArrowRight" || e.key === "Enter") handleNext();
            if (e.key === "ArrowLeft") handlePrev();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, handleNext, handlePrev, handleClose]);

    if (!isOpen) {
        return (
            <button
                onClick={startTour}
                className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all hover:scale-105 ${isDark
                    ? "bg-violet-600 hover:bg-violet-700 text-white"
                    : "bg-violet-500 hover:bg-violet-600 text-white"
                    }`}
            >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Take a Tour</span>
            </button>
        );
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                onClick={handleSkip}
            />

            {/* Tour Card */}
            <div
                className={`fixed z-50 w-[420px] max-w-[90vw] p-6 rounded-2xl shadow-2xl transition-all duration-300 ${isDark
                    ? "bg-zinc-900 border border-zinc-800"
                    : "bg-white border border-zinc-200"
                    } ${step.position === "center"
                        ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        : step.position === "left"
                            ? "top-1/2 left-[380px] -translate-y-1/2"
                            : "top-1/2 right-[380px] -translate-y-1/2"
                    }`}
            >
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className={`absolute top-4 right-4 p-1 rounded-lg transition-colors ${isDark ? "hover:bg-zinc-800" : "hover:bg-zinc-100"
                        }`}
                >
                    <X className="w-5 h-5 text-zinc-500" />
                </button>

                {/* Step indicator */}
                <div className="flex gap-1.5 mb-4">
                    {TOUR_STEPS.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1 rounded-full transition-all ${idx === currentStep
                                ? "w-6 bg-violet-500"
                                : idx < currentStep
                                    ? "w-2 bg-violet-500/50"
                                    : `w-2 ${isDark ? "bg-zinc-700" : "bg-zinc-200"}`
                                }`}
                        />
                    ))}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/25">
                    <div className="text-white">{step.icon}</div>
                </div>

                {/* Content */}
                <h2 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}>
                    {step.title}
                </h2>
                <p className={`text-sm leading-relaxed mb-6 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                    {step.description}
                </p>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleSkip}
                        className={`text-sm font-medium ${isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-500 hover:text-zinc-700"}`}
                    >
                        Skip tour
                    </button>

                    <div className="flex gap-2">
                        {!isFirstStep && (
                            <Button
                                onClick={handlePrev}
                                variant="outline"
                                size="sm"
                                className={`rounded-lg ${isDark ? "border-zinc-700" : "border-zinc-200"}`}
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back
                            </Button>
                        )}
                        <Button
                            onClick={handleNext}
                            size="sm"
                            className="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                        >
                            {isLastStep ? (
                                <>
                                    Get Started
                                    <Sparkles className="w-4 h-4 ml-1" />
                                </>
                            ) : (
                                <>
                                    Next
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Step counter */}
                <div className={`text-center text-xs mt-4 ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
                    {currentStep + 1} of {TOUR_STEPS.length}
                </div>
            </div>
        </>
    );
}
