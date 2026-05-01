export type ContentLinkType = 'championship' | 'coach' | 'heisman' | 'nfl' | 'feature' | 'conference' | 'assessment' | 'rivalry';
export type EraId =
  | 'big-six'
  | 'big-seven'
  | 'big-eight'
  | 'big-12-original'
  | 'big-12-post-nebraska-colorado'
  | 'big-12-tcu-west-virginia'
  | 'big-12-expanded'
  | 'big-12-current'
  | 'sec-2012'
  | 'sec-current';
export type LogoAccuracy = 'exact' | 'approximate' | 'placeholder';
export type MapLayerId = 'conference' | 'nfl' | 'rivalries' | 'recruiting';

export interface RelatedLink {
  type: ContentLinkType;
  id: string;
  label: string;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export interface StatBlock {
  label: string;
  value: string;
}

export interface TagOption {
  id: string;
  label: string;
  description?: string;
}

export interface ConferenceSchool {
  id: string;
  name: string;
  shortName: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  espnId?: string;
  isOU: boolean;
  note: string;
  ouContext: string;
  mascot?: string;
  logo: {
    light?: string;
    dark?: string;
    alt: string;
    accuracy: LogoAccuracy;
    status: 'era-accurate' | 'approximate' | 'placeholder';
    note?: string;
  };
}

export interface ConferenceEra {
  id: EraId;
  label: string;
  conference: string;
  eraName: string;
  years: string;
  description: string;
  changeSummary: string;
  previousSnapshotId?: EraId;
  nextSnapshotId?: EraId;
  schools: ConferenceSchool[];
  schoolIds: string[];
  addedSchoolIds: string[];
  removedSchoolIds: string[];
  accent?: string;
}

export interface SchoolRegistryEntry {
  id: string;
  name: string;
  shortName: string;
  mascot?: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  espnId?: string;
  isOU?: boolean;
}

export interface ConferenceMembershipEra {
  id: EraId;
  label: string;
  conference: string;
  years: string;
  description: string;
  changeSummary: string;
  schoolIds: string[];
  previousSnapshotId?: EraId;
  nextSnapshotId?: EraId;
  accent?: string;
}

export interface LogoManifestEntry {
  eraId: EraId;
  schoolId: string;
  assetPath: string;
  altText: string;
  accuracy: LogoAccuracy;
  variant?: 'light' | 'dark';
  darkAssetPath?: string;
  largeAssetPath?: string;
  fallbackAssetPath?: string;
  isHistoricalExact: boolean;
  note?: string;
}

export interface ResolvedLogoAsset {
  light?: string;
  dark?: string;
  alt: string;
  accuracy: LogoAccuracy;
  status: 'era-accurate' | 'approximate' | 'placeholder';
  note?: string;
  source: 'manifest' | 'espn' | 'placeholder' | 'initials';
  manifestEntry?: LogoManifestEntry;
}

export interface ChampionshipSeason {
  id: string;
  year: number;
  title: string;
  coachId: string;
  record: string;
  conference: string;
  summary: string;
  whyItMatters: string;
  titleRecognition: string;
  notablePlayers: string[];
  keyGames: Array<{ opponent: string; result: string; note: string }>;
  milestones: Milestone[];
  relatedCoachIds: string[];
  relatedPlayerIds: string[];
  tags: string[];
}

export interface CoachProfile {
  id: string;
  name: string;
  years: string;
  role: string;
  summary: string;
  philosophy: string;
  legacy: string;
  record: string;
  championships: number[];
  conferenceTitles: string;
  notablePlayers: string[];
  featured: boolean;
  eraLabel: string;
  relatedChampionshipIds: string[];
  tags: string[];
}

export interface HeismanWinner {
  id: string;
  name: string;
  year: number;
  position: string;
  summary: string;
  seasonContext: string;
  whyWon: string;
  ouLegacy: string;
  notableStats: StatBlock[];
  milestones: Milestone[];
  featured: boolean;
  relatedCoachIds: string[];
  relatedChampionshipIds: string[];
  tags: string[];
}

export type NFLStatus = 'active' | 'practice squad' | 'retired' | 'historical';

export interface NFLSooner {
  id: string;
  name: string;
  position: string;
  ouYears: string;
  nflTeams: string[];
  currentTeam: string;
  nflStatus: NFLStatus;
  draftYear: string;
  draftRound: string;
  draftPick: string;
  ouSummary: string;
  nflSummary: string;
  featured: boolean;
  active: boolean;
  tags: string[];
}

export interface FeaturedPerson {
  id: string;
  name: string;
  slug: string;
  title: string;
  category: string;
  heroSummary: string;
  longSummary: string;
  milestoneTimeline: Milestone[];
  statBlocks: StatBlock[];
  spotlightSections: Array<{ title: string; body: string }>;
  relatedLinks: RelatedLink[];
}

export interface SiteSection {
  id: string;
  label: string;
  title: string;
  description: string;
  order: number;
  featured: boolean;
}

export type MuseumMode = 'guided' | 'free';
export type MuseumPathId = 'history' | 'players' | 'coaches' | 'conferences' | 'nfl';

export interface MuseumPath {
  id: MuseumPathId;
  title: string;
  description: string;
  startScreen: string;
}

export interface TourChapter {
  id: string;
  title: string;
  screens: string[];
  narrative: string;
  eraLabel: string;
  tone: 'archival' | 'dynasty' | 'modern' | 'sec';
}

export interface MuseumArtifact {
  id: string;
  title: string;
  category: string;
  era: string;
  summary: string;
  context: string;
  significance: string;
  relatedLinks: RelatedLink[];
}

export interface SignatureMoment {
  id: string;
  title: string;
  era: string;
  narrative: string;
  takeaway: string;
  relatedLinks: RelatedLink[];
}

export interface RivalryProfile {
  id: string;
  opponent: string;
  title: string;
  origin: string;
  emotionalTone: string;
  conferenceImplication: string;
  culturalImpact: string;
  definingGames: Array<{ year: string; result: string; note: string }>;
  relatedLinks: RelatedLink[];
}

export interface MapLegendItem {
  id: string;
  label: string;
  tone: 'conference' | 'anchor' | 'heisman' | 'nfl' | 'rivalry' | 'championship' | 'recruiting' | 'route' | 'selected' | 'explored' | 'new';
  description?: string;
}

export interface RouteLine {
  id: string;
  fromId: string;
  toId: string;
  fromLatitude: number;
  fromLongitude: number;
  toLatitude: number;
  toLongitude: number;
  kind: 'heisman' | 'nfl' | 'rivalry' | 'championship';
  emphasis?: 'low' | 'medium' | 'high';
}

export interface HeismanHometownMarker {
  id: string;
  playerId: string;
  playerName: string;
  year: number;
  hometownCity: string;
  state: string;
  latitude: number;
  longitude: number;
  position: string;
  summary: string;
  relatedLinks: RelatedLink[];
}

export interface NFLDestinationMarker {
  id: string;
  teamAbbreviation: string;
  teamEspnId?: string;
  teamName: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  playerIds: string[];
}

export interface NFLMapPlayerRoute {
  id: string;
  playerId: string;
  playerName: string;
  teamAbbreviation: string;
  teamEspnId?: string;
  position: string;
  active: boolean;
  featured: boolean;
  nflStatus: NFLStatus;
  teamName: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  ouSummary: string;
  nflSummary: string;
}

export interface RivalryConnection {
  id: string;
  rivalryId: string;
  rivalSchoolId: string;
  schoolName: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  rivalryLabel: string;
  significance: 'foundational' | 'major' | 'modern';
  keyEras: string[];
  summary: string;
  tone?: string;
  relatedLinks: RelatedLink[];
}

export interface ChampionshipVenueEntry {
  id: string;
  seasonYear: number;
  championshipLabel: string;
  venueName: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  coachId: string;
  opponent: string;
  result: string;
  titleContext: string;
  venueNote: string;
  relatedChampionshipId: string;
  dataStatus: 'verify' | 'reference';
}

export interface ChampionshipVenueMarker {
  id: string;
  venueName: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  seasons: ChampionshipVenueEntry[];
}

export interface RecruitingRegion {
  id: string;
  label: string;
  regionType: string;
  cityOrRegion: string;
  state: string;
  latitude: number;
  longitude: number;
  radius: number;
  intensity: 'core' | 'strong' | 'emerging' | 'historical';
  eras: string[];
  summary: string;
  notablePlayers: string[];
  positionTrends: string[];
  dataStatus: 'verify' | 'starter';
}

export interface OpponentHistoryGame {
  year: number;
  location: string;
  result: 'Win' | 'Loss' | 'Tie' | 'Pending';
  score: string;
  significance: string;
}

export interface OpponentHistoryEntry {
  schoolId: string;
  opponentName: string;
  firstMatchup: OpponentHistoryGame | null;
  totalGames: number | null;
  ouWins: number | null;
  opponentWins: number | null;
  ties: number | null;
  currentStreak: string;
  longestOUWinStreak: string;
  longestOpponentWinStreak: string;
  biggestOUMargin: string;
  biggestOpponentMargin: string;
  notableGames: OpponentHistoryGame[];
  rivalryNotes: string;
  seriesSummary: string;
  dataStatus: 'needs-verification' | 'starter';
}
