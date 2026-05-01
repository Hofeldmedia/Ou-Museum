import { generatedSchoolLogos, generatedSchoolLogosByAbbreviation, generatedSchoolLogosBySlug } from '../data/generatedSchoolLogos';
import { findLogoManifestEntry } from '../data/logoManifest';
import type { EraId, LogoAccuracy, ResolvedLogoAsset } from '../types/content';

export function getSchoolLogo(eraId: EraId, schoolId: string, schoolName = schoolId, espnId?: string | number | null): ResolvedLogoAsset {
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

  const generatedLogo = getGeneratedSchoolLogo(schoolId, schoolName, espnId);
  if (generatedLogo) {
    return {
      light: generatedLogo,
      dark: generatedLogo,
      alt: `${schoolName} logo`,
      accuracy: 'approximate',
      status: 'approximate',
      note: 'Generated from a locally cached ESPN logo asset.',
      source: 'espn',
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


function getGeneratedSchoolLogo(schoolId: string, schoolName: string, espnId?: string | number | null) {
  const espnKey = espnId == null ? null : String(espnId);
  if (espnKey && generatedSchoolLogos[espnKey]) return generatedSchoolLogos[espnKey];

  const normalizedId = normalizeLogoKey(schoolId);
  const normalizedName = normalizeLogoKey(schoolName);

  const alias = generatedSchoolLogoAliases[normalizedId];

  return (
    generatedSchoolLogosBySlug[normalizedId] ??
    generatedSchoolLogos[schoolName] ??
    generatedSchoolLogosBySlug[normalizedName] ??
    generatedSchoolLogosByAbbreviation[schoolId.toLowerCase()] ??
    (alias ? generatedSchoolLogos[alias] ?? generatedSchoolLogosBySlug[alias] ?? generatedSchoolLogosByAbbreviation[alias] : null) ??
    findGeneratedSchoolLogoByNamePrefix(normalizedName) ??
    null
  );
}

function findGeneratedSchoolLogoByNamePrefix(normalizedName: string) {
  if (!normalizedName) return null;
  const match = Object.entries(generatedSchoolLogosBySlug).find(([slug]) => slug.startsWith(`${normalizedName}-`));
  return match?.[1] ?? null;
}

function normalizeLogoKey(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const generatedSchoolLogoAliases: Record<string, string> = {
  'appalachian-state': 'app-state-mountaineers',
  fiu: 'fiu',
  hawaii: 'hawaii-rainbow-warriors',
  'louisiana-monroe': 'ulm',
  'san-jose-state': 'san-jose-state-spartans',
  'texas-am': '245',
};

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
