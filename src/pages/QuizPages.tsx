import { useEffect, useMemo, useState } from 'react';
import { coachesOrderingItems, heismanMatchingPairs, QUIZ_PASS_PERCENT, quizMeta, rivalryQuestions } from '../data/quizData';
import { QuizContainer } from '../components/quiz/QuizContainer';
import { QuizHeader } from '../components/quiz/QuizHeader';
import { QuizResults } from '../components/quiz/QuizResults';
import { PrimaryButton } from '../components/PrimaryButton';
import { saveQuizResult, getQuizRank } from '../utils/quizProgress';
import type { QuizId, QuizMode } from '../types/quiz';

type SharedQuizPageProps = {
  onContinue: (nextUnlockedQuizId: QuizId | null) => void;
};

type FrozenQuizStats = {
  score: number;
  total: number;
  percentage: number;
  timeUsedSeconds: number | null;
};

function formatTimer(secondsLeft: number) {
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  return mins > 0 ? `${mins}:${String(secs).padStart(2, '0')} remaining` : `${secs}s remaining`;
}

function ModeChooser({
  quizId,
  onStart,
}: {
  quizId: Exclude<QuizId, 'challenge'>;
  onStart: (mode: QuizMode) => void;
}) {
  const meta = quizMeta[quizId];

  return (
    <section className="rounded-md border border-charcoal/10 bg-white/88 p-6 shadow-exhibit">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-brass">Choose a mode</p>
      <h2 className="mt-2 font-display text-4xl font-bold">{meta.title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-charcoal/70">{meta.description}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <PrimaryButton onClick={() => onStart('standard')}>Standard Mode</PrimaryButton>
        <PrimaryButton variant="secondary" onClick={() => onStart('timed')}>Timed Mode</PrimaryButton>
      </div>
      <p className="mt-4 text-sm font-semibold text-charcoal/60">Timed mode limit: {meta.timeLimitSeconds} seconds</p>
    </section>
  );
}

function useQuizTimer(mode: QuizMode | null, seconds: number, onExpire: () => void, active = true) {
  const [secondsLeft, setSecondsLeft] = useState(seconds);

  useEffect(() => {
    setSecondsLeft(seconds);
  }, [seconds, mode]);

  useEffect(() => {
    if (!active) return;
    if (mode !== 'timed') return;
    if (secondsLeft <= 0) {
      onExpire();
      return;
    }

    const timeout = window.setTimeout(() => setSecondsLeft((current) => current - 1), 1000);
    return () => window.clearTimeout(timeout);
  }, [active, mode, onExpire, secondsLeft]);

  return {
    secondsLeft,
    timeUsedSeconds: Math.max(seconds - secondsLeft, 0),
    timerLabel: mode === 'timed' ? formatTimer(secondsLeft) : null,
  };
}

export function CoachesOrderingQuizPage({ onContinue }: SharedQuizPageProps) {
  const [mode, setMode] = useState<QuizMode | null>(null);
  const [order, setOrder] = useState([coachesOrderingItems[1], coachesOrderingItems[2], coachesOrderingItems[0]]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof saveQuizResult> | null>(null);
  const [finalStats, setFinalStats] = useState<FrozenQuizStats | null>(null);

  const finalize = () => {
    if (submitted || !mode) return;
    const score = order.reduce((sum, item, index) => sum + Number(item.id === coachesOrderingItems[index].id), 0);
    const percentage = Math.round((score / coachesOrderingItems.length) * 100);
    const stats: FrozenQuizStats = {
      score,
      total: coachesOrderingItems.length,
      percentage,
      timeUsedSeconds: mode === 'timed' ? timeUsedSeconds : null,
    };
    const saved = saveQuizResult({
      quizId: 'coaches-order',
      score,
      total: coachesOrderingItems.length,
      percentage,
      timeUsedSeconds: stats.timeUsedSeconds,
      mode,
    });
    setFinalStats(stats);
    setResult(saved);
    setSubmitted(true);
  };

  const { timeUsedSeconds, timerLabel } = useQuizTimer(mode, quizMeta['coaches-order'].timeLimitSeconds ?? 60, finalize, !submitted);

  const moveItem = (index: number, direction: -1 | 1) => {
    setOrder((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  if (!mode) {
    return <ModeChooser quizId="coaches-order" onStart={setMode} />;
  }

  if (submitted && result && finalStats) {
    return (
      <QuizResults
        title={quizMeta['coaches-order'].title}
        score={finalStats.score}
        total={finalStats.total}
        percentage={finalStats.percentage}
        rank={getQuizRank(finalStats.percentage)}
        timeUsedLabel={finalStats.timeUsedSeconds != null ? `${finalStats.timeUsedSeconds}s` : null}
        unlockedMessage={result.passed ? quizMeta['coaches-order'].unlockMessage ?? null : null}
        passed={result.passed}
        details={
          <section className="rounded-md border border-charcoal/10 bg-cream/70 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-brass">Championship timeline</p>
            <dl className="mt-3 grid gap-3 md:grid-cols-3">
              <div>
                <dt className="text-sm font-black text-charcoal">Bud Wilkinson</dt>
                <dd className="mt-1 text-sm text-charcoal/72">1950, 1955, 1956</dd>
              </div>
              <div>
                <dt className="text-sm font-black text-charcoal">Barry Switzer</dt>
                <dd className="mt-1 text-sm text-charcoal/72">1974, 1975, 1985</dd>
              </div>
              <div>
                <dt className="text-sm font-black text-charcoal">Bob Stoops</dt>
                <dd className="mt-1 text-sm text-charcoal/72">2000</dd>
              </div>
            </dl>
          </section>
        }
        onRetry={() => {
          setMode(null);
          setOrder([coachesOrderingItems[1], coachesOrderingItems[2], coachesOrderingItems[0]]);
          setSubmitted(false);
          setResult(null);
          setFinalStats(null);
        }}
        onContinue={() => onContinue(result.newlyUnlockedQuizId)}
      />
    );
  }

  return (
    <QuizContainer>
      <QuizHeader
        eyebrow="Quiz Challenge 1"
        title={quizMeta['coaches-order'].title}
        description="Use the up and down controls to place the title-winning OU coaches in chronological order."
        questionLabel="Arrange the timeline"
        timerLabel={timerLabel}
        mode={mode}
      />
      <section className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
        <aside className="rounded-md border border-charcoal/10 bg-charcoal p-6 text-cream shadow-exhibit">
          <h2 className="font-display text-3xl font-bold">Championship order</h2>
          <p className="mt-3 text-sm leading-6 text-cream/72">This challenge only has three names, but the order matters: Wilkinson, then Switzer, then Stoops.</p>
          <PrimaryButton className="mt-5 w-full" onClick={finalize}>Check Order</PrimaryButton>
        </aside>
        <div className="space-y-3">
          {order.map((item, index) => (
            <div key={item.id} className="rounded-md border border-charcoal/10 bg-white/88 p-4 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-charcoal/45">Position {index + 1}</p>
                  <h3 className="mt-1 font-display text-3xl font-bold">{item.label}</h3>
                </div>
                <div className="flex gap-2">
                  <PrimaryButton variant="secondary" onClick={() => moveItem(index, -1)} disabled={index === 0} aria-label={`Move ${item.label} earlier`}>Up</PrimaryButton>
                  <PrimaryButton variant="secondary" onClick={() => moveItem(index, 1)} disabled={index === order.length - 1} aria-label={`Move ${item.label} later`}>Down</PrimaryButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </QuizContainer>
  );
}

export function HeismanMatchingQuizPage({ onContinue }: SharedQuizPageProps) {
  const [mode, setMode] = useState<QuizMode | null>(null);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof saveQuizResult> | null>(null);
  const [finalStats, setFinalStats] = useState<FrozenQuizStats | null>(null);
  const years = useMemo(() => [...heismanMatchingPairs.map((pair) => pair.right)].sort(() => 0.5 - Math.random()), []);

  const finalize = () => {
    if (submitted || !mode) return;
    const score = heismanMatchingPairs.reduce((sum, pair) => sum + Number(matches[pair.id] === pair.right), 0);
    const percentage = Math.round((score / heismanMatchingPairs.length) * 100);
    const stats: FrozenQuizStats = {
      score,
      total: heismanMatchingPairs.length,
      percentage,
      timeUsedSeconds: mode === 'timed' ? timeUsedSeconds : null,
    };
    const saved = saveQuizResult({
      quizId: 'heisman-matching',
      score,
      total: heismanMatchingPairs.length,
      percentage,
      timeUsedSeconds: stats.timeUsedSeconds,
      mode,
    });
    setFinalStats(stats);
    setResult(saved);
    setSubmitted(true);
  };

  const { timeUsedSeconds, timerLabel } = useQuizTimer(mode, quizMeta['heisman-matching'].timeLimitSeconds ?? 90, finalize, !submitted);

  useEffect(() => {
    if (submitted) return;
    const allMatched = heismanMatchingPairs.every((pair) => matches[pair.id] === pair.right);
    if (allMatched && Object.keys(matches).length === heismanMatchingPairs.length) {
      finalize();
    }
  }, [matches, submitted]);

  const assignYear = (year: string) => {
    if (!selectedLeft) return;
    const pair = heismanMatchingPairs.find((entry) => entry.id === selectedLeft);
    if (!pair) return;

    if (pair.right === year) {
      setMatches((current) => ({ ...current, [pair.id]: year }));
      setFeedback(`${pair.left} matched correctly with ${year}.`);
    } else {
      setFeedback(`${pair.left} does not match ${year}. Try again.`);
    }

    setSelectedLeft(null);
  };

  if (!mode) {
    return <ModeChooser quizId="heisman-matching" onStart={setMode} />;
  }

  if (submitted && result && finalStats) {
    return (
      <QuizResults
        title={quizMeta['heisman-matching'].title}
        score={finalStats.score}
        total={finalStats.total}
        percentage={finalStats.percentage}
        rank={getQuizRank(finalStats.percentage)}
        timeUsedLabel={finalStats.timeUsedSeconds != null ? `${finalStats.timeUsedSeconds}s` : null}
        unlockedMessage={result.passed ? quizMeta['heisman-matching'].unlockMessage ?? null : null}
        passed={result.passed}
        onRetry={() => {
          setMode(null);
          setSelectedLeft(null);
          setMatches({});
          setFeedback(null);
          setSubmitted(false);
          setResult(null);
          setFinalStats(null);
        }}
        onContinue={() => onContinue(result.newlyUnlockedQuizId)}
      />
    );
  }

  return (
    <QuizContainer>
      <QuizHeader
        eyebrow="Quiz Challenge 2"
        title={quizMeta['heisman-matching'].title}
        description="Select a winner, then select the matching year. Correct pairs lock immediately."
        questionLabel={`${Object.keys(matches).length} of ${heismanMatchingPairs.length} matched`}
        timerLabel={timerLabel}
        mode={mode}
      />
      {feedback && <p aria-live="polite" className="rounded-md border border-charcoal/10 bg-white/88 px-4 py-3 text-sm font-semibold text-charcoal/72">{feedback}</p>}
      <div className="grid gap-5 md:grid-cols-2">
        <section className="rounded-md border border-charcoal/10 bg-white/88 p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brass">Winners</p>
          <div className="mt-3 grid gap-2">
            {heismanMatchingPairs.map((pair) => {
              const locked = matches[pair.id] === pair.right;
              return (
                <button
                  key={pair.id}
                  type="button"
                  onClick={() => setSelectedLeft(pair.id)}
                  disabled={locked}
                  className={`rounded-md border px-4 py-3 text-left text-sm font-bold transition ${locked ? 'border-emerald-700 bg-emerald-50 text-charcoal' : selectedLeft === pair.id ? 'border-crimson bg-crimson text-white' : 'border-charcoal/10 bg-white hover:bg-cream'}`}
                >
                  {pair.left}
                </button>
              );
            })}
          </div>
        </section>
        <section className="rounded-md border border-charcoal/10 bg-white/88 p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brass">Years</p>
          <div className="mt-3 grid gap-2">
            {years.map((year) => {
              const used = Object.values(matches).includes(year);
              return (
                <button
                  key={year}
                  type="button"
                  onClick={() => assignYear(year)}
                  disabled={used}
                  className={`rounded-md border px-4 py-3 text-left text-sm font-bold transition ${used ? 'border-emerald-700 bg-emerald-50 text-charcoal' : 'border-charcoal/10 bg-white hover:bg-cream'}`}
                >
                  {year}
                </button>
              );
            })}
          </div>
        </section>
      </div>
      <div className="flex justify-end">
        <PrimaryButton onClick={finalize}>Finish Matching</PrimaryButton>
      </div>
    </QuizContainer>
  );
}

export function RivalriesQuizPage({ onContinue }: SharedQuizPageProps) {
  const [mode, setMode] = useState<QuizMode | null>(null);
  const [questions, setQuestions] = useState(rivalryQuestions);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof saveQuizResult> | null>(null);
  const [finalStats, setFinalStats] = useState<FrozenQuizStats | null>(null);

  const question = questions[index];

  const finalize = () => {
    if (submitted || !mode) return;
    const score = questions.reduce((sum, item) => sum + Number(answers[item.id] === item.correctAnswer), 0);
    const percentage = Math.round((score / questions.length) * 100);
    const stats: FrozenQuizStats = {
      score,
      total: questions.length,
      percentage,
      timeUsedSeconds: mode === 'timed' ? timeUsedSeconds : null,
    };
    const saved = saveQuizResult({
      quizId: 'rivalries',
      score,
      total: questions.length,
      percentage,
      timeUsedSeconds: stats.timeUsedSeconds,
      mode,
    });
    setFinalStats(stats);
    setResult(saved);
    setSubmitted(true);
  };

  const { timeUsedSeconds, timerLabel } = useQuizTimer(mode, quizMeta.rivalries.timeLimitSeconds ?? 120, finalize, !submitted);

  if (!mode) {
    return <ModeChooser quizId="rivalries" onStart={(selectedMode) => {
      setQuestions([...rivalryQuestions].sort(() => 0.5 - Math.random()));
      setMode(selectedMode);
    }} />;
  }

  if (submitted && result && finalStats) {
    return (
      <QuizResults
        title={quizMeta.rivalries.title}
        score={finalStats.score}
        total={finalStats.total}
        percentage={finalStats.percentage}
        rank={getQuizRank(finalStats.percentage)}
        timeUsedLabel={finalStats.timeUsedSeconds != null ? `${finalStats.timeUsedSeconds}s` : null}
        unlockedMessage={result.passed ? quizMeta.rivalries.unlockMessage ?? null : null}
        passed={result.passed}
        onRetry={() => {
          setMode(null);
          setAnswers({});
          setIndex(0);
          setSubmitted(false);
          setResult(null);
          setFinalStats(null);
        }}
        onContinue={() => onContinue(result.newlyUnlockedQuizId)}
      />
    );
  }

  const selectedAnswer = answers[question.id];
  const answered = Boolean(selectedAnswer);

  return (
    <QuizContainer>
      <QuizHeader
        eyebrow="Quiz Challenge 3"
        title={quizMeta.rivalries.title}
        description="Answer each question, review the explanation, and move through the museum’s rivalry and conference test."
        questionLabel={`Question ${index + 1} of ${questions.length}`}
        timerLabel={timerLabel}
        mode={mode}
      />
      <section className="rounded-md border border-charcoal/10 bg-white/88 p-6 shadow-exhibit">
        <p className="font-display text-3xl font-bold leading-tight">{question.prompt}</p>
        <div className="mt-5 grid gap-3">
          {question.options.map((option) => {
            const isCorrect = option === question.correctAnswer;
            const isSelected = selectedAnswer === option;
            return (
              <button
                key={option}
                type="button"
                disabled={answered}
                onClick={() => setAnswers((current) => ({ ...current, [question.id]: option }))}
                className={`rounded-md border px-4 py-3 text-left text-sm font-bold transition ${
                  answered
                    ? isCorrect
                      ? 'border-emerald-700 bg-emerald-50 text-charcoal'
                      : isSelected
                        ? 'border-crimson bg-crimson text-white'
                        : 'border-charcoal/10 bg-white text-charcoal/55'
                    : 'border-charcoal/10 bg-white hover:bg-cream'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
        {answered && (
          <div className="mt-5 rounded-md border border-charcoal/10 bg-cream/80 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brass">
              {selectedAnswer === question.correctAnswer ? 'Correct' : 'Review'}
            </p>
            <p className="mt-2 text-sm leading-6 text-charcoal/72">{question.explanation}</p>
          </div>
        )}
        <div className="mt-5 flex flex-wrap gap-3">
          {index < questions.length - 1 ? (
            <PrimaryButton disabled={!answered} onClick={() => setIndex((current) => current + 1)}>Next Question</PrimaryButton>
          ) : (
            <PrimaryButton disabled={!answered} onClick={finalize}>Finish Quiz</PrimaryButton>
          )}
        </div>
      </section>
    </QuizContainer>
  );
}
