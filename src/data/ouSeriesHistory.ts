import type { OpponentSeriesHistoryEntry } from '../types/seriesHistory';

const pendingFirstMeeting = {
  date: null,
  location: null,
  result: null,
  score: null,
};

const pendingAllTimeRecord = {
  ouWins: null,
  opponentWins: null,
  ties: null,
};

const verificationSourceNotes = 'Records pending verification against OU official opponent history, SoonerStats, Sports Reference, and Winsipedia as a secondary reference.';

function pendingSeries(schoolId: string, opponentName: string): OpponentSeriesHistoryEntry {
  return {
    schoolId,
    opponentName,
    firstMeeting: pendingFirstMeeting,
    allTimeRecord: pendingAllTimeRecord,
    currentStreak: 'Data pending',
    longestOUWinStreak: 'Data pending',
    longestOpponentWinStreak: 'Data pending',
    biggestOUMargin: 'Data pending',
    biggestOpponentMargin: 'Data pending',
    notableGames: [],
    sourceNotes: verificationSourceNotes,
    dataStatus: 'needs-verification',
  };
}

// Verify every record against OU official opponent history, SoonerStats, Sports Reference,
// and Winsipedia as a secondary reference before marking an entry as verified.
export const ouSeriesHistory: Record<string, OpponentSeriesHistoryEntry> = {
  texas: pendingSeries('texas', 'Texas'),
  'oklahoma-state': pendingSeries('oklahoma-state', 'Oklahoma State'),
  nebraska: pendingSeries('nebraska', 'Nebraska'),
  missouri: pendingSeries('missouri', 'Missouri'),
  kansas: pendingSeries('kansas', 'Kansas'),
  'kansas-state': pendingSeries('kansas-state', 'Kansas State'),
  colorado: pendingSeries('colorado', 'Colorado'),
  'texas-am': pendingSeries('texas-am', 'Texas A&M'),
  baylor: pendingSeries('baylor', 'Baylor'),
  'texas-tech': pendingSeries('texas-tech', 'Texas Tech'),
};
