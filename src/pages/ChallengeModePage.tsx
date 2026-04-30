import { useEffect, useMemo, useState } from 'react';
import { challengeQuestions, coachesOrderingItems, heismanMatchingPairs, quizMeta } from '../data/quizData';
import { QuizContainer } from '../components/quiz/QuizContainer';
import { QuizHeader } from '../components/quiz/QuizHeader';
import { QuizResults } from '../components/quiz/QuizResults';
import { PrimaryButton } from '../components/PrimaryButton';
import { getQuizRank, saveQuizResult } from '../utils/quizProgress';

export function ChallengeModePage({ onContinue }: { onContinue: () => void }) {
  const [step, setStep] = useState(0);
  const [order, setOrder] = useState([coachesOrderingItems[2], coachesOrderingItems[0], coachesOrderingItems[1]]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [questions, setQuestions] = useState(() => [...challengeQuestions].sort(() => 0.5 - Math.random()));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [secondsLeft, setSecondsLeft] = useState(quizMeta.challenge.timeLimitSeconds ?? 180);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof saveQuizResult> | null>(null);
  const [years, setYears] = useState(() => [...heismanMatchingPairs.map((pair) => pair.right)].sort(() => 0.5 - Math.random()));

  const finalize = () => {
    if (submitted) return;
    const orderingScore = order.reduce((sum, item, index) => sum + Number(item.id === coachesOrderingItems[index].id), 0);
    const matchingScore = heismanMatchingPairs.reduce((sum, pair) => sum + Number(matches[pair.id] === pair.right), 0);
    const questionScore = questions.reduce((sum, question) => sum + Number(answers[question.id] === question.correctAnswer), 0);
    const total = coachesOrderingItems.length + heismanMatchingPairs.length + questions.length;
    const score = orderingScore + matchingScore + questionScore;
    const percentage = Math.round((score / total) * 100);
    const saved = saveQuizResult({
      quizId: 'challenge',
      score,
      total,
      percentage,
      timeUsedSeconds: (quizMeta.challenge.timeLimitSeconds ?? 180) - secondsLeft,
      mode: 'challenge',
    });
    setResult(saved);
    setSubmitted(true);
  };

  useEffect(() => {
    if (submitted) return;
    if (secondsLeft <= 0) {
      finalize();
      return;
    }
    const timeout = window.setTimeout(() => setSecondsLeft((current) => current - 1), 1000);
    return () => window.clearTimeout(timeout);
  }, [secondsLeft, submitted]);

  const activeQuestion = questions[questionIndex];

  const resetChallenge = () => {
    setStep(0);
    setOrder([coachesOrderingItems[2], coachesOrderingItems[0], coachesOrderingItems[1]]);
    setSelectedLeft(null);
    setMatches({});
    setQuestions([...challengeQuestions].sort(() => 0.5 - Math.random()));
    setQuestionIndex(0);
    setAnswers({});
    setSecondsLeft(quizMeta.challenge.timeLimitSeconds ?? 180);
    setSubmitted(false);
    setResult(null);
    setYears([...heismanMatchingPairs.map((pair) => pair.right)].sort(() => 0.5 - Math.random()));
  };

  const moveCoach = (index: number, direction: -1 | 1) => {
    setOrder((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  if (submitted && result) {
    const orderingScore = order.reduce((sum, item, index) => sum + Number(item.id === coachesOrderingItems[index].id), 0);
    const matchingScore = heismanMatchingPairs.reduce((sum, pair) => sum + Number(matches[pair.id] === pair.right), 0);
    const questionScore = questions.reduce((sum, question) => sum + Number(answers[question.id] === question.correctAnswer), 0);
    const total = coachesOrderingItems.length + heismanMatchingPairs.length + questions.length;
    const score = orderingScore + matchingScore + questionScore;
    const percentage = Math.round((score / total) * 100);

    return (
      <QuizResults
        title={quizMeta.challenge.title}
        score={score}
        total={total}
        percentage={percentage}
        rank={getQuizRank(percentage)}
        timeUsedLabel={`${(quizMeta.challenge.timeLimitSeconds ?? 180) - secondsLeft}s`}
        passed={result.passed}
        onRetry={resetChallenge}
        onContinue={onContinue}
      />
    );
  }

  return (
    <QuizContainer>
      <QuizHeader
        eyebrow="Challenge Mode"
        title={quizMeta.challenge.title}
        description="One timed museum gauntlet: order the coaches, match the Heisman winners, and clear the rivalry/conference round."
        questionLabel={`Stage ${step + 1} of 3`}
        timerLabel={`${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')} remaining`}
        mode="challenge"
      />

      {step === 0 && (
        <section className="space-y-3 rounded-md border border-charcoal/10 bg-white/88 p-6 shadow-exhibit">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brass">Stage 1 | Coaches order</p>
          {order.map((item, index) => (
            <div key={item.id} className="rounded-md border border-charcoal/10 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-3xl font-bold">{item.label}</h2>
                <div className="flex gap-2">
                  <PrimaryButton variant="secondary" onClick={() => moveCoach(index, -1)} disabled={index === 0}>Up</PrimaryButton>
                  <PrimaryButton variant="secondary" onClick={() => moveCoach(index, 1)} disabled={index === order.length - 1}>Down</PrimaryButton>
                </div>
              </div>
            </div>
          ))}
          <PrimaryButton onClick={() => setStep(1)}>Continue to Heisman matching</PrimaryButton>
        </section>
      )}

      {step === 1 && (
        <section className="grid gap-5 md:grid-cols-2 rounded-md border border-charcoal/10 bg-white/88 p-6 shadow-exhibit">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brass">Stage 2 | Winners</p>
            <div className="mt-3 grid gap-2">
              {heismanMatchingPairs.map((pair) => {
                const locked = matches[pair.id] === pair.right;
                return (
                  <button
                    key={pair.id}
                    type="button"
                    disabled={locked}
                    onClick={() => setSelectedLeft(pair.id)}
                    className={`rounded-md border px-4 py-3 text-left text-sm font-bold ${locked ? 'border-emerald-700 bg-emerald-50' : selectedLeft === pair.id ? 'border-crimson bg-crimson text-white' : 'border-charcoal/10 bg-white hover:bg-cream'}`}
                  >
                    {pair.left}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brass">Years</p>
            <div className="mt-3 grid gap-2">
              {years.map((year) => {
                const used = Object.values(matches).includes(year);
                return (
                  <button
                    key={year}
                    type="button"
                    disabled={used}
                    onClick={() => {
                      if (!selectedLeft) return;
                      const pair = heismanMatchingPairs.find((item) => item.id === selectedLeft);
                      if (!pair) return;
                      if (pair.right === year) {
                        setMatches((current) => ({ ...current, [pair.id]: year }));
                      }
                      setSelectedLeft(null);
                    }}
                    className={`rounded-md border px-4 py-3 text-left text-sm font-bold ${used ? 'border-emerald-700 bg-emerald-50' : 'border-charcoal/10 bg-white hover:bg-cream'}`}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="md:col-span-2">
            <PrimaryButton onClick={() => setStep(2)}>Continue to rivalry round</PrimaryButton>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="rounded-md border border-charcoal/10 bg-white/88 p-6 shadow-exhibit">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brass">Stage 3 | Rivalries and conferences</p>
          <h2 className="mt-2 font-display text-3xl font-bold">{activeQuestion.prompt}</h2>
          <div className="mt-5 grid gap-3">
            {activeQuestion.options.map((option) => (
              <button
                key={option}
                type="button"
                disabled={Boolean(answers[activeQuestion.id])}
                onClick={() => setAnswers((current) => ({ ...current, [activeQuestion.id]: option }))}
                className={`rounded-md border px-4 py-3 text-left text-sm font-bold ${
                  answers[activeQuestion.id]
                    ? option === activeQuestion.correctAnswer
                      ? 'border-emerald-700 bg-emerald-50'
                      : answers[activeQuestion.id] === option
                        ? 'border-crimson bg-crimson text-white'
                        : 'border-charcoal/10 bg-white text-charcoal/55'
                    : 'border-charcoal/10 bg-white hover:bg-cream'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          {answers[activeQuestion.id] && (
            <div className="mt-4 rounded-md border border-charcoal/10 bg-cream/80 p-4 text-sm leading-6 text-charcoal/72">
              {activeQuestion.explanation}
            </div>
          )}
          <div className="mt-5 flex gap-3">
            {questionIndex < questions.length - 1 ? (
              <PrimaryButton disabled={!answers[activeQuestion.id]} onClick={() => setQuestionIndex((current) => current + 1)}>Next Question</PrimaryButton>
            ) : (
              <PrimaryButton disabled={!answers[activeQuestion.id]} onClick={finalize}>Finish Challenge</PrimaryButton>
            )}
          </div>
        </section>
      )}
    </QuizContainer>
  );
}
