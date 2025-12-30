// Google Fonts configuration
export const FONTS = [
    { name: "Bebas Neue", value: "Bebas Neue", weights: [400] },
    { name: "Anton", value: "Anton", weights: [400] },
    { name: "Oswald", value: "Oswald", weights: [300, 400, 500, 600, 700] },
    { name: "Poppins", value: "Poppins", weights: [300, 400, 500, 600, 700, 800, 900] },
    { name: "Montserrat", value: "Montserrat", weights: [300, 400, 500, 600, 700, 800, 900] },
    { name: "Roboto", value: "Roboto", weights: [300, 400, 500, 700, 900] },
    { name: "Inter", value: "Inter", weights: [300, 400, 500, 600, 700, 800, 900] },
    { name: "Playfair Display", value: "Playfair Display", weights: [400, 500, 600, 700, 800, 900] },
    { name: "Lato", value: "Lato", weights: [300, 400, 700, 900] },
    { name: "Open Sans", value: "Open Sans", weights: [300, 400, 500, 600, 700, 800] },
    { name: "Raleway", value: "Raleway", weights: [300, 400, 500, 600, 700, 800, 900] },
    { name: "PT Sans", value: "PT Sans", weights: [400, 700] },
    { name: "Merriweather", value: "Merriweather", weights: [300, 400, 700, 900] },
    { name: "Outfit", value: "Outfit", weights: [300, 400, 500, 600, 700, 800, 900] },
    { name: "Space Grotesk", value: "Space Grotesk", weights: [300, 400, 500, 600, 700] },
] as const;

// Generate Google Fonts URL for all fonts
export function getGoogleFontsUrl(): string {
    const families = FONTS.map((font) => {
        const weights = font.weights.join(";");
        return `family=${encodeURIComponent(font.value)}:wght@${weights}`;
    }).join("&");

    return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

// Get available weights for a font
export function getFontWeights(fontFamily: string): number[] {
    const font = FONTS.find((f) => f.value === fontFamily);
    return font?.weights.map((w) => w) ?? [400, 700];
}
