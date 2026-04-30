import { rivalries } from './immersive';
import { schoolRegistry } from './schoolRegistry';
import { normanAnchor } from './heismanMapData';
import type { RivalryConnection, RouteLine } from '../types/content';

const significanceMap: Record<string, RivalryConnection['significance']> = {
  texas: 'foundational',
  nebraska: 'foundational',
  'oklahoma-state': 'major',
  missouri: 'modern',
};

const keyErasMap: Record<string, string[]> = {
  texas: ['Early era', 'Big 12 era', 'SEC era'],
  nebraska: ['Big Eight era', 'National title races'],
  'oklahoma-state': ['Big Eight era', 'Big 12 era'],
  missouri: ['Big Eight era', 'Big 12 era', 'SEC bridge'],
};

export const rivalryConnections: RivalryConnection[] = rivalries.flatMap((rivalry) => {
  const school = schoolRegistry.find((entry) => entry.id === rivalry.id);
  if (!school) return [];

  return [
    {
      id: `rivalry-${rivalry.id}`,
      rivalryId: rivalry.id,
      rivalSchoolId: school.id,
      schoolName: school.name,
      city: school.city,
      state: school.state,
      latitude: school.latitude,
      longitude: school.longitude,
      rivalryLabel: rivalry.title,
      significance: significanceMap[school.id] ?? 'major',
      keyEras: keyErasMap[school.id] ?? ['Conference eras'],
      summary: rivalry.conferenceImplication,
      tone: rivalry.emotionalTone,
      relatedLinks: rivalry.relatedLinks,
    },
  ];
});

export const rivalryRouteLines: RouteLine[] = rivalryConnections.map((rivalry) => ({
  id: `rivalry-line-${rivalry.rivalryId}`,
  fromId: normanAnchor.id,
  toId: rivalry.id,
  fromLatitude: normanAnchor.latitude,
  fromLongitude: normanAnchor.longitude,
  toLatitude: rivalry.latitude,
  toLongitude: rivalry.longitude,
  kind: 'rivalry',
  emphasis: rivalry.significance === 'foundational' ? 'high' : rivalry.significance === 'major' ? 'medium' : 'low',
}));
