import { RotateCcw } from 'lucide-react';
import { QuizHub } from '../components/quiz/QuizHub';
import { PrimaryButton } from '../components/PrimaryButton';
import { GalleryPlaque, SectionHero } from '../components/MuseumComponents';
import type { QuizId, QuizProgressState } from '../types/quiz';

export function QuizHubPage({
  progress,
  onOpenQuiz,
  onResetProgress,
}: {
  progress: QuizProgressState;
  onOpenQuiz: (quizId: QuizId) => void;
  onResetProgress: () => void;
}) {
  return (
    <section>
      <SectionHero eyebrow="Quiz Challenges" title="Museum Challenge Hub" meta="Unlockable progression">
        Move through three connected OU football challenges, save your best score locally, and unlock the final challenge mode.
      </SectionHero>
      <GalleryPlaque eyebrow="Challenge Order" title="One challenge unlocks the next">
        Start with championship coaches, move into the Heisman matching game, then take the rivalry and conference quiz. Challenge Mode unlocks only after all three base quizzes are cleared at 70% or better.
      </GalleryPlaque>
      <QuizHub progress={progress} onOpenQuiz={onOpenQuiz} />
      <footer className="mt-6 flex justify-end">
        <PrimaryButton variant="secondary" onClick={onResetProgress}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset Quiz Progress
        </PrimaryButton>
      </footer>
    </section>
  );
}
