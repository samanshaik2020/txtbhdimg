"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Layers,
  Type,
  Wand2,
  Download,
  Zap,
  MousePointer,
  Moon,
  Sun,
  ArrowRight,
  Check,
  Play,
  Github,
  Twitter,
  Minimize2,
  Scissors,
  RotateCw,
  Maximize2,
  ImageMinus,
  Wrench,
  FileType,
} from "lucide-react";

export default function LandingPage() {
  const [isDark, setIsDark] = useState(true); // Default to dark, will be updated on client
  const [mounted, setMounted] = useState(false);

  // Handle mounting and theme initialization
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme");
    if (saved) {
      setIsDark(saved === "dark");
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(isDark ? "dark" : "light");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    }
  }, [isDark, mounted]);

  if (!mounted) return null;

  const features = [
    {
      icon: <Wand2 className="w-6 h-6" />,
      title: "AI Background Removal",
      description: "Automatically separate subjects from backgrounds using cutting-edge AI technology.",
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Layered Editing",
      description: "Text magically appears behind subjects. Full control over layer visibility and ordering.",
    },
    {
      icon: <Type className="w-6 h-6" />,
      title: "35+ Google Fonts",
      description: "Choose from Bebas Neue, Poppins, Pacifico, Bangers, and many more with shadows & strokes.",
    },
    {
      icon: <MousePointer className="w-6 h-6" />,
      title: "Drag & Drop",
      description: "Intuitive canvas with snapping guides, transform handles, and keyboard shortcuts.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Canvas Presets",
      description: "Ready-made sizes for YouTube, Instagram, Twitter, LinkedIn, and more.",
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "High-Quality Export",
      description: "Download your designs as crisp 2x resolution PNG images.",
    },
  ];

  const tools = [
    {
      icon: <Minimize2 className="w-7 h-7" />,
      title: "Compress Image",
      description: "Reduce file size while maintaining quality",
      href: "/tools/compress",
      color: "from-emerald-500 to-teal-500",
      shadowColor: "shadow-emerald-500/25",
    },
    {
      icon: <ImageMinus className="w-7 h-7" />,
      title: "Remove Background",
      description: "AI-powered background removal",
      href: "/tools/remove-background",
      color: "from-violet-500 to-purple-500",
      shadowColor: "shadow-violet-500/25",
    },
    {
      icon: <Maximize2 className="w-7 h-7" />,
      title: "Resize Image",
      description: "Change dimensions to any size",
      href: "/tools/resize",
      color: "from-blue-500 to-cyan-500",
      shadowColor: "shadow-blue-500/25",
    },
    {
      icon: <Scissors className="w-7 h-7" />,
      title: "Crop Image",
      description: "Cut and frame your images",
      href: "/tools/crop",
      color: "from-orange-500 to-amber-500",
      shadowColor: "shadow-orange-500/25",
    },
    {
      icon: <RotateCw className="w-7 h-7" />,
      title: "Rotate Image",
      description: "Rotate and flip images easily",
      href: "/tools/rotate",
      color: "from-pink-500 to-rose-500",
      shadowColor: "shadow-pink-500/25",
    },
    {
      icon: <FileType className="w-7 h-7" />,
      title: "Convert Format",
      description: "PNG, JPG, WEBP, AVIF conversion",
      href: "/tools/convert",
      color: "from-indigo-500 to-purple-500",
      shadowColor: "shadow-indigo-500/25",
    },
  ];

  const steps = [
    { step: "01", title: "Upload Image", description: "Drop any image with a clear subject" },
    { step: "02", title: "Add Text", description: "Type your message and customize style" },
    { step: "03", title: "Watch Magic", description: "Text appears behind the subject" },
    { step: "04", title: "Export", description: "Download your stunning creation" },
  ];

  return (
    <div className={`min-h-screen transition-colors ${isDark ? "bg-zinc-950 text-white" : "bg-white text-zinc-900"}`}>
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl ${isDark ? "bg-zinc-950/80 border-zinc-800" : "bg-white/80 border-zinc-200"
        }`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">TextBehind</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className={`text-sm font-medium transition-colors ${isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-zinc-900"}`}>
              Features
            </a>
            <a href="#tools" className={`text-sm font-medium transition-colors ${isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-zinc-900"}`}>
              Tools
            </a>
            <a href="#how-it-works" className={`text-sm font-medium transition-colors ${isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-zinc-900"}`}>
              How It Works
            </a>
            <Link href="/blog" className={`text-sm font-medium transition-colors ${isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-zinc-900"}`}>
              Blog
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-zinc-800" : "hover:bg-zinc-100"}`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link
              href="/editor"
              className="px-5 py-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white text-sm font-medium transition-all hover:shadow-lg hover:shadow-violet-500/25"
            >
              Open Editor
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8 ${isDark ? "bg-violet-500/10 text-violet-400 border border-violet-500/20" : "bg-violet-50 text-violet-600 border border-violet-200"
              }`}>
              <Sparkles className="w-4 h-4" />
              AI-Powered Design Tool
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Add Text Behind
              <br />
              <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
                Image Online
              </span>
            </h1>

            <p className={`text-xl md:text-2xl mb-10 leading-relaxed max-w-2xl mx-auto ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              The professional way to add text behind subjects.
              <span className="hidden md:inline"> Automatically remove backgrounds, manage layers, and create stunning visuals in seconds.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/editor"
                className="group flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-semibold text-lg transition-all hover:shadow-xl hover:shadow-violet-500/30 hover:scale-105"
              >
                Start Creating Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className={`flex items-center gap-2 px-6 py-4 rounded-full font-medium transition-colors ${isDark ? "bg-zinc-800 hover:bg-zinc-700" : "bg-zinc-100 hover:bg-zinc-200"
                }`}>
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>

            <div className={`flex items-center justify-center gap-6 mt-10 text-sm ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" /> No sign-up required
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" /> 100% free
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" /> Works in browser
              </span>
            </div>
          </div>

          {/* Hero Preview */}
          <div className="mt-16 relative">
            <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? "from-zinc-950" : "from-white"} to-transparent z-10 pointer-events-none h-32 bottom-0 top-auto`} />
            <div className={`rounded-2xl border overflow-hidden shadow-2xl ${isDark ? "border-zinc-800 shadow-violet-500/10" : "border-zinc-200 shadow-zinc-500/10"
              }`}>
              <div className={`h-10 flex items-center gap-2 px-4 border-b ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-zinc-50 border-zinc-200"}`}>
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className={`flex items-center justify-center p-8 ${isDark ? "bg-zinc-900" : "bg-zinc-100"}`}>
                <div className="flex items-center justify-center gap-8 w-full">
                  {/* Before Image */}
                  <div className="flex flex-col items-center gap-3 flex-1">
                    <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-zinc-900/50">
                      <img
                        src="/car-normal.png"
                        alt="Original car image"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                    <span className={`text-sm font-medium ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>Before</span>
                  </div>

                  {/* Arrow indicator */}
                  <div className={`flex-shrink-0 ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
                    <ArrowRight className="w-8 h-8" />
                  </div>

                  {/* After Image */}
                  <div className="flex flex-col items-center gap-3 flex-1">
                    <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-violet-500/30">
                      <img
                        src="/car-edited.png"
                        alt="Edited car image with text behind"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                    <span className={`text-sm font-medium ${isDark ? "text-violet-400" : "text-violet-600"}`}>After</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className={`py-24 px-6 ${isDark ? "bg-zinc-900/50" : "bg-zinc-50"}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${isDark ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-emerald-50 text-emerald-600 border border-emerald-200"
              }`}>
              <Wrench className="w-4 h-4" />
              Free Image Tools
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">More Tools for You</h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              Powerful image editing tools, all free and running in your browser
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, idx) => (
              <Link
                key={idx}
                href={tool.href}
                className={`group p-6 rounded-2xl border transition-all hover:scale-[1.02] hover:-translate-y-1 ${isDark
                  ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                  : "bg-white border-zinc-200 hover:border-zinc-300"
                  }`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 shadow-lg ${tool.shadowColor} group-hover:scale-110 transition-transform`}>
                  <div className="text-white">{tool.icon}</div>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-violet-500 transition-colors">{tool.title}</h3>
                <p className={isDark ? "text-zinc-400" : "text-zinc-600"}>{tool.description}</p>
                <div className={`flex items-center gap-1 mt-4 text-sm font-medium ${isDark ? "text-zinc-500" : "text-zinc-500"} group-hover:text-violet-500 transition-colors`}>
                  Try it free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Text Behind Image Features</h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              Everything you need to create stunning text-behind-image designs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition-all hover:scale-[1.02] ${isDark
                  ? "bg-zinc-900 border-zinc-800 hover:border-violet-500/50"
                  : "bg-white border-zinc-200 hover:border-violet-500/50"
                  }`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mb-4 text-violet-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className={isDark ? "text-zinc-400" : "text-zinc-600"}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className={`py-24 px-6 ${isDark ? "bg-zinc-900/50" : "bg-zinc-50"}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              Create professional designs in just 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="text-6xl font-bold bg-gradient-to-br from-violet-500 to-fuchsia-500 bg-clip-text text-transparent mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className={isDark ? "text-zinc-400" : "text-zinc-600"}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Create Something Amazing?
          </h2>
          <p className={`text-xl mb-10 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
            Join thousands of creators making stunning designs with TextBehind
          </p>
          <Link
            href="/editor"
            className="group inline-flex items-center gap-2 px-10 py-5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-semibold text-xl transition-all hover:shadow-xl hover:shadow-violet-500/30 hover:scale-105"
          >
            Launch Editor
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Showcase Images */}
          <div className="mt-20 flex flex-col items-center gap-12">
            {/* Top row - 2 images */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-10 w-full">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-violet-500/20 hover:scale-[1.02] transition-transform duration-500">
                <img
                  src="/text-behind-image (6).png"
                  alt="Text behind image example 1"
                  className="w-full max-w-2xl h-auto"
                />
              </div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-fuchsia-500/20 hover:scale-[1.02] transition-transform duration-500">
                <img
                  src="/text-behind-image (8).png"
                  alt="Text behind image example 2"
                  className="w-full max-w-2xl h-auto"
                />
              </div>
            </div>
            {/* Bottom row - 1 centered extra large image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/20 hover:scale-[1.02] transition-transform duration-500">
              <img
                src="/text-behind-image (10).png"
                alt="Text behind image example 3"
                className="w-full max-w-3xl h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-6 border-t ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">TextBehind</span>
          </div>
          <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
            © 2025 TextBehind. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-zinc-800" : "hover:bg-zinc-100"}`}>
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-zinc-800" : "hover:bg-zinc-100"}`}>
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
