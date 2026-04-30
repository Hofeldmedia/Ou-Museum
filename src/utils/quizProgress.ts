import { QUIZ_PASS_PERCENT, quizUnlockOrder } from '../data/quizData';
import type { QuizId, QuizProgressState, QuizResultInput, QuizSaveResult, StoredQuizRecord } from '../types/quiz';

const QUIZ_PROGRESS_KEY = 'ou-football-museum.quiz-progress.v1';

const emptyProgress: QuizProgressState = {
  records: {},
};

export function getQuizProgress(): QuizProgressState {
  if (typeof window === 'undefined') return emptyProgress;

  try {
    const raw = window.localStorage.getItem(QUIZ_PROGRESS_KEY);
    if (!raw) return emptyProgress;
    const parsed = JSON.parse(raw) as QuizProgressState;
    return parsed?.records ? parsed : emptyProgress;
  } catch {
    return emptyProgress;
  }
}

export function saveQuizResult(input: QuizResultInput): QuizSaveResult {
  const progress = getQuizProgress();
  const passed = input.percentage >= QUIZ_PASS_PERCENT;
  const current = progress.records[input.quizId];

  const nextRecord: StoredQuizRecord = {
    bestScore: Math.max(current?.bestScore ?? 0, input.score),
    bestPercentage: Math.max(current?.bestPercentage ?? 0, input.percentage),
    bestTimeSeconds:
      input.timeUsedSeconds != null
        ? current?.bestTimeSeconds == null
          ? input.timeUsedSeconds
          : Math.min(current.bestTimeSeconds, input.timeUsedSeconds)
        : current?.bestTimeSeconds ?? null,
    completed: Boolean(current?.completed || passed),
    attempts: (current?.attempts ?? 0) + 1,
  };

  const nextProgress: QuizProgressState = {
    records: {
      ...progress.records,
      [input.quizId]: nextRecord,
    },
  };

  const newlyUnlockedQuizId = passed ? unlockNextQuiz(input.quizId, nextProgress) : null;
  persistQuizProgress(nextProgress);

  return { progress: nextProgress, passed, newlyUnlockedQuizId };
}

export function isQuizUnlocked(quizId: QuizId, progress = getQuizProgress()) {
  if (quizId === quizUnlockOrder[0]) return true;
  if (quizId === 'challenge') {
    return quizUnlockOrder
      .filter((id) => id !== 'challenge')
      .every((id) => progress.records[id]?.completed);
  }

  const index = quizUnlockOrder.indexOf(quizId);
  const previousId = quizUnlockOrder[index - 1];
  return Boolean(previousId && progress.records[previousId]?.completed);
}

export function unlockNextQuiz(currentQuizId: QuizId, progress = getQuizProgress()): QuizId | null {
  const currentIndex = quizUnlockOrder.indexOf(currentQuizId);
  if (currentIndex === -1 || currentIndex === quizUnlockOrder.length - 1) return null;

  const nextId = quizUnlockOrder[currentIndex + 1];
  return isQuizUnlocked(nextId, progress) ? nextId : null;
}

export function resetQuizProgress() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(QUIZ_PROGRESS_KEY);
}

export function getQuizRecord(quizId: QuizId, progress = getQuizProgress()) {
  return progress.records[quizId] ?? null;
}

export function getQuizRank(percentage: number) {
  if (percentage >= 90) return 'Sooner Historian';
  if (percentage >= 80) return 'Championship Scholar';
  if (percentage >= 70) return 'Varsity Knowledge';
  return 'Keep Exploring';
}

function persistQuizProgress(progress: QuizProgressState) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(QUIZ_PROGRESS_KEY, JSON.stringify(progress));
}
