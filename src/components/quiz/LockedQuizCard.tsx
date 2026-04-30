import { Lock } from 'lucide-react';
import type { QuizMeta } from '../../types/quiz';
import { PrimaryButton } from '../PrimaryButton';

export function LockedQuizCard({
  quiz,
  unlocked,
  completed,
  bestScore,
  bestTimeLabel,
  lockMessage,
  onStart,
}: {
  quiz: QuizMeta;
  unlocked: boolean;
  completed: boolean;
  bestScore: number | null;
  bestTimeLabel: string | null;
  lockMessage?: string;
  onStart: () => void;
}) {
  return (
    <article className={`rounded-md border p-5 shadow-sm transition ${unlocked ? 'border-charcoal/10 bg-white/86' : 'border-charcoal/10 bg-charcoal text-cream'}`}>
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-brass">{completed ? 'Completed' : unlocked ? 'Unlocked' : 'Locked'}</p>
      <h2 className="mt-2 font-display text-3xl font-bold">{quiz.title}</h2>
      <p className={`mt-2 text-sm leading-6 ${unlocked ? 'text-charcoal/68' : 'text-cream/72'}`}>{quiz.description}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div className={`rounded-md border px-3 py-3 ${unlocked ? 'border-charcoal/10 bg-cream/80' : 'border-white/10 bg-white/10'}`}>
          <p className="text-[11px] font-black uppercase tracking-[0.12em] opacity-55">Best score</p>
          <p className="mt-1 text-lg font-black">{bestScore != null ? `${bestScore}%` : '—'}</p>
        </div>
        <div className={`rounded-md border px-3 py-3 ${unlocked ? 'border-charcoal/10 bg-cream/80' : 'border-white/10 bg-white/10'}`}>
          <p className="text-[11px] font-black uppercase tracking-[0.12em] opacity-55">Best time</p>
          <p className="mt-1 text-lg font-black">{bestTimeLabel ?? '—'}</p>
        </div>
      </div>
      {unlocked ? (
        <PrimaryButton className="mt-5" onClick={onStart}>Start Quiz</PrimaryButton>
      ) : (
        <div className="mt-5 rounded-md border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-cream">
          <div className="flex items-start gap-2">
            <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{lockMessage}</span>
          </div>
        </div>
      )}
    </article>
  );
}
