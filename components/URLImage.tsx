"use client";

import { useEffect, useRef, useState } from "react";
import { Image } from "react-konva";

interface URLImageProps {
    src: string;
    alt?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    opacity?: number;
    listening?: boolean;
    onLoad?: (img: HTMLImageElement) => void;
}

export function URLImage({
    src,
    x = 0,
    y = 0,
    width,
    height,
    opacity = 1,
    listening = true,
    onLoad,
}: URLImageProps) {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => {
            imageRef.current = img;
            setImage(img);
            onLoad?.(img);
        };

        return () => {
            img.onload = null;
        };
    }, [src, onLoad]);

    if (!image) return null;

    return (
        <Image
            image={image}
            x={x}
            y={y}
            width={width ?? image.width}
            height={height ?? image.height}
            opacity={opacity}
            listening={listening}
        />
    );
}
