import type { EraId, LogoManifestEntry } from '../types/content';

const eraIds: EraId[] = [
  'big-six',
  'big-seven',
  'big-eight',
  'big-12-original',
  'big-12-post-nebraska-colorado',
  'big-12-tcu-west-virginia',
  'big-12-expanded',
  'big-12-current',
  'sec-2012',
  'sec-current',
];
const schoolIds = [
  'oklahoma',
  'kansas',
  'kansas-state',
  'missouri',
  'nebraska',
  'iowa-state',
  'colorado',
  'oklahoma-state',
  'texas',
  'texas-am',
  'texas-tech',
  'baylor',
  'byu',
  'ucf',
  'cincinnati',
  'houston',
  'west-virginia',
  'tcu',
  'utah',
  'arizona',
  'arizona-state',
  'alabama',
  'arkansas',
  'auburn',
  'florida',
  'georgia',
  'kentucky',
  'lsu',
  'mississippi-state',
  'ole-miss',
  'south-carolina',
  'tennessee',
  'vanderbilt',
];

export const logoManifest: LogoManifestEntry[] = eraIds.flatMap((eraId) =>
  schoolIds.map((schoolId) => ({
    eraId,
    schoolId,
    // Replace this with `/assets/logos/${eraId}/${schoolId}.png` when a verified era logo is supplied.
    assetPath: `/assets/logos/placeholders/${schoolId}.svg`,
    fallbackAssetPath: `/assets/logos/placeholders/${schoolId}.svg`,
    darkAssetPath: `/assets/logos/placeholders/${schoolId}.svg`,
    largeAssetPath: `/assets/logos/placeholders/${schoolId}.svg`,
    altText: `${schoolId.replaceAll('-', ' ')} logo for ${eraId.replaceAll('-', ' ')}`,
    accuracy: 'placeholder',
    isHistoricalExact: false,
    note: 'Placeholder badge. Drop in a licensed historical logo and update this manifest entry.',
  })),
);

export function findLogoManifestEntry(eraId: EraId, schoolId: string) {
  return logoManifest.find((entry) => entry.eraId === eraId && entry.schoolId === schoolId);
}
