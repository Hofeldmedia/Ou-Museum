import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const endpoints = {
  collegeFootball: 'https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams?limit=1000',
  nfl: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams',
};

const output = {
  collegeFootball: {
    assetDir: path.join(rootDir, 'src/assets/logos/schools'),
    manifestPath: path.join(rootDir, 'src/data/generatedSchoolLogos.ts'),
    importPath: '../assets/logos/schools',
    exportName: 'generatedSchoolLogos',
    slugExportName: 'generatedSchoolLogosBySlug',
    abbreviationExportName: 'generatedSchoolLogosByAbbreviation',
  },
  nfl: {
    assetDir: path.join(rootDir, 'src/assets/logos/nfl'),
    manifestPath: path.join(rootDir, 'src/data/generatedNFLLogos.ts'),
    importPath: '../assets/logos/nfl',
    exportName: 'generatedNFLLogos',
    slugExportName: 'generatedNFLLogosBySlug',
    abbreviationExportName: 'generatedNFLLogosByAbbreviation',
  },
};

const report = {
  collegeFootball: {
    noEspnLogoFound: [],
    failedDownloads: [],
    appTeamsMissingFromGeneratedMaps: [],
  },
  nfl: {
    noEspnLogoFound: [],
    failedDownloads: [],
    appTeamsMissingFromGeneratedMaps: [],
  },
};

function normalizeKey(value = '') {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function stableFileName(team) {
  return `${team.id}.png`;
}

function identifierFor(index) {
  return `logo${String(index).padStart(3, '0')}`;
}

function findTeams(payload) {
  const teams = [];
  const seen = new Set();

  function visit(node) {
    if (!node || typeof node !== 'object') return;

    if (node.team && typeof node.team === 'object') {
      const team = node.team;
      if (team.id && (team.displayName || team.name) && !seen.has(team.id)) {
        seen.add(team.id);
        teams.push(team);
      }
    }

    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(visit);
      else if (value && typeof value === 'object') visit(value);
    }
  }

  visit(payload);
  return teams;
}

function choosePngLogo(team) {
  const logos = Array.isArray(team.logos) ? team.logos : [];
  const pngLogos = logos.filter((logo) => {
    const href = logo?.href;
    if (!href) return false;
    return /\.png(?:$|[?#])/i.test(href) || /format=png/i.test(href);
  });

  pngLogos.sort((left, right) => scoreLogo(right) - scoreLogo(left));
  return pngLogos[0]?.href ?? null;
}

function scoreLogo(logo) {
  const rel = Array.isArray(logo.rel) ? logo.rel.join(' ') : '';
  let score = 0;
  if (/full|default/i.test(rel)) score += 10;
  if (/dark/i.test(rel)) score += 4;
  if (/scoreboard/i.test(rel)) score -= 5;
  if (Number.isFinite(logo.width)) score += Math.min(Number(logo.width), 1000) / 1000;
  return score;
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { accept: 'application/json' } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

async function downloadLogo(url, filePath) {
  const response = await fetch(url, { headers: { accept: 'image/png,image/*;q=0.8,*/*;q=0.5' } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('image')) {
    throw new Error(`Unexpected content-type: ${contentType || 'unknown'}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(filePath, bytes);
}

async function syncKind(kind) {
  const config = output[kind];
  await rm(config.assetDir, { recursive: true, force: true });
  await mkdir(config.assetDir, { recursive: true });

  const payload = await fetchJson(endpoints[kind]);
  const teams = findTeams(payload).sort((a, b) => (a.displayName || a.name || '').localeCompare(b.displayName || b.name || ''));
  const records = [];

  for (const team of teams) {
    const displayName = team.displayName || team.name || team.shortDisplayName || team.abbreviation || team.id;
    const slug = normalizeKey(team.slug || displayName);
    const abbreviation = String(team.abbreviation || '').toLowerCase();
    const logoUrl = choosePngLogo(team);

    if (!logoUrl) {
      report[kind].noEspnLogoFound.push({ id: team.id, displayName, abbreviation, slug: team.slug ?? null });
      continue;
    }

    const fileName = stableFileName({ ...team, displayName });
    const filePath = path.join(config.assetDir, fileName);

    try {
      await downloadLogo(logoUrl, filePath);
      records.push({ espnId: String(team.id), displayName, slug, abbreviation, fileName, sourceUrl: logoUrl });
    } catch (error) {
      report[kind].failedDownloads.push({ id: team.id, displayName, abbreviation, slug: team.slug ?? null, url: logoUrl, error: error.message });
    }
  }

  await writeManifest(config, records);
  return records;
}

async function writeManifest(config, records) {
  const imports = [];
  const byId = [];
  const byName = [];
  const bySlug = [];
  const byAbbreviation = [];
  const seenIds = new Set();
  const seenNames = new Set();
  const seenSlugs = new Set();
  const seenAbbreviations = new Set();

  records.forEach((record, index) => {
    const identifier = `_${record.espnId.replace(/[^a-zA-Z0-9_$]/g, '_')}`;
    const uniqueIdentifier = imports.some((line) => line.startsWith(`import ${identifier} `)) ? identifierFor(index) : identifier;
    imports.push(`import ${uniqueIdentifier} from '${config.importPath}/${record.fileName}';`);

    if (!seenIds.has(record.espnId)) {
      seenIds.add(record.espnId);
      byId.push(`  ${JSON.stringify(record.espnId)}: ${uniqueIdentifier},`);
    }

    if (!seenNames.has(record.displayName)) {
      seenNames.add(record.displayName);
      byName.push(`  ${JSON.stringify(record.displayName)}: ${uniqueIdentifier},`);
    }

    if (record.slug && !seenSlugs.has(record.slug)) {
      seenSlugs.add(record.slug);
      bySlug.push(`  ${JSON.stringify(record.slug)}: ${uniqueIdentifier},`);
    }

    if (record.abbreviation && !seenAbbreviations.has(record.abbreviation)) {
      seenAbbreviations.add(record.abbreviation);
      byAbbreviation.push(`  ${JSON.stringify(record.abbreviation)}: ${uniqueIdentifier},`);
    }
  });

  const contents = `${imports.join('\n')}${imports.length ? '\n\n' : ''}export const ${config.exportName}: Record<string, string> = {\n${byId.join('\n')}\n};\n\nexport const ${config.exportName}ByName: Record<string, string> = {\n${byName.join('\n')}\n};\n\nexport const ${config.slugExportName}: Record<string, string> = {\n${bySlug.join('\n')}\n};\n\nexport const ${config.abbreviationExportName}: Record<string, string> = {\n${byAbbreviation.join('\n')}\n};\n`;

  await writeFile(config.manifestPath, contents);
}

async function readSource(relativePath) {
  return readFile(path.join(rootDir, relativePath), 'utf8');
}

function collectSchoolAppTeams(source) {
  const teams = [];
  const matcher = /\{[^{}]*\}/g;
  let match;
  while ((match = matcher.exec(source))) {
    const objectText = match[0];
    const id = objectText.match(/id:\s*'([^']+)'/)?.[1];
    const name = objectText.match(/name:\s*'([^']+)'/)?.[1];
    if (!id || !name) continue;
    teams.push({
      id,
      name,
      shortName: objectText.match(/shortName:\s*'([^']+)'/)?.[1] ?? '',
      mascot: objectText.match(/mascot:\s*'([^']+)'/)?.[1] ?? '',
    });
  }
  return teams;
}

function collectNflAppTeams(source) {
  const teams = [];
  const matcher = /^\s*'?([^'":]+)'?:\s*\{\s*abbreviation:\s*'([^']+)'/gm;
  let match;
  while ((match = matcher.exec(source))) {
    teams.push({ name: match[1], abbreviation: match[2].toLowerCase() });
  }
  return teams;
}

const appSchoolAliases = {
  'appalachian-state': ['app-state-mountaineers', 'app'],
  fiu: ['florida-international-panthers', 'fiu'],
  hawaii: ['hawaii-rainbow-warriors', 'haw'],
  'louisiana-monroe': ['ul-monroe-warhawks', 'ulm'],
  'san-jose-state': ['san-jose-state-spartans', 'sjsu'],
};

function appSchoolMatched(team, records) {
  const id = normalizeKey(team.id);
  const name = normalizeKey(team.name);
  const mascot = normalizeKey(team.mascot);
  const shortName = normalizeKey(team.shortName);
  const aliases = appSchoolAliases[id] ?? [];

  return records.some((record) => {
    const recordName = normalizeKey(record.displayName);
    return (
      record.slug === id ||
      recordName === name ||
      (name && recordName.startsWith(`${name}-`)) ||
      (mascot && recordName.endsWith(`-${mascot}`)) ||
      (shortName && record.abbreviation === shortName.toLowerCase()) ||
      aliases.includes(record.slug) ||
      aliases.includes(record.abbreviation)
    );
  });
}

async function writeReport(collegeRecords, nflRecords) {
  const historicalSchools = collectSchoolAppTeams(await readSource('src/data/schoolRegistry.ts'));
  const fbsSchools = collectSchoolAppTeams(await readSource('src/data/fbsSchoolRegistry.ts'));
  const allSchools = [...new Map([...historicalSchools, ...fbsSchools].map((team) => [team.id, team])).values()];
  const nflTeams = collectNflAppTeams(await readSource('src/data/nflMapData.ts'));
  const nflAbbreviations = new Set(nflRecords.map((record) => record.abbreviation).filter(Boolean));

  report.collegeFootball.appTeamsMissingFromGeneratedMaps = allSchools
    .filter((team) => !appSchoolMatched(team, collegeRecords))
    .map((team) => ({ id: team.id, name: team.name, shortName: team.shortName || null, mascot: team.mascot || null }));

  report.nfl.appTeamsMissingFromGeneratedMaps = nflTeams
    .filter((team) => !nflAbbreviations.has(team.abbreviation))
    .map((team) => ({ name: team.name, abbreviation: team.abbreviation }));

  await writeFile(path.join(rootDir, 'scripts/logo-report.json'), `${JSON.stringify(report, null, 2)}\n`);
}

async function main() {
  const collegeRecords = await syncKind('collegeFootball');
  const nflRecords = await syncKind('nfl');
  await writeReport(collegeRecords, nflRecords);

  console.log(`Downloaded ${collegeRecords.length} college football logos.`);
  console.log(`Downloaded ${nflRecords.length} NFL logos.`);
  console.log('Generated src/data/generatedSchoolLogos.ts');
  console.log('Generated src/data/generatedNFLLogos.ts');
  console.log('Wrote scripts/logo-report.json');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
