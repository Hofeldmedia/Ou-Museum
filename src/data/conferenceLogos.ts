export const CONFERENCE_LOGO_BASE_PATH = '/assets/conference-logos';
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

const logoPath = (filename: string) => `${CONFERENCE_LOGO_BASE_PATH}/${filename}`;

export const conferenceLogos: Record<ConferenceLogoId, ConferenceLogoConfig> = {
  'big-six': { path: logoPath('big-eight.png'), fallbackLabel: 'BIG 8' },
  'big-seven': { path: logoPath('big-eight.png'), fallbackLabel: 'BIG 8' },
  'big-eight': { path: logoPath('big-eight.png'), fallbackLabel: 'BIG 8' },
  'big-12-original': { path: logoPath('big-12-old.png'), fallbackLabel: 'BIG 12' },
  'big-12-post-nebraska-colorado': { path: logoPath('big-12-old.png'), fallbackLabel: 'BIG 12' },
  'big-12-tcu-west-virginia': { path: logoPath('big-12-new.png'), fallbackLabel: 'BIG 12' },
  'big-12-expanded': { path: logoPath('big-12-new.png'), fallbackLabel: 'BIG 12' },
  'big-12-current': { path: logoPath('big-12-new.png'), fallbackLabel: 'BIG 12' },
  'sec-2012': { path: logoPath('sec.png'), fallbackLabel: 'SEC' },
  'sec-current': { path: logoPath('sec.png'), fallbackLabel: 'SEC' },

  acc: { path: logoPath('acc.png'), fallbackLabel: 'ACC' },
  american: { path: logoPath('american.png'), fallbackLabel: 'AMERICAN' },
  'big-12': { path: logoPath('big-12-new.png'), fallbackLabel: 'BIG 12' },
  'big-ten': { path: logoPath('big-ten.png'), fallbackLabel: 'BIG TEN' },
  'conference-usa': { path: logoPath('conference-usa.png'), fallbackLabel: 'CUSA' },
  cusa: { path: logoPath('conference-usa.png'), fallbackLabel: 'CUSA' },
  'fbs-independents': { path: logoPath('independents.png'), fallbackLabel: 'IND' },
  independents: { path: logoPath('independents.png'), fallbackLabel: 'IND' },
  mac: { path: logoPath('mac.png'), fallbackLabel: 'MAC' },
  'mountain-west': { path: logoPath('mountain-west.png'), fallbackLabel: 'MW' },
  // Pac-12 released a new primary mark on April 27, 2026. Full brand identity guidelines are expected ahead of the 2026-27 season.
  'pac-12': { path: logoPath('pac-12-new.png'), fallbackLabel: 'PAC-12' },
  sec: { path: logoPath('sec.png'), fallbackLabel: 'SEC' },
  'sun-belt': { path: logoPath('sun-belt.png'), fallbackLabel: 'SUN BELT' },
};

export function getConferenceLogo(id?: string | null): ConferenceLogoConfig | null {
  if (!id) return null;
  return conferenceLogos[id as ConferenceLogoId] ?? null;
}

export function getConferenceLogoPath(id?: string | null) {
  return getConferenceLogo(id)?.path;
}
