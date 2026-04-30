import { Check, X } from 'lucide-react';
import type { MatchPair } from '../types';

type MatchCardProps = {
  pair: MatchPair;
  selectedEffect: string;
  effects: MatchPair[];
  onChange: (pairId: string, effectId: string) => void;
};

export function MatchCard({ pair, selectedEffect, effects, onChange }: MatchCardProps) {
  const hasAnswer = Boolean(selectedEffect);
  const isCorrect = selectedEffect === pair.id;

  return (
    <article
      className={`rounded-md border bg-white/88 p-4 shadow-sm transition duration-300 ${
        isCorrect ? 'border-emerald-600 shadow-emerald-900/10 animate-[pulseCorrect_0.5s_ease-out]' : hasAnswer ? 'border-crimson/70' : 'border-charcoal/12'
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brass">Cause</p>
          <h3 className="mt-1 font-display text-xl font-bold">{pair.cause}</h3>
        </div>
        {hasAnswer && (
          <span className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${isCorrect ? 'bg-emerald-700 text-white' : 'bg-crimson text-white'}`}>
            {isCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </span>
        )}
      </div>
      <label className="block text-sm font-bold text-charcoal/70" htmlFor={`match-${pair.id}`}>
        Match the effect
      </label>
      <select
        id={`match-${pair.id}`}
        value={selectedEffect}
        onChange={(event) => onChange(pair.id, event.target.value)}
        className="mt-2 w-full rounded-md border border-charcoal/20 bg-cream px-3 py-3 text-sm font-semibold text-charcoal"
      >
        <option value="">Choose an effect...</option>
        {effects.map((effect) => (
          <option key={effect.id} value={effect.id}>
            {effect.effect}
          </option>
        ))}
      </select>
      {isCorrect && <p className="mt-3 text-sm leading-5 text-charcoal/70">{pair.explanation}</p>}
    </article>
  );
}
