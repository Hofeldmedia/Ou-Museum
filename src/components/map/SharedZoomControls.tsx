import { Minus, Move, Plus, Target } from 'lucide-react';

export function SharedZoomControls({
  onZoomIn,
  onZoomOut,
  onFocus,
  onReset,
  focusLabel,
  focusDisabled = false,
}: {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFocus: () => void;
  onReset: () => void;
  focusLabel: string;
  focusDisabled?: boolean;
}) {
  const buttonClass =
    'flex h-11 w-11 items-center justify-center rounded-md border border-charcoal/15 bg-white/90 text-charcoal shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-crimson/20';

  return (
    <div className="absolute right-3 top-3 z-20 flex flex-col gap-2 sm:right-4 sm:top-4">
      <button type="button" onClick={onZoomIn} className={buttonClass} aria-label="Zoom in on map">
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
      <button type="button" onClick={onZoomOut} className={buttonClass} aria-label="Zoom out on map">
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onFocus}
        className={`${buttonClass} disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-white/88`}
        aria-label={focusLabel}
        disabled={focusDisabled}
      >
        <Target className="h-4 w-4" aria-hidden="true" />
      </button>
      <button type="button" onClick={onReset} className={buttonClass} aria-label="Reset map zoom and pan">
        <Move className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
