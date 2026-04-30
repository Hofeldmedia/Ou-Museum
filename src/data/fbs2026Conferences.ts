import { getConferenceLogoPath } from './conferenceLogos';
import { fbsSchoolRegistry } from './fbsSchoolRegistry';
import type { FbsConference, FbsConferenceId } from '../types/fbs';

// 2026 FBS membership is based on announced realignment and should be reviewed periodically.
const conferenceMeta: Array<Omit<FbsConference, 'memberSchoolIds'>> = [
  {
    id: 'acc',
    name: 'Atlantic Coast Conference',
    shortName: 'ACC',
    status: 'projected-2026',
    description: 'East Coast core with recent western additions California, Stanford, and SMU included in the national FBS landscape.',
    colorToken: '#1f6feb',
    logoPath: getConferenceLogoPath('acc'),
  },
  {
    id: 'american',
    name: 'American Athletic Conference',
    shortName: 'American',
    status: 'projected-2026',
    description: 'A national Group of Five league spanning service academies, Texas programs, and southeastern urban campuses.',
    colorToken: '#0f8b8d',
    logoPath: getConferenceLogoPath('american'),
  },
  {
    id: 'big-12',
    name: 'Big 12 Conference',
    shortName: 'Big 12',
    status: 'projected-2026',
    description: 'The post-Oklahoma/Texas Big 12 with the Four Corners additions, legacy Plains members, and Texas holdovers.',
    colorToken: '#7a1f1f',
    logoPath: getConferenceLogoPath('big-12'),
  },
  {
    id: 'big-ten',
    name: 'Big Ten Conference',
    shortName: 'Big Ten',
    status: 'projected-2026',
    description: 'A coast-to-coast power conference stretching from the Pacific programs to the traditional Midwest and East members.',
    colorToken: '#304c89',
    logoPath: getConferenceLogoPath('big-ten'),
  },
  {
    id: 'cusa',
    name: 'Conference USA',
    shortName: 'CUSA',
    status: 'projected-2026',
    description: 'Conference USA after the projected 2026 departures of UTEP and Louisiana Tech.',
    colorToken: '#1f7a8c',
    logoPath: getConferenceLogoPath('conference-usa'),
  },
  {
    id: 'independents',
    name: 'FBS Independents',
    shortName: 'Independents',
    status: 'independent',
    description: 'FBS football programs not assigned to a football conference in this projected landscape.',
    colorToken: '#6b7280',
    logoPath: getConferenceLogoPath('fbs-independents'),
  },
  {
    id: 'mac',
    name: 'Mid-American Conference',
    shortName: 'MAC',
    status: 'projected-2026',
    description: 'The Midwest-centered MAC with UMass included and Northern Illinois removed from this football map for its Mountain West move.',
    colorToken: '#0f766e',
    logoPath: getConferenceLogoPath('mac'),
  },
  {
    id: 'mountain-west',
    name: 'Mountain West Conference',
    shortName: 'Mountain West',
    status: 'projected-2026',
    description: 'The reshaped Mountain West after Pac-12 departures, with UTEP, Northern Illinois, and North Dakota State added.',
    colorToken: '#7c3aed',
    logoPath: getConferenceLogoPath('mountain-west'),
  },
  {
    id: 'pac-12',
    name: 'Pac-12 Conference',
    shortName: 'Pac-12',
    status: 'projected-2026',
    description: 'The rebuilt 2026 Pac-12 football group anchored by Oregon State, Washington State, former Mountain West additions, and Texas State.',
    // Pac-12 released a new primary mark on April 27, 2026. Full brand identity guidelines are expected ahead of the 2026-27 season.
    colorToken: '#111827',
    logoPath: getConferenceLogoPath('pac-12'),
  },
  {
    id: 'sec',
    name: 'Southeastern Conference',
    shortName: 'SEC',
    status: 'projected-2026',
    description: 'The 16-team SEC alignment with Oklahoma and Texas included.',
    colorToken: '#b45309',
    logoPath: getConferenceLogoPath('sec'),
  },
  {
    id: 'sun-belt',
    name: 'Sun Belt Conference',
    shortName: 'Sun Belt',
    status: 'projected-2026',
    description: 'The Sun Belt with Louisiana Tech added and Texas State removed for the Pac-12.',
    colorToken: '#b91c1c',
    logoPath: getConferenceLogoPath('sun-belt'),
  },
];

function membersFor(conferenceId: FbsConferenceId) {
  return fbsSchoolRegistry.filter((school) => school.conferenceId === conferenceId).map((school) => school.id);
}

export const fbs2026Conferences: FbsConference[] = conferenceMeta.map((conference) => ({
  ...conference,
  memberSchoolIds: membersFor(conference.id),
}));
