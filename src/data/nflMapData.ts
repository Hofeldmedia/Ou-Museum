import { nflSooners } from './nflSooners';
import { normanAnchor } from './heismanMapData';
import type { NFLDestinationMarker, NFLMapPlayerRoute, RouteLine } from '../types/content';

export const nflTeamRegistry: Record<string, { abbreviation: string; city: string; state: string; latitude: number; longitude: number; espnId?: string }> = {
  Browns: { abbreviation: 'cle', city: 'Cleveland', state: 'Ohio', latitude: 41.4993, longitude: -81.6944, espnId: '5' },
  Panthers: { abbreviation: 'car', city: 'Charlotte', state: 'North Carolina', latitude: 35.2271, longitude: -80.8431, espnId: '29' },
  Rams: { abbreviation: 'lar', city: 'Los Angeles', state: 'California', latitude: 34.0522, longitude: -118.2437, espnId: '14' },
  Buccaneers: { abbreviation: 'tb', city: 'Tampa', state: 'Florida', latitude: 27.9506, longitude: -82.4572, espnId: '27' },
  Cardinals: { abbreviation: 'ari', city: 'Phoenix', state: 'Arizona', latitude: 33.4484, longitude: -112.074, espnId: '22' },
  Cowboys: { abbreviation: 'dal', city: 'Arlington', state: 'Texas', latitude: 32.7357, longitude: -97.1081, espnId: '6' },
  Commanders: { abbreviation: 'wsh', city: 'Washington', state: 'District of Columbia', latitude: 38.9072, longitude: -77.0369, espnId: '28' },
  '49ers': { abbreviation: 'sf', city: 'Santa Clara', state: 'California', latitude: 37.3541, longitude: -121.9552, espnId: '25' },
  Vikings: { abbreviation: 'min', city: 'Minneapolis', state: 'Minnesota', latitude: 44.9778, longitude: -93.265, espnId: '16' },
  Saints: { abbreviation: 'no', city: 'New Orleans', state: 'Louisiana', latitude: 29.9511, longitude: -90.0715, espnId: '18' },
  Lions: { abbreviation: 'det', city: 'Detroit', state: 'Michigan', latitude: 42.3314, longitude: -83.0458, espnId: '8' },
  Titans: { abbreviation: 'ten', city: 'Nashville', state: 'Tennessee', latitude: 36.1627, longitude: -86.7816, espnId: '10' },
  Seahawks: { abbreviation: 'sea', city: 'Seattle', state: 'Washington', latitude: 47.6062, longitude: -122.3321, espnId: '26' },
  Bengals: { abbreviation: 'cin', city: 'Cincinnati', state: 'Ohio', latitude: 39.1031, longitude: -84.512, espnId: '4' },
  Texans: { abbreviation: 'hou', city: 'Houston', state: 'Texas', latitude: 29.7604, longitude: -95.3698, espnId: '34' },
  Chiefs: { abbreviation: 'kc', city: 'Kansas City', state: 'Missouri', latitude: 39.0997, longitude: -94.5786, espnId: '12' },
  Eagles: { abbreviation: 'phi', city: 'Philadelphia', state: 'Pennsylvania', latitude: 39.9526, longitude: -75.1652, espnId: '21' },
  Ravens: { abbreviation: 'bal', city: 'Baltimore', state: 'Maryland', latitude: 39.2904, longitude: -76.6122, espnId: '33' },
  Chargers: { abbreviation: 'lac', city: 'Los Angeles', state: 'California', latitude: 34.0522, longitude: -118.2437, espnId: '24' },
  Patriots: { abbreviation: 'ne', city: 'Foxborough', state: 'Massachusetts', latitude: 42.0654, longitude: -71.2478, espnId: '17' },
  Raiders: { abbreviation: 'lv', city: 'Las Vegas', state: 'Nevada', latitude: 36.1699, longitude: -115.1398, espnId: '13' },
};

export const nflMapRoutes: NFLMapPlayerRoute[] = nflSooners.flatMap((player) =>
  player.nflTeams.flatMap((teamName) => {
    const team = nflTeamRegistry[teamName];
    if (!team) return [];

    return [
      {
        id: `${player.id}-${teamName.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`,
        playerId: player.id,
        playerName: player.name,
        teamAbbreviation: team.abbreviation,
        teamEspnId: team.espnId,
        position: player.position,
        active: player.active,
        featured: player.featured,
        nflStatus: player.nflStatus,
        teamName,
        city: team.city,
        state: team.state,
        latitude: team.latitude,
        longitude: team.longitude,
        ouSummary: player.ouSummary,
        nflSummary: player.nflSummary,
      },
    ];
  }),
);

export const nflDestinationMarkers: NFLDestinationMarker[] = Object.values(
  nflMapRoutes.reduce<Record<string, NFLDestinationMarker>>((accumulator, route) => {
    if (!accumulator[route.teamName]) {
      accumulator[route.teamName] = {
        id: `nfl-destination-${route.teamName.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`,
        teamAbbreviation: route.teamAbbreviation,
        teamEspnId: route.teamEspnId,
        teamName: route.teamName,
        city: route.city,
        state: route.state,
        latitude: route.latitude,
        longitude: route.longitude,
        playerIds: [],
      };
    }

    accumulator[route.teamName].playerIds.push(route.playerId);
    return accumulator;
  }, {}),
);

export const nflRouteLines: RouteLine[] = nflMapRoutes.map((route) => ({
  id: `nfl-line-${route.id}`,
  fromId: normanAnchor.id,
  toId: route.id,
  fromLatitude: normanAnchor.latitude,
  fromLongitude: normanAnchor.longitude,
  toLatitude: route.latitude,
  toLongitude: route.longitude,
  kind: 'nfl',
  emphasis: route.active ? 'medium' : 'low',
}));
