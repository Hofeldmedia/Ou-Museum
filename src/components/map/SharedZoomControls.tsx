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
    'flex h-10 w-10 items-center justify-center rounded-md border border-charcoal/15 bg-white/88 text-charcoal shadow-sm transition hover:bg-white';

  return (
    <div className="absolute right-4 top-4 z-20 flex flex-col gap-2">
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
