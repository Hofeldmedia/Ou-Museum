export function MapLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-md border border-charcoal/12 bg-white/88 px-3 py-2 text-xs font-bold text-charcoal/82 shadow-sm backdrop-blur">
      <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-gold shadow-[0_0_14px_rgba(132,22,23,0.45)]" /> Selected</span>
      <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-emerald-500" /> Explored</span>
      <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full border border-charcoal/35 bg-white" /> Unexplored</span>
      <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-crimson ring-2 ring-white" /> OU</span>
    </div>
  );
}
