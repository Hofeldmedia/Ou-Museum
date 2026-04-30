import { CheckCircle2 } from 'lucide-react';
import type { Screen } from '../types';

const steps: Array<{ id: Screen; label: string }> = [
  { id: 'map', label: 'Explore' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'connections', label: 'Connections' },
  { id: 'summary', label: 'Summary' },
];

type ProgressTrackerProps = {
  current: Screen;
  completed: Screen[];
};

export function ProgressTracker({ current, completed }: ProgressTrackerProps) {
  if (!steps.some((step) => step.id === current)) return null;
  const currentIndex = steps.findIndex((step) => step.id === current);
  const currentStep = steps[currentIndex];

  return (
    <nav aria-label="Activity progress" className="mb-5 rounded-md border border-charcoal/10 bg-white/70 p-3 shadow-sm backdrop-blur">
      <div className="mb-3 flex items-center justify-between gap-3 sm:hidden">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-charcoal/48">Assessment path</p>
          <p className="font-display text-2xl font-bold text-charcoal">{currentStep.label}</p>
        </div>
        <p className="rounded-sm bg-charcoal px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-cream">
          Step {currentIndex + 1} of {steps.length}
        </p>
      </div>
      <ol className="grid grid-cols-4 gap-2 sm:gap-3">
        {steps.map((step, index) => {
          const isDone = completed.includes(step.id) || index < currentIndex;
          const isCurrent = step.id === current;

          return (
            <li key={step.id} className="flex items-center gap-2 rounded-md border border-transparent px-1 py-1.5 sm:px-2">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-black transition sm:h-9 sm:w-9 ${
                  isDone
                    ? 'border-crimson bg-crimson text-white'
                    : isCurrent
                      ? 'border-crimson bg-crimson text-white'
                      : 'border-charcoal/20 bg-white text-charcoal/60'
                }`}
              >
                {isDone ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : index + 1}
              </span>
              <span className={`hidden text-xs font-bold uppercase tracking-[0.16em] sm:inline ${isCurrent ? 'text-crimson' : 'text-charcoal/65'}`}>
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
