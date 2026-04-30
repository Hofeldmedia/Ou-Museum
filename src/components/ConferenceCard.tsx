import { MapPin } from 'lucide-react';
import type { ConferenceInfo } from '../types';

type ConferenceCardProps = {
  conference: ConferenceInfo;
  selected: boolean;
  explored: boolean;
  onSelect: () => void;
};

export function ConferenceCard({ conference, selected, explored, onSelect }: ConferenceCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`group absolute w-44 rounded-md border p-4 text-left shadow-exhibit transition duration-300 hover:-translate-y-1 sm:w-52 ${
        conference.position
      } ${
        selected
          ? 'border-gold bg-charcoal text-white'
          : explored
            ? 'border-crimson/35 bg-white text-charcoal'
            : 'border-white/70 bg-white/85 text-charcoal hover:bg-white'
      }`}
    >
      <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-crimson text-white">
        <MapPin className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="block font-display text-2xl font-bold">{conference.name}</span>
      <span className={`mt-1 block text-xs font-bold uppercase tracking-[0.16em] ${selected ? 'text-white/78' : 'text-brass'}`}>
        {conference.years}
      </span>
      <span className="mt-3 block text-sm leading-5 opacity-80">{conference.headline}</span>
    </button>
  );
}
