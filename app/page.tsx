import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  FileType,
  ImageMinus,
  Layers,
  Maximize2,
  Minimize2,
  RotateCw,
  Scissors,
  Sparkles,
  Type,
  Wand2,
  Zap,
} from "lucide-react";

const tools = [
  {
    icon: Minimize2,
    title: "Compress Image",
    description: "Reduce file size while preserving visual quality.",
    href: "/tools/compress",
    color: "from-cyan-500 to-blue-500",
    label: "Optimize",
    image: "/Compress Image.jpeg",
    imageAlt: "Reference preview for the compress image tool",
    howItWorks: "Upload an image, tune compression, and export a smaller file in a few clicks.",
  },
  {
    icon: ImageMinus,
    title: "Remove Background",
    description: "Extract subjects with AI in one click.",
    href: "/tools/remove-background",
    color: "from-emerald-500 to-teal-500",
    label: "AI Assist",
    image: "/Remove Background.jpeg",
    imageAlt: "Reference preview for the remove background tool",
    howItWorks: "Pick your photo, let AI isolate the subject, then download a clean transparent cutout.",
  },
  {
    icon: Maximize2,
    title: "Resize Image",
    description: "Set custom dimensions for every platform.",
    href: "/tools/resize",
    color: "from-orange-500 to-amber-500",
    label: "Resize",
    image: "/Resize Image.jpeg",
    imageAlt: "Reference preview for the resize image tool",
    howItWorks: "Choose your target size, preview the frame, and export with the new dimensions.",
  },
  {
    icon: Scissors,
    title: "Crop Image",
    description: "Frame exactly what matters in seconds.",
    href: "/tools/crop",
    color: "from-rose-500 to-pink-500",
    label: "Frame",
    image: "/Crop Image.jpeg",
    imageAlt: "Reference preview for the crop image tool",
    howItWorks: "Drag the crop area to focus the composition and save only the part you need.",
  },
  {
    icon: RotateCw,
    title: "Rotate Image",
    description: "Fix orientation and mirror instantly.",
    href: "/tools/rotate",
    color: "from-indigo-500 to-sky-500",
    label: "Adjust",
    image: "/Rotate Image.jpeg",
    imageAlt: "Reference preview for the rotate image tool",
    howItWorks: "Rotate or flip the image until the angle looks right, then export the corrected version.",
  },
  {
    icon: FileType,
    title: "Convert Format",
    description: "Export PNG, JPG, WEBP, and AVIF files.",
    href: "/tools/convert",
    color: "from-lime-500 to-emerald-500",
    label: "Export",
    image: "/Convert Format.jpeg",
    imageAlt: "Reference preview for the convert format tool",
    howItWorks: "Upload once, choose the file type you need, and download the converted asset.",
  },
];

const showcaseImages = [
  {
    src: "/car-edited.png",
    alt: "Black car with layered text behind image effect",
    title: "Car Poster Effect",
    description: "Use existing photo assets to create ad-style compositions.",
  },
  {
    src: "/car-normal.png",
    alt: "Original black car image used before adding text effects",
    title: "Original Photo",
    description: "Show the clean source image before turning it into a layered design.",
  },
  {
    src: "/text-behind-image (8).png",
    alt: "Space-themed text behind image example",
    title: "Editorial Layout",
    description: "High-contrast visuals for campaigns, posters, and social covers.",
  },
];

const headingFont = { fontFamily: '"Space Grotesk", var(--font-geist-sans), sans-serif' };
const bodyFont = { fontFamily: '"Poppins", var(--font-geist-sans), sans-serif' };

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-0 h-[420px] w-[420px] rounded-full bg-cyan-400/20 blur-[130px]" />
        <div className="absolute -right-24 top-[20%] h-[380px] w-[380px] rounded-full bg-amber-400/20 blur-[120px]" />
        <div className="absolute bottom-0 left-[35%] h-[300px] w-[300px] rounded-full bg-emerald-400/15 blur-[130px]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-7">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400 text-slate-950">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-base font-semibold tracking-tight" style={headingFont}>
              TextBehind
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex" style={bodyFont}>
            <a href="#showcase" className="transition hover:text-white">
              Showcase
            </a>
            <a href="#tools" className="transition hover:text-white">
              Tools
            </a>
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <Link href="/blog" className="transition hover:text-white">
              Blog
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative px-5 pb-16 pt-14 sm:px-7 sm:pt-20">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl" style={headingFont}>
              Create scroll-stopping posters with{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300 bg-clip-text text-transparent">
                text behind image
              </span>{" "}
              and{" "}
              <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                text inside image
              </span>
              .
            </h1>

            <p className="mt-6 max-w-xl text-base text-slate-300 sm:text-lg" style={bodyFont}>
              Design studio quality visuals directly in your browser. No login wall, fast exports, and built-in AI tools
              to speed up every step.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/editor"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
                style={bodyFont}
              >
                <Layers className="h-4 w-4" />
                Start Text Behind
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/editor/text-inside"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold transition hover:border-white/40 hover:bg-white/10"
                style={bodyFont}
              >
                <Type className="h-4 w-4" />
                Start Text Inside
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3" style={bodyFont}>
              {["No signup", "Free exports", "Built-in AI tools"].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-slate-200"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-900/70 shadow-[0_30px_80px_-40px_rgba(34,211,238,0.65)]">
              <Image
                src="/hero-image-new.png"
                alt="Text effect editor preview"
                width={1000}
                height={680}
                className="h-auto w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            </div>

            <div className="absolute -left-5 -top-5 hidden max-w-[230px] rounded-2xl border border-white/15 bg-slate-900/90 p-3 shadow-2xl lg:block">
              <Image
                src="/text-behind-image (10).png"
                alt="Text behind image sample"
                width={280}
                height={168}
                className="rounded-xl object-cover"
              />
              <p className="mt-2 text-xs text-slate-300" style={bodyFont}>
                Subject overlap handled automatically.
              </p>
            </div>

            <div className="absolute -bottom-6 -right-6 hidden rounded-2xl border border-white/15 bg-slate-900/90 p-5 shadow-2xl lg:block">
              <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200/90" style={bodyFont}>
                Text inside preview
              </p>
              <p
                className="mt-2 text-6xl font-bold leading-none tracking-tight text-transparent"
                style={{
                  ...headingFont,
                  backgroundImage: "url('/text-behind-image%20(8).png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                }}
              >
                INSIDE
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900/40 px-5 py-16 sm:px-7">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200" style={bodyFont}>
              Core Workflows
            </p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl" style={headingFont}>
              Built to highlight both signature effects.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <article className="overflow-hidden rounded-3xl border border-white/15 bg-slate-950/70">
              <div className="relative aspect-[16/10]">
                <Image src="/text-behind-image (6).png" alt="Text behind image example" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              </div>
              <div className="p-6 sm:p-7">
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-200" style={bodyFont}>
                  Text Behind Image
                </p>
                <h3 className="mt-2 text-2xl font-semibold" style={headingFont}>
                  Keep the subject in front while the typography stays bold.
                </h3>
                <p className="mt-3 text-sm text-slate-300" style={bodyFont}>
                  Blend foreground extraction, layer control, and typography into one fast workflow for posters, reels,
                  and ad creatives.
                </p>
                <Link
                  href="/editor"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-cyan-100"
                  style={bodyFont}
                >
                  Open editor <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>

            <article className="overflow-hidden rounded-3xl border border-white/15 bg-slate-950/70 p-6 sm:p-7">
              <p className="text-xs uppercase tracking-[0.18em] text-amber-200" style={bodyFont}>
                Text Inside Image
              </p>
              <h3 className="mt-2 text-2xl font-semibold" style={headingFont}>
                Fill typography with image texture for premium title treatments.
              </h3>
              <div className="mt-6 rounded-2xl border border-white/15 bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-8 sm:px-6 sm:py-10">
                <p
                  className="text-center text-[clamp(4.75rem,13vw,9rem)] font-bold leading-none tracking-tight text-transparent"
                  style={{
                    ...headingFont,
                    backgroundImage: "url('/hero-image-new.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                  }}
                >
                  INSIDE
                </p>
              </div>
              <p className="mt-5 text-sm text-slate-300" style={bodyFont}>
                Use this style for hero headlines, album art, event promos, and brand campaigns where text needs visual
                depth.
              </p>
              <Link
                href="/editor/text-inside"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-amber-200 transition hover:text-amber-100"
                style={bodyFont}
              >
                Open text inside tool <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section id="tools" className="border-t border-white/10 bg-slate-900/40 px-5 py-16 sm:px-7">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200" style={bodyFont}>
                More Free Tools
              </p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl" style={headingFont}>
                Complete the entire image workflow in one place.
              </h2>
              <p className="mt-3 max-w-xl text-sm text-slate-300 sm:text-base" style={bodyFont}>
                Move from cleanup to export without leaving the product. Every tool is tuned to support fast creative
                production, not just isolated edits.
              </p>
            </div>

            <div
              className="inline-flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300"
              style={bodyFont}
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-300/15 text-cyan-200">
                <Sparkles className="h-4 w-4" />
              </span>
              <span>Designed as a complete browser-based toolkit.</span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-slate-950/90 p-6 sm:p-7">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
            <div className="absolute -right-16 top-10 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute -bottom-10 left-1/3 h-28 w-28 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-200" style={bodyFont}>
                  Toolkit overview
                </p>
                <h3 className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl" style={headingFont}>
                  Polish, resize, convert, and prep the final asset without breaking flow.
                </h3>
                <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base" style={bodyFont}>
                  The support tools are grouped to feel like a real workflow layer around the main text effects editor,
                  so the section reads more like a product and less like a generic feature grid.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[420px]">
                {[
                  "Fast cards with cleaner spacing",
                  "Balanced layout for wide screens",
                  "Better hierarchy for scanning",
                  "Stronger visual contrast and rhythm",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200"
                    style={bodyFont}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {tools.map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="group flex min-h-[320px] flex-col overflow-hidden rounded-[24px] border border-white/15 bg-slate-950/75 transition duration-200 hover:-translate-y-0.5 hover:border-white/30 hover:bg-slate-900"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={tool.image}
                    alt={tool.imageAlt}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p
                      className="inline-flex rounded-full border border-white/10 bg-slate-950/80 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-cyan-200"
                      style={bodyFont}
                    >
                      Reference image
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tool.color}`}
                    >
                      <tool.icon className="h-5 w-5 text-slate-950" />
                    </span>
                    <span
                      className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-slate-400"
                      style={bodyFont}
                    >
                      {tool.label}
                    </span>
                  </div>

                  <div className="mt-6 flex-1">
                    <h3 className="text-xl font-semibold" style={headingFont}>
                      {tool.title}
                    </h3>
                    <p className="mt-2 max-w-[28ch] text-sm leading-6 text-slate-300" style={bodyFont}>
                      {tool.description}
                    </p>
                    <p
                      className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-slate-200"
                      style={bodyFont}
                    >
                      <span className="mr-2 text-cyan-200">How it works:</span>
                      {tool.howItWorks}
                    </p>
                  </div>
                </div>

                <span
                  className="inline-flex items-center gap-1 px-5 pb-5 text-sm font-semibold text-cyan-200 transition group-hover:gap-2 group-hover:text-cyan-100"
                  style={bodyFont}
                >
                  Try tool <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="px-5 py-16 sm:px-7">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-200" style={bodyFont}>
              Why Teams Use It
            </p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl" style={headingFont}>
              Fast output. Strong visuals. No design friction.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Wand2,
                title: "AI Foreground Detection",
                description: "Keep people, products, and vehicles cleanly separated from text layers.",
                color: "from-cyan-500 to-blue-500",
              },
              {
                icon: Type,
                title: "Advanced Type Styling",
                description: "Tune font, weight, spacing, opacity, and layering in a precise visual canvas.",
                color: "from-amber-500 to-orange-500",
              },
              {
                icon: Zap,
                title: "Export in Seconds",
                description: "Generate high-quality assets quickly, directly from your browser workflow.",
                color: "from-emerald-500 to-teal-500",
              },
            ].map((feature) => (
              <article
                key={feature.title}
                className="rounded-3xl border border-white/15 bg-slate-900/70 p-6 transition hover:border-white/30"
              >
                <div
                  className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color}`}
                >
                  <feature.icon className="h-6 w-6 text-slate-950" />
                </div>
                <h3 className="text-xl font-semibold" style={headingFont}>
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-slate-300" style={bodyFont}>
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="showcase" className="border-t border-white/10 px-5 py-16 sm:px-7">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200" style={bodyFont}>
              Showcase
            </p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl" style={headingFont}>
              Finished looks for posters, campaigns, and editorial layouts.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {showcaseImages.map((item) => (
              <article
                key={item.src}
                className="overflow-hidden rounded-[24px] border border-white/15 bg-slate-950/70 transition hover:border-white/25"
              >
                <div className="relative aspect-[4/5]">
                  <Image src={item.src} alt={item.alt} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold" style={headingFont}>
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300" style={bodyFont}>
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-10 text-slate-400 sm:px-7">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-sm" style={bodyFont}>
            TextBehindImage.in
          </p>
          <p className="text-sm" style={bodyFont}>
            Build standout designs with text behind and text inside effects.
          </p>
        </div>
      </footer>
    </main>
  );
}

