"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import {
    Search,
    Calendar,
    Clock,
    ArrowRight,
    Instagram,
    Twitter,
    Moon,
    Sun
} from "lucide-react";

import { BLOG_POSTS } from "@/lib/blog-data";

const CATEGORIES = ["All", "SEO", "Design", "Development", "Tutorial"];

export default function BlogListingPage() {
    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("theme");
        if (saved) setIsDark(saved === "dark");
    }, []);

    useEffect(() => {
        if (mounted) {
            document.documentElement.classList.remove("light", "dark");
            document.documentElement.classList.add(isDark ? "dark" : "light");
            localStorage.setItem("theme", isDark ? "dark" : "light");
        }
    }, [isDark, mounted]);

    const filteredPosts = BLOG_POSTS.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === "All" || post.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    if (!mounted) return null;

    return (
        <div className={`min-h-screen flex flex-col transition-colors ${isDark ? "bg-zinc-950 text-white" : "bg-white text-zinc-900"}`}>
            {/* Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl ${isDark ? "bg-zinc-950/80 border-zinc-800" : "bg-white/80 border-zinc-200"}`}>
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <BrandMark className="h-8 w-8 rounded-lg" />
                        <span className="font-bold text-lg">Text-Behind-Image</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/blog" className="text-sm font-medium text-violet-500">Blog</Link>
                        <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-zinc-800" : "hover:bg-zinc-100"}`}>
                            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                        <Link href="/editor" className="px-4 py-2 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-sm font-bold transition-all hover:scale-105">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="flex-1 pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-left mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Text Behind Image Blog</h1>
                        <p className={`text-lg ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                            Expert guides on web design, SEO optimization, and modern development
                        </p>
                    </div>

                    {/* Search & Filters */}
                    <div className={`p-6 rounded-2xl mb-12 border ${isDark ? "bg-zinc-900/50 border-zinc-800" : "bg-zinc-50 border-zinc-200"}`}>
                        <div className="relative mb-6">
                            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-zinc-500" : "text-zinc-400"}`} />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all outline-none ${isDark
                                    ? "bg-zinc-950 border-zinc-800 focus:border-violet-500 text-white"
                                    : "bg-white border-zinc-200 focus:border-violet-500 text-zinc-900"
                                    }`}
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${activeCategory === cat
                                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                                        : isDark
                                            ? "bg-zinc-800 text-zinc-400 hover:text-white"
                                            : "bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6 text-sm font-medium text-zinc-500">
                        Found {filteredPosts.length} articles
                    </div>

                    {/* Blog Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className={`group flex flex-col p-6 rounded-2xl border transition-all hover:shadow-xl hover:-translate-y-1 ${isDark
                                    ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                                    : "bg-white border-zinc-200 hover:border-zinc-300"
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${isDark ? "bg-zinc-800 text-white" : "bg-zinc-100 text-zinc-900"
                                        }`}>
                                        {post.category}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                                        <Clock className="w-3.5 h-3.5" />
                                        {post.readTime}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-violet-500 transition-colors leading-tight">
                                    {post.title}
                                </h3>
                                <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-4 font-medium">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {post.date}
                                </div>
                                <p className={`text-sm mb-6 flex-1 ${isDark ? "text-zinc-400 italic" : "text-zinc-600 font-light"}`}>
                                    {post.description}
                                </p>
                                <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-800/50">
                                    {post.tags.map(tag => (
                                        <span key={tag} className="px-2 py-0.5 rounded bg-zinc-800/30 text-zinc-500 text-[10px] border border-zinc-800">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className={`py-20 px-6 border-t ${isDark ? "border-zinc-900" : "border-zinc-100"}`}>
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 mb-16">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <BrandMark className="h-8 w-8 rounded-lg" />
                                <span className="font-bold text-xl">Text Behind Image</span>
                            </div>
                            <p className={`text-sm max-w-sm mb-6 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                                Create stunning text-behind-image designs in seconds. Built with ❤️ by team at <span className="text-violet-500">Text Behind Image</span> (Formerly known as Text Behind Photos).
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6">CONNECT</h4>
                            <div className="space-y-4">
                                <a href="#" className={`flex items-center gap-3 text-sm transition-colors ${isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-zinc-900"}`}>
                                    <Instagram className="w-4 h-4 text-violet-500" /> Instagram
                                </a>
                                <a href="#" className={`flex items-center gap-3 text-sm transition-colors ${isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-zinc-900"}`}>
                                    <Twitter className="w-4 h-4 text-violet-500" /> Twitter
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-zinc-900/50 text-xs text-zinc-500">
                        <p>© 2025 Text Behind Image. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-violet-500 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-violet-500 transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
