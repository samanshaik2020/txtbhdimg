"use client";

import { SharedImageProvider } from "./SharedImageContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return <SharedImageProvider>{children}</SharedImageProvider>;
}
