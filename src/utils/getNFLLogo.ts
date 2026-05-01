import { nflLogos } from '../data/nflLogos';
import { OU_LOGO } from '../data/conferenceLogos';

export function getNFLLogo(teamAbbreviation: string): string | null {
  return nflLogos[teamAbbreviation.toLowerCase()] ?? null;
}

export function getOUOriginLogo(): string {
  return OU_LOGO;
}
