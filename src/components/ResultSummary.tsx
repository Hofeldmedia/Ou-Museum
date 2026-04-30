import { Award, BookOpenCheck } from 'lucide-react';
import { takeaways } from '../data/historyData';
import type { Screen } from '../types';
import { PrimaryButton } from './PrimaryButton';

type ResultSummaryProps = {
  onPlayAgain: () => void;
  onNavigate: (screen: Screen, targetId?: string) => void;
};

export function ResultSummary({ onPlayAgain, onNavigate }: ResultSummaryProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="relative overflow-hidden rounded-md bg-charcoal p-6 text-cream shadow-exhibit">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_18%,rgba(190,180,165,0.18),transparent_32%),radial-gradient(circle_at_15%_80%,rgba(132,22,23,0.28),transparent_34%)]" />
        <div className="relative">
        <Award className="mb-5 h-12 w-12 text-gold" aria-hidden="true" />
        <p className="text-xs font-black uppercase tracking-[0.22em] text-gold">Capstone Complete</p>
        <h2 className="mt-3 font-display text-4xl font-bold">You’ve walked the history of Oklahoma football.</h2>
        <p className="mt-4 text-sm leading-6 text-cream/78">
          From regional roots to national titles, from Heisman rooms to SEC questions, the exhibit ends with a program still rewriting its place in college football.
        </p>
        <div className="mt-6 rounded-md border border-gold/40 bg-white/10 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-gold">Certificate of Completion</p>
          <p className="mt-2 font-display text-2xl font-bold">OU Football Museum Explorer</p>
        </div>
        </div>
      </div>
      <div className="rounded-md border border-charcoal/10 bg-white/80 p-6 shadow-exhibit">
        <div className="mb-5 flex items-center gap-3">
          <BookOpenCheck className="h-6 w-6 text-crimson" aria-hidden="true" />
          <h3 className="font-display text-2xl font-bold">Key Takeaways</h3>
        </div>
        <ul className="space-y-3">
          {takeaways.map((takeaway) => (
            <li key={takeaway} className="flex gap-3 text-sm leading-6 text-charcoal/78">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold" />
              {takeaway}
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-wrap gap-3">
          <PrimaryButton onClick={onPlayAgain}>Play Again</PrimaryButton>
          <PrimaryButton variant="secondary" onClick={() => onNavigate('rivalries')}>Replay Rivalries</PrimaryButton>
          <PrimaryButton variant="secondary" onClick={() => onNavigate('heismans')}>Revisit Heismans</PrimaryButton>
          <PrimaryButton variant="secondary" disabled title="Teacher guide content can be added in a later content pass.">
            Teacher Guide Draft
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}
