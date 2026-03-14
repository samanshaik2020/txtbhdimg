import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Briefcase, LayoutTemplate, MessagesSquare } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact TextBehindImage.in for custom creative tools, landing pages, and projects similar to this experience.",
};

const headingFont = { fontFamily: '"Space Grotesk", var(--font-geist-sans), sans-serif' };
const bodyFont = { fontFamily: '"Poppins", var(--font-geist-sans), sans-serif' };

const offerings = [
  "Custom creative tools and browser-based editors",
  "Landing pages for products, campaigns, and launches",
  "Visual design systems for bold interactive experiences",
];

const briefItems = [
  {
    icon: Briefcase,
    title: "Project type",
    description: "Tell us whether you need a landing page, creative tool, product demo, or another visual experience.",
  },
  {
    icon: LayoutTemplate,
    title: "References and goals",
    description: "Share example sites, the visual style you want, and what the project should help your business do.",
  },
  {
    icon: MessagesSquare,
    title: "Scope and timeline",
    description: "Include target launch timing, must-have features, and what success looks like for the project.",
  },
];

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-0 h-[380px] w-[380px] rounded-full bg-cyan-400/20 blur-[130px]" />
        <div className="absolute right-0 top-[22%] h-[340px] w-[340px] rounded-full bg-amber-400/15 blur-[120px]" />
        <div className="absolute bottom-0 left-[40%] h-[280px] w-[280px] rounded-full bg-emerald-400/12 blur-[110px]" />
      </div>

      <SiteHeader />

      <section className="relative px-5 pb-16 pt-14 sm:px-7 sm:pt-20">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200" style={bodyFont}>
              Contact Us
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl" style={headingFont}>
              Want a project like this for your own brand, product, or campaign?
            </h1>
            <p className="mt-6 max-w-2xl text-base text-slate-300 sm:text-lg" style={bodyFont}>
              We are interested in more creative builds in this style: high-impact landing pages, interactive visual
              tools, and polished browser experiences designed to feel memorable from the first screen.
            </p>

            <div className="mt-8 space-y-3" style={bodyFont}>
              {offerings.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/15 bg-slate-900/75 p-7 sm:p-8">
            <BrandMark className="h-12 w-12 rounded-2xl" />
            <h2 className="mt-5 text-2xl font-semibold" style={headingFont}>
              Project brief starter
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base" style={bodyFont}>
              If you want something similar, the fastest way to begin is to gather a short brief with your goal, visual
              references, must-have features, and timeline. This page is ready to act as your contact hub and can be
              connected to your preferred email or form workflow later.
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/70 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-amber-200" style={bodyFont}>
                Suggested brief
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300" style={bodyFont}>
                Project name
                <br />
                What you want to build
                <br />
                Reference links
                <br />
                Required features
                <br />
                Preferred timeline
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900/40 px-5 py-16 sm:px-7">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.18em] text-amber-200" style={bodyFont}>
              What To Send
            </p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl" style={headingFont}>
              A clear brief helps turn the idea into a real scope quickly.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {briefItems.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-white/15 bg-slate-950/75 p-6 transition hover:border-white/30"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 text-slate-950">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold" style={headingFont}>
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-300" style={bodyFont}>
                  {item.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-[32px] border border-white/15 bg-gradient-to-r from-slate-950 to-slate-900 p-7 sm:p-8">
            <h2 className="text-2xl font-semibold sm:text-3xl" style={headingFont}>
              Ready to shape another project like this?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base" style={bodyFont}>
              Use this page as the starting point for new creative work, custom product pages, or design-tool concepts.
              If you want, the next step can be adding your real inquiry form, inbox connection, or lead capture flow.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold transition hover:border-white/40 hover:bg-white/10"
                style={bodyFont}
              >
                Learn about us
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
                style={bodyFont}
              >
                Back to home
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
