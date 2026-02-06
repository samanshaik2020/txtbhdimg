"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, Variants } from "framer-motion";
import {
  Sparkles,
  Layers,
  Type,
  Wand2,
  Zap,
  Moon,
  Sun,
  ArrowRight,
  Check,
  Minimize2,
  Scissors,
  RotateCw,
  Maximize2,
  ImageMinus,
  Wrench,
  FileType,
  Github,
  Twitter,
} from "lucide-react";
import Image from "next/image";

// Animated SVG Background Component
const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating Gradient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 right-20 w-96 h-96 bg-violet-500/30 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-20 left-20 w-96 h-96 bg-fuchsia-500/30 rounded-full blur-[120px]"
      />

      {/* Floating SVG Shapes */}
      <svg className="absolute inset-0 w-full h-full">
        <motion.circle
          cx="10%"
          cy="20%"
          r="2"
          fill="url(#gradient1)"
          animate={{
            cy: ["20%", "25%", "20%"],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.circle
          cx="90%"
          cy="30%"
          r="3"
          fill="url(#gradient2)"
          animate={{
            cy: ["30%", "35%", "30%"],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        <motion.circle
          cx="15%"
          cy="70%"
          r="2.5"
          fill="url(#gradient3)"
          animate={{
            cy: ["70%", "75%", "70%"],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.circle
          cx="85%"
          cy="80%"
          r="2"
          fill="url(#gradient1)"
          animate={{
            cy: ["80%", "85%", "80%"],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />

        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// Animated Grid Lines SVG
const AnimatedGrid = () => {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <motion.path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
};

// Animated SVG Hero Title
const AnimatedHeroTitle = ({ isDark }: { isDark: boolean }) => {
  return (
    <div className="w-full max-w-6xl mx-auto h-[200px] md:h-[300px] lg:h-[350px] mb-8 relative z-20">
      <svg
        viewBox="0 0 1000 300"
        className="w-full h-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Line 1: Create Stunning */}
        <motion.text
          x="50%"
          y="35%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-7xl md:text-8xl font-black uppercase tracking-tighter"
          style={{
            fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
            fontWeight: 900,
          }}
          stroke={isDark ? "#ffffff" : "#18181b"}
          strokeWidth="2"
          fill="transparent"
          initial={{ strokeDasharray: 800, strokeDashoffset: 800 }}
          animate={{ strokeDashoffset: 0, fill: isDark ? "#ffffff" : "#18181b" }}
          transition={{
            strokeDashoffset: { duration: 2, ease: "easeInOut" },
            fill: { duration: 0.8, ease: "easeOut", delay: 1.5 },
          }}
        >
          Create Stunning
        </motion.text>

        {/* Line 2: Text Effects */}
        <motion.text
          x="50%"
          y="75%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-8xl md:text-9xl font-black uppercase tracking-tighter"
          style={{
            fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
            fontWeight: 900,
            filter: "url(#glow)",
          }}
          stroke="url(#heroGradient)"
          strokeWidth="3"
          fill="transparent"
          initial={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
          animate={{ strokeDashoffset: 0, fill: "url(#heroGradient)" }}
          transition={{
            strokeDashoffset: { duration: 2, ease: "easeInOut", delay: 0.8 },
            fill: { duration: 0.8, ease: "easeOut", delay: 2.3 },
          }}
        >
          Text Effects
        </motion.text>
      </svg>
    </div>
  );
};

export default function LandingPage() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className={`min-h-screen transition-colors ${isDark ? "bg-zinc-950 text-white" : "bg-white text-zinc-900"}`}>
      {/* Animated Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 origin-left z-50"
        style={{ scaleX: scaleProgress }}
      />

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl ${isDark ? "bg-zinc-950/80 border-zinc-800" : "bg-white/80 border-zinc-200"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <motion.div
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <span className="font-bold text-lg">TextBehind</span>
          </motion.div>
          <div className="hidden md:flex items-center gap-6">
            {["Showcase", "Features", "Tools", "Blog"].map((item, i) => (
              <motion.a
                key={item}
                href={item === "Blog" ? "/blog" : `#${item.toLowerCase()}`}
                className={`text-sm font-medium transition-colors ${isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-zinc-900"}`}
                whileHover={{ scale: 1.1, y: -2 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-zinc-800" : "hover:bg-zinc-100"}`}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <AnimatedBackground />
        <AnimatedGrid />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center max-w-5xl mx-auto mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* SVG Animated Text Headline */}
            <AnimatedHeroTitle isDark={isDark} />

            {/* Tagline */}
            <motion.p
              className={`text-2xl md:text-3xl mb-12 font-medium ${isDark ? "text-zinc-400" : "text-zinc-600"}`}
              variants={itemVariants}
            >
              AI-powered tools to make your text stand out
            </motion.p>

            {/* Dual CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              variants={itemVariants}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/editor"
                  className="group px-10 py-5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold text-lg transition-all shadow-lg shadow-violet-500/30 flex items-center gap-2"
                >
                  <Layers className="w-5 h-5" />
                  Text Behind Image
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/editor/text-inside"
                  className="group px-10 py-5 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white font-bold text-lg transition-all shadow-lg shadow-fuchsia-500/30 flex items-center gap-2"
                >
                  <Type className="w-5 h-5" />
                  Text Inside Image
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>

            {/* Feature Badges */}
            <motion.div
              className={`flex flex-wrap items-center justify-center gap-6 mt-12 text-sm ${isDark ? "text-zinc-500" : "text-zinc-500"}`}
              variants={containerVariants}
            >
              {["No Sign-Up", "100% Free", "AI-Powered", "Instant Results"].map((badge, i) => (
                <motion.span
                  key={badge}
                  className="flex items-center gap-2"
                  variants={itemVariants}
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  >
                    <Check className="w-4 h-4 text-emerald-500" />
                  </motion.div>
                  {badge}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Showcase Gallery - BENTO GRID */}
      <section id="showcase" className={`py-16 px-6 ${isDark ? "bg-zinc-900/30" : "bg-zinc-50"}`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 ${isDark ? "bg-violet-500/10 text-violet-400 border border-violet-500/20" : "bg-violet-50 text-violet-600 border border-violet-200"
                }`}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              Showcase Gallery
            </motion.div>
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              See What You Can Create
            </motion.h2>
            <motion.p
              className={`text-xl max-w-2xl mx-auto ${isDark ? "text-zinc-400" : "text-zinc-600"}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Transform ordinary images into extraordinary designs with AI
            </motion.p>
          </motion.div>

          {/* Bento Grid Layout */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Large Hero Image - Left */}
            <motion.div
              className="lg:row-span-2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className={`group relative rounded-3xl overflow-hidden border-2 ${isDark
                  ? "bg-zinc-900/50 backdrop-blur-xl border-violet-500/20 shadow-xl"
                  : "bg-white border-violet-200 shadow-xl"
                  }`}
                whileHover={{ scale: 1.02, borderColor: isDark ? "rgba(139, 92, 246, 0.5)" : "rgba(139, 92, 246, 0.4)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src="/text-behind-image (10).png"
                    alt="Text Behind Image Example"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-8"
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-2xl font-bold text-white mb-2">Text Behind Image</h3>
                    <p className="text-white/80">AI-powered background removal</p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Top Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                className={`group relative rounded-3xl overflow-hidden border-2 ${isDark
                  ? "bg-zinc-900/50 backdrop-blur-xl border-fuchsia-500/20 shadow-xl"
                  : "bg-white border-fuchsia-200 shadow-xl"
                  }`}
                whileHover={{ scale: 1.02, borderColor: isDark ? "rgba(217, 70, 239, 0.5)" : "rgba(217, 70, 239, 0.4)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/text-behind-image (6).png"
                    alt="Creative Text Design"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-6"
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-bold text-white mb-1">Creative Typography</h3>
                    <p className="text-white/80 text-sm">35+ Google Fonts</p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Bottom Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.div
                className={`group relative rounded-3xl overflow-hidden border-2 ${isDark
                  ? "bg-zinc-900/50 backdrop-blur-xl border-purple-500/20 shadow-xl"
                  : "bg-white border-purple-200 shadow-xl"
                  }`}
                whileHover={{ scale: 1.02, borderColor: isDark ? "rgba(168, 85, 247, 0.5)" : "rgba(168, 85, 247, 0.4)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/text-behind-image (8).png"
                    alt="Professional Design"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-6"
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-bold text-white mb-1">Professional Quality</h3>
                    <p className="text-white/80 text-sm">High-resolution exports</p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Powerful Features
            </motion.h2>
            <motion.p
              className={`text-xl max-w-2xl mx-auto ${isDark ? "text-zinc-400" : "text-zinc-600"}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Everything you need to create professional designs
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: <Wand2 className="w-8 h-8 text-white" />,
                title: "AI Background Removal",
                description: "Automatically separate subjects from backgrounds with cutting-edge AI technology",
                color: "from-violet-500 to-purple-500",
              },
              {
                icon: <Type className="w-8 h-8 text-white" />,
                title: "35+ Google Fonts",
                description: "Choose from Bebas Neue, Poppins, Pacifico, and many more professional fonts",
                color: "from-fuchsia-500 to-pink-500",
              },
              {
                icon: <Zap className="w-8 h-8 text-white" />,
                title: "Instant Export",
                description: "Download your designs as high-quality 2x resolution PNG images instantly",
                color: "from-purple-500 to-indigo-500",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className={`p-8 rounded-3xl border-2 ${isDark
                  ? "bg-zinc-900/50 backdrop-blur-xl border-violet-500/20"
                  : "bg-white border-violet-200"
                  }`}
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  borderColor: isDark ? "rgba(139, 92, 246, 0.5)" : "rgba(139, 92, 246, 0.4)",
                  boxShadow: "0 20px 60px rgba(139, 92, 246, 0.3)"
                }}
              >
                <motion.div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className={isDark ? "text-zinc-400" : "text-zinc-600"}>{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className={`py-16 px-6 ${isDark ? "bg-zinc-900/30" : "bg-zinc-50"}`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${isDark ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                }`}
              whileHover={{ scale: 1.05 }}
            >
              <Wrench className="w-4 h-4" />
              Free Image Tools
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">More Tools for You</h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              Powerful image editing tools, all free and running in your browser
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {tools.map((tool, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Link
                  href={tool.href}
                  className={`group block p-6 rounded-2xl border transition-all ${isDark
                    ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                    : "bg-white border-zinc-200 hover:border-zinc-300"
                    }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 shadow-lg ${tool.shadowColor}`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="text-white">{tool.icon}</div>
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-violet-500 transition-colors">{tool.title}</h3>
                    <p className={isDark ? "text-zinc-400" : "text-zinc-600"}>{tool.description}</p>
                    <motion.div
                      className={`flex items-center gap-1 mt-4 text-sm font-medium ${isDark ? "text-zinc-500" : "text-zinc-500"} group-hover:text-violet-500 transition-colors`}
                      whileHover={{ x: 5 }}
                    >
                      Try it free <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        className={`py-12 px-6 border-t ${isDark ? "border-zinc-800" : "border-zinc-200"}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </motion.div>
            <span className="font-semibold">TextBehind</span>
          </motion.div>
          <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
            © 2025 TextBehind. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[Github, Twitter].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-zinc-800" : "hover:bg-zinc-100"}`}
                whileHover={{ scale: 1.2, rotate: 360 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
