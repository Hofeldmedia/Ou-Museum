import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const appDataFiles = [
  'src/data/fbsSchoolRegistry.ts',
  'src/data/schoolRegistry.ts',
];
const generatedLogoFile = 'src/data/generatedSchoolLogos.ts';

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function normalizeName(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[.'’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function toSlug(value = '') {
  return normalizeName(value).replace(/\s+/g, '-');
}

function parseObjects(source, sourceFile) {
  const rows = [];
  const objectPattern = /\{[^{}]*\}/g;
  for (const match of source.matchAll(objectPattern)) {
    const body = match[0];
    const id = body.match(/\bid:\s*'([^']+)'/)?.[1];
    const name = body.match(/\bname:\s*'((?:\\'|[^'])+)'/)?.[1]?.replace(/\\'/g, "'");
    if (!id || !name) continue;
    rows.push({
      sourceFile,
      id,
      name,
      shortName: body.match(/\bshortName:\s*'((?:\\'|[^'])+)'/)?.[1]?.replace(/\\'/g, "'") ?? null,
      mascot: body.match(/\bmascot:\s*'((?:\\'|[^'])+)'/)?.[1]?.replace(/\\'/g, "'") ?? null,
      espnId: body.match(/\bespnId:\s*'([^']+)'/)?.[1] ?? null,
    });
  }
  return rows;
}

function parseGeneratedMap(source, exportName) {
  const block = source.match(new RegExp(`export const ${exportName}: Record<[^>]+> = \\{([\\s\\S]*?)\\n\\};`))?.[1] ?? '';
  const map = new Map();
  for (const match of block.matchAll(/"([^"]+)":\s*(_[A-Za-z0-9]+),/g)) {
    map.set(match[1], match[2]);
  }
  return map;
}

function groupedCollisions(items, keyFn, valueFn = item => item) {
  const groups = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (!key) continue;
    const values = groups.get(key) ?? [];
    values.push(valueFn(item));
    groups.set(key, values);
  }
  return [...groups.entries()]
    .filter(([, values]) => new Set(values.map(v => JSON.stringify(v))).size > 1)
    .map(([key, values]) => ({ key, values }));
}

const schools = appDataFiles.flatMap(file => parseObjects(read(file), file));
const generatedSource = read(generatedLogoFile);
const generatedById = parseGeneratedMap(generatedSource, 'generatedSchoolLogos');
const generatedByName = parseGeneratedMap(generatedSource, 'generatedSchoolLogosByName');
const generatedBySlug = parseGeneratedMap(generatedSource, 'generatedSchoolLogosBySlug');

const exactFullDisplaySlugBySchoolId = {
  'appalachian state': 'app-state-mountaineers',
  fiu: 'florida-international-panthers',
  hawaii: 'hawaii-rainbow-warriors',
  'louisiana monroe': 'ul-monroe-warhawks',
  'san jose state': 'san-jose-state-spartans',
  'texas am': 'texas-am-aggies',
  'ferris state': 'ferris-state-bulldogs',
};

const schoolLogoEspnIdOverrides = {
  'oregon state': '204',
  'ohio state': '194',
  minnesota: '135',
  'ferris state': '2222',
  umass: '113',
  massachusetts: '113',
  'massachusetts minutemen': '113',
  louisiana: '309',
  'louisiana ragin cajuns': '309',
  washington: '264',
  'washington huskies': '264',
};

const generatedNormalizedNames = new Map();
for (const [name, logo] of generatedByName) {
  const key = normalizeName(name);
  if (!generatedNormalizedNames.has(key)) generatedNormalizedNames.set(key, logo);
}

function deterministicLogoSource(school) {
  const normalizedId = normalizeName(school.id);
  const normalizedName = normalizeName(school.name);
  const overrideId = schoolLogoEspnIdOverrides[normalizedId] ?? schoolLogoEspnIdOverrides[normalizedName];
  const espnId = overrideId ?? school.espnId;
  if (espnId && generatedById.has(String(espnId))) return { source: overrideId ? 'override-espn-id' : 'espn-id', value: String(espnId) };

  if (generatedNormalizedNames.has(normalizedName)) return { source: 'exact-normalized-name', value: normalizedName };

  const nameSlug = toSlug(school.name);
  if (generatedBySlug.has(nameSlug)) return { source: 'exact-name-slug', value: nameSlug };

  const idSlug = toSlug(school.id);
  if (generatedBySlug.has(idSlug)) return { source: 'exact-id-slug', value: idSlug };

  const exactFullDisplaySlug = exactFullDisplaySlugBySchoolId[normalizedId];
  if (exactFullDisplaySlug && generatedBySlug.has(exactFullDisplaySlug)) return { source: 'exact-full-display-slug', value: exactFullDisplaySlug };

  return null;
}

const missingEspnId = schools
  .filter(school => !school.espnId)
  .map(({ sourceFile, id, name }) => ({ sourceFile, id, name }));

const placeholderFallback = schools
  .filter(school => !deterministicLogoSource(school))
  .map(({ sourceFile, id, name, espnId }) => ({ sourceFile, id, name, espnId }));

const duplicateNormalizedNames = groupedCollisions(
  schools,
  school => normalizeName(school.name),
  school => ({ sourceFile: school.sourceFile, id: school.id, name: school.name, espnId: school.espnId })
);

const generatedNameCollisions = groupedCollisions(
  [...generatedByName.keys()],
  name => normalizeName(name),
  name => name
);

const generatedSlugCollisions = groupedCollisions(
  [...generatedBySlug.keys()],
  slug => normalizeName(slug),
  slug => slug
);

const report = {
  generatedAt: new Date().toISOString(),
  summary: {
    appSchoolsChecked: schools.length,
    missingEspnId: missingEspnId.length,
    placeholderFallback: placeholderFallback.length,
    duplicateNormalizedNames: duplicateNormalizedNames.length,
    logoMapCollisions: generatedNameCollisions.length + generatedSlugCollisions.length,
  },
  missingEspnId,
  placeholderFallback,
  duplicateNormalizedNames,
  logoMapCollisions: {
    generatedNameCollisions,
    generatedSlugCollisions,
  },
};

fs.writeFileSync(path.join(root, 'scripts/logo-debug-report.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report.summary, null, 2));
