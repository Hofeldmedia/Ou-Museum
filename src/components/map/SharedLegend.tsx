import type { MapLegendItem } from '../../types/content';

const toneClasses: Record<MapLegendItem['tone'], string> = {
  conference: 'bg-white border border-charcoal/35',
  anchor: 'bg-crimson ring-2 ring-white',
  heisman: 'bg-gold border border-charcoal/10',
  nfl: 'bg-sky border border-charcoal/15',
  rivalry: 'bg-crimson border border-white/60',
  championship: 'bg-gold ring-2 ring-white',
  recruiting: 'bg-crimson/60 ring-2 ring-white',
  route: 'bg-charcoal/70',
  selected: 'bg-gold shadow-[0_0_14px_rgba(132,22,23,0.45)]',
  explored: 'bg-emerald-500',
  new: 'bg-sky ring-2 ring-white',
};

export function SharedLegend({ items }: { items: MapLegendItem[] }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-md border border-charcoal/12 bg-white/88 px-3 py-2 text-xs font-bold text-charcoal/82 shadow-sm backdrop-blur">
      {items.map((item) => (
        <span key={item.id} className="inline-flex items-center gap-2">
          <span className={`h-3 w-3 rounded-full ${toneClasses[item.tone]}`} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
