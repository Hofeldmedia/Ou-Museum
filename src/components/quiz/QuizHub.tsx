import { quizMeta, quizUnlockOrder } from '../../data/quizData';
import type { QuizId, QuizProgressState } from '../../types/quiz';
import { getQuizRecord, isQuizUnlocked } from '../../utils/quizProgress';
import { LockedQuizCard } from './LockedQuizCard';

function formatTime(seconds: number | null) {
  if (seconds == null) return null;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${String(secs).padStart(2, '0')}s` : `${secs}s`;
}

export function QuizHub({
  progress,
  onOpenQuiz,
}: {
  progress: QuizProgressState;
  onOpenQuiz: (quizId: QuizId) => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {quizUnlockOrder.map((quizId) => {
        const meta = quizMeta[quizId];
        const record = getQuizRecord(quizId, progress);
        const unlocked = isQuizUnlocked(quizId, progress);
        const previousQuizId = quizUnlockOrder[quizUnlockOrder.indexOf(quizId) - 1];
        const lockMessage =
          quizId === 'challenge'
            ? 'Complete all museum quizzes to unlock Challenge Mode.'
            : previousQuizId
              ? `Complete the ${quizMeta[previousQuizId].title} to unlock this challenge.`
              : undefined;

        return (
          <LockedQuizCard
            key={quizId}
            quiz={meta}
            unlocked={unlocked}
            completed={Boolean(record?.completed)}
            bestScore={record ? record.bestPercentage : null}
            bestTimeLabel={formatTime(record?.bestTimeSeconds ?? null)}
            lockMessage={lockMessage}
            onStart={() => onOpenQuiz(quizId)}
          />
        );
      })}
    </div>
  );
}
