import { CheckCircle2, Landmark, RotateCcw } from 'lucide-react';
import { matchPairs, timelineEvents } from '../../data/historyData';
import type { Screen, TimelineEvent } from '../../types';
import { MatchCard } from '../MatchCard';
import { PrimaryButton } from '../PrimaryButton';
import { ResultSummary } from '../ResultSummary';
import { ScreenHeader } from '../ScreenHeader';
import { TimelineCard } from '../TimelineCard';

type TimelineScreenProps = {
  timeline: TimelineEvent[];
  checked: boolean;
  solved: boolean;
  onCheck: () => void;
  onReset: () => void;
  onContinue: () => void;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDragEnd: () => void;
};

export function TimelineScreen(props: TimelineScreenProps) {
  return (
    <section>
      <ScreenHeader eyebrow="Assessment 1" title="Build the Timeline">
        Drag the cards into chronological order, then check your work.
      </ScreenHeader>
      <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="rounded-md border border-charcoal/10 bg-charcoal p-6 text-cream shadow-exhibit">
          <Landmark className="mb-5 h-10 w-10 text-gold" aria-hidden="true" />
          <h2 className="font-display text-3xl font-bold">Ordering Clue</h2>
          <p className="mt-3 text-sm leading-6 text-cream/75">Think in eras: regional roots, dynasty coaches, Big 12 formation, then SEC realignment.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <PrimaryButton variant="secondary" onClick={props.onCheck}>Check Order</PrimaryButton>
            <PrimaryButton variant="ghost" className="text-cream hover:bg-white/10" onClick={props.onReset}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset
            </PrimaryButton>
          </div>
          {props.checked && (
            <p className={`mt-5 rounded-md px-4 py-3 text-sm font-semibold ${props.solved ? 'bg-emerald-700 text-white' : 'bg-crimson text-white'}`}>
              {props.solved ? 'Timeline complete. The next exhibit is unlocked.' : 'Some cards are out of place. Adjust and retry.'}
            </p>
          )}
          <PrimaryButton className="mt-5 w-full" disabled={!props.solved} onClick={props.onContinue}>Continue to Connections</PrimaryButton>
        </aside>
        <div className="space-y-3">
          {props.timeline.map((event, index) => {
            const correct = event.id === timelineEvents[index].id;
            const status = props.checked ? (correct ? 'correct' : 'incorrect') : 'pending';
            return (
              <TimelineCard
                key={event.id}
                event={event}
                index={index}
                status={status}
                onDragStart={props.onDragStart}
                onDragEnter={props.onDragEnter}
                onDragEnd={props.onDragEnd}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

type ConnectionsScreenProps = {
  matches: Record<string, string>;
  effects: typeof matchPairs;
  complete: boolean;
  onMatch: (pairId: string, effectId: string) => void;
  onSummary: () => void;
};

export function ConnectionsScreen({ matches, effects, complete, onMatch, onSummary }: ConnectionsScreenProps) {
  return (
    <section>
      <ScreenHeader eyebrow="Assessment 2" title="Connect Causes and Effects">
        Match each force to its result. Correct answers explain the connection.
      </ScreenHeader>
      <div className="grid gap-4 md:grid-cols-2">
        {matchPairs.map((pair) => (
          <MatchCard key={pair.id} pair={pair} selectedEffect={matches[pair.id] ?? ''} effects={effects} onChange={onMatch} />
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-md border border-charcoal/10 bg-white/70 p-4">
        <PrimaryButton disabled={!complete} onClick={onSummary}>View Legacy Summary</PrimaryButton>
        <p className="text-sm font-semibold text-charcoal/65">{complete ? 'All connections made.' : 'Feedback appears as you match.'}</p>
      </div>
    </section>
  );
}

type SummaryScreenProps = {
  mapComplete: boolean;
  timelineSolved: boolean;
  matchComplete: boolean;
  onPlayAgain: () => void;
  onNavigate: (screen: Screen, targetId?: string) => void;
};

export function SummaryScreen({ mapComplete, timelineSolved, matchComplete, onPlayAgain, onNavigate }: SummaryScreenProps) {
  return (
    <section>
      <ScreenHeader eyebrow="Final Exhibit" title="Legacy Summary">
        Your completed path shows how football success and conference change shaped OU’s story.
      </ScreenHeader>
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        {[
          ['Conferences explored', mapComplete],
          ['Timeline solved', timelineSolved],
          ['Connections matched', matchComplete],
        ].map(([label, done]) => (
          <div key={String(label)} className="flex items-center gap-3 rounded-md border border-charcoal/10 bg-white/70 p-4">
            <CheckCircle2 className={`h-5 w-5 ${done ? 'text-emerald-700' : 'text-charcoal/30'}`} aria-hidden="true" />
            <span className="text-sm font-bold text-charcoal/75">{label}</span>
          </div>
        ))}
      </div>
      <ResultSummary onPlayAgain={onPlayAgain} onNavigate={onNavigate} />
    </section>
  );
}
