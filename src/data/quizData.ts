import type { MatchingPair, MultipleChoiceQuestion, OrderingItem, QuizId, QuizMeta } from '../types/quiz';

export const QUIZ_PASS_PERCENT = 70;

export const quizMeta: Record<QuizId, QuizMeta> = {
  'coaches-order': {
    id: 'coaches-order',
    title: 'Championship Coaches Ordering Quiz',
    description: 'Place OU’s championship coaches in chronological order.',
    timeLimitSeconds: 60,
    unlockMessage: 'Unlocked: Heisman Matching Game',
  },
  'heisman-matching': {
    id: 'heisman-matching',
    title: 'Heisman Winners Matching Game',
    description: 'Match Oklahoma’s Heisman winners to their correct years.',
    timeLimitSeconds: 90,
    unlockMessage: 'Unlocked: Rivalries & Conference Opponents Quiz',
  },
  rivalries: {
    id: 'rivalries',
    title: 'Rivalries & Conference Opponents Quiz',
    description: 'Test your grasp of OU rivalries, conference history, and realignment.',
    timeLimitSeconds: 120,
    unlockMessage: 'Unlocked: Challenge Mode',
  },
  challenge: {
    id: 'challenge',
    title: 'Challenge Mode',
    description: 'One timed museum challenge combining ordering, matching, and rivalry knowledge.',
    timeLimitSeconds: 180,
    challenge: true,
  },
};

export const quizUnlockOrder: QuizId[] = ['coaches-order', 'heisman-matching', 'rivalries', 'challenge'];

export const coachesOrderingItems: OrderingItem[] = [
  { id: 'bud-wilkinson', label: 'Bud Wilkinson', detail: '1950, 1955, 1956' },
  { id: 'barry-switzer', label: 'Barry Switzer', detail: '1974, 1975, 1985' },
  { id: 'bob-stoops', label: 'Bob Stoops', detail: '2000' },
];

export const heismanMatchingPairs: MatchingPair[] = [
  { id: 'billy-vessels', left: 'Billy Vessels', right: '1952' },
  { id: 'steve-owens', left: 'Steve Owens', right: '1969' },
  { id: 'billy-sims', left: 'Billy Sims', right: '1978' },
  { id: 'jason-white', left: 'Jason White', right: '2003' },
  { id: 'sam-bradford', left: 'Sam Bradford', right: '2008' },
  { id: 'baker-mayfield', left: 'Baker Mayfield', right: '2017' },
  { id: 'kyler-murray', left: 'Kyler Murray', right: '2018' },
];

export const rivalryQuestions: MultipleChoiceQuestion[] = [
  {
    id: 'primary-rival',
    prompt: 'Which school is Oklahoma’s primary rival in the annual Red River game?',
    options: ['Texas', 'Nebraska', 'Oklahoma State', 'Missouri'],
    correctAnswer: 'Texas',
    explanation: 'Texas is OU’s defining annual rival in the Red River series.',
  },
  {
    id: 'big-eight-nebraska',
    prompt: 'During the Big Eight era, Nebraska was a member of which conference?',
    options: ['Big Eight', 'Southwest Conference', 'Big Ten', 'SEC'],
    correctAnswer: 'Big Eight',
    explanation: 'Nebraska and Oklahoma were pillars of the Big Eight before later realignment.',
  },
  {
    id: 'sec-expansion',
    prompt: 'Which school joined the SEC alongside Texas A&M in 2012?',
    options: ['Missouri', 'Oklahoma', 'Texas', 'Arkansas'],
    correctAnswer: 'Missouri',
    explanation: 'Missouri and Texas A&M entered the SEC together in 2012.',
  },
  {
    id: 'traditional-rival',
    prompt: 'Which of these schools is NOT usually treated as one of OU’s traditional core rivals?',
    options: ['Missouri', 'Texas', 'Nebraska', 'Oklahoma State'],
    correctAnswer: 'Missouri',
    explanation: 'Missouri mattered in conference play, but Texas, Nebraska, and Oklahoma State carry the stronger rivalry identities.',
  },
  {
    id: 'big-eight-membership',
    prompt: 'Which school was part of the Big Eight with Oklahoma?',
    options: ['Colorado', 'Baylor', 'Texas A&M', 'Florida'],
    correctAnswer: 'Colorado',
    explanation: 'Colorado joined the old Plains league and became part of the Big Eight lineup.',
  },
  {
    id: 'original-big-12',
    prompt: 'Which Texas-based school helped form the original Big 12 with Oklahoma?',
    options: ['Baylor', 'Houston', 'TCU', 'UCF'],
    correctAnswer: 'Baylor',
    explanation: 'Baylor was one of the Texas programs that joined the former Big Eight schools in 1996.',
  },
  {
    id: 'current-big-12',
    prompt: 'Which school is in the current Big 12 after Oklahoma and Texas left?',
    options: ['Arizona State', 'Oklahoma', 'Texas', 'Missouri'],
    correctAnswer: 'Arizona State',
    explanation: 'Arizona State is part of the current post-OU/Texas Big 12 footprint.',
  },
  {
    id: 'sec-future',
    prompt: 'Which conference did Oklahoma join in 2024?',
    options: ['SEC', 'Big Ten', 'ACC', 'Pac-12'],
    correctAnswer: 'SEC',
    explanation: 'Oklahoma entered the SEC in 2024 alongside Texas.',
  },
  {
    id: 'bedlam',
    prompt: 'Bedlam refers to Oklahoma’s rivalry with which school?',
    options: ['Oklahoma State', 'Kansas State', 'Texas Tech', 'Arkansas'],
    correctAnswer: 'Oklahoma State',
    explanation: 'Bedlam is the long-running in-state series between Oklahoma and Oklahoma State.',
  },
  {
    id: 'present-sec',
    prompt: 'Which school is part of the present SEC with Oklahoma?',
    options: ['Georgia', 'Kansas', 'Baylor', 'BYU'],
    correctAnswer: 'Georgia',
    explanation: 'Georgia is a current SEC member and now shares conference space with Oklahoma.',
  },
];

export const challengeQuestions: MultipleChoiceQuestion[] = [
  ...rivalryQuestions.slice(0, 6),
  {
    id: 'challenge-bonus',
    prompt: 'Bonus: Which conference snapshot represents the modern Big 12 without Oklahoma and Texas?',
    options: ['Current Big 12 (Post-OU/Texas)', 'Original Big 12', 'Big Eight', 'SEC After Missouri and Texas A&M Joined'],
    correctAnswer: 'Current Big 12 (Post-OU/Texas)',
    explanation: 'The current Big 12 snapshot represents the conference after OU and Texas left for the SEC.',
  },
];
