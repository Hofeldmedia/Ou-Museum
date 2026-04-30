import type { LucideIcon } from 'lucide-react';
import { Lock, Trophy } from 'lucide-react';
import { artifacts } from '../../data/immersive';
import { siteSections } from '../../data/siteSections';
import type { Screen } from '../../types';
import type { MuseumArtifact, MuseumMode } from '../../types/content';
import { ArtifactCard, CollectionGrid, GalleryPlaque, SectionHero } from '../MuseumComponents';

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
      <GalleryPlaque eyebrow="Museum Structure" title={museumMode === 'guided' ? 'Guided sequence active' : 'Free exploration active'}>
        Galleries are arranged as Conference Gallery, Championship Hall, Heisman Room, Coaches Wing, NFL Pipeline Exhibit, Featured Exhibits, and Rivalry Gallery.
      </GalleryPlaque>
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
              className="group relative overflow-hidden rounded-md border border-charcoal/10 bg-white/84 p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-charcoal/20 hover:shadow-exhibit focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-crimson/15"
            >
              <span className="absolute inset-x-0 top-0 h-1 bg-crimson/85 transition group-hover:bg-gold" />
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-charcoal text-gold group-hover:bg-crimson group-hover:text-white">
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
              {!locked && <span className="mt-4 inline-flex text-xs font-black uppercase tracking-[0.14em] text-crimson">Enter exhibit</span>}
            </button>
          );
        })}
      </CollectionGrid>
      <section className="mt-6">
        <GalleryPlaque eyebrow="Artifact Case" title="Objects that turn history into memory">
          Open an artifact to see the story behind a ticket, headline, playbook sheet, or signature moment.
        </GalleryPlaque>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {artifacts.map((artifact) => <ArtifactCard key={artifact.id} artifact={artifact} onOpen={onOpenArtifact} />)}
        </div>
      </section>
    </section>
  );
}
