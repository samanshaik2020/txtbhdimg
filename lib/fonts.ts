// Google Fonts configuration
export const FONTS = [
    // Classic Display Fonts
    { name: "Bebas Neue", value: "Bebas Neue", weights: [400] },
    { name: "Anton", value: "Anton", weights: [400] },
    { name: "Oswald", value: "Oswald", weights: [300, 400, 500, 600, 700] },

    // Modern Sans-Serif
    { name: "Poppins", value: "Poppins", weights: [300, 400, 500, 600, 700, 800, 900] },
    { name: "Montserrat", value: "Montserrat", weights: [300, 400, 500, 600, 700, 800, 900] },
    { name: "Roboto", value: "Roboto", weights: [300, 400, 500, 700, 900] },
    { name: "Inter", value: "Inter", weights: [300, 400, 500, 600, 700, 800, 900] },
    { name: "Lato", value: "Lato", weights: [300, 400, 700, 900] },
    { name: "Open Sans", value: "Open Sans", weights: [300, 400, 500, 600, 700, 800] },
    { name: "Raleway", value: "Raleway", weights: [300, 400, 500, 600, 700, 800, 900] },
    { name: "PT Sans", value: "PT Sans", weights: [400, 700] },
    { name: "Outfit", value: "Outfit", weights: [300, 400, 500, 600, 700, 800, 900] },
    { name: "Space Grotesk", value: "Space Grotesk", weights: [300, 400, 500, 600, 700] },
    { name: "Work Sans", value: "Work Sans", weights: [300, 400, 500, 600, 700, 800, 900] },
    { name: "Nunito", value: "Nunito", weights: [300, 400, 500, 600, 700, 800, 900] },

    // Serif Fonts
    { name: "Playfair Display", value: "Playfair Display", weights: [400, 500, 600, 700, 800, 900] },
    { name: "Merriweather", value: "Merriweather", weights: [300, 400, 700, 900] },
    { name: "Libre Baskerville", value: "Libre Baskerville", weights: [400, 700] },
    { name: "Lora", value: "Lora", weights: [400, 500, 600, 700] },
    { name: "Crimson Text", value: "Crimson Text", weights: [400, 600, 700] },

    // Bold Display Fonts
    { name: "Righteous", value: "Righteous", weights: [400] },
    { name: "Archivo Black", value: "Archivo Black", weights: [400] },
    { name: "Bungee", value: "Bungee", weights: [400] },
    { name: "Russo One", value: "Russo One", weights: [400] },
    { name: "Fredoka One", value: "Fredoka One", weights: [400] },
    { name: "Bangers", value: "Bangers", weights: [400] },
    { name: "Alfa Slab One", value: "Alfa Slab One", weights: [400] },

    // Handwritten & Script Fonts
    { name: "Pacifico", value: "Pacifico", weights: [400] },
    { name: "Dancing Script", value: "Dancing Script", weights: [400, 500, 600, 700] },
    { name: "Permanent Marker", value: "Permanent Marker", weights: [400] },
    { name: "Caveat", value: "Caveat", weights: [400, 500, 600, 700] },
    { name: "Satisfy", value: "Satisfy", weights: [400] },

    // Condensed & Narrow Fonts
    { name: "Fjalla One", value: "Fjalla One", weights: [400] },
    { name: "Barlow Condensed", value: "Barlow Condensed", weights: [300, 400, 500, 600, 700, 800, 900] },

    // Rounded Fonts
    { name: "Rubik", value: "Rubik", weights: [300, 400, 500, 600, 700, 800, 900] },
    { name: "Quicksand", value: "Quicksand", weights: [300, 400, 500, 600, 700] },

    // Tech & Modern
    { name: "Orbitron", value: "Orbitron", weights: [400, 500, 600, 700, 800, 900] },
    { name: "Exo 2", value: "Exo 2", weights: [300, 400, 500, 600, 700, 800, 900] },
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
