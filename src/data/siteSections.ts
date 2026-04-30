import type { SiteSection } from '../types/content';

export const siteSections: SiteSection[] = [
  { id: 'hub', label: 'Museum Hub', title: 'Choose an Exhibit', description: 'Jump into the OU football museum experience.', order: 0, featured: false },
  { id: 'quizzes', label: 'Quiz Challenges', title: 'Quiz Challenges', description: 'Timed and standard museum knowledge challenges.', order: 1, featured: true },
  { id: 'map', label: 'Conference Map', title: 'Conference Atlas', description: 'Explore OU’s league lineage from Big Six to SEC.', order: 1, featured: true },
  { id: 'map', label: 'Conference Map', title: 'Conference Atlas', description: 'Explore OU’s league lineage from Big Six to SEC.', order: 2, featured: true },
  { id: 'fbs-landscape', label: 'FBS 2026', title: '2026 FBS Landscape', description: 'A national map of projected 2026 FBS conference alignment.', order: 3, featured: true },
  { id: 'championships', label: 'Championships', title: 'National Championships', description: 'Seven official OU title seasons.', order: 4, featured: true },
  { id: 'coaches', label: 'Coaches', title: 'Important Coaches', description: 'Program leaders who shaped OU identity.', order: 5, featured: true },
  { id: 'heismans', label: 'Heismans', title: 'Heisman Winners', description: 'All seven Oklahoma Heisman Trophy winners.', order: 6, featured: true },
  { id: 'nfl', label: 'NFL Sooners', title: 'Sooners in the NFL', description: 'Searchable OU-to-NFL starter database.', order: 7, featured: true },
  { id: 'rivalries', label: 'Rivalries', title: 'Rivalry Gallery', description: 'Texas, Nebraska, Oklahoma State, and Missouri as identity-shaping opponents.', order: 8, featured: true },
  { id: 'baker', label: 'Baker', title: 'Baker Mayfield', description: 'A marquee feature on OU’s walk-on Heisman star.', order: 9, featured: true },
  { id: 'venables', label: 'Venables', title: 'Brent Venables', description: 'A current-era feature on defense, culture, and the SEC.', order: 10, featured: true },
  { id: 'timeline', label: 'Timeline', title: 'Timeline Puzzle', description: 'Chronological assessment activity.', order: 12, featured: false },
  { id: 'connections', label: 'Connections', title: 'Cause and Effect', description: 'Matching assessment activity.', order: 11, featured: false },
];
