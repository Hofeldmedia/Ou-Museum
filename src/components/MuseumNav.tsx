import { BookOpenCheck, Map, Volume2, VolumeX } from 'lucide-react';
import { siteSections } from '../data/siteSections';
import type { Screen } from '../types';
import type { MuseumMode } from '../types/content';
import { getOUOriginLogo } from '../utils/getNFLLogo';
import { BrandLogo } from './BrandLogo';
import { SectionNav } from './MuseumLayout';

const sections = siteSections
  .slice()
  .sort((a, b) => a.order - b.order)
  .map((section) => ({ screen: section.id as Screen, label: section.label }))
  .concat([{ screen: 'summary' as Screen, label: 'Summary' }]);

type MuseumNavProps = {
  current: Screen;
  onNavigate: (screen: Screen) => void;
  mapComplete: boolean;
  timelineSolved: boolean;
  matchComplete: boolean;
  museumMode: MuseumMode;
  audioEnabled: boolean;
  onToggleAudio: () => void;
};

export function MuseumNav({ current, onNavigate, mapComplete, timelineSolved, matchComplete, museumMode, audioEnabled, onToggleAudio }: MuseumNavProps) {
  if (current === 'home' || current === 'intro') return null;
  const selectValue = sections.some((section) => section.screen === current) ? current : ('quizzes' as Screen);

  const isLocked = (screen: Screen) => {
    if (museumMode === 'free') return false;
    if (screen === 'timeline') return !mapComplete;
    if (screen === 'connections') return !mapComplete || !timelineSolved;
    if (screen === 'summary') return !matchComplete;
    return false;
  };

  const nextStepLabel =
    museumMode === 'free'
      ? 'Free Explore active'
      : !mapComplete
        ? 'Next: finish Conference Gallery'
        : !timelineSolved
          ? 'Next: solve the timeline'
          : !matchComplete
            ? 'Next: complete the connections activity'
            : 'Capstone unlocked';

  return (
    <header className="sticky top-3 z-40 mb-5 rounded-md border border-charcoal/10 bg-white/86 p-3 shadow-exhibit backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onNavigate('hub')}
          className="flex items-center gap-3 rounded-md px-2 py-2 text-left transition hover:bg-charcoal/5"
        >
          <BrandLogo
            src={getOUOriginLogo()}
            alt="Oklahoma Sooners logo"
            fallback="OU"
            className="h-10 w-10"
            imageClassName="p-1"
          />
          <span>
            <span className="block font-display text-xl font-bold leading-none">OU Football Museum</span>
            <span className="text-xs font-black uppercase tracking-[0.16em] text-brass">{museumMode === 'guided' ? 'Guided tour' : 'Free explore'}</span>
          </span>
        </button>
        <div className="hidden rounded-sm bg-charcoal px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-cream lg:block">
          {nextStepLabel}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleAudio}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-charcoal/15 bg-white text-charcoal transition hover:bg-cream"
            aria-label={audioEnabled ? 'Mute museum audio' : 'Enable subtle museum audio'}
            aria-pressed={audioEnabled}
          >
            {audioEnabled ? <Volume2 className="h-5 w-5" aria-hidden="true" /> : <VolumeX className="h-5 w-5" aria-hidden="true" />}
          </button>
          <Map className="hidden h-4 w-4 text-charcoal/45 sm:block" aria-hidden="true" />
          <select
            aria-label="Jump to museum section"
            value={selectValue}
            onChange={(event) => onNavigate(event.target.value as Screen)}
            className="rounded-md border border-charcoal/15 bg-cream px-3 py-2 text-sm font-bold text-charcoal"
          >
            {sections.map((section) => (
              <option key={section.screen} value={section.screen} disabled={isLocked(section.screen)}>
                {isLocked(section.screen) ? `${section.label} - locked` : section.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => onNavigate('summary')}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-charcoal/15 bg-white text-charcoal transition hover:bg-cream disabled:cursor-not-allowed disabled:opacity-45"
            aria-label={!isLocked('summary') ? 'Open completion summary' : 'Completion summary locked until assessments are complete'}
            disabled={isLocked('summary')}
          >
            <BookOpenCheck className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <SectionNav sections={sections.slice(1, 12)} current={selectValue} onNavigate={onNavigate} isLocked={isLocked} />
    </header>
  );
}
