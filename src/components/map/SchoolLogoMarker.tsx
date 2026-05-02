import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import type { ConferenceSchool } from '../../types/content';

type SchoolLogoMarkerProps = {
  school: ConferenceSchool;
  eraName: string;
  selected: boolean;
  explored: boolean;
  newlyAdded?: boolean;
  x: number;
  y: number;
  onSelect: () => void;
};

export function SchoolLogoMarker({ school, eraName, selected, explored, newlyAdded = false, x, y, onSelect }: SchoolLogoMarkerProps) {
  const [fallbackFailed, setFallbackFailed] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const logoSrc = useFallback ? school.logo.dark : school.logo.light;
  const showImage = Boolean(logoSrc) && !fallbackFailed;

  return (
    <button
      type="button"
      aria-label={`Explore ${school.name} in the ${eraName}`}
      aria-pressed={selected}
      title={`${school.name} in the ${eraName}${explored ? ' - explored' : ''}`}
      onClick={onSelect}
      className={`group absolute flex min-h-16 min-w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-full p-2 transition duration-300 hover:z-30 hover:scale-110 focus:z-50 focus-visible:outline-none ${
        selected
          ? 'z-40 animate-[selectNode_0.45s_ease-out]'
          : school.isOU
            ? 'z-30'
            : 'z-20'
      }`}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <span className="absolute inset-0 rounded-full bg-transparent" aria-hidden="true" />
      <span
        className={`relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border bg-[#edf1f4] shadow-lg transition sm:h-10 sm:w-10 md:h-11 md:w-11 ${
          selected
            ? 'scale-110 border-[3px] border-gold shadow-[0_0_34px_rgba(132,22,23,0.55)] ring-4 ring-crimson/35'
            : newlyAdded
              ? 'border-2 border-sky shadow-[0_0_14px_rgba(188,220,235,0.38)]'
            : explored
              ? 'border-2 border-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.32)] ring-2 ring-emerald-500/25'
              : school.isOU
                ? 'border-2 border-white shadow-[0_0_26px_rgba(132,22,23,0.55)] ring-4 ring-crimson/45'
                : 'border-2 border-white/70'
        }`}
      >
        {showImage ? (
          <span className="relative z-10 flex h-[78%] w-[78%] items-center justify-center rounded-full bg-charcoal/10 p-[2px]">
            <img
              src={logoSrc}
              alt={school.logo.alt}
              className="h-full w-full object-contain drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]"
              onError={() => {
                if (!useFallback && school.logo.dark) {
                  setUseFallback(true);
                  return;
                }
                setFallbackFailed(true);
              }}
              loading="lazy"
            />
          </span>
        ) : (
          <span className={`flex h-full w-full items-center justify-center px-1 text-center text-[10px] font-black leading-none ${school.isOU ? 'bg-crimson text-white' : 'bg-charcoal text-gold'}`}>
            {school.shortName}
          </span>
        )}
        {explored && (
          <span className="absolute -right-0.5 -top-0.5 rounded-full border border-white bg-emerald-600 p-0.5 text-white">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        )}
      </span>
      <span className={`pointer-events-none hidden max-w-24 rounded-sm px-1.5 py-0.5 text-center text-[10px] font-black uppercase tracking-[0.08em] opacity-0 shadow transition group-hover:opacity-100 group-focus-visible:opacity-100 md:block ${selected ? 'bg-crimson text-white opacity-100' : 'bg-black/70 text-cream'}`}>
        {school.shortName}
      </span>
    </button>
  );
}
