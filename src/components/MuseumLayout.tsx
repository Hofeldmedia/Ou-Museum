import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Screen } from '../types';
import type { MuseumMode } from '../types/content';
import { OU_LOGO } from '../data/conferenceLogos';
import { ConferenceLogo } from './ui/ConferenceLogo';
import { BrandLogo } from './BrandLogo';
import { PrimaryButton } from './PrimaryButton';
import { Volume2, VolumeX } from 'lucide-react';

type MuseumLayoutProps = {
  children: ReactNode;
  theme?: 'light' | 'dark';
};

export function MuseumLayout({ children, theme = 'light' }: MuseumLayoutProps) {
  return (
    <main className={`min-h-screen overflow-x-hidden text-charcoal ${theme === 'dark' ? 'bg-charcoal' : 'museum-texture'}`}>
      <div className="mx-auto flex min-h-screen w-full max-w-[1200px] flex-col px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        {children}
        <footer className="mt-8 border-t border-charcoal/10 py-5 text-center text-xs font-bold uppercase tracking-[0.16em] text-charcoal/48">
          Created by Hofeld Media, LLC
        </footer>
      </div>
    </main>
  );
}

export function ExhibitContainer({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return <div className={`mx-auto w-full ${wide ? 'max-w-[1200px]' : 'max-w-6xl'} px-0 sm:px-0`}>{children}</div>;
}

export function PageTransition({ children, transitionKey }: { children: ReactNode; transitionKey: string }) {
  return (
    <div key={transitionKey} className="flex flex-1 flex-col animate-[pageRise_0.42s_ease-out]">
      {children}
    </div>
  );
}

export function SectionNav({
  sections,
  current,
  onNavigate,
  isLocked,
}: {
  sections: Array<{ screen: Screen; label: string }>;
  current: Screen;
  onNavigate: (screen: Screen) => void;
  isLocked: (screen: Screen) => boolean;
}) {
  return (
    <nav aria-label="Museum galleries" className="mt-3 hidden gap-2 overflow-x-auto border-t border-charcoal/10 pt-3 md:flex">
      {sections.map((section) => (
        <button
          key={section.screen}
          type="button"
          onClick={() => onNavigate(section.screen)}
          disabled={isLocked(section.screen)}
          className={`shrink-0 rounded-md border px-3 py-2 text-xs font-black uppercase tracking-[0.14em] transition disabled:cursor-not-allowed disabled:opacity-45 ${
            current === section.screen
              ? 'border-charcoal bg-charcoal text-cream'
              : isLocked(section.screen)
                ? 'border-charcoal/8 bg-white/45 text-charcoal/40'
                : 'border-charcoal/10 bg-white/70 text-charcoal/62 hover:border-crimson/30 hover:bg-cream hover:text-charcoal'
          }`}
        >
          {section.label}
        </button>
      ))}
    </nav>
  );
}

export function HeroLanding({
  museumMode,
  audioEnabled,
  onBeginTour,
  onExploreFreely,
  onStartExploring,
  onOpenTimeline,
  onOpenNfl,
  onOpenConferenceGallery,
  onOpenChampionships,
  onToggleAudio,
}: {
  museumMode: MuseumMode;
  audioEnabled: boolean;
  onBeginTour: () => void;
  onExploreFreely: () => void;
  onStartExploring: () => void;
  onOpenTimeline: () => void;
  onOpenNfl: () => void;
  onOpenConferenceGallery: () => void;
  onOpenChampionships: () => void;
  onToggleAudio: () => void;
}) {
  return (
    <section className="relative -mx-4 -mt-4 flex min-h-screen items-center overflow-hidden px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="absolute inset-0 bg-charcoal" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.16),transparent_22%),radial-gradient(circle_at_78%_68%,rgba(132,22,23,0.38),transparent_34%),linear-gradient(115deg,rgba(0,0,0,0.96),rgba(50,50,50,0.74))]" />
      <div className="stadium-lights absolute inset-0 opacity-75" />
      <div className="field-lines absolute inset-0 opacity-25" />
      <div className="film-grain absolute inset-0 opacity-35" />
      <ExhibitContainer wide>
        <div className="relative grid min-h-[82vh] items-center">
          <div className="max-w-5xl text-cream animate-[heroTextIn_0.9s_ease-out]">
            <p className="mb-5 inline-flex rounded-sm bg-gold px-3 py-1 text-xs font-black uppercase tracking-[0.24em] text-charcoal">
              Oklahoma Interactive Museum
            </p>
            <h1 className="font-display text-[clamp(2.65rem,13vw,5rem)] font-bold leading-[0.98] sm:text-[clamp(3.5rem,8vw,5.5rem)]">
              Explore the Evolution of College Football
            </h1>
            <p className="mt-6 max-w-3xl text-[clamp(1rem,2.5vw,1.25rem)] leading-7 text-cream/78 sm:leading-8">
              Follow conference realignment, school locations, and historical map changes through Oklahoma’s journey from regional power to SEC-era contender.
            </p>
            <p className="mt-5 font-accent text-lg leading-none text-white/70 sm:text-xl">
              Maps, rivalries, titles, and the road ahead.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <PrimaryButton className="w-full sm:w-auto" onClick={onStartExploring} aria-label="Start with the 2026 map">Start with 2026 Map</PrimaryButton>
              <PrimaryButton className="w-full sm:w-auto" variant="secondary" onClick={onBeginTour}>Guided Intro</PrimaryButton>
              <PrimaryButton className="w-full border border-white/15 text-cream hover:bg-white/10 hover:text-white sm:w-auto" variant="ghost" onClick={onExploreFreely}>Museum Hub</PrimaryButton>
              <button
                type="button"
                onClick={onToggleAudio}
                aria-pressed={audioEnabled}
                aria-label={audioEnabled ? 'Mute museum audio' : 'Enable subtle museum audio'}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] text-cream transition hover:bg-white/18 sm:w-auto"
              >
                {audioEnabled ? <Volume2 className="h-4 w-4" aria-hidden="true" /> : <VolumeX className="h-4 w-4" aria-hidden="true" />}
                {audioEnabled ? 'Audio On' : 'Audio Off'}
              </button>
            </div>
            <nav className="mt-6 flex flex-wrap gap-2" aria-label="Featured museum sections">
              {[
                ['Timeline View', onOpenTimeline],
                ['From Norman to the NFL', onOpenNfl],
                ['Conference Gallery', onOpenConferenceGallery],
                ['National Championships', onOpenChampionships],
              ].map(([label, handler]) => (
                <button
                  key={label as string}
                  type="button"
                  onClick={handler as () => void}
                  className="min-h-11 rounded-md border border-white/14 bg-white/8 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-cream/78 transition hover:border-gold/45 hover:bg-white/14 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/20"
                >
                  {label as string}
                </button>
              ))}
            </nav>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-cream/50">
              A digital interactive experience | {museumMode === 'guided' ? 'Guided Tour selected' : 'Free Explore selected'}
            </p>
          </div>
        </div>
      </ExhibitContainer>
    </section>
  );
}

function IntroLogoBadge({
  src,
  alt,
  fallback,
}: {
  src: string;
  alt: string;
  fallback: string;
}) {
  const [failed, setFailed] = useState(false);

  const handleError = () => {
    if (import.meta.env.DEV) {
      console.warn(`[IntroSequence] Missing intro logo asset: ${src}`);
    }
    setFailed(true);
  };

  if (failed) {
    return (
      <div className="flex h-24 w-28 items-center justify-center rounded-md border border-white/10 bg-white/92 px-3 text-center text-[11px] font-black uppercase tracking-[0.12em] text-charcoal shadow-[0_16px_36px_rgba(0,0,0,0.35)] sm:h-28 sm:w-32">
        {fallback}
      </div>
    );
  }

  return (
    <div className="flex h-24 w-28 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-white/95 px-3 shadow-[0_16px_36px_rgba(0,0,0,0.35)] sm:h-28 sm:w-32">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={handleError}
        className="h-full w-full object-contain py-2"
      />
    </div>
  );
}

function TypewriterLine({
  text,
  active,
  speed = 65,
  startDelay = 0,
}: {
  text: string;
  active: boolean;
  speed?: number;
  startDelay?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }

    setCount(0);
    let interval: number | null = null;
    const startTyping = window.setTimeout(() => {
      interval = window.setInterval(() => {
        setCount((current) => {
          if (current >= text.length) {
            if (interval != null) window.clearInterval(interval);
            return current;
          }
          return current + 1;
        });
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(startTyping);
      if (interval != null) window.clearInterval(interval);
    };
  }, [active, speed, startDelay, text]);

  const done = count >= text.length;

  return (
    <div className="min-h-[3.75rem] sm:min-h-[4.5rem]">
      <p aria-label={text} className="font-display text-[clamp(2rem,10vw,3rem)] font-bold leading-tight">
        <span aria-hidden="true">{text.slice(0, count)}</span>
        {!done && <span aria-hidden="true" className="ml-1 inline-block h-[1em] w-[0.08em] animate-pulse bg-cream align-[-0.1em]" />}
      </p>
    </div>
  );
}

export function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const sequence = [
    { kind: 'text' as const, line: 'Every program has a history.', duration: 3600 },
    { kind: 'text' as const, line: 'Few have a legacy.', duration: 3600 },
    { kind: 'text' as const, line: "There's only one Oklahoma.", duration: 3800 },
    {
      kind: 'logos' as const,
      pair: { leftLabel: 'Oklahoma', rightLabel: 'Big Eight', snapshotId: 'big-eight' },
      duration: 3600,
    },
    {
      kind: 'logos' as const,
      pair: { leftLabel: 'Oklahoma', rightLabel: 'Old Big 12', snapshotId: 'big-12-original' },
      duration: 3600,
    },
    {
      kind: 'logos' as const,
      pair: { leftLabel: 'Oklahoma', rightLabel: 'New Big 12', snapshotId: 'big-12-current' },
      duration: 3600,
    },
    {
      kind: 'logos' as const,
      pair: { leftLabel: 'Oklahoma', rightLabel: 'SEC', snapshotId: 'sec-current' },
      duration: 3600,
    },
    {
      kind: 'finalLogo' as const,
      duration: 1800,
    },
    {
      kind: 'typewriter' as const,
      line: '7 National Titles. 7 Heismans.',
      duration: 4800,
    },
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const transitionMs = 760;
  const activeFrame = sequence[activeIndex];

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    completedRef.current = false;
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (activeIndex < sequence.length - 1) {
        setPreviousIndex(activeIndex);
        setActiveIndex((index) => index + 1);
        return;
      }

      if (!completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current();
      }
    }, activeFrame.duration);

    return () => window.clearTimeout(timeout);
  }, [activeFrame.duration, activeIndex, sequence.length]);

  useEffect(() => {
    if (previousIndex == null) return;
    const timeout = window.setTimeout(() => setPreviousIndex(null), transitionMs);
    return () => window.clearTimeout(timeout);
  }, [previousIndex, transitionMs]);

  const skipIntro = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current();
  };

  return (
    <section className="relative -mx-4 -mt-4 flex min-h-screen items-center justify-center overflow-hidden bg-charcoal px-4 text-center text-cream sm:-mx-6 lg:-mx-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(190,180,165,0.18),transparent_28%),linear-gradient(135deg,rgba(132,22,23,0.3),transparent_48%)]" />
      <div className="film-grain absolute inset-0 opacity-30" />
      <button
        type="button"
        onClick={skipIntro}
        className="absolute right-4 top-4 z-10 min-h-[44px] rounded-md border border-white/15 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-cream transition hover:bg-white/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 sm:right-5 sm:top-5"
      >
        Skip Intro
      </button>
      <div className="relative h-[18rem] w-full max-w-5xl sm:h-[20rem]">
        {previousIndex != null && (
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center animate-[introCrossfadeOut_0.76s_cubic-bezier(0.22,1,0.36,1)_both]"
          >
            <IntroFrameContent frame={sequence[previousIndex]} />
          </div>
        )}
        <div
          key={activeIndex}
          className="absolute inset-0 flex items-center justify-center animate-[introCrossfadeIn_0.76s_cubic-bezier(0.22,1,0.36,1)_both]"
        >
          <IntroFrameContent frame={activeFrame} />
        </div>
      </div>
    </section>
  );
}

function IntroFrameContent({
  frame,
}: {
  frame:
    | { kind: 'text'; line: string; duration: number }
    | { kind: 'logos'; pair: { leftLabel: string; rightLabel: string; snapshotId: string }; duration: number }
    | { kind: 'finalLogo'; duration: number }
    | { kind: 'typewriter'; line: string; duration: number };
}) {
  if (frame.kind === 'text') {
    return (
      <h1 className="max-w-4xl px-2 font-display text-[clamp(2.25rem,12vw,4rem)] font-bold leading-tight text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.45)]">
        {frame.line}
      </h1>
    );
  }

  if (frame.kind === 'logos') {
    return (
      <div className="flex flex-col items-center gap-8">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          <IntroLogoBadge src={OU_LOGO} alt="Oklahoma Sooners logo" fallback="OU" />
          <div aria-hidden="true" className="h-16 w-px bg-white/60 sm:h-20" />
          <ConferenceLogo snapshotId={frame.pair.snapshotId} alt={`${frame.pair.rightLabel} logo`} size="intro" fallbackLabel={frame.pair.rightLabel} className="border-white/10 bg-white/95 text-charcoal shadow-[0_16px_36px_rgba(0,0,0,0.35)]" imageClassName="py-2" />
        </div>
        <p className="font-accent text-sm uppercase tracking-[0.22em] text-cream/72 sm:text-base">
          {frame.pair.leftLabel} and {frame.pair.rightLabel}
        </p>
      </div>
    );
  }

  if (frame.kind === 'finalLogo') {
    return (
      <div className="flex flex-col items-center gap-6">
        <IntroLogoBadge src={OU_LOGO} alt="Oklahoma Sooners logo" fallback="OU" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <IntroLogoBadge src={OU_LOGO} alt="Oklahoma Sooners logo" fallback="OU" />
      <TypewriterLine text={frame.line} active speed={60} startDelay={800} />
    </div>
  );
}
