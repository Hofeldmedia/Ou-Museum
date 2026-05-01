import { Award, CheckCircle2, Filter, Landmark, MapPinned, Search, Shield, Trophy, Users } from 'lucide-react';
import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { ConferenceExplorerScreen } from './components/ConferenceExplorerScreen';
import { AudioAura } from './components/experience/AudioAura';
import { TourNarrative } from './components/experience/TourNarrative';
import { Layout } from './components/Layout';
import { ArtifactViewerModal, ComparePanel, FeatureBanner, MilestoneTimeline, ReflectionPrompt, RelatedLinks, SectionHero, SignatureMomentCard, StatPill } from './components/MuseumComponents';
import { MuseumNav } from './components/MuseumNav';
import { HeroLanding, IntroSequence, PageTransition } from './components/MuseumLayout';
import { NFLLogoBadge } from './components/NFLLogoBadge';
import { PrimaryButton } from './components/PrimaryButton';
import { ProgressTracker } from './components/ProgressTracker';
import { ProfileImage } from './components/ui/ProfileImage';
import { ConnectionsScreen, SummaryScreen, TimelineScreen } from './components/sections/AssessmentScreens';
import { SectionHub } from './components/sections/SectionHub';
import { championships } from './data/championships';
import { coaches } from './data/coaches';
import { featuredPeople } from './data/featuredPeople';
import { heismans } from './data/heismans';
import { matchPairs, timelineEvents } from './data/historyData';
import { rivalries, signatureMoments, tourChapters } from './data/immersive';
import { nflSooners } from './data/nflSooners';
import { profileImages } from './data/profileImages';
import { nflTeamRegistry } from './data/nflMapData';
import type { ExploredSchools, Screen } from './types';
import type { ChampionshipSeason, CoachProfile, FeaturedPerson, HeismanWinner, MuseumArtifact, MuseumMode, NFLSooner, NFLStatus, RelatedLink, RivalryProfile } from './types/content';
import type { QuizId, QuizProgressState } from './types/quiz';
import { isConferenceExplorationComplete } from './utils/exploration';
import { relatedLinkToRoute } from './utils/navigation';
import { setPageTitle } from './utils/setPageTitle';
import { getQuizProgress, isQuizUnlocked, resetQuizProgress } from './utils/quizProgress';


const QuizHubPage = lazy(() => import('./pages/QuizHubPage').then(({ QuizHubPage }) => ({ default: QuizHubPage })));
const ChallengeModePage = lazy(() => import('./pages/ChallengeModePage').then(({ ChallengeModePage }) => ({ default: ChallengeModePage })));
const FbsLandscapePage = lazy(() => import('./pages/FbsLandscapePage').then(({ FbsLandscapePage }) => ({ default: FbsLandscapePage })));
const CoachesOrderingQuizPage = lazy(() => import('./pages/QuizPages').then(({ CoachesOrderingQuizPage }) => ({ default: CoachesOrderingQuizPage })));
const HeismanMatchingQuizPage = lazy(() => import('./pages/QuizPages').then(({ HeismanMatchingQuizPage }) => ({ default: HeismanMatchingQuizPage })));
const RivalriesQuizPage = lazy(() => import('./pages/QuizPages').then(({ RivalriesQuizPage }) => ({ default: RivalriesQuizPage })));

const initialTimeline = [
  timelineEvents[4],
  timelineEvents[1],
  timelineEvents[6],
  timelineEvents[0],
  timelineEvents[7],
  timelineEvents[2],
  timelineEvents[5],
  timelineEvents[3],
];

const sectionIcons: Partial<Record<Screen, typeof Trophy>> = {
  quizzes: Award,
  'quiz-coaches-order': Award,
  'quiz-heisman-matching': Award,
  'quiz-rivalries': Award,
  'quiz-challenge': Trophy,
  map: Landmark,
  'fbs-landscape': MapPinned,
  championships: Trophy,
  coaches: Users,
  heismans: Award,
  nfl: Shield,
  rivalries: MapPinned,
  baker: Award,
  venables: Shield,
  timeline: CheckCircle2,
};

const pageTitles: Partial<Record<Screen, string>> = {
  hub: 'Museum Hub',
  quizzes: 'Quiz Hub',
  'quiz-coaches-order': 'Coaches Order Quiz',
  'quiz-heisman-matching': 'Heisman Matching Quiz',
  'quiz-rivalries': 'Rivalries Quiz',
  'quiz-challenge': 'Challenge Mode Quiz',
  map: 'Conference Map',
  'fbs-landscape': 'FBS Landscape 2026',
  championships: 'National Championships',
  coaches: 'Important Coaches',
  heismans: 'Heisman Winners',
  nfl: 'Norman to the NFL',
  rivalries: 'Rivalries and Regions',
  baker: 'Baker Mayfield',
  venables: 'Brent Venables',
  timeline: 'Timeline Puzzle',
  connections: 'Cause and Effect',
  summary: 'Legacy Summary',
};

const screenPaths: Record<Screen, string> = {
  home: '/',
  intro: '/intro',
  hub: '/hub',
  quizzes: '/quizzes',
  'quiz-coaches-order': '/quiz/coaches-order',
  'quiz-heisman-matching': '/quiz/heisman-matching',
  'quiz-rivalries': '/quiz/rivalries',
  'quiz-challenge': '/quiz/challenge',
  map: '/map',
  'fbs-landscape': '/fbs-landscape-2026',
  championships: '/championships',
  coaches: '/coaches',
  heismans: '/heismans',
  nfl: '/nfl',
  rivalries: '/rivalries',
  baker: '/features/baker',
  venables: '/features/venables',
  timeline: '/timeline',
  connections: '/connections',
  summary: '/summary',
};

function screenFromPath(pathname: string): Screen {
  const found = Object.entries(screenPaths).find(([, path]) => path === pathname);
  return (found?.[0] as Screen) ?? 'home';
}

function quizIdToScreen(quizId: QuizId): Screen {
  if (quizId === 'coaches-order') return 'quiz-coaches-order';
  if (quizId === 'heisman-matching') return 'quiz-heisman-matching';
  if (quizId === 'rivalries') return 'quiz-rivalries';
  return 'quiz-challenge';
}

function screenToQuizId(screen: Screen): QuizId | null {
  if (screen === 'quiz-coaches-order') return 'coaches-order';
  if (screen === 'quiz-heisman-matching') return 'heisman-matching';
  if (screen === 'quiz-rivalries') return 'rivalries';
  if (screen === 'quiz-challenge') return 'challenge';
  return null;
}

function getNflEra(player: NFLSooner) {
  const startYear = Number(player.ouYears.slice(0, 4));
  if (Number.isNaN(startYear)) return 'modern';
  if (startYear < 1990) return 'classic';
  if (startYear < 2020) return 'modern';
  return 'current';
}

function nflRelatedLinks(player: NFLSooner): RelatedLink[] {
  const links: RelatedLink[] = [];
  if (player.id === 'baker-mayfield') links.push({ type: 'feature', id: 'baker-mayfield', label: 'Baker feature' }, { type: 'heisman', id: 'baker-mayfield', label: '2017 Heisman' });
  if (player.id === 'kyler-murray') links.push({ type: 'heisman', id: 'kyler-murray', label: '2018 Heisman' });
  if (player.id === 'sam-bradford') links.push({ type: 'heisman', id: 'sam-bradford', label: '2008 Heisman' });
  if (player.id === 'adrian-peterson') links.push({ type: 'coach', id: 'bob-stoops', label: 'Bob Stoops era' });
  return links;
}

function getCurrentTeamAbbreviation(player: NFLSooner) {
  return nflTeamRegistry[player.currentTeam]?.abbreviation ?? null;
}

function getPlayerTeamAbbreviations(player: NFLSooner) {
  return player.nflTeams
    .map((teamName) => ({ teamName, abbreviation: nflTeamRegistry[teamName]?.abbreviation ?? null }))
    .filter((team, index, teams) => teams.findIndex((entry) => entry.teamName === team.teamName) === index);
}

function App() {
  const [screen, setScreen] = useState<Screen>(() => screenFromPath(window.location.pathname));
  const [museumMode, setMuseumMode] = useState<MuseumMode>('guided');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [activeArtifact, setActiveArtifact] = useState<MuseumArtifact | null>(null);
  const [completed, setCompleted] = useState<Screen[]>([]);
  const [exploredSchools, setExploredSchools] = useState<ExploredSchools>({});
  const [timeline, setTimeline] = useState(initialTimeline);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [timelineChecked, setTimelineChecked] = useState(false);
  const [timelineSolved, setTimelineSolved] = useState(false);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [selectedChampionshipId, setSelectedChampionshipId] = useState(championships[championships.length - 1].id);
  const [selectedCoachId, setSelectedCoachId] = useState(coaches[0].id);
  const [selectedHeismanId, setSelectedHeismanId] = useState(heismans[5].id);
  const [selectedNflId, setSelectedNflId] = useState(nflSooners[0].id);
  const [selectedRivalryId, setSelectedRivalryId] = useState(rivalries[0].id);
  const [nflSearch, setNflSearch] = useState('');
  const [nflStatus, setNflStatus] = useState('all');
  const [nflPosition, setNflPosition] = useState('all');
  const [nflTeam, setNflTeam] = useState('all');
  const [nflEra, setNflEra] = useState('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [quizProgress, setQuizProgress] = useState<QuizProgressState>(() => getQuizProgress());

  const mapComplete = isConferenceExplorationComplete(exploredSchools);
  const matchComplete = matchPairs.every((pair) => matches[pair.id] === pair.id);
  const selectedChampionship = championships.find((item) => item.id === selectedChampionshipId) ?? championships[0];
  const selectedCoach = coaches.find((item) => item.id === selectedCoachId) ?? coaches[0];
  const selectedHeisman = heismans.find((item) => item.id === selectedHeismanId) ?? heismans[0];
  const selectedNfl = nflSooners.find((item) => item.id === selectedNflId) ?? nflSooners[0];
  const selectedRivalry = rivalries.find((item) => item.id === selectedRivalryId) ?? rivalries[0];

  const shuffledEffects = useMemo(() => [matchPairs[2], matchPairs[0], matchPairs[3], matchPairs[1]], []);
  const positions = useMemo(() => Array.from(new Set(nflSooners.map((player) => player.position))).sort(), []);
  const teams = useMemo(() => Array.from(new Set(nflSooners.map((player) => player.currentTeam))).sort(), []);

  const filteredNfl = useMemo(() => {
    return nflSooners.filter((player) => {
      const text = `${player.name} ${player.position} ${player.currentTeam} ${player.tags.join(' ')}`.toLowerCase();
      return (
        text.includes(nflSearch.toLowerCase()) &&
        (nflStatus === 'all' || player.nflStatus === nflStatus) &&
        (nflPosition === 'all' || player.position === nflPosition) &&
        (nflTeam === 'all' || player.currentTeam === nflTeam) &&
        (nflEra === 'all' || getNflEra(player) === nflEra) &&
        (!featuredOnly || player.featured)
      );
    });
  }, [featuredOnly, nflEra, nflPosition, nflSearch, nflStatus, nflTeam]);

  const currentChapter = useMemo(() => {
    return tourChapters.find((chapter) => chapter.screens.includes(screen)) ?? tourChapters[0];
  }, [screen]);

  useEffect(() => {
    if (!filteredNfl.length) return;
    if (filteredNfl.some((player) => player.id === selectedNflId)) return;
    setSelectedNflId(filteredNfl[0].id);
  }, [filteredNfl, selectedNflId]);

  useEffect(() => {
    setPageTitle(pageTitles[screen]);
  }, [screen]);

  useEffect(() => {
    const nextPath = screenPaths[screen];
    if (window.location.pathname !== nextPath) {
      window.history.pushState(null, '', nextPath);
    }
  }, [screen]);

  useEffect(() => {
    const handlePopState = () => {
      setScreen(screenFromPath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const quizId = screenToQuizId(screen);
    if (!quizId) return;
    const progress = getQuizProgress();
    if (!isQuizUnlocked(quizId, progress)) {
      setQuizProgress(progress);
      setScreen('quizzes');
    }
  }, [screen]);

  const playTone = (kind: 'open' | 'unlock' = 'open') => {
    if (!audioEnabled) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = kind === 'unlock' ? 660 : 392;
    gain.gain.value = 0.025;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.22);
    oscillator.stop(context.currentTime + 0.24);
  };

  const beginMuseum = () => {
    setMuseumMode('guided');
    setScreen('intro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const exploreFreely = () => {
    setMuseumMode('free');
    moveTo('hub');
  };

  const openArtifact = (artifact: MuseumArtifact) => {
    setActiveArtifact(artifact);
    playTone('open');
  };

  const moveTo = (nextScreen: Screen, targetId?: string) => {
    let destination = nextScreen;

    if (museumMode === 'guided' && nextScreen === 'timeline' && !mapComplete) {
      destination = 'map';
    }

    if (museumMode === 'guided' && nextScreen === 'connections') {
      if (!mapComplete) {
        destination = 'map';
      } else if (!timelineSolved) {
        destination = 'timeline';
      }
    }

    if (museumMode === 'guided' && nextScreen === 'summary' && !matchComplete) {
      if (!mapComplete) destination = 'map';
      else if (!timelineSolved) destination = 'timeline';
      else destination = 'connections';
    }

    if (targetId) {
      if (destination === 'championships') setSelectedChampionshipId(targetId);
      if (destination === 'coaches') setSelectedCoachId(targetId);
      if (destination === 'heismans') setSelectedHeismanId(targetId);
      if (destination === 'nfl') setSelectedNflId(targetId);
      if (destination === 'rivalries') setSelectedRivalryId(targetId);
    }
    const destinationQuizId = screenToQuizId(destination);
    if (destinationQuizId && !isQuizUnlocked(destinationQuizId, getQuizProgress())) {
      setQuizProgress(getQuizProgress());
      destination = 'quizzes';
    }
    if (destination === 'quizzes') {
      setQuizProgress(getQuizProgress());
    }
    setScreen(destination);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const markCompleted = (doneScreen: Screen) => {
    setCompleted((current) => (current.includes(doneScreen) ? current : [...current, doneScreen]));
    playTone('unlock');
  };

  const handleExploreSchool = (eraId: string, schoolId: string) => {
    setExploredSchools((current) => {
      const eraExplored = current[eraId] ?? [];
      if (eraExplored.includes(schoolId)) return current;
      return { ...current, [eraId]: [...eraExplored, schoolId] };
    });
  };

  const handleDragEnter = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) return;
    setTimeline((current) => {
      const next = [...current];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
    setDragIndex(targetIndex);
    setTimelineChecked(false);
  };

  const checkTimeline = () => {
    const solved = timeline.every((event, index) => event.id === timelineEvents[index].id);
    setTimelineChecked(true);
    setTimelineSolved(solved);
    if (solved) markCompleted('timeline');
  };

  const resetTimeline = () => {
    setTimeline(initialTimeline);
    setTimelineChecked(false);
    setTimelineSolved(false);
  };

  const handleMatchChange = (pairId: string, effectId: string) => {
    const next = { ...matches, [pairId]: effectId };
    setMatches(next);
    if (matchPairs.every((pair) => next[pair.id] === pair.id)) markCompleted('connections');
  };

  const resetAll = () => {
    setCompleted([]);
    setExploredSchools({});
    setTimeline(initialTimeline);
    setTimelineChecked(false);
    setTimelineSolved(false);
    setMatches({});
    moveTo('home');
  };

  const selectAdjacentChampionship = (direction: -1 | 1) => {
    const index = championships.findIndex((item) => item.id === selectedChampionship.id);
    const next = championships[(index + direction + championships.length) % championships.length];
    setSelectedChampionshipId(next.id);
  };

  return (
    <Layout>
      <MuseumNav
        current={screen}
        onNavigate={moveTo}
        mapComplete={mapComplete}
        timelineSolved={timelineSolved}
        matchComplete={matchComplete}
        museumMode={museumMode}
        audioEnabled={audioEnabled}
        onToggleAudio={() => setAudioEnabled((value) => !value)}
      />
      <ProgressTracker current={screen} completed={completed} />
      {screen !== 'home' && screen !== 'intro' && !screen.startsWith('quiz') && screen !== 'quizzes' && <TourNarrative chapter={currentChapter} museumMode={museumMode} />}
      <PageTransition transitionKey={screen}>
        <Suspense fallback={<MuseumLoadingState />}>
        {screen === 'home' && (
          <HomeScreen
            museumMode={museumMode}
            onModeChange={setMuseumMode}
            audioEnabled={audioEnabled}
            onToggleAudio={() => setAudioEnabled((value) => !value)}
            onStart={beginMuseum}
            onExploreFreely={exploreFreely}
            onStartExploring={() => {
              setMuseumMode('free');
              moveTo('map');
            }}
          />
        )}
        {screen === 'intro' && <IntroSequence onComplete={() => moveTo('map')} />}
        {screen === 'hub' && (
          <SectionHub
            onNavigate={moveTo}
            mapComplete={mapComplete}
            timelineSolved={timelineSolved}
            museumMode={museumMode}
            onOpenArtifact={openArtifact}
            sectionIcons={sectionIcons}
          />
        )}
        {screen === 'quizzes' && (
          <QuizHubPage
            progress={quizProgress}
            onOpenQuiz={(quizId) => moveTo(quizIdToScreen(quizId))}
            onResetProgress={() => {
              resetQuizProgress();
              setQuizProgress(getQuizProgress());
            }}
          />
        )}
        {screen === 'map' && (
          <ConferenceExplorerScreen
            exploredSchools={exploredSchools}
            onExploreSchool={handleExploreSchool}
            onComplete={() => {
              markCompleted('map');
              moveTo('timeline');
            }}
            onNavigate={moveTo}
          />
        )}
        {screen === 'fbs-landscape' && <FbsLandscapePage />}
        {screen === 'championships' && (
          <ChampionshipsScreen
            selected={selectedChampionship}
            onSelect={setSelectedChampionshipId}
            onAdjacent={selectAdjacentChampionship}
            onNavigate={moveTo}
          />
        )}
        {screen === 'coaches' && <CoachesScreen selected={selectedCoach} onSelect={setSelectedCoachId} onNavigate={moveTo} />}
        {screen === 'heismans' && <HeismansScreen selected={selectedHeisman} onSelect={setSelectedHeismanId} onNavigate={moveTo} />}
        {screen === 'nfl' && (
          <NflScreen
            players={filteredNfl}
            selected={selectedNfl}
            onSelect={setSelectedNflId}
            search={nflSearch}
            onSearch={setNflSearch}
            status={nflStatus}
            onStatus={setNflStatus}
            position={nflPosition}
            onPosition={setNflPosition}
            team={nflTeam}
            onTeam={setNflTeam}
            era={nflEra}
            onEra={setNflEra}
            featuredOnly={featuredOnly}
            onFeaturedOnly={setFeaturedOnly}
            onClearFilters={() => {
              setNflSearch('');
              setNflStatus('all');
              setNflPosition('all');
              setNflTeam('all');
              setNflEra('all');
              setFeaturedOnly(false);
            }}
            positions={positions}
            teams={teams}
            onNavigate={moveTo}
          />
        )}
        {screen === 'rivalries' && <RivalriesScreen selected={selectedRivalry} onSelect={setSelectedRivalryId} onNavigate={moveTo} />}
        {screen === 'baker' && <FeatureScreen person={featuredPeople.baker} onNavigate={moveTo} />}
        {screen === 'venables' && <FeatureScreen person={featuredPeople.venables} onNavigate={moveTo} />}
        {screen === 'timeline' && (
          <TimelineScreen
            timeline={timeline}
            checked={timelineChecked}
            solved={timelineSolved}
            onCheck={checkTimeline}
            onReset={resetTimeline}
            onContinue={() => moveTo('connections')}
            onDragStart={setDragIndex}
            onDragEnter={handleDragEnter}
            onDragEnd={() => setDragIndex(null)}
          />
        )}
        {screen === 'connections' && (
          <ConnectionsScreen
            matches={matches}
            effects={shuffledEffects}
            complete={matchComplete}
            onMatch={handleMatchChange}
            onSummary={() => {
              markCompleted('summary');
              moveTo('summary');
            }}
          />
        )}
        {screen === 'summary' && <SummaryScreen mapComplete={mapComplete} timelineSolved={timelineSolved} matchComplete={matchComplete} onPlayAgain={resetAll} onNavigate={moveTo} />}
        {screen === 'quiz-coaches-order' && (
          <CoachesOrderingQuizPage
            onContinue={(nextUnlockedQuizId) => {
              setQuizProgress(getQuizProgress());
              moveTo(nextUnlockedQuizId ? quizIdToScreen(nextUnlockedQuizId) : 'quizzes');
            }}
          />
        )}
        {screen === 'quiz-heisman-matching' && (
          <HeismanMatchingQuizPage
            onContinue={(nextUnlockedQuizId) => {
              setQuizProgress(getQuizProgress());
              moveTo(nextUnlockedQuizId ? quizIdToScreen(nextUnlockedQuizId) : 'quizzes');
            }}
          />
        )}
        {screen === 'quiz-rivalries' && (
          <RivalriesQuizPage
            onContinue={(nextUnlockedQuizId) => {
              setQuizProgress(getQuizProgress());
              moveTo(nextUnlockedQuizId ? quizIdToScreen(nextUnlockedQuizId) : 'quizzes');
            }}
          />
        )}
        {screen === 'quiz-challenge' && (
          <ChallengeModePage
            onContinue={() => {
              setQuizProgress(getQuizProgress());
              moveTo('quizzes');
            }}
          />
        )}
        </Suspense>
      </PageTransition>
      <ArtifactViewerModal artifact={activeArtifact} onClose={() => setActiveArtifact(null)} onNavigate={moveTo} />
      <AudioAura enabled={audioEnabled} />
    </Layout>
  );
}


function MuseumLoadingState() {
  return (
    <section className="grid min-h-[55vh] place-items-center rounded-md border border-charcoal/10 bg-white/86 p-8 text-center shadow-exhibit" aria-live="polite" aria-busy="true">
      <div>
        <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-charcoal/10 border-t-crimson" />
        <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-brass">Loading exhibit</p>
        <p className="mt-2 text-sm leading-6 text-charcoal/66">Preparing maps, logos, and museum data.</p>
      </div>
    </section>
  );
}

function HomeScreen({
  museumMode,
  onModeChange,
  audioEnabled,
  onToggleAudio,
  onStart,
  onExploreFreely,
  onStartExploring,
}: {
  museumMode: MuseumMode;
  onModeChange: (mode: MuseumMode) => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  onStart: () => void;
  onExploreFreely: () => void;
  onStartExploring: () => void;
}) {
  return (
    <HeroLanding
      museumMode={museumMode}
      audioEnabled={audioEnabled}
      onBeginTour={() => {
        onModeChange('guided');
        onStart();
      }}
      onExploreFreely={() => {
        onModeChange('free');
        onExploreFreely();
      }}
      onStartExploring={onStartExploring}
      onToggleAudio={onToggleAudio}
    />
  );
}

function ChampionshipsScreen({
  selected,
  onSelect,
  onAdjacent,
  onNavigate,
}: {
  selected: ChampionshipSeason;
  onSelect: (id: string) => void;
  onAdjacent: (direction: -1 | 1) => void;
  onNavigate: (screen: Screen, targetId?: string) => void;
}) {
  const coach = coaches.find((item) => item.id === selected.coachId);
  const majorGames = selected.keyGames.map((game) => `${game.result} vs. ${game.opponent}: ${game.note}`);
  const relatedLinks: RelatedLink[] = [
    ...selected.relatedCoachIds.map((id) => ({ type: 'coach' as const, id, label: coaches.find((item) => item.id === id)?.name ?? 'Coach profile' })),
    ...selected.relatedPlayerIds.map((id) => {
      const heisman = heismans.find((item) => item.id === id);
      const nflPlayer = nflSooners.find((item) => item.id === id);
      return {
        type: heisman ? 'heisman' as const : 'nfl' as const,
        id,
        label: heisman?.name ?? nflPlayer?.name ?? id.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join(' '),
      };
    }),
  ];

  return (
    <section>
      <SectionHero eyebrow="Championship Gallery" title="National Championships" meta="Official OU-recognized title seasons">
        OU recognizes seven national championship seasons. Select a title year to inspect the coach, story, games, and legacy.
      </SectionHero>
      <div className="mb-5 grid grid-cols-2 gap-3 rounded-md border border-charcoal/10 bg-charcoal p-3 shadow-exhibit sm:flex sm:overflow-x-auto">
        {championships.map((title) => (
          <button
            key={title.id}
            type="button"
            onClick={() => onSelect(title.id)}
            className={`min-w-0 rounded-md border px-4 py-3 text-left transition hover:-translate-y-0.5 sm:min-w-32 ${
              selected.id === title.id ? 'border-crimson bg-crimson text-white shadow-lg' : 'border-white/10 bg-white/10 text-cream hover:bg-white/18'
            }`}
          >
            <span className="font-display text-3xl font-bold">{title.year}</span>
            <span className="block text-xs font-black uppercase tracking-[0.14em] opacity-70">{title.record}</span>
          </button>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="relative overflow-hidden rounded-md border border-charcoal/10 bg-charcoal p-7 text-cream shadow-exhibit">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_18%,rgba(190,180,165,0.2),transparent_30%),radial-gradient(circle_at_20%_80%,rgba(132,22,23,0.24),transparent_32%)]" />
          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-gold">Title Season</p>
            <h2 className="mt-2 font-display text-[clamp(4rem,22vw,8rem)] font-bold leading-none">{selected.year}</h2>
            <p className="mt-4 max-w-xl font-display text-3xl font-bold leading-tight text-cream">{selected.title}</p>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-cream/72">{selected.summary}</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <StatPill label="Coach" value={coach?.name ?? selected.coachId} dark />
              <StatPill label="Record" value={selected.record} dark />
              <StatPill label="League" value={selected.conference} dark />
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <PrimaryButton variant="secondary" onClick={() => onAdjacent(-1)}>Previous Title</PrimaryButton>
              <PrimaryButton variant="secondary" onClick={() => onAdjacent(1)}>Next Title</PrimaryButton>
            </div>
          </div>
        </article>
        <article className="rounded-md border border-charcoal/10 bg-white/88 p-6 shadow-exhibit">
          <div className="grid gap-4 md:grid-cols-2">
            <StoryCard title="Season file">{selected.summary}</StoryCard>
            <StoryCard title="Why it matters">{selected.whyItMatters}</StoryCard>
            <StoryCard title="Signature moment">{selected.keyGames[0] ? `${selected.keyGames[0].result} vs. ${selected.keyGames[0].opponent}: ${selected.keyGames[0].note}` : selected.summary}</StoryCard>
            <StoryCard title="State of college football">{selected.year < 1960 ? 'Regional conferences still shaped national power, and OU made the Plains impossible to ignore.' : selected.year < 1990 ? 'Television, bowls, and rivalry Saturdays turned title races into national theater.' : 'The modern Big 12 era demanded speed, depth, and national recruiting reach.'}</StoryCard>
          </div>
          <InfoList title="Notable Players" items={selected.notablePlayers} />
          <InfoList title="Major Games" items={majorGames} />
          <section className="mt-5 rounded-md border border-gold/40 bg-cream p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brass">Recognition Note</p>
            <p className="mt-1 text-sm leading-6 text-charcoal/72">{selected.titleRecognition}</p>
          </section>
          <RelatedLinks links={relatedLinks} onNavigate={onNavigate} />
        </article>
      </div>
      <ComparePanel
        title="Compare Title Teams"
        items={championships.slice(-3).map((title) => ({
          label: String(title.year),
          summary: title.whyItMatters,
          stats: [
            { label: 'Record', value: title.record },
            { label: 'Conference', value: title.conference },
            { label: 'Coach', value: coaches.find((item) => item.id === title.coachId)?.name ?? title.coachId },
          ],
        }))}
      />
      <ReflectionPrompt question="What makes a championship season feel larger than its record?" />
    </section>
  );
}

function CoachesScreen({ selected, onSelect, onNavigate }: { selected: CoachProfile; onSelect: (id: string) => void; onNavigate: (screen: Screen, targetId?: string) => void }) {
  const relatedLinks: RelatedLink[] = selected.relatedChampionshipIds.map((id) => ({
    type: 'championship',
    id,
    label: championships.find((item) => item.id === id)?.title ?? 'Championship season',
  }));

  return (
    <section>
      <SectionHero eyebrow="Leadership Wing" title="Important Coaches">
        Trace the leaders who shaped OU’s style, standards, and national reputation.
      </SectionHero>
      <div className="mb-5 flex justify-start sm:justify-end">
        <PrimaryButton onClick={() => onNavigate('quiz-coaches-order')}>Championship Coaches Quiz</PrimaryButton>
      </div>
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          {coaches.map((coach) => (
            <button
              key={coach.id}
              type="button"
              onClick={() => onSelect(coach.id)}
              className={`w-full rounded-md border p-4 text-left transition hover:-translate-y-0.5 ${selected.id === coach.id ? 'border-gold bg-charcoal text-cream shadow-exhibit' : 'border-charcoal/10 bg-white/82 text-charcoal shadow-sm'}`}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="font-display text-2xl font-bold">{coach.name}</span>
                {coach.featured && coach.championships.length > 0 && <span className="rounded-sm bg-gold px-2 py-1 text-xs font-black uppercase tracking-[0.12em] text-charcoal">Title Coach</span>}
              </span>
              <span className="mt-1 block text-xs font-black uppercase tracking-[0.16em] opacity-70">{coach.years}</span>
            </button>
          ))}
        </div>
        <article className="rounded-md border border-charcoal/10 bg-white/88 p-6 shadow-exhibit">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-brass">{selected.role} | {selected.years}</p>
          <h2 className="mt-2 font-display text-5xl font-bold">{selected.name}</h2>
          <p className="mt-3 text-sm leading-6 text-charcoal/72">{selected.summary}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <StatPill label="OU Record" value={selected.record} />
            <StatPill label="Titles" value={selected.championships.length ? selected.championships.join(', ') : selected.conferenceTitles} />
          </div>
          <InfoList title="Signature Traits" items={[selected.philosophy, ...selected.tags]} />
          <InfoList title="Defining Players" items={selected.notablePlayers} />
          <div className="mt-4 rounded-md bg-charcoal p-4 text-cream">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-gold">Legacy</p>
            <p className="mt-1 text-sm leading-6 text-cream/76">{selected.legacy}</p>
            <p className="mt-3 text-sm leading-6 text-cream/76">{selected.eraLabel}</p>
          </div>
          <RelatedLinks links={relatedLinks} onNavigate={onNavigate} />
        </article>
      </div>
      <ComparePanel
        title="Compare Coaching Eras"
        items={coaches.filter((coach) => coach.featured).slice(0, 3).map((coach) => ({
          label: coach.name,
          summary: coach.legacy,
          stats: [
            { label: 'Years', value: coach.years },
            { label: 'Record', value: coach.record },
            { label: 'Identity', value: coach.eraLabel },
          ],
        }))}
      />
      <ReflectionPrompt question="How much of a program’s identity comes from its coaches?" />
    </section>
  );
}

function HeismansScreen({ selected, onSelect, onNavigate }: { selected: HeismanWinner; onSelect: (id: string) => void; onNavigate: (screen: Screen, targetId?: string) => void }) {
  const relatedLinks: RelatedLink[] = [
    ...selected.relatedCoachIds.map((id) => ({ type: 'coach' as const, id, label: coaches.find((item) => item.id === id)?.name ?? 'Coach profile' })),
    ...selected.relatedChampionshipIds.map((id) => ({ type: 'championship' as const, id, label: championships.find((item) => item.id === id)?.title ?? 'Championship season' })),
    ...(selected.id === 'baker-mayfield' ? [{ type: 'feature' as const, id: 'baker-mayfield', label: 'Baker feature' }, { type: 'nfl' as const, id: 'baker-mayfield', label: 'NFL profile' }] : []),
    ...(selected.id === 'kyler-murray' ? [{ type: 'nfl' as const, id: 'kyler-murray', label: 'NFL profile' }] : []),
  ];

  return (
    <section>
      <SectionHero eyebrow="Trophy Room" title="Seven Heisman Winners" accent="gold" meta="OU Heisman legacy: 1952-2018">
        Oklahoma has produced seven Heisman Trophy winners, from Billy Vessels to Kyler Murray.
      </SectionHero>
      <div className="mb-5 flex justify-start sm:justify-end">
        <PrimaryButton onClick={() => onNavigate('quiz-heisman-matching')}>Heisman Matching Game</PrimaryButton>
      </div>
      <div className="mb-5 rounded-md border border-charcoal/10 bg-charcoal p-4 shadow-exhibit">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
        {heismans.map((winner) => (
          <button
            key={winner.id}
            type="button"
            onClick={() => onSelect(winner.id)}
            className={`relative overflow-hidden rounded-md border p-4 text-left transition hover:-translate-y-1 ${
              selected.id === winner.id ? 'border-crimson bg-crimson text-white shadow-[0_0_26px_rgba(132,22,23,0.32)]' : 'border-white/10 bg-white/10 text-cream hover:bg-white/16'
            }`}
          >
            <Award className={`mb-4 h-8 w-8 ${selected.id === winner.id ? 'text-white' : 'text-gold'}`} aria-hidden="true" />
            <p className="font-display text-3xl font-bold">{winner.year}</p>
            <h2 className="mt-1 font-display text-xl font-bold leading-tight">{winner.name}</h2>
            <p className="mt-2 text-xs font-black uppercase tracking-[0.12em] opacity-70">{winner.position}</p>
          </button>
        ))}
        </div>
      </div>
      <article className="rounded-md border border-charcoal/10 bg-white/88 p-6 shadow-exhibit">
        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="rounded-md bg-charcoal p-6 text-cream">
            <Award className="mb-4 h-12 w-12 text-gold" aria-hidden="true" />
            <p className="text-xs font-black uppercase tracking-[0.2em] text-gold">{selected.year} Heisman</p>
            <h2 className="mt-2 font-display text-5xl font-bold leading-tight">{selected.name}</h2>
            <p className="mt-3 text-sm font-semibold text-cream/70">{selected.position}</p>
            <p className="mt-5 text-sm leading-6 text-cream/76">{selected.summary}</p>
          </div>
          <div>
            <div className="grid gap-3 md:grid-cols-3">
          {selected.notableStats.map((stat) => <StatPill key={stat.label} label={stat.label} value={stat.value} />)}
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <StoryCard title="Why he won">{selected.whyWon}</StoryCard>
              <StoryCard title="OU legacy">{selected.ouLegacy}</StoryCard>
              <StoryCard title="Team context">{selected.seasonContext}</StoryCard>
              <StoryCard title="Milestone">{selected.milestones[0]?.description ?? selected.summary}</StoryCard>
            </div>
          </div>
        </div>
        <RelatedLinks links={relatedLinks} onNavigate={onNavigate} />
      </article>
      <ComparePanel
        title="Compare Heisman Winners"
        items={[heismans[0], heismans[5], heismans[6]].map((winner) => ({
          label: winner.name,
          summary: winner.ouLegacy,
          stats: [
            { label: 'Year', value: String(winner.year) },
            { label: 'Position', value: winner.position },
            { label: 'Signature', value: winner.notableStats[2]?.value ?? 'OU icon' },
          ],
        }))}
      />
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {signatureMoments.filter((moment) => ['win-streak', 'title-2000'].includes(moment.id)).map((moment) => (
          <SignatureMomentCard key={moment.id} moment={moment} onNavigate={onNavigate} />
        ))}
      </div>
      <ReflectionPrompt question="Why do certain players become symbols instead of just stars?" />
    </section>
  );
}

function NflScreen(props: {
  players: NFLSooner[];
  selected: NFLSooner;
  onSelect: (id: string) => void;
  search: string;
  onSearch: (value: string) => void;
  status: string;
  onStatus: (value: string) => void;
  position: string;
  onPosition: (value: string) => void;
  team: string;
  onTeam: (value: string) => void;
  era: string;
  onEra: (value: string) => void;
  featuredOnly: boolean;
  onFeaturedOnly: (value: boolean) => void;
  onClearFilters: () => void;
  positions: string[];
  teams: string[];
  onNavigate: (screen: Screen, targetId?: string) => void;
}) {
  const active = nflSooners.filter((player) => player.active).slice(0, 5);

  return (
    <section>
      <SectionHero eyebrow="Pro Pipeline" title="Sooners in the NFL" meta={`${props.players.length} players shown`}>
        Search and filter a scalable starter database of OU alumni in the NFL. Roster statuses are representative and should be reviewed periodically.
      </SectionHero>
      <section className="mb-5 grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="rounded-md border border-charcoal/10 bg-charcoal p-5 text-cream shadow-exhibit">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-gold">Active Sooners Snapshot</p>
          <div className="mt-3 grid gap-2">
            {active.map((player) => (
              <button key={player.id} type="button" onClick={() => props.onSelect(player.id)} className="flex items-center justify-between rounded-md bg-white/10 px-3 py-2 text-sm font-bold transition hover:bg-crimson">
                <span className="flex items-center gap-2">
                  <NFLLogoBadge
                    teamAbbreviation={getCurrentTeamAbbreviation(player)}
                    teamName={player.currentTeam}
                    className="h-8 w-8 border-white/15 bg-white"
                    imageClassName="p-1"
                  />
                  <span>{player.name}</span>
                </span>
                <span className="text-cream/62">{player.currentTeam}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-md border border-charcoal/10 bg-white/84 p-5 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-crimson" aria-hidden="true" />
              <h2 className="font-display text-2xl font-bold">Filter the Database</h2>
            </div>
            <button
              type="button"
              onClick={props.onClearFilters}
              className="rounded-sm bg-charcoal px-3 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-cream transition hover:bg-crimson"
            >
              Clear filters
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.4fr_repeat(4,0.9fr)]">
            <label className="relative md:col-span-2 xl:col-span-1">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-charcoal/40" aria-hidden="true" />
            <input
              value={props.search}
              onChange={(event) => props.onSearch(event.target.value)}
              placeholder="Search player, tag, team..."
              className="w-full rounded-md border border-charcoal/15 bg-cream py-3 pl-9 pr-3 text-sm font-semibold"
            />
            </label>
            <FilterSelect label="Status" value={props.status} onChange={props.onStatus} options={['all', 'active', 'practice squad', 'retired', 'historical']} />
            <FilterSelect label="Position" value={props.position} onChange={props.onPosition} options={['all', ...props.positions]} />
            <FilterSelect label="Team" value={props.team} onChange={props.onTeam} options={['all', ...props.teams]} />
            <FilterSelect label="Era" value={props.era} onChange={props.onEra} options={['all', 'classic', 'modern', 'current']} />
          </div>
          <label className="mt-3 inline-flex items-center gap-2 rounded-md border border-charcoal/15 bg-cream px-3 py-2 text-sm font-bold">
            <input type="checkbox" checked={props.featuredOnly} onChange={(event) => props.onFeaturedOnly(event.target.checked)} />
            Featured players only
          </label>
          <p className="mt-3 text-xs font-semibold text-charcoal/55">{props.players.length} players match the current filters.</p>
        </div>
      </section>
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-3 md:grid-cols-2">
          {props.players.length ? props.players.map((player) => (
            <button
              key={player.id}
              type="button"
              onClick={() => props.onSelect(player.id)}
              className={`min-h-[44px] rounded-md border p-4 text-left transition hover:-translate-y-0.5 ${props.selected.id === player.id ? 'border-gold bg-charcoal text-cream shadow-exhibit' : 'border-charcoal/10 bg-white/84 text-charcoal shadow-sm'}`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <NFLLogoBadge
                  teamAbbreviation={getCurrentTeamAbbreviation(player)}
                  teamName={player.currentTeam}
                  className={`h-11 w-11 ${props.selected.id === player.id ? 'border-white/20 bg-white' : ''}`}
                  imageClassName="p-1.5"
                />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] opacity-65">{player.position} | OU {player.ouYears}</p>
                  <h2 className="mt-2 font-display text-2xl font-bold">{player.name}</h2>
                  <p className="mt-1 text-sm font-semibold opacity-70">{player.currentTeam}</p>
                </div>
              </div>
                <StatusBadge status={player.nflStatus} />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {getPlayerTeamAbbreviations(player).slice(0, 4).map((team) => (
                  <NFLLogoBadge
                    key={`${player.id}-${team.teamName}`}
                    teamAbbreviation={team.abbreviation}
                    teamName={team.teamName}
                    className="h-7 w-7"
                    imageClassName="p-0.5"
                  />
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {player.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-sm bg-gold/20 px-2 py-1 text-xs font-bold">{tag}</span>)}
              </div>
            </button>
          )) : (
            <div className="rounded-md border border-charcoal/10 bg-white/84 p-6 shadow-sm md:col-span-2">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-brass">No players match</p>
              <h2 className="mt-2 font-display text-3xl font-bold">Try broadening the filters</h2>
              <p className="mt-2 text-sm leading-6 text-charcoal/68">Clear the search, switch status to all, or turn off featured-only to scan the full starter database.</p>
            </div>
          )}
        </div>
        <article className="self-start rounded-md border border-charcoal/10 bg-white/90 p-6 shadow-exhibit xl:sticky xl:top-32">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <NFLLogoBadge
                teamAbbreviation={getCurrentTeamAbbreviation(props.selected)}
                teamName={props.selected.currentTeam}
                className="h-14 w-14"
                imageClassName="p-1.5"
              />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-brass">{props.selected.position} profile</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {getPlayerTeamAbbreviations(props.selected).slice(0, 5).map((team) => (
                    <NFLLogoBadge
                      key={`${props.selected.id}-${team.teamName}`}
                      teamAbbreviation={team.abbreviation}
                      teamName={team.teamName}
                      className="h-7 w-7"
                      imageClassName="p-0.5"
                    />
                  ))}
                </div>
              </div>
            </div>
            <StatusBadge status={props.selected.nflStatus} />
          </div>
          <h2 className="mt-2 break-words font-display text-[clamp(2.5rem,10vw,3rem)] font-bold leading-tight">{props.selected.name}</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <StatPill label="Current Team" value={props.selected.currentTeam} />
            <StatPill label="Draft" value={`${props.selected.draftYear} Round ${props.selected.draftRound}, Pick ${props.selected.draftPick}`} />
          </div>
          <StoryCard title="OU profile">{props.selected.ouSummary}</StoryCard>
          <StoryCard title="NFL career">{props.selected.nflSummary}</StoryCard>
          <StoryCard title="Roster metadata">Current team and active status are starter-data fields intended for periodic review.</StoryCard>
          <RelatedLinks links={nflRelatedLinks(props.selected)} onNavigate={props.onNavigate} />
        </article>
      </div>
      <ReflectionPrompt question="What changes when a college program becomes a pipeline to professional football?" />
    </section>
  );
}

function RivalriesScreen({
  selected,
  onSelect,
  onNavigate,
}: {
  selected: RivalryProfile;
  onSelect: (id: string) => void;
  onNavigate: (screen: Screen, targetId?: string) => void;
}) {
  return (
    <section>
      <SectionHero eyebrow="Rivalry Gallery" title="Rivalries That Shaped the Story" meta="Texas | Nebraska | Oklahoma State | Missouri">
        Some opponents are more than names on a schedule. They define eras, conference meaning, and how fans remember time.
      </SectionHero>
      <div className="mb-5 flex justify-start sm:justify-end">
        <PrimaryButton onClick={() => onNavigate('quiz-rivalries')}>Rivalries Quiz</PrimaryButton>
      </div>
      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="grid gap-3">
          {rivalries.map((rivalry) => (
            <button
              key={rivalry.id}
              type="button"
              onClick={() => onSelect(rivalry.id)}
              className={`rounded-md border p-4 text-left transition hover:-translate-y-0.5 ${
                selected.id === rivalry.id ? 'border-gold bg-charcoal text-cream shadow-exhibit' : 'border-charcoal/10 bg-white/84 text-charcoal shadow-sm'
              }`}
            >
              <p className="text-xs font-black uppercase tracking-[0.16em] opacity-65">{rivalry.opponent}</p>
              <h2 className="mt-1 font-display text-2xl font-bold">{rivalry.title}</h2>
              <p className="mt-2 text-sm leading-6 opacity-70">{rivalry.emotionalTone}</p>
            </button>
          ))}
        </div>
        <article className="rounded-md border border-charcoal/10 bg-white/88 p-6 shadow-exhibit">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-brass">{selected.opponent} rivalry file</p>
          <h2 className="mt-2 font-display text-5xl font-bold leading-tight">{selected.title}</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <StoryCard title="Origin story">{selected.origin}</StoryCard>
            <StoryCard title="Emotional tone">{selected.emotionalTone}</StoryCard>
            <StoryCard title="Conference implications">{selected.conferenceImplication}</StoryCard>
            <StoryCard title="Cultural impact">{selected.culturalImpact}</StoryCard>
          </div>
          <InfoList title="Defining Games" items={selected.definingGames.map((game) => `${game.year}: ${game.result} - ${game.note}`)} />
          <RelatedLinks links={selected.relatedLinks} onNavigate={onNavigate} />
        </article>
      </div>
      <ReflectionPrompt question="How do rivalries turn geography into identity?" />
    </section>
  );
}

function FeatureScreen({ person, onNavigate }: { person: FeaturedPerson; onNavigate: (screen: Screen, targetId?: string) => void }) {
  const isBaker = person.slug === 'baker-mayfield';
  const profileImage = isBaker ? profileImages.baker : profileImages.venables;

  return (
    <section>
      <section className={`mb-6 overflow-hidden rounded-md border border-charcoal/10 text-cream shadow-exhibit ${isBaker ? 'bg-crimson' : 'bg-charcoal'}`}>
        <div className={`relative p-7 sm:p-8 ${isBaker ? 'bg-[radial-gradient(circle_at_78%_22%,rgba(255,255,255,0.14),transparent_28%),linear-gradient(135deg,rgba(132,22,23,0.96),rgba(0,0,0,0.9))]' : 'bg-[radial-gradient(circle_at_78%_22%,rgba(190,180,165,0.14),transparent_28%),linear-gradient(135deg,rgba(0,0,0,0.98),rgba(50,50,50,0.94))]'}`}>
          <div className="absolute right-8 top-8 hidden rounded-md border border-white/10 bg-white/10 px-4 py-3 text-right backdrop-blur xl:block">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-gold">{isBaker ? 'Icon File' : 'Strategy File'}</p>
            <p className="font-display text-3xl font-bold">{isBaker ? 'No. 6' : 'SEC Era'}</p>
          </div>
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_220px] xl:grid-cols-[minmax(0,1fr)_260px]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-gold">{person.category}</p>
              <h1 className="mt-3 max-w-4xl font-display text-[clamp(3rem,14vw,4.75rem)] font-bold leading-none">{person.name}</h1>
              <p className="mt-3 max-w-4xl font-display text-3xl font-bold leading-tight text-cream/88">{person.title}</p>
              <p className="mt-6 max-w-3xl text-base leading-7 text-cream/76">{person.heroSummary}</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {person.statBlocks.map((stat) => <StatPill key={stat.label} label={stat.label} value={stat.value} dark />)}
              </div>
            </div>
            <div className="mx-auto w-full max-w-[220px] lg:mx-0 lg:max-w-none">
              <ProfileImage
                src={profileImage.src}
                alt={profileImage.alt}
                fallbackText={profileImage.fallbackText}
                className="aspect-[4/5] w-full"
                imageClassName="bg-white/6"
              />
            </div>
          </div>
        </div>
      </section>
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <section className="rounded-md border border-charcoal/10 bg-white/88 p-6 shadow-exhibit">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brass">{isBaker ? 'Narrative Arc' : 'Program Lens'}</p>
            <p className="mt-2 text-sm leading-6 text-charcoal/72">{person.longSummary}</p>
            <div className="mt-4 space-y-3">
              {person.spotlightSections.map((panel) => <StoryCard key={panel.title} title={panel.title}>{panel.body}</StoryCard>)}
            </div>
          </section>
          <RelatedLinks links={person.relatedLinks} onNavigate={onNavigate} />
        </div>
        <div>
          <h2 className="mb-3 font-display text-3xl font-bold">{isBaker ? 'Baker Milestones' : 'Venables Milestones'}</h2>
          <MilestoneTimeline items={person.milestoneTimeline.map((item) => ({ year: item.year, title: item.title, body: item.description }))} />
        </div>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {person.spotlightSections.slice(0, 2).map((card, index) => (
          <FeatureBanner key={card.title} title={card.title} buttonLabel={isBaker ? 'Follow the Legacy' : 'View the Context'} onClick={() => {
            const link = person.relatedLinks[index] ?? person.relatedLinks[0];
            const route = relatedLinkToRoute(link);
            onNavigate(route.screen, route.targetId);
          }}>
            {card.body}
          </FeatureBanner>
        ))}
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {(isBaker ? signatureMoments.filter((moment) => moment.id === 'sec-move' || moment.id === 'title-2000').slice(0, 1) : signatureMoments.filter((moment) => moment.id === 'sec-move')).map((moment) => (
          <SignatureMomentCard key={moment.id} moment={moment} onNavigate={onNavigate} />
        ))}
      </div>
      <ReflectionPrompt question={isBaker ? 'When does confidence become part of a team’s legacy?' : 'How should a tradition-rich program prepare for a new competitive world?'} />
    </section>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-brass">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => <span key={item} className="rounded-sm bg-cream px-2.5 py-1 text-xs font-bold text-charcoal/72">{item}</span>)}
      </div>
    </div>
  );
}

function StoryCard({ title, children }: { title: string; children: string }) {
  return (
    <article className="rounded-md border border-charcoal/10 bg-white/86 p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-brass">{title}</p>
      <p className="mt-2 text-sm leading-6 text-charcoal/72">{children}</p>
    </article>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label>
      <span className="mb-1 block text-xs font-black uppercase tracking-[0.14em] text-charcoal/50">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-md border border-charcoal/15 bg-cream px-3 py-3 text-sm font-bold capitalize shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-crimson/15">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function StatusBadge({ status }: { status: NFLStatus }) {
  const classes = {
    active: 'bg-emerald-700 text-white',
    'practice squad': 'bg-gold text-charcoal',
    retired: 'bg-charcoal/12 text-charcoal',
    historical: 'bg-crimson text-white',
  }[status];

  return <span className={`shrink-0 rounded-sm px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${classes}`}>{status}</span>;
}

export default App;
