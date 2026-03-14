import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

const headingFont = { fontFamily: '"Space Grotesk", var(--font-geist-sans), sans-serif' };
const bodyFont = { fontFamily: '"Poppins", var(--font-geist-sans), sans-serif' };

const navItems = [
  { href: "/#showcase", label: "Showcase" },
  { href: "/#tools", label: "Tools" },
  { href: "/#features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-7">
        <Link href="/" className="flex items-center gap-2.5">
          <BrandMark />
          <span className="text-base font-semibold tracking-tight" style={headingFont}>
            TextBehind
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex" style={bodyFont}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
