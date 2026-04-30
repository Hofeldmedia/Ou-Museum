import { nflLogos } from '../data/nflLogos';

export function getNFLLogo(teamAbbreviation: string): string | null {
  return nflLogos[teamAbbreviation.toLowerCase()] ?? null;
}

export function getOUOriginLogo(): string {
  return 'http://a.espncdn.com/i/teamlogos/ncaa/500/201.png';
}
