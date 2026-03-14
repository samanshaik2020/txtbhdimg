import Link from "next/link";

const bodyFont = { fontFamily: '"Poppins", var(--font-geist-sans), sans-serif' };

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 px-5 py-10 text-slate-400 sm:px-7">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm" style={bodyFont}>
            TextBehindImage.in
          </p>
          <p className="mt-1 text-sm" style={bodyFont}>
            Build standout designs with text behind and text inside effects.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm" style={bodyFont}>
          <Link href="/about" className="transition hover:text-white">
            About
          </Link>
          <Link href="/contact" className="transition hover:text-white">
            Contact
          </Link>
          <Link href="/blog" className="transition hover:text-white">
            Blog
          </Link>
        </div>
      </div>
    </footer>
  );
}
