# Interactive Museum Demo: OU Football History Museum

A premium web-based Oklahoma Sooners football history museum. The app now combines cinematic storytelling, guided/free exploration modes, artifact cases, rivalry galleries, comparison tools, a real U.S. conference map, and optional puzzle/assessment activities.

## Setup

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in your terminal.

To verify a production build:

```bash
npm run build
```

## OU Digital Brand System

The visual system is aligned to OU's public digital brand guidance where practical:

- Oklahoma Crimson: `#841617`
- Black: `#000000`
- Dark Gray: `#323232`
- Light Gray: `#F0F0F0`
- White: `#FFFFFF`
- Minimal accents: Dark Crimson `#4E0002`, Sky `#BCDCEB`, Leaf `#8CA57D`, Stone `#BEB4A5`

Oklahoma Cream is not used as a primary digital UI background. OU guidance reserves cream for print, so the app uses white, light gray, dark gray, black, and subtle texture instead of warm cream surfaces.

Typography is defined with role-based CSS variables in `src/styles.css` and Tailwind font tokens in `tailwind.config.js`:

- `--font-headline`: Mongoose role, used through `font-display`, all caps
- `--font-body`: Arboria role, used for body/UI copy
- `--font-accent`: Obviously Wide role, used sparingly as outlined accent text
- `--font-editorial`: Freight role, used for curator/reflection copy

The exact OU brand fonts are not bundled in this project. The app currently uses responsible fallbacks that preserve the hierarchy: condensed bold sans for Mongoose, clean sans for Arboria, wide display sans for Obviously Wide, and editorial serif for Freight. To install licensed OU fonts later, place them in the project through your normal font pipeline and update the CSS variables in `src/styles.css`; component class names do not need to change.

## Conference Logo Assets

Conference logos are centralized in `src/data/conferenceLogos.ts` and rendered through `src/components/ui/ConferenceLogo.tsx`. Conference logos should always be local assets; do not point conference logo config or components at remote ESPN, SportsLogos, or other third-party image URLs. ESPN URLs remain acceptable for school, NFL team, and player imagery where the app already uses those sources.

Required local conference-logo filenames live in:

```text
public/assets/conference-logos/
  big-eight.png
  big-12-old.png
  big-12-new.png
  sec.png
  pac-12-new.png
  acc.png
  american.png
  big-ten.png
  conference-usa.png
  mac.png
  mountain-west.png
  sun-belt.png
  independents.png
```

If one of those files is missing, `ConferenceLogo` shows a clean text badge fallback and logs a development warning instead of exposing a broken image icon. Add or replace official assets in this folder, then update only `src/data/conferenceLogos.ts` if a mapping changes.

Pac-12 released a new primary mark on April 27, 2026. Full brand identity guidelines are expected ahead of the 2026-27 season. The projected 2026 Pac-12 landscape should use `/assets/conference-logos/pac-12-new.png`.

## Game Flow

1. **Home** opens with a cinematic landing experience, Museum Mode toggle, optional audio, and Choose Your Path options.
2. **Museum Hub** lets users jump to galleries, artifacts, and narrative paths.
3. **Explore the Conferences** is a learn mode. Learners move through Big Six, Big Seven, Big Eight, Big 12, and SEC eras and click every member school on a real U.S. map.
4. **National Championships** covers OU's seven recognized title seasons.
5. **Important Coaches** profiles major program leaders.
6. **Heisman Winners** presents all seven OU Heisman winners.
7. **Sooners in the NFL** provides a searchable, filterable starter database.
8. **Rivalry Gallery** explores Texas, Nebraska, Oklahoma State, and Missouri.
9. **Baker Mayfield** and **Brent Venables** are premium feature exhibits.
10. **Timeline Puzzle** and **Cause & Effect** provide optional assessment activities.
11. **Legacy Summary** acts as a capstone with replay paths.

Guided Tour mode uses progression and unlocks. Free Explore mode opens navigation for non-linear browsing. The conference exploration stage requires every school marker in every required era to be clicked at least once before guided assessments unlock.

## Editing Historical Content

Editable activity content lives in:

```text
src/data/championships.ts
src/data/coaches.ts
src/data/conferences.ts
src/data/featuredPeople.ts
src/data/heismans.ts
src/data/immersive.ts
src/data/nflSooners.ts
src/data/siteSections.ts
src/data/historyData.ts
src/types/content.ts
```

Shared interfaces live in `src/types/content.ts`. Add fields there first when a new content pattern should be supported across multiple sections.

## App Architecture

Core product structure is split into reusable app-shell and section modules:

- `src/components/MuseumLayout.tsx`: `MuseumLayout`, `ExhibitContainer`, `SectionNav`, `HeroLanding`, `IntroSequence`, and page transitions
- `src/components/MuseumComponents.tsx`: shared exhibit primitives such as `SectionHero`, `StatPill`, related links, artifacts, comparison panels, and reflection prompts
- `src/components/sections/SectionHub.tsx`: museum directory cards and artifact case
- `src/components/sections/AssessmentScreens.tsx`: timeline, connections, and final summary screens
- `src/components/experience/`: guided-tour narrative and optional ambient audio helpers
- `src/utils/navigation.ts`: shared related-link route resolution
- `src/components/map/`: real U.S. conference map, marker layer, logo markers, legend, and controls

Use `src/data/conferences.ts` to change:

- conference era names, years, and descriptions
- member schools for each era
- school notes and OU context notes
- projected map positions generated from latitude/longitude

Use `src/data/championshipMapData.ts` to edit Championship Sites:

- add or update defining title venues
- adjust `titleContext` wording when a season was awarded through final polls
- use `dataStatus: "verify"` for entries that still need tighter historical venue confirmation

Use `src/data/recruitingMapData.ts` to edit Recruiting Footprint:

- add or update recruiting regions
- change `intensity` values (`core`, `strong`, `emerging`, `historical`)
- tune region `radius` values for the heat-circle footprint
- update era tags, notable players, and position trends

To add future map layers later:

- define new typed data in `src/types/content.ts`
- add a data file under `src/data/`
- add a layer renderer under `src/components/map/`
- register the layer in `MapLayerSwitcher`, `USConferenceMap`, and `ConferenceExplorerScreen`

The conference map is built from separate layers:

- `src/data/schoolRegistry.ts`: stable school identity, city/state, latitude, and longitude
- `src/data/conferenceMembership.ts`: era definitions, member school IDs, era notes, and OU context
- `src/data/logoManifest.ts`: era-specific logo asset paths and historical-accuracy status
- `src/data/championshipMapData.ts`: championship venue markers and Norman-to-venue routes
- `src/data/recruitingMapData.ts`: regional recruiting footprint circles and metadata
- `src/utils/mapProjection.ts`: converts latitude/longitude into responsive SVG map positions
- `src/components/map/`: U.S. map rendering, marker layer, logo badges, legend, and controls
- `public/assets/maps/us-map.svg`: static continental U.S. base map

Logo assets live under:

```text
public/assets/logos/
  big-six/
  big-seven/
  big-eight/
  big-12/
  sec/
  placeholders/
```

Naming convention:

```text
public/assets/logos/<era-id>/<school-id>.svg
```

Example:

```text
public/assets/logos/big-eight/nebraska.svg
```

Do not fabricate official university logos or embed logo binaries in code. React components do not import logo files directly; they receive resolved logo metadata from `src/utils/getSchoolLogo.ts`, which reads `src/data/logoManifest.ts`.

The current logo files are local placeholder badges in `public/assets/logos/placeholders`. Era folders are intentionally reserved for supplied historical assets. To add a licensed or verified historical logo later, drop the asset into the correct era folder, then update `src/data/logoManifest.ts`:

- set `assetPath`
- set `accuracy` to `exact`, `approximate`, or `placeholder`
- set `isHistoricalExact`
- add a short `note` or source-tracking reminder

If an era-specific asset is missing, the app falls back to the placeholder badge and then to text initials.

Use `src/data/championships.ts` to add or edit a national championship season. Each entry includes the year, title, `coachId`, record, conference, season summary, key games, notable players, milestones, and related IDs.

Use `src/data/coaches.ts` to add or edit a coach profile. Each coach includes years, role, record, philosophy, legacy text, championships, conference titles, notable players, tags, and related championship IDs.

Use `src/data/heismans.ts` to add or edit a Heisman winner. Each entry includes summary, season context, why the player won, OU legacy, stat blocks, milestones, related coach IDs, related championship IDs, and tags.

Use `src/data/nflSooners.ts` to add or edit NFL alumni. Each entry is starter data, not a complete all-time database. NFL roster fields are intentionally easy to update:

- Stable OU/pro biography fields: `ouYears`, `ouSummary`, `nflSummary`, `draftYear`, `draftRound`, `draftPick`, `tags`
- Roster/status fields to review periodically: `currentTeam`, `nflStatus`, `active`, `featured`

The page is searchable and filterable by status, position, NFL team, era, and featured flag. Current teams and active statuses should be reviewed periodically.

Use `src/data/featuredPeople.ts` to edit the special Baker Mayfield and Brent Venables feature pages.

Use `src/data/siteSections.ts` to edit main navigation labels, section titles, section descriptions, ordering, and which sections appear on the museum hub.

Use `src/data/historyData.ts` to change timeline events, matching pairs, and final takeaways.

Use `src/data/immersive.ts` to edit:

- Guided Tour chapters and era tone labels
- Choose Your Path entry points
- artifact cards and artifact viewer content
- signature moments
- rivalry profiles

This prototype uses representative membership snapshots for educational purposes and can be refined further for year-by-year accuracy.

## Special Feature Pages

- **Baker Mayfield**: walk-on journey, 2017 Heisman season, OU legacy, NFL draft note, milestones, and highlight modules.
- **Brent Venables**: OU connection, defensive identity, program-building themes, SEC transition storyline, and milestones.

## Screenshot

Run the app locally and add a screenshot here when you are ready to document the prototype visually.
