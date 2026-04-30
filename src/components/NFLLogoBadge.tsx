import { useMemo, useState } from 'react';
import { getNFLLogo } from '../utils/getNFLLogo';

type NFLLogoBadgeProps = {
  teamAbbreviation?: string | null;
  teamName: string;
  className?: string;
  imageClassName?: string;
};

function getInitials(teamName: string) {
  return teamName
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
}

export function NFLLogoBadge({ teamAbbreviation, teamName, className = '', imageClassName = '' }: NFLLogoBadgeProps) {
  const [failed, setFailed] = useState(false);
  const logoUrl = useMemo(() => (teamAbbreviation ? getNFLLogo(teamAbbreviation) : null), [teamAbbreviation]);

  if (!logoUrl || failed) {
    return (
      <span className={`flex items-center justify-center rounded-md border border-charcoal/10 bg-charcoal text-[11px] font-black uppercase tracking-[0.08em] text-white ${className}`}>
        {getInitials(teamName)}
      </span>
    );
  }

  return (
    <span className={`flex items-center justify-center overflow-hidden rounded-md border border-charcoal/10 bg-white shadow-sm ${className}`}>
      <img
        src={logoUrl}
        alt={`${teamName} logo`}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`h-full w-full object-contain ${imageClassName}`}
      />
    </span>
  );
}
