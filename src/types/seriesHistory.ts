export type SeriesDataStatus = 'verified' | 'needs-verification' | 'missing';

export type SeriesFirstMeeting = {
  date: string | null;
  location: string | null;
  result: string | null;
  score: string | null;
};

export type SeriesRecord = {
  ouWins: number | null;
  opponentWins: number | null;
  ties: number | null;
};

export type SeriesNotableGame = {
  year: number | null;
  score: string | null;
  location: string | null;
  significance: string | null;
};

export type OpponentSeriesHistoryEntry = {
  schoolId: string;
  opponentName: string;
  firstMeeting: SeriesFirstMeeting;
  allTimeRecord: SeriesRecord;
  currentStreak: string | null;
  longestOUWinStreak: string | null;
  longestOpponentWinStreak: string | null;
  biggestOUMargin: string | null;
  biggestOpponentMargin: string | null;
  notableGames: SeriesNotableGame[];
  sourceNotes: string;
  dataStatus: SeriesDataStatus;
};
