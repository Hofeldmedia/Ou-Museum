import accLogo from '/assets/conference-logos/acc.png?url';
import americanLogo from '/assets/conference-logos/american.png?url';
import big12NewLogo from '/assets/conference-logos/big-12-new.png?url';
import big12OldLogo from '/assets/conference-logos/big-12-old.png?url';
import bigEightLogo from '/assets/conference-logos/big-eight.png?url';
import bigTenLogo from '/assets/conference-logos/big-ten.png?url';
import conferenceUsaLogo from '/assets/conference-logos/conference-usa.png?url';
import independentsLogo from '/assets/conference-logos/independents.png?url';
import macLogo from '/assets/conference-logos/mac.png?url';
import mountainWestLogo from '/assets/conference-logos/mountain-west.png?url';
import pac12Logo from '/assets/conference-logos/pac-12-new.png?url';
import secLogo from '/assets/conference-logos/sec.png?url';
import sunBeltLogo from '/assets/conference-logos/sun-belt.png?url';

export const OU_LOGO = '/assets/intro-logos/OU.png';

export type ConferenceLogoId =
  | 'big-six'
  | 'big-seven'
  | 'big-eight'
  | 'big-12-original'
  | 'big-12-post-nebraska-colorado'
  | 'big-12-tcu-west-virginia'
  | 'big-12-expanded'
  | 'big-12-current'
  | 'sec-2012'
  | 'sec-current'
  | 'acc'
  | 'american'
  | 'big-12'
  | 'big-ten'
  | 'conference-usa'
  | 'cusa'
  | 'fbs-independents'
  | 'independents'
  | 'mac'
  | 'mountain-west'
  | 'pac-12'
  | 'sec'
  | 'sun-belt';

export type ConferenceLogoConfig = {
  path: string;
  fallbackLabel: string;
};

export const conferenceLogos: Record<ConferenceLogoId, ConferenceLogoConfig> = {
  'big-six': { path: bigEightLogo, fallbackLabel: 'BIG 8' },
  'big-seven': { path: bigEightLogo, fallbackLabel: 'BIG 8' },
  'big-eight': { path: bigEightLogo, fallbackLabel: 'BIG 8' },
  'big-12-original': { path: big12OldLogo, fallbackLabel: 'BIG 12' },
  'big-12-post-nebraska-colorado': { path: big12OldLogo, fallbackLabel: 'BIG 12' },
  'big-12-tcu-west-virginia': { path: big12NewLogo, fallbackLabel: 'BIG 12' },
  'big-12-expanded': { path: big12NewLogo, fallbackLabel: 'BIG 12' },
  'big-12-current': { path: big12NewLogo, fallbackLabel: 'BIG 12' },
  'sec-2012': { path: secLogo, fallbackLabel: 'SEC' },
  'sec-current': { path: secLogo, fallbackLabel: 'SEC' },
  acc: { path: accLogo, fallbackLabel: 'ACC' },
  american: { path: americanLogo, fallbackLabel: 'AMERICAN' },
  'big-12': { path: big12NewLogo, fallbackLabel: 'BIG 12' },
  'big-ten': { path: bigTenLogo, fallbackLabel: 'BIG TEN' },
  'conference-usa': { path: conferenceUsaLogo, fallbackLabel: 'CUSA' },
  cusa: { path: conferenceUsaLogo, fallbackLabel: 'CUSA' },
  'fbs-independents': { path: independentsLogo, fallbackLabel: 'IND' },
  independents: { path: independentsLogo, fallbackLabel: 'IND' },
  mac: { path: macLogo, fallbackLabel: 'MAC' },
  'mountain-west': { path: mountainWestLogo, fallbackLabel: 'MW' },
  'pac-12': { path: pac12Logo, fallbackLabel: 'PAC-12' },
  sec: { path: secLogo, fallbackLabel: 'SEC' },
  'sun-belt': { path: sunBeltLogo, fallbackLabel: 'SUN BELT' },
};

export function getConferenceLogo(id?: string | null): ConferenceLogoConfig | null {
  if (!id) return null;
  return conferenceLogos[id as ConferenceLogoId] ?? null;
}

export function getConferenceLogoPath(id?: string | null) {
  return getConferenceLogo(id)?.path;
}
