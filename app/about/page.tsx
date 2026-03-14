import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Layers, Rocket, Wand2 } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about TextBehindImage.in, the creative studio building fast browser-based typography and image editing tools.",
};

const headingFont = { fontFamily: '"Space Grotesk", var(--font-geist-sans), sans-serif' };
const bodyFont = { fontFamily: '"Poppins", var(--font-geist-sans), sans-serif' };

const values = [
  {
    icon: Layers,
    title: "Creative tools with real depth",
    description: "We focus on effects people actually want to publish, not generic demo features.",
  },
  {
    icon: Wand2,
    title: "Fast workflows in the browser",
    description: "The goal is simple: less setup, less friction, and stronger visual output in fewer clicks.",
  },
  {
    icon: Rocket,
    title: "Built for more projects like this",
    description: "We are expanding into more design utilities, marketing experiences, and creative editing products.",
  },
];

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-0 h-[420px] w-[420px] rounded-full bg-cyan-400/20 blur-[130px]" />
        <div className="absolute right-0 top-[18%] h-[340px] w-[340px] rounded-full bg-amber-400/15 blur-[120px]" />
        <div className="absolute bottom-0 left-[30%] h-[300px] w-[300px] rounded-full bg-emerald-400/10 blur-[120px]" />
      </div>

      <SiteHeader />

      <section className="relative px-5 pb-16 pt-14 sm:px-7 sm:pt-20">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200" style={bodyFont}>
              About Us
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl" style={headingFont}>
              We build creative web tools that help visuals feel sharper, faster, and more publish-ready.
            </h1>
            <p className="mt-6 max-w-2xl text-base text-slate-300 sm:text-lg" style={bodyFont}>
              TextBehindImage.in started with a focused idea: make premium-looking typography effects easy to create in
              the browser. From there, the product expanded into a wider toolkit for creators, marketers, and teams who
              need strong visuals without heavy desktop software.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {values.map((value) => (
              <article
                key={value.title}
                className="rounded-3xl border border-white/15 bg-slate-900/70 p-6 transition hover:border-white/30"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-400 text-slate-950">
                  <value.icon className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold" style={headingFont}>
                  {value.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-300" style={bodyFont}>
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900/40 px-5 py-16 sm:px-7">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-white/15 bg-slate-950/75 p-7 sm:p-8">
            <p className="text-xs uppercase tracking-[0.18em] text-amber-200" style={bodyFont}>
              What We Build
            </p>
            <h2 className="mt-4 text-3xl font-semibold" style={headingFont}>
              Projects that blend utility, motion, and strong visual identity.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base" style={bodyFont}>
              We are especially interested in browser-based creative products: image tools, typography experiences,
              content generators, product launch pages, and interfaces that need to feel bold without becoming hard to
              use. The aim is always the same: clean UX with more personality.
            </p>
          </div>

          <div className="rounded-[32px] border border-white/15 bg-gradient-to-br from-slate-950 to-slate-900 p-7 sm:p-8">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-200" style={bodyFont}>
              Next Up
            </p>
            <ul className="mt-5 space-y-4 text-sm text-slate-300 sm:text-base" style={bodyFont}>
              <li>Custom landing pages for creative products and campaigns.</li>
              <li>More editor-style tools built for social, ads, and brand content.</li>
              <li>Interactive project experiences that showcase products more memorably.</li>
            </ul>

            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
              style={bodyFont}
            >
              Start a project conversation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
