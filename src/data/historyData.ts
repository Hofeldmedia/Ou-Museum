import type { MatchPair, TimelineEvent } from '../types';

export const timelineEvents: TimelineEvent[] = [
  {
    id: 'big8-era',
    year: 1928,
    title: 'OU’s Big 8 Roots Begin',
    shortLabel: 'Big 8 roots',
    description: 'OU’s long conference story grows from the Missouri Valley / Big Six lineage that later becomes the Big 8.',
  },
  {
    id: 'wilkinson',
    year: 1947,
    title: 'Bud Wilkinson Arrives',
    shortLabel: 'Wilkinson era',
    description: 'Wilkinson turns OU into a disciplined national dynasty.',
  },
  {
    id: 'streak',
    year: 1953,
    title: '47-Game Win Streak Begins',
    shortLabel: '47-game streak',
    description: 'The Sooners start the longest winning streak in major college football history.',
  },
  {
    id: 'switzer',
    year: 1973,
    title: 'Barry Switzer Takes Over',
    shortLabel: 'Switzer prominence',
    description: 'Switzer’s teams pair option football with championship expectations.',
  },
  {
    id: 'big12-forms',
    year: 1996,
    title: 'Big 12 Launches',
    shortLabel: 'Big 12 forms',
    description: 'The Big 8 merges with Texas schools from the Southwest Conference.',
  },
  {
    id: 'stoops',
    year: 2000,
    title: 'Bob Stoops Revival',
    shortLabel: '2000 title',
    description: 'OU wins a national championship and reenters the national spotlight.',
  },
  {
    id: 'sec-announced',
    year: 2021,
    title: 'SEC Move Announced',
    shortLabel: 'SEC announced',
    description: 'Oklahoma and Texas announce plans to leave the Big 12 for the SEC.',
  },
  {
    id: 'sec-joins',
    year: 2024,
    title: 'OU Joins the SEC',
    shortLabel: 'SEC arrival',
    description: 'OU begins a new chapter in the Southeastern Conference.',
  },
];

export const matchPairs: MatchPair[] = [
  {
    id: 'realignment',
    cause: 'Conference realignment',
    effect: 'New competitive landscape',
    explanation: 'League moves change schedules, recruiting, travel, and national perception.',
  },
  {
    id: 'tv',
    cause: 'TV money and media rights',
    effect: 'Pressure to shift conferences',
    explanation: 'Broadcast value became a major force in modern college sports decisions.',
  },
  {
    id: 'coaching',
    cause: 'Coaching stability',
    effect: 'Sustained success',
    explanation: 'Strong systems helped OU turn talent into repeated championship contention.',
  },
  {
    id: 'national',
    cause: 'National relevance',
    effect: 'Conference influence',
    explanation: 'Winning programs shape the identity and power of their leagues.',
  },
];

export const takeaways = [
  'OU’s football legacy grew through eras of coaching, rivalry, and national titles.',
  'The Big 8 gave OU its classic regional identity.',
  'The Big 12 connected older traditions to modern media-driven college football.',
  'The SEC move shows how conference history keeps changing.',
  'Realignment is about culture, competition, money, and geography at once.',
];
