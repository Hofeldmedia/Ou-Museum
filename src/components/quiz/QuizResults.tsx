import type { ReactNode } from 'react';
import { PrimaryButton } from '../PrimaryButton';

export function QuizResults({
  title,
  score,
  total,
  percentage,
  rank,
  timeUsedLabel,
  unlockedMessage,
  passed,
  details,
  onRetry,
  onContinue,
}: {
  title: string;
  score: number;
  total: number;
  percentage: number;
  rank: string;
  timeUsedLabel?: string | null;
  unlockedMessage?: string | null;
  passed: boolean;
  details?: ReactNode;
  onRetry: () => void;
  onContinue: () => void;
}) {
  return (
    <section className="rounded-md border border-charcoal/10 bg-white/90 p-6 shadow-exhibit" aria-live="polite">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-brass">Results</p>
      <h2 className="mt-2 font-display text-4xl font-bold">{title}</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        <div className="rounded-md border border-charcoal/10 bg-cream/80 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-charcoal/48">Score</p>
          <p className="mt-1 text-2xl font-black text-charcoal">{score} / {total}</p>
        </div>
        <div className="rounded-md border border-charcoal/10 bg-cream/80 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-charcoal/48">Percent</p>
          <p className="mt-1 text-2xl font-black text-charcoal">{percentage}%</p>
        </div>
        <div className="rounded-md border border-charcoal/10 bg-cream/80 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-charcoal/48">Rank</p>
          <p className="mt-1 text-xl font-black text-charcoal">{rank}</p>
        </div>
        <div className="rounded-md border border-charcoal/10 bg-cream/80 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-charcoal/48">Time</p>
          <p className="mt-1 text-xl font-black text-charcoal">{timeUsedLabel ?? 'Untimed'}</p>
        </div>
      </div>
      <p className={`mt-5 rounded-md px-4 py-3 text-sm font-semibold ${passed ? 'bg-emerald-700 text-white' : 'bg-crimson text-white'}`}>
        {passed ? 'Challenge complete. You cleared the 70% threshold.' : 'Keep exploring and retry to reach the unlock threshold.'}
      </p>
      {unlockedMessage && <p className="mt-4 rounded-md border border-gold/30 bg-gold/15 px-4 py-3 text-sm font-bold text-charcoal">{unlockedMessage}</p>}
      {details && <div className="mt-5">{details}</div>}
      <div className="mt-5 flex flex-wrap gap-3">
        <PrimaryButton onClick={onRetry}>Retry</PrimaryButton>
        <PrimaryButton variant="secondary" onClick={onContinue}>Continue</PrimaryButton>
      </div>
    </section>
  );
}
