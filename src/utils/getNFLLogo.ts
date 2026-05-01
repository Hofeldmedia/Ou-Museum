import { generatedNFLLogos, generatedNFLLogosByAbbreviation } from '../data/generatedNFLLogos';
import { nflLogos } from '../data/nflLogos';
import { OU_LOGO } from '../data/conferenceLogos';

export function getNFLLogo(teamAbbreviation: string, espnId?: string | number | null): string | null {
  const abbreviation = teamAbbreviation.toLowerCase();
  const espnKey = espnId == null ? null : String(espnId);
  return (espnKey ? generatedNFLLogos[espnKey] : null) ?? nflLogos[abbreviation] ?? generatedNFLLogosByAbbreviation[abbreviation] ?? null;
}

export function getOUOriginLogo(): string {
  return OU_LOGO;
}
