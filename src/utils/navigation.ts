import type { Screen } from '../types';
import type { RelatedLink } from '../types/content';

export function relatedLinkToRoute(link: RelatedLink): { screen: Screen; targetId?: string } {
  if (link.type === 'championship') return { screen: 'championships', targetId: link.id };
  if (link.type === 'coach') return { screen: 'coaches', targetId: link.id };
  if (link.type === 'heisman') return { screen: 'heismans', targetId: link.id };
  if (link.type === 'nfl') return { screen: 'nfl', targetId: link.id };
  if (link.type === 'feature') return { screen: link.id === 'brent-venables' ? 'venables' : 'baker' };
  if (link.type === 'conference') return { screen: 'map' };
  if (link.type === 'assessment') return { screen: link.id === 'connections' ? 'connections' : 'timeline' };
  if (link.type === 'rivalry') return { screen: 'rivalries', targetId: link.id };
  return { screen: 'hub' };
}
