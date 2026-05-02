import { ArrowRight, ChevronDown, FileText, Link2, ListChecks, X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import type { Screen } from '../types';
import type { MuseumArtifact, RelatedLink, SignatureMoment } from '../types/content';
import { relatedLinkToRoute } from '../utils/navigation';
import { PrimaryButton } from './PrimaryButton';

export function SectionHero({
  eyebrow,
  title,
  children,
  accent = 'crimson',
  meta,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  accent?: 'crimson' | 'gold' | 'charcoal';
  meta?: string;
}) {
  const color = {
    crimson: 'bg-crimson',
    gold: 'bg-gold',
    charcoal: 'bg-charcoal',
  }[accent];

  return (
    <section className="mb-5 border-b border-charcoal/10 bg-white/70 pb-5 backdrop-blur">
      <div className={`mb-4 h-1 w-16 rounded-full ${color}`} />
      <div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-brass">{eyebrow}</p>
          <h1 className="mt-2 font-display text-[clamp(2rem,8vw,3.35rem)] font-bold leading-tight text-charcoal">{title}</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-charcoal/68">{children}</p>
          {meta && <p className="mt-3 inline-flex max-w-full rounded-sm bg-charcoal/8 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-charcoal/68">{meta}</p>}
        </div>
      </div>
    </section>
  );
}

export function StatPill({ label, value, dark = false }: { label: string; value: string; dark?: boolean }) {
  return (
    <div className={`rounded-md border p-3 ${dark ? 'border-white/10 bg-white/10' : 'border-charcoal/10 bg-cream/85'}`}>
      <p className={`text-xs font-black uppercase tracking-[0.16em] ${dark ? 'text-gold' : 'text-charcoal/48'}`}>{label}</p>
      <p className={`mt-1 break-words font-display text-2xl font-bold leading-tight ${dark ? 'text-cream' : 'text-charcoal'}`}>{value}</p>
    </div>
  );
}

export function CollectionGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</div>;
}

export function RelatedLinks({ links, onNavigate }: { links: RelatedLink[]; onNavigate: (screen: Screen, targetId?: string) => void }) {
  if (!links.length) return null;

  return (
    <div className="mt-5 rounded-md border border-charcoal/10 bg-white/80 p-4 shadow-sm">
      <p className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-brass">
        <Link2 className="h-4 w-4" aria-hidden="true" /> Related exhibits
      </p>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <button
            key={`${link.type}-${link.id}-${link.label}`}
            type="button"
            onClick={() => {
              const route = relatedLinkToRoute(link);
              onNavigate(route.screen, route.targetId);
            }}
            className="inline-flex min-h-[44px] max-w-full items-center gap-2 rounded-md bg-charcoal px-3 py-2 text-left text-xs font-bold uppercase leading-tight tracking-[0.12em] text-cream transition hover:-translate-y-0.5 hover:bg-crimson"
          >
            {link.label} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function MilestoneTimeline({ items }: { items: Array<{ year: string; title: string; body: string }> }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article key={`${item.year}-${item.title}`} className="grid gap-3 rounded-md border border-charcoal/10 bg-white/82 p-4 shadow-sm sm:grid-cols-[5rem_1fr]">
          <div className="font-display text-2xl font-bold text-crimson">{item.year}</div>
          <div>
            <h3 className="font-display text-xl font-bold">{item.title}</h3>
            <p className="mt-1 text-sm leading-6 text-charcoal/70">{item.body}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function FeatureBanner({
  title,
  children,
  buttonLabel,
  onClick,
}: {
  title: string;
  children: ReactNode;
  buttonLabel: string;
  onClick: () => void;
}) {
  return (
    <section className="rounded-md border border-charcoal/10 bg-charcoal p-6 text-cream shadow-exhibit">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-gold">Featured Path</p>
      <h2 className="mt-2 font-display text-3xl font-bold">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-cream/76">{children}</p>
      <PrimaryButton className="mt-5" variant="secondary" onClick={onClick}>
        {buttonLabel}
      </PrimaryButton>
    </section>
  );
}

export function GalleryPlaque({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <aside className="mb-5 rounded-md border-l-4 border-gold bg-white/72 px-4 py-3">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-brass">{eyebrow}</p>
      <h2 className="mt-1 font-display text-2xl font-bold text-charcoal">{title}</h2>
      <p className="mt-1 max-w-4xl text-sm leading-6 text-charcoal/68">{children}</p>
    </aside>
  );
}


export function HistoricalNotesPanel({
  title = 'Key Changes',
  notes,
  compact = false,
}: {
  title?: string;
  notes?: string[];
  compact?: boolean;
}) {
  if (!notes?.length) {
    return (
      <section className="rounded-md border border-charcoal/10 bg-white/72 p-4">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-brass">
          <ListChecks className="h-4 w-4" aria-hidden="true" /> {title}
        </p>
        <p className="mt-2 text-sm leading-6 text-charcoal/64">Historical notes are being curated for this view.</p>
      </section>
    );
  }

  return (
    <details className={`group rounded-md border border-charcoal/10 bg-white/76 ${compact ? 'p-3' : 'p-4'}`} open={!compact}>
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.16em] text-brass focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-crimson/15">
        <span className="flex items-center gap-2"><ListChecks className="h-4 w-4" aria-hidden="true" /> {title}</span>
        <ChevronDown className="h-4 w-4 transition group-open:rotate-180" aria-hidden="true" />
      </summary>
      <ul className="mt-2 grid gap-1.5 border-t border-charcoal/10 pt-3">
        {notes.map((note) => (
          <li key={note} className="grid grid-cols-[0.45rem_1fr] gap-2 text-sm leading-6 text-charcoal/70">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-crimson" aria-hidden="true" />
            <span>{note}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function ReflectionPrompt({ question }: { question: string }) {
  return (
    <aside className="mt-5 rounded-md border border-charcoal/10 bg-cream/70 p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-brass">Reflection Prompt</p>
      <p className="mt-2 font-editorial text-2xl font-bold leading-tight text-charcoal">{question}</p>
    </aside>
  );
}

export function ArtifactCard({ artifact, onOpen }: { artifact: MuseumArtifact; onOpen: (artifact: MuseumArtifact) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(artifact)}
      className="group relative overflow-hidden rounded-md border border-charcoal/10 bg-white/86 p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-crimson/35 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-crimson/15"
    >
      <span className="absolute inset-x-0 top-0 h-1 bg-gold" />
      <FileText className="mb-4 h-8 w-8 text-crimson transition group-hover:scale-110" aria-hidden="true" />
      <p className="text-xs font-black uppercase tracking-[0.18em] text-brass">{artifact.category} | {artifact.era}</p>
      <h3 className="mt-2 font-display text-2xl font-bold leading-tight text-charcoal">{artifact.title}</h3>
      <p className="mt-2 text-sm leading-6 text-charcoal/68">{artifact.summary}</p>
    </button>
  );
}

export function ArtifactViewerModal({
  artifact,
  onClose,
  onNavigate,
}: {
  artifact: MuseumArtifact | null;
  onClose: () => void;
  onNavigate: (screen: Screen, targetId?: string) => void;
}) {
  useEffect(() => {
    if (!artifact) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [artifact, onClose]);

  if (!artifact) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${artifact.title} artifact`}
      onClick={onClose}
    >
      <article className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-md border border-gold/40 bg-cream shadow-exhibit" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 border-b border-charcoal/10 bg-charcoal p-5 text-cream">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-gold">{artifact.category} | {artifact.era}</p>
            <h2 className="mt-2 font-display text-4xl font-bold leading-tight">{artifact.title}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-md border border-white/15 p-2 text-cream transition hover:bg-white/10" aria-label="Close artifact viewer">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="grid gap-4 p-5">
          <StoryBlock title="Context">{artifact.context}</StoryBlock>
          <StoryBlock title="Significance">{artifact.significance}</StoryBlock>
          <RelatedLinks links={artifact.relatedLinks} onNavigate={(screen, targetId) => {
            onClose();
            onNavigate(screen, targetId);
          }} />
        </div>
      </article>
    </div>
  );
}

export function SignatureMomentCard({ moment, onNavigate }: { moment: SignatureMoment; onNavigate: (screen: Screen, targetId?: string) => void }) {
  return (
    <article className="rounded-md border border-charcoal/10 bg-charcoal p-5 text-cream shadow-exhibit">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-gold">{moment.era}</p>
      <h3 className="mt-2 font-display text-3xl font-bold">{moment.title}</h3>
      <p className="mt-3 text-sm leading-6 text-cream/76">{moment.narrative}</p>
      <p className="mt-4 rounded-md border border-white/10 bg-white/10 p-3 text-sm font-semibold leading-6 text-cream/82">{moment.takeaway}</p>
      <RelatedLinks links={moment.relatedLinks} onNavigate={onNavigate} />
    </article>
  );
}

export function ComparePanel({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; stats: Array<{ label: string; value: string }>; summary: string }>;
}) {
  return (
    <section className="mt-5 rounded-md border border-charcoal/10 bg-white/82 p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-brass">Comparison Tool</p>
      <h2 className="mt-1 font-display text-3xl font-bold">{title}</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.label} className="rounded-md border border-charcoal/10 bg-cream/85 p-4">
            <h3 className="font-display text-2xl font-bold">{item.label}</h3>
            <p className="mt-2 text-sm leading-6 text-charcoal/70">{item.summary}</p>
            <div className="mt-3 grid gap-2">
              {item.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1 border-t border-charcoal/10 pt-2 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                  <span className="font-bold text-charcoal/56">{stat.label}</span>
                  <span className="font-black text-charcoal">{stat.value}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function StoryBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-md border border-charcoal/10 bg-white/80 p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-brass">{title}</p>
      <p className="mt-2 text-sm leading-6 text-charcoal/74">{children}</p>
    </section>
  );
}
