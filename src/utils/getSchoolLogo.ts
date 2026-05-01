import { findLogoManifestEntry } from '../data/logoManifest';
import type { EraId, LogoAccuracy, ResolvedLogoAsset } from '../types/content';

export function getSchoolLogo(eraId: EraId, schoolId: string, schoolName = schoolId): ResolvedLogoAsset {
  const entry = findLogoManifestEntry(eraId, schoolId);
  const placeholderAsset = getLocalPlaceholderAsset(schoolId, entry?.fallbackAssetPath);

  if (entry && entry.accuracy !== 'placeholder') {
    return {
      light: entry.assetPath,
      dark: entry.darkAssetPath ?? entry.fallbackAssetPath ?? placeholderAsset,
      alt: entry.altText,
      accuracy: entry.accuracy,
      status: toLegacyStatus(entry.accuracy),
      note: entry.note,
      source: 'manifest',
      manifestEntry: entry,
    };
  }

  return {
    light: placeholderAsset,
    dark: GENERIC_SCHOOL_PLACEHOLDER,
    alt: `${schoolName} generic placeholder badge`,
    accuracy: 'placeholder',
    status: 'placeholder',
    note: entry?.note ?? 'No local school PNG asset found. Placeholder badge used.',
    source: 'placeholder',
    manifestEntry: entry,
  };
}

export function getLogoStatusLabel(accuracy: LogoAccuracy) {
  if (accuracy === 'exact') return 'Era-accurate';
  if (accuracy === 'approximate') return 'Approximate';
  return 'Placeholder';
}

function toLegacyStatus(accuracy: LogoAccuracy): ResolvedLogoAsset['status'] {
  if (accuracy === 'exact') return 'era-accurate';
  return accuracy;
}

const GENERIC_SCHOOL_PLACEHOLDER = '/assets/logos/placeholders/generic-school.svg';

const localPlaceholderSchoolIds = new Set([
  'alabama',
  'arkansas',
  'auburn',
  'baylor',
  'colorado',
  'florida',
  'georgia',
  'iowa-state',
  'kansas',
  'kansas-state',
  'kentucky',
  'lsu',
  'mississippi-state',
  'missouri',
  'nebraska',
  'oklahoma',
  'oklahoma-state',
  'ole-miss',
  'south-carolina',
  'tennessee',
  'texas',
  'texas-am',
  'texas-tech',
  'vanderbilt',
]);

function getLocalPlaceholderAsset(schoolId: string, manifestFallback?: string) {
  if (manifestFallback && localPlaceholderSchoolIds.has(schoolId)) return manifestFallback;
  if (localPlaceholderSchoolIds.has(schoolId)) return `/assets/logos/placeholders/${schoolId}.svg`;
  return GENERIC_SCHOOL_PLACEHOLDER;
}
