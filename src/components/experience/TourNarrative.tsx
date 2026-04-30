import type { MuseumMode, TourChapter } from '../../types/content';

export function TourNarrative({ chapter, museumMode }: { chapter: TourChapter; museumMode: MuseumMode }) {
  return (
    <aside className={`mb-5 rounded-md border p-4 shadow-sm backdrop-blur ${
      chapter.tone === 'archival'
        ? 'border-brass/25 bg-cream/78'
        : chapter.tone === 'dynasty'
          ? 'border-crimson/20 bg-white/75'
          : chapter.tone === 'modern'
            ? 'border-charcoal/10 bg-white/82'
            : 'border-gold/30 bg-charcoal text-cream'
    }`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className={`text-xs font-black uppercase tracking-[0.22em] ${chapter.tone === 'sec' ? 'text-gold' : 'text-brass'}`}>
            {museumMode === 'guided' ? 'Guided Tour' : 'Free Explore'} | {chapter.eraLabel}
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold">{chapter.title}</h2>
        </div>
        <span className={`rounded-sm px-3 py-1 text-xs font-black uppercase tracking-[0.14em] ${chapter.tone === 'sec' ? 'bg-white/10 text-cream' : 'bg-charcoal text-cream'}`}>
          Era Lens
        </span>
      </div>
      <p className={`mt-2 max-w-4xl text-sm leading-6 ${chapter.tone === 'sec' ? 'text-cream/74' : 'text-charcoal/72'}`}>{chapter.narrative}</p>
    </aside>
  );
}
