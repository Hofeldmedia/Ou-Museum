import type { QuizMode } from '../../types/quiz';

export function QuizHeader({
  eyebrow,
  title,
  description,
  questionLabel,
  timerLabel,
  mode,
}: {
  eyebrow: string;
  title: string;
  description: string;
  questionLabel?: string;
  timerLabel?: string | null;
  mode?: QuizMode | 'challenge';
}) {
  return (
    <header className="rounded-md border border-charcoal/10 bg-white/86 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brass">{eyebrow}</p>
          <h1 className="mt-2 font-display text-4xl font-bold leading-tight">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-charcoal/70">{description}</p>
        </div>
        <div className="space-y-2 text-right">
          {mode && <p className="text-[11px] font-black uppercase tracking-[0.16em] text-charcoal/50">{mode === 'timed' ? 'Timed mode' : mode === 'challenge' ? 'Challenge mode' : 'Standard mode'}</p>}
          {questionLabel && <p className="rounded-sm bg-charcoal px-3 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-cream">{questionLabel}</p>}
          {timerLabel && <p className={`rounded-sm px-3 py-2 text-[11px] font-black uppercase tracking-[0.14em] ${timerLabel.includes('10s') || timerLabel.includes('9s') || timerLabel.includes('8s') || timerLabel.includes('7s') || timerLabel.includes('6s') || timerLabel.includes('5s') || timerLabel.includes('4s') || timerLabel.includes('3s') || timerLabel.includes('2s') || timerLabel.includes('1s') ? 'bg-crimson text-white' : 'bg-cream text-charcoal'}`}>{timerLabel}</p>}
        </div>
      </div>
    </header>
  );
}
