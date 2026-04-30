import { heismans } from './heismans';
import type { HeismanHometownMarker, RelatedLink, RouteLine } from '../types/content';

export const normanAnchor = {
  id: 'norman-anchor',
  label: 'Norman, Oklahoma',
  latitude: 35.2059,
  longitude: -97.4457,
};

const hometownRegistry: Record<string, Omit<HeismanHometownMarker, 'summary' | 'position' | 'relatedLinks'>> = {
  'billy-vessels': {
    id: 'hometown-billy-vessels',
    playerId: 'billy-vessels',
    playerName: 'Billy Vessels',
    year: 1952,
    hometownCity: 'Cleveland',
    state: 'Oklahoma',
    latitude: 36.3076,
    longitude: -96.4634,
  },
  'steve-owens': {
    id: 'hometown-steve-owens',
    playerId: 'steve-owens',
    playerName: 'Steve Owens',
    year: 1969,
    hometownCity: 'Miami',
    state: 'Oklahoma',
    latitude: 36.8745,
    longitude: -94.8775,
  },
  'billy-sims': {
    id: 'hometown-billy-sims',
    playerId: 'billy-sims',
    playerName: 'Billy Sims',
    year: 1978,
    hometownCity: 'Hooks',
    state: 'Texas',
    latitude: 33.4665,
    longitude: -94.3977,
  },
  'jason-white': {
    id: 'hometown-jason-white',
    playerId: 'jason-white',
    playerName: 'Jason White',
    year: 2003,
    hometownCity: 'Tuttle',
    state: 'Oklahoma',
    latitude: 35.2901,
    longitude: -97.8123,
  },
  'sam-bradford': {
    id: 'hometown-sam-bradford',
    playerId: 'sam-bradford',
    playerName: 'Sam Bradford',
    year: 2008,
    hometownCity: 'Oklahoma City',
    state: 'Oklahoma',
    latitude: 35.4676,
    longitude: -97.5164,
  },
  'baker-mayfield': {
    id: 'hometown-baker-mayfield',
    playerId: 'baker-mayfield',
    playerName: 'Baker Mayfield',
    year: 2017,
    hometownCity: 'Austin',
    state: 'Texas',
    latitude: 30.2672,
    longitude: -97.7431,
  },
  'kyler-murray': {
    id: 'hometown-kyler-murray',
    playerId: 'kyler-murray',
    playerName: 'Kyler Murray',
    year: 2018,
    hometownCity: 'Allen',
    state: 'Texas',
    latitude: 33.1032,
    longitude: -96.6706,
  },
};

export const heismanHometowns: HeismanHometownMarker[] = heismans.flatMap((winner) => {
  const hometown = hometownRegistry[winner.id];
  if (!hometown) return [];

  const relatedLinks: RelatedLink[] = [
    { type: 'heisman', id: winner.id, label: `${winner.year} Heisman` },
    ...(winner.featured ? [{ type: 'feature' as const, id: winner.id, label: `${winner.name} exhibit` }] : []),
  ];

  return [
    {
      ...hometown,
      position: winner.position,
      summary: winner.summary,
      relatedLinks,
    },
  ];
});

export const heismanRoutes: RouteLine[] = heismanHometowns.map((winner) => ({
  id: `route-${winner.playerId}`,
  fromId: winner.id,
  toId: normanAnchor.id,
  fromLatitude: winner.latitude,
  fromLongitude: winner.longitude,
  toLatitude: normanAnchor.latitude,
  toLongitude: normanAnchor.longitude,
  kind: 'heisman',
  emphasis: winner.playerId === 'baker-mayfield' || winner.playerId === 'kyler-murray' ? 'medium' : 'low',
}));
