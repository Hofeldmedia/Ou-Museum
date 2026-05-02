import type { LucideIcon } from 'lucide-react';
import { ChevronDown, Lock, Trophy } from 'lucide-react';
import { artifacts } from '../../data/immersive';
import { siteSections } from '../../data/siteSections';
import type { Screen } from '../../types';
import type { MuseumArtifact, MuseumMode } from '../../types/content';
import { ArtifactCard, CollectionGrid, SectionHero } from '../MuseumComponents';

type SectionHubProps = {
  onNavigate: (screen: Screen) => void;
  mapComplete: boolean;
  timelineSolved: boolean;
  museumMode: MuseumMode;
  onOpenArtifact: (artifact: MuseumArtifact) => void;
  sectionIcons: Partial<Record<Screen, LucideIcon>>;
};

export function SectionHub({ onNavigate, mapComplete, timelineSolved, museumMode, onOpenArtifact, sectionIcons }: SectionHubProps) {
  const featuredSections = siteSections.filter((section) => section.featured || section.id === 'timeline').sort((a, b) => a.order - b.order);

  return (
    <section>
      <SectionHero eyebrow="Museum Hub" title="Choose an Exhibit">
        Move through OU football history as a digital museum. Explore freely, then enter the assessment path when ready.
      </SectionHero>
      <div className="mb-5 rounded-md border border-charcoal/10 bg-white/72 px-4 py-3 text-sm font-semibold text-charcoal/68">
        {museumMode === 'guided' ? 'Guided mode: start with Conference Gallery, then continue through the unlocked path.' : 'Free explore: choose any exhibit below.'}
      </div>
      <CollectionGrid>
        {featuredSections.map((section) => {
          const screenId = section.id as Screen;
          const Icon = sectionIcons[screenId] ?? Trophy;
          const locked = museumMode === 'guided' && ((screenId === 'timeline' && !mapComplete) || (screenId === 'connections' && !timelineSolved));

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onNavigate(screenId)}
              disabled={locked}
              aria-disabled={locked}
              className={`group relative overflow-hidden rounded-md border p-5 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-crimson/15 ${locked ? 'cursor-not-allowed border-charcoal/10 bg-white/50 text-charcoal/45' : 'border-charcoal/10 bg-white/86 text-charcoal hover:-translate-y-0.5 hover:border-crimson/35 hover:bg-white'}`}
            >
              <span className={`absolute inset-x-0 top-0 h-1 ${locked ? 'bg-charcoal/15' : 'bg-crimson/85 transition group-hover:bg-gold'}`} />
              <span className={`mb-4 flex h-11 w-11 items-center justify-center rounded-md ${locked ? 'bg-charcoal/10 text-charcoal/35' : 'bg-charcoal text-gold group-hover:bg-crimson group-hover:text-white'}` }>
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-charcoal/45">
                {locked ? 'Locked in guided mode' : 'Open exhibit'}
              </p>
              <h2 className="font-display text-3xl font-bold">{section.title}</h2>
              <p className="mt-2 text-sm leading-6 text-charcoal/68">{section.description}</p>
              {locked && (
                <span className="mt-4 inline-flex items-center gap-2 rounded-sm bg-charcoal px-2.5 py-1 text-xs font-black uppercase tracking-[0.12em] text-cream">
                  <Lock className="h-3.5 w-3.5" aria-hidden="true" /> Explore map first
                </span>
              )}
              {!locked && <span className="mt-4 inline-flex min-h-11 items-center rounded-md bg-charcoal px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-cream transition group-hover:bg-crimson">Enter exhibit</span>}
            </button>
          );
        })}
      </CollectionGrid>
      <details className="mt-6 rounded-md border border-charcoal/10 bg-white/72 p-4">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-black uppercase tracking-[0.14em] text-charcoal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-crimson/15">
          Artifact case
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </summary>
        <p className="mt-2 max-w-3xl border-t border-charcoal/10 pt-3 text-sm leading-6 text-charcoal/62">Open an artifact to see the story behind a ticket, headline, playbook sheet, or signature moment.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {artifacts.map((artifact) => <ArtifactCard key={artifact.id} artifact={artifact} onOpen={onOpenArtifact} />)}
        </div>
      </details>
    </section>
  );
}
