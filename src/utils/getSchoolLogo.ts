import { espnLogos } from '../data/espnLogos';
import { findLogoManifestEntry } from '../data/logoManifest';
import type { EraId, LogoAccuracy, ResolvedLogoAsset } from '../types/content';

export function getSchoolLogo(eraId: EraId, schoolId: string, schoolName = schoolId): ResolvedLogoAsset {
  const entry = findLogoManifestEntry(eraId, schoolId);
  const espnLogo = espnLogos[schoolId];
  const placeholderAsset = entry?.fallbackAssetPath ?? `/assets/logos/placeholders/${schoolId}.svg`;

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

  if (espnLogo) {
    return {
      light: espnLogo,
      dark: placeholderAsset,
      alt: `${schoolName} logo from ESPN`,
      accuracy: 'approximate',
      status: 'approximate',
      note: entry?.note ?? 'ESPN logo fallback used until a verified local conference-era asset is supplied.',
      source: 'espn',
      manifestEntry: entry,
    };
  }

  return {
    light: placeholderAsset,
    dark: '/assets/logos/placeholders/generic-school.svg',
    alt: `${schoolName} generic placeholder badge`,
    accuracy: 'placeholder',
    status: 'placeholder',
    note: entry?.note ?? 'No logo manifest entry or ESPN logo found. Placeholder badge used.',
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
