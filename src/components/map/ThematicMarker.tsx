import { useState, type CSSProperties } from 'react';

type ThematicMarkerProps = {
  x: number;
  y: number;
  label: string;
  selected: boolean;
  tone: 'anchor' | 'heisman' | 'nfl' | 'rivalry' | 'championship' | 'recruiting';
  badge?: string;
  imageUrl?: string | null;
  imageAlt?: string;
  fallbackText?: string;
  muted?: boolean;
  alwaysShowLabel?: boolean;
  labelClassName?: string;
  markerClassName?: string;
  markerStyle?: CSSProperties;
  badgeClassName?: string;
  imageClassName?: string;
  onSelect: () => void;
};

const toneClasses: Record<ThematicMarkerProps['tone'], string> = {
  anchor: 'bg-crimson text-white border-white shadow-[0_0_20px_rgba(132,22,23,0.42)]',
  heisman: 'bg-gold text-charcoal border-white shadow-[0_0_18px_rgba(199,163,90,0.35)]',
  nfl: 'bg-sky text-charcoal border-white shadow-[0_0_18px_rgba(74,127,153,0.28)]',
  rivalry: 'bg-charcoal text-cream border-white shadow-[0_0_18px_rgba(132,22,23,0.32)]',
  championship: 'bg-gold text-charcoal border-white shadow-[0_0_22px_rgba(199,163,90,0.42)]',
  recruiting: 'bg-crimson/85 text-white border-white shadow-[0_0_20px_rgba(132,22,23,0.28)]',
};

export function ThematicMarker({
  x,
  y,
  label,
  selected,
  tone,
  badge,
  imageUrl,
  imageAlt,
  fallbackText,
  muted = false,
  alwaysShowLabel = false,
  labelClassName,
  markerClassName,
  markerStyle,
  badgeClassName,
  imageClassName,
  onSelect,
}: ThematicMarkerProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const baseLabelClass =
    'pointer-events-none hidden max-w-32 rounded-sm px-2 py-1 text-center text-[11px] font-black uppercase tracking-[0.08em] shadow-[0_2px_10px_rgba(0,0,0,0.28)] transition md:block';

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={selected}
      onClick={onSelect}
      className={`group absolute flex min-h-[4.25rem] min-w-[4.25rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-2 transition duration-300 focus:z-50 focus-visible:outline-none ${
        selected ? 'z-40 scale-110' : 'z-20 hover:z-30 hover:scale-105'
      } ${muted ? 'opacity-55' : 'opacity-100'}
      } ${markerClassName ?? ''}`}
      style={{ left: `${x}%`, top: `${y}%`, minWidth: 'var(--map-touch-size, 4.25rem)', minHeight: 'var(--map-touch-size, 4.25rem)', ...markerStyle }}
    >
      <span className="absolute inset-0 rounded-full bg-transparent" aria-hidden="true" />
      <span
        style={{ width: 'var(--map-marker-size, 2.5rem)', height: 'var(--map-marker-size, 2.5rem)' }}
        className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 text-[11px] font-black uppercase transition sm:h-9 sm:w-9 md:h-10 md:w-10 ${
          toneClasses[tone]
        } ${
          selected
            ? tone === 'heisman'
              ? 'scale-110 ring-4 ring-gold/35 shadow-[0_0_28px_rgba(199,163,90,0.7)]'
              : 'ring-4 ring-crimson/20'
            : tone === 'heisman'
              ? 'shadow-[0_0_16px_rgba(199,163,90,0.3)]'
              : ''
        } ${muted && !selected ? 'saturate-[0.85]' : ''} ${badgeClassName ?? ''}`}
      >
        {imageUrl && !imageFailed ? (
          <img
            src={imageUrl}
            alt={imageAlt ?? `${label} logo`}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className={`h-[70%] w-[70%] object-contain ${imageClassName ?? ''}`}
          />
        ) : (
          fallbackText ?? badge ?? label.slice(0, 2)
        )}
      </span>
      <span
        className={`${baseLabelClass} ${
          selected || alwaysShowLabel
            ? 'bg-charcoal/92 text-white opacity-100'
            : 'bg-charcoal/84 text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
        } ${tone === 'heisman' ? 'border border-gold/55 [text-shadow:0_1px_1px_rgba(0,0,0,0.55)]' : ''} ${labelClassName ?? ''}`}
      >
        {label}
      </span>
    </button>
  );
}
