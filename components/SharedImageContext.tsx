"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SharedImageContextType {
    sharedImage: string | null;
    sharedFile: File | null;
    setSharedImage: (image: string | null) => void;
    setSharedFile: (file: File | null) => void;
    clearSharedImage: () => void;
}

const SharedImageContext = createContext<SharedImageContextType | undefined>(undefined);

export function SharedImageProvider({ children }: { children: ReactNode }) {
    const [sharedImage, setSharedImage] = useState<string | null>(null);
    const [sharedFile, setSharedFile] = useState<File | null>(null);

    // Store image in sessionStorage for persistence across navigation
    useEffect(() => {
        // Load from sessionStorage on mount
        const storedImage = sessionStorage.getItem("sharedToolImage");
        if (storedImage) {
            setSharedImage(storedImage);
        }
    }, []);

    useEffect(() => {
        // Save to sessionStorage when image changes
        if (sharedImage) {
            sessionStorage.setItem("sharedToolImage", sharedImage);
        } else {
            sessionStorage.removeItem("sharedToolImage");
        }
    }, [sharedImage]);

    const clearSharedImage = () => {
        setSharedImage(null);
        setSharedFile(null);
        sessionStorage.removeItem("sharedToolImage");
    };

    return (
        <SharedImageContext.Provider
            value={{
                sharedImage,
                sharedFile,
                setSharedImage,
                setSharedFile,
                clearSharedImage,
            }}
        >
            {children}
        </SharedImageContext.Provider>
    );
}

export function useSharedImage() {
    const context = useContext(SharedImageContext);
    if (context === undefined) {
        throw new Error("useSharedImage must be used within a SharedImageProvider");
    }
    return context;
}
