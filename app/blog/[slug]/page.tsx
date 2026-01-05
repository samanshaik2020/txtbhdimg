"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
    Calendar,
    Clock,
    ArrowLeft,
    Sparkles,
    Instagram,
    Twitter,
    Moon,
    Sun,
    Share2,
    Bookmark
} from "lucide-react";
import { BLOG_POSTS } from "@/lib/blog-data";
import { notFound } from "next/navigation";

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const post = BLOG_POSTS.find(p => p.slug === slug);
    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);

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

    if (!post) {
        notFound();
    }

    if (!mounted) return null;

    return (
        <div className={`min-h-screen flex flex-col transition-colors ${isDark ? "bg-zinc-950 text-white" : "bg-white text-zinc-900"}`}>
            {/* Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl ${isDark ? "bg-zinc-950/80 border-zinc-800" : "bg-white/80 border-zinc-200"}`}>
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
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
                <div className="max-w-3xl mx-auto">
                    {/* Back Button */}
                    <Link
                        href="/blog"
                        className={`inline-flex items-center gap-2 mb-12 text-sm font-medium transition-colors ${isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-zinc-900"}`}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to all articles
                    </Link>

                    {/* Post Header */}
                    <header className="mb-12">
                        <div className="flex items-center gap-4 mb-6">
                            <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${isDark ? "bg-zinc-800 text-white" : "bg-zinc-100 text-zinc-900"
                                }`}>
                                {post.category}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                                <Calendar className="w-3.5 h-3.5" />
                                {post.date}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                                <Clock className="w-3.5 h-3.5" />
                                {post.readTime} reading time
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                            {post.title}
                        </h1>

                        <div className={`p-6 rounded-2xl border mb-12 flex items-center justify-between ${isDark ? "bg-zinc-900/50 border-zinc-800" : "bg-zinc-50 border-zinc-200"}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
                                    TB
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Text Behind Image Team</p>
                                    <p className="text-xs text-zinc-500">Design & SEO Experts</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-zinc-800" : "hover:bg-zinc-100"}`}>
                                    <Share2 className="w-4 h-4" />
                                </button>
                                <button className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-zinc-800" : "hover:bg-zinc-100"}`}>
                                    <Bookmark className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Post Content */}
                    <div
                        className={`prose prose-lg max-w-none ${isDark ? "prose-invert" : "prose-zinc"} 
                        prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
                        prose-p:text-zinc-400 prose-p:leading-relaxed prose-li:text-zinc-400`}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Tags */}
                    <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 rounded-full bg-zinc-800 shadow-sm text-zinc-400 text-xs border border-zinc-700">
                                # {tag}
                            </span>
                        ))}
                    </div>

                    {/* Next Steps CTA */}
                    <div className={`mt-20 p-8 rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white text-center`}>
                        <h2 className="text-3xl font-bold mb-4 text-white">Inspired to create?</h2>
                        <p className="text-violet-100 mb-8 max-w-md mx-auto">
                            Put these strategies into practice and create your first text-behind-image design today.
                        </p>
                        <Link href="/editor" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-violet-600 font-bold hover:shadow-xl transition-all hover:scale-105">
                            Launch Editor Now
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className={`py-20 px-6 border-t ${isDark ? "border-zinc-900" : "border-zinc-100"}`}>
                <div className="max-w-6xl mx-auto text-center border-t border-zinc-900/50 pt-8 text-xs text-zinc-500">
                    <p>© 2025 Text Behind Image. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
