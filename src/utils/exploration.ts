import { conferenceEras } from '../data/conferences';
import type { ExploredSchools } from '../types';
import type { ConferenceEra } from '../types/content';

export function getEraExplored(eraId: string, exploredSchools: ExploredSchools) {
  return exploredSchools[eraId] ?? [];
}

export function isEraComplete(era: ConferenceEra, exploredSchools: ExploredSchools) {
  const explored = getEraExplored(era.id, exploredSchools);
  return era.schools.every((school) => explored.includes(school.id));
}

export function isConferenceExplorationComplete(exploredSchools: ExploredSchools) {
  return conferenceEras.every((era) => isEraComplete(era, exploredSchools));
}
