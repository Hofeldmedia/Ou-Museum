export type QuizId = 'coaches-order' | 'heisman-matching' | 'rivalries' | 'challenge';
export type QuizMode = 'standard' | 'timed';

export interface QuizMeta {
  id: QuizId;
  title: string;
  description: string;
  unlockMessage?: string;
  timeLimitSeconds?: number;
  challenge?: boolean;
}

export interface OrderingItem {
  id: string;
  label: string;
  detail?: string;
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface MultipleChoiceQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizResultInput {
  quizId: QuizId;
  score: number;
  total: number;
  percentage: number;
  timeUsedSeconds?: number | null;
  mode: QuizMode | 'challenge';
}

export interface StoredQuizRecord {
  bestScore: number;
  bestPercentage: number;
  bestTimeSeconds: number | null;
  completed: boolean;
  attempts: number;
}

export interface QuizProgressState {
  records: Partial<Record<QuizId, StoredQuizRecord>>;
}

export interface QuizSaveResult {
  progress: QuizProgressState;
  passed: boolean;
  newlyUnlockedQuizId: QuizId | null;
}
