import { GripVertical } from 'lucide-react';
import type { TimelineEvent } from '../types';

type TimelineCardProps = {
  event: TimelineEvent;
  index: number;
  status?: 'correct' | 'incorrect' | 'pending';
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDragEnd: () => void;
};

export function TimelineCard({ event, index, status = 'pending', onDragStart, onDragEnter, onDragEnd }: TimelineCardProps) {
  const statusClasses = {
    correct: 'border-emerald-600 bg-emerald-50 shadow-lg shadow-emerald-900/10 animate-[pulseCorrect_0.5s_ease-out]',
    incorrect: 'border-crimson bg-red-50',
    pending: 'border-charcoal/12 bg-white/90 hover:border-gold hover:bg-white',
  };

  return (
    <article
      draggable
      onDragStart={() => onDragStart(index)}
      onDragEnter={() => onDragEnter(index)}
      onDragEnd={onDragEnd}
      onDragOver={(event) => event.preventDefault()}
      className={`grid cursor-grab grid-cols-[auto_1fr_auto] items-center gap-4 rounded-md border p-4 transition duration-200 active:cursor-grabbing ${statusClasses[status]}`}
      aria-label={`Timeline event: ${event.title}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-charcoal text-center font-display text-lg font-bold text-cream">
        {index + 1}
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-xl font-bold text-charcoal">{event.title}</h3>
          {status === 'correct' && <span className="rounded-sm bg-emerald-700 px-2 py-0.5 text-xs font-bold uppercase tracking-[0.12em] text-white">Correct</span>}
          {status === 'incorrect' && <span className="rounded-sm bg-crimson px-2 py-0.5 text-xs font-bold uppercase tracking-[0.12em] text-white">Try</span>}
        </div>
        <p className="mt-1 text-sm leading-5 text-charcoal/68">{event.description}</p>
      </div>
      <GripVertical className="h-5 w-5 text-charcoal/40" aria-hidden="true" />
    </article>
  );
}
