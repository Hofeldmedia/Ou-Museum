export type {
  FbsConference,
  FbsConferenceId,
  FbsConferenceStatus,
  FbsSchool,
} from './types/fbs';

export type {
  OpponentSeriesHistoryEntry,
  SeriesDataStatus,
  SeriesFirstMeeting,
  SeriesNotableGame,
  SeriesRecord,
} from './types/seriesHistory';

export type {
  ChampionshipSeason,
  ChampionshipVenueEntry,
  ChampionshipVenueMarker,
  CoachProfile,
  ConferenceEra,
  ConferenceSchool,
  EraId,
  FeaturedPerson,
  HeismanWinner,
  LogoAccuracy,
  MapLayerId,
  MapLegendItem,
  MuseumArtifact,
  MuseumMode,
  MuseumPath,
  MuseumPathId,
  Milestone,
  NFLDestinationMarker,
  NFLMapPlayerRoute,
  NFLSooner,
  NFLStatus,
  RecruitingRegion,
  RelatedLink,
  RouteLine,
  RivalryConnection,
  RivalryProfile,
  SiteSection,
  SignatureMoment,
  StatBlock,
  TagOption,
  HeismanHometownMarker,
  TourChapter,
} from './types/content';

export type Screen =
  | 'home'
  | 'intro'
  | 'hub'
  | 'quizzes'
  | 'quiz-coaches-order'
  | 'quiz-heisman-matching'
  | 'quiz-rivalries'
  | 'quiz-challenge'
  | 'map'
  | 'fbs-landscape'
  | 'championships'
  | 'coaches'
  | 'heismans'
  | 'nfl'
  | 'rivalries'
  | 'baker'
  | 'venables'
  | 'timeline'
  | 'connections'
  | 'summary';

export type ExploredSchools = Record<string, string[]>;

export type ConferenceInfo = {
  id: string;
  name: string;
  years: string;
  schools: string[];
  headline: string;
  whyItMattered: string;
  position: string;
};

export type TimelineEvent = {
  id: string;
  year: number;
  title: string;
  shortLabel: string;
  description: string;
};

export type MatchPair = {
  id: string;
  cause: string;
  effect: string;
  explanation: string;
};
