import type { FeaturedPerson } from '../types/content';

export const featuredPeople: Record<'baker' | 'venables', FeaturedPerson> = {
  baker: {
    id: 'baker-mayfield-feature',
    name: 'Baker Mayfield',
    slug: 'baker-mayfield',
    title: 'The Walk-On Who Reframed OU Swagger',
    category: 'Marquee Player Exhibit',
    heroSummary: 'Baker Mayfield’s OU story blends transfer risk, walk-on belief, Heisman production, and a lasting imprint on modern Sooners identity.',
    longSummary: 'Mayfield arrived at Oklahoma without the certainty normally attached to a future Heisman winner. His rise became a story about opportunity, confidence, and performance under pressure. By 2017, he was the center of one of college football’s defining player arcs.',
    milestoneTimeline: [
      { year: '2014', title: 'Transfers to OU', description: 'Begins a new chapter after starting his career at Texas Tech.' },
      { year: '2015', title: 'Takes over', description: 'Leads OU to the College Football Playoff.' },
      { year: '2017', title: 'Wins Heisman', description: 'Delivers an iconic quarterback season.' },
      { year: '2018', title: 'No. 1 pick', description: 'Becomes the top selection in the NFL Draft.' },
    ],
    statBlocks: [
      { label: 'Heisman', value: '2017' },
      { label: 'NFL Draft', value: 'No. 1' },
      { label: 'OU Years', value: '2015-17' },
    ],
    spotlightSections: [
      { title: 'Transfer and walk-on rise', body: 'Mayfield’s path helps learners discuss transfer rules, opportunity, and self-belief.' },
      { title: '2017 Heisman season', body: 'His efficiency, improvisation, and leadership made him the clear center of OU’s offense.' },
      { title: 'Legacy at OU', body: 'Mayfield gave modern OU football a bold, unmistakable personality.' },
      { title: 'NFL draft note', body: 'His No. 1 selection extended OU’s quarterback pipeline into the NFL.' },
    ],
    relatedLinks: [
      { type: 'heisman', id: 'baker-mayfield', label: '2017 Heisman profile' },
      { type: 'nfl', id: 'baker-mayfield', label: 'NFL profile' },
      { type: 'coach', id: 'lincoln-riley', label: 'Lincoln Riley era' },
    ],
  },
  venables: {
    id: 'brent-venables-feature',
    name: 'Brent Venables',
    slug: 'brent-venables',
    title: 'Defense, Culture, and the SEC Transition',
    category: 'Current Era Exhibit',
    heroSummary: 'Brent Venables connects OU’s defensive past to a demanding SEC future, emphasizing culture, recruiting, and physical identity.',
    longSummary: 'Venables returned to Oklahoma with deep ties to the Stoops revival and a reputation for defensive detail. His head-coaching chapter is closely tied to preparing OU for life in the SEC.',
    milestoneTimeline: [
      { year: '1999', title: 'Arrives with Stoops', description: 'Helps rebuild OU’s defensive standard.' },
      { year: '2000', title: 'National title staff', description: 'Contributes to the staff that restores OU to No. 1.' },
      { year: '2022', title: 'Returns as head coach', description: 'Begins a new program-building chapter.' },
      { year: '2024', title: 'SEC era begins', description: 'Leads OU into a new conference environment.' },
    ],
    statBlocks: [
      { label: 'Returned', value: '2022' },
      { label: 'Identity', value: 'Defense' },
      { label: 'Era', value: 'SEC' },
    ],
    spotlightSections: [
      { title: 'Coaching background', body: 'Venables’ OU connection reaches back to the Stoops revival and the 2000 title staff.' },
      { title: 'Defensive identity', body: 'His program vision emphasizes teaching detail, speed, and physicality.' },
      { title: 'Recruiting and culture', body: 'The current era asks OU to build depth and standards for a tougher league schedule.' },
      { title: 'SEC-era importance', body: 'Venables’ tenure is framed by the move into college football’s most visible conference.' },
    ],
    relatedLinks: [
      { type: 'coach', id: 'brent-venables', label: 'Coach profile' },
      { type: 'conference', id: 'sec', label: 'SEC transition map' },
      { type: 'assessment', id: 'timeline', label: 'Realignment timeline' },
    ],
  },
};
