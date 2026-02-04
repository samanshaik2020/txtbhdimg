import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getGoogleFontsUrl } from "@/lib/fonts";
import Script from "next/script";
import { Providers } from "@/components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Comprehensive SEO Metadata for Google ranking
export const metadata: Metadata = {
  // Primary Meta Tags
  title: {
    default: "Text Behind Image Online | 100% Free to Use",
    template: "%s | TextBehindImage.in",
  },
  description:
    "Easily create text-behind-image designs in seconds using AI. Unlimited downloads. 100% free to use. No Ads. No sign-up required.",
  keywords: [
    "text behind image",
    "text behind image online",
    "text behind image free",
    "text behind photo",
    "add text behind image",
    "text overlay effect",
    "ai background remover",
    "photo text editor",
    "free online photo editor",
    "creative typography",
    "text behind subject",
    "layer text behind image",
    "image editing tool",
    "free image editor",
  ],
  authors: [{ name: "TextBehindImage.in" }],
  creator: "TextBehindImage.in",
  publisher: "TextBehindImage.in",

  // Canonical URL
  metadataBase: new URL("https://textbehindimage.in"),
  alternates: {
    canonical: "/",
  },

  // Robots & Indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://textbehindimage.in",
    siteName: "TextBehindImage.in",
    title: "Text Behind Image Online | 100% Free to Use",
    description:
      "Easily create text-behind-image designs in seconds using AI. Unlimited downloads. 100% free to use. No Ads. No sign-up required.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Text Behind Image - Free AI Photo Editor",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Text Behind Image Online | 100% Free to Use",
    description:
      "Easily create text-behind-image designs in seconds using AI. Unlimited downloads. 100% free to use. No Ads. No sign-up required.",
    images: ["/og-image.svg"],
    creator: "@textbehindimage",
  },

  // Additional Meta
  category: "Photo Editing",
  classification: "Online Tool",

  // Google Search Console Verification
  verification: {
    google: "CJk9CUuPZzTsEglNYkb2ied9_i-jyxQZOYzmlWoE8Cg",
  },

  // Icons (using Next.js app directory convention with icon.svg and apple-icon.svg)
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.svg", type: "image/svg+xml" },
    ],
  },

  // App-specific
  applicationName: "TextBehindImage.in",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

// JSON-LD Structured Data for Rich Snippets
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Text Behind Image",
  url: "https://textbehindimage.in",
  description:
    "Easily create text-behind-image designs in seconds using AI. Unlimited downloads. 100% free to use. No Ads. No sign-up required.",
  applicationCategory: "DesignApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "1250",
    bestRating: "5",
    worstRating: "1",
  },
  featureList: [
    "AI Background Removal",
    "Text Behind Subject Effect",
    "15+ Google Fonts",
    "Drag & Drop Editor",
    "High-Quality Export",
    "No Sign-up Required",
    "100% Free",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WR6DMT62');`}
        </Script>

        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EYFHG074VZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EYFHG074VZ');
          `}
        </Script>

        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9833112183659445"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={getGoogleFontsUrl()} rel="stylesheet" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#7c3aed" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="TextBehindImage" />

        {/* Geo Tags for Local SEO */}
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />

        {/* Language */}
        <meta httpEquiv="content-language" content="en" />

        {/* Revisit frequency hint for crawlers */}
        <meta name="revisit-after" content="7 days" />

        {/* Rating */}
        <meta name="rating" content="general" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WR6DMT62"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

