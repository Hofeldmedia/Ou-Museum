import { coaches } from './coaches';
import type { ChampionshipVenueEntry, ChampionshipVenueMarker, RouteLine } from '../types/content';

export const championshipVenueEntries: ChampionshipVenueEntry[] = [
  {
    id: 'title-site-1950',
    seasonYear: 1950,
    championshipLabel: '1950 National Championship',
    venueName: 'Owen Field Context Site',
    city: 'Norman',
    state: 'Oklahoma',
    latitude: 35.2059,
    longitude: -97.4457,
    coachId: 'bud-wilkinson',
    opponent: 'Texas',
    result: 'W 14-13',
    titleContext: 'Poll-era title season; this starter data uses a representative defining venue rather than a single official title game site.',
    venueNote: 'Poll-era venue context should be verified and refined later.',
    relatedChampionshipId: 'title-1950',
    dataStatus: 'verify',
  },
  {
    id: 'title-site-1955',
    seasonYear: 1955,
    championshipLabel: '1955 National Championship',
    venueName: 'Orange Bowl',
    city: 'Miami',
    state: 'Florida',
    latitude: 25.7841,
    longitude: -80.2102,
    coachId: 'bud-wilkinson',
    opponent: 'Maryland',
    result: 'W 20-6',
    titleContext: 'Poll-era title season paired here with a defining postseason venue.',
    venueNote: 'Venue wording should remain careful because national-title determination was poll-based.',
    relatedChampionshipId: 'title-1955',
    dataStatus: 'verify',
  },
  {
    id: 'title-site-1956',
    seasonYear: 1956,
    championshipLabel: '1956 National Championship',
    venueName: 'Dallas Memorial Stadium Context Site',
    city: 'Dallas',
    state: 'Texas',
    latitude: 32.7801,
    longitude: -96.8003,
    coachId: 'bud-wilkinson',
    opponent: 'Texas',
    result: 'W 45-0',
    titleContext: 'Poll-era title season; this starter entry highlights a defining venue from the title run.',
    venueNote: 'Poll-era venue context should be verified and refined later.',
    relatedChampionshipId: 'title-1956',
    dataStatus: 'verify',
  },
  {
    id: 'title-site-1974',
    seasonYear: 1974,
    championshipLabel: '1974 National Championship',
    venueName: 'Cotton Bowl Context Site',
    city: 'Dallas',
    state: 'Texas',
    latitude: 32.7797,
    longitude: -96.7599,
    coachId: 'barry-switzer',
    opponent: 'Texas',
    result: 'W 16-13',
    titleContext: 'This title was recognized through end-of-season championship voting rather than a modern standalone title game.',
    venueNote: 'Starter venue context; verify for final historical labeling.',
    relatedChampionshipId: 'title-1974',
    dataStatus: 'verify',
  },
  {
    id: 'title-site-1975',
    seasonYear: 1975,
    championshipLabel: '1975 National Championship',
    venueName: 'Orange Bowl',
    city: 'Miami',
    state: 'Florida',
    latitude: 25.7841,
    longitude: -80.2102,
    coachId: 'barry-switzer',
    opponent: 'Michigan',
    result: 'W 14-6',
    titleContext: 'A defining postseason venue tied to OU’s repeat title season.',
    venueNote: 'Postseason venue used here as title context.',
    relatedChampionshipId: 'title-1975',
    dataStatus: 'verify',
  },
  {
    id: 'title-site-1985',
    seasonYear: 1985,
    championshipLabel: '1985 National Championship',
    venueName: 'Orange Bowl',
    city: 'Miami',
    state: 'Florida',
    latitude: 25.7841,
    longitude: -80.2102,
    coachId: 'barry-switzer',
    opponent: 'Penn State',
    result: 'W 25-10',
    titleContext: 'A defining postseason venue tied to OU’s return to No. 1.',
    venueNote: 'Postseason venue used here as title context.',
    relatedChampionshipId: 'title-1985',
    dataStatus: 'reference',
  },
  {
    id: 'title-site-2000',
    seasonYear: 2000,
    championshipLabel: '2000 National Championship',
    venueName: 'Orange Bowl',
    city: 'Miami Gardens',
    state: 'Florida',
    latitude: 25.958,
    longitude: -80.2389,
    coachId: 'bob-stoops',
    opponent: 'Florida State',
    result: 'W 13-2',
    titleContext: 'The BCS-era title game site that completed OU’s modern revival.',
    venueNote: 'Venue naming and exact site can be refined if the historical display needs more precision.',
    relatedChampionshipId: 'title-2000',
    dataStatus: 'reference',
  },
];

export const championshipVenueMarkers: ChampionshipVenueMarker[] = Object.values(
  championshipVenueEntries.reduce<Record<string, ChampionshipVenueMarker>>((accumulator, entry) => {
    const key = `${entry.venueName}|${entry.city}|${entry.state}`;
    const current = accumulator[key];

    if (current) {
      current.seasons.push(entry);
      return accumulator;
    }

    accumulator[key] = {
      id: `venue-${entry.venueName.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}-${entry.city.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`,
      venueName: entry.venueName,
      city: entry.city,
      state: entry.state,
      latitude: entry.latitude,
      longitude: entry.longitude,
      seasons: [entry],
    };

    return accumulator;
  }, {}),
);

export const championshipRouteLines: RouteLine[] = championshipVenueEntries.map((entry) => ({
  id: `championship-route-${entry.id}`,
  fromId: 'norman',
  toId: entry.id,
  fromLatitude: 35.2059,
  fromLongitude: -97.4457,
  toLatitude: entry.latitude,
  toLongitude: entry.longitude,
  kind: 'championship',
  emphasis: entry.seasonYear === 2000 ? 'high' : 'medium',
}));

export function getCoachName(coachId: string) {
  return coaches.find((coach) => coach.id === coachId)?.name ?? coachId;
}
