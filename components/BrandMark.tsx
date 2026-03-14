type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className = "" }: BrandMarkProps) {
  return (
    <div
      className={`relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-cyan-400 via-emerald-400 to-amber-300 shadow-[0_10px_25px_-12px_rgba(34,211,238,0.8)] ${className}`.trim()}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.45),transparent_55%)]" />
      <div className="absolute left-[7px] top-[8px] h-[11px] w-[11px] rounded-[3px] border-2 border-slate-950/85 bg-transparent" />
      <div className="absolute right-[6px] top-[5px] h-[12px] w-[12px] rounded-[3px] bg-slate-950/85" />
      <div className="absolute bottom-[7px] left-[7px] h-[3px] w-[17px] rounded-full bg-slate-950/85" />
      <div className="absolute bottom-[12px] right-[7px] h-[3px] w-[10px] rounded-full bg-slate-950/65" />
    </div>
  );
}
