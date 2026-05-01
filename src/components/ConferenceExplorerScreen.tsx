import { CheckCircle2, ChevronLeft, ChevronRight, Info, MapPinned, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { BrandLogo } from './BrandLogo';
import { conferenceEras, earlyContextCards } from '../data/conferences';
import { historicalNotes } from '../data/historicalNotes';
import { ConferenceLogo } from './ui/ConferenceLogo';
import { normanAnchor } from '../data/heismanMapData';
import { nflDestinationMarkers, nflMapRoutes } from '../data/nflMapData';
import { ouSeriesHistory } from '../data/ouSeriesHistory';
import { recruitingRegions } from '../data/recruitingMapData';
import { rivalryConnections, rivalryRouteLines } from '../data/rivalryMapData';
import { rivalries } from '../data/immersive';
import { nflSooners } from '../data/nflSooners';
import type { ExploredSchools, Screen } from '../types';
import type {
  ConferenceEra,
  ConferenceSchool,
  MapLayerId,
  MapLegendItem,
  NFLDestinationMarker,
  NFLMapPlayerRoute,
  RecruitingRegion,
  RivalryConnection,
  RivalryProfile,
} from '../types/content';
import { getEraExplored, isConferenceExplorationComplete, isEraComplete } from '../utils/exploration';
import { getSchoolLogo } from '../utils/getSchoolLogo';
import { getOUOriginLogo } from '../utils/getNFLLogo';
import { GalleryPlaque, HistoricalNotesPanel, RelatedLinks, SectionHero } from './MuseumComponents';
import { NFLLogoBadge } from './NFLLogoBadge';
import { PrimaryButton } from './PrimaryButton';
import { MapControls } from './map/MapControls';
import { MapLayerSwitcher } from './map/MapLayerSwitcher';
import { MarkerLayer } from './map/MarkerLayer';
import { NFLLayer } from './map/NFLLayer';
import { RecruitingLayer } from './map/RecruitingLayer';
import { RivalryLayer } from './map/RivalryLayer';
import { USConferenceMap } from './map/USConferenceMap';
import { OpponentSeriesHistory } from './series/OpponentSeriesHistory';

type ConferenceExplorerScreenProps = {
  exploredSchools: ExploredSchools;
  onExploreSchool: (eraId: string, schoolId: string) => void;
  onComplete: () => void;
  onNavigate: (screen: Screen) => void;
};

function getPreferredEraSchool(era: ConferenceEra) {
  return era.schools.find((school) => school.isOU) ?? era.schools[0];
}

function getEraTitleYear(era: ConferenceEra) {
  return era.years.match(/\d{4}/)?.[0] ?? null;
}

function EraSelector({
  currentEra,
  exploredSchools,
  onSelectEra,
}: {
  currentEra: ConferenceEra;
  exploredSchools: ExploredSchools;
  onSelectEra: (eraId: string) => void;
}) {
  const railRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const selected = rail.querySelector<HTMLButtonElement>(`[data-era-id="${currentEra.id}"]`);
    selected?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [currentEra.id]);

  const scrollRail = (direction: 'prev' | 'next') => {
    const rail = railRef.current;
    if (!rail) return;
    const amount = Math.max(rail.clientWidth * 0.72, 260);
    rail.scrollBy({ left: direction === 'next' ? amount : -amount, behavior: 'smooth' });
  };

  return (
    <div className="rounded-md border border-charcoal/10 bg-white/80 p-3 shadow-exhibit backdrop-blur">
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-brass">Conference Timeline</p>
          <p className="text-sm font-semibold text-charcoal/62">Step through major conference snapshots and watch the membership map evolve.</p>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={() => scrollRail('prev')}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-charcoal/10 bg-white text-charcoal transition hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson/40"
            aria-label="Scroll conference snapshots left"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollRail('next')}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-charcoal/10 bg-white text-charcoal transition hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson/40"
            aria-label="Scroll conference snapshots right"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        ref={railRef}
        className="relative grid grid-cols-1 gap-3 pb-2 md:flex md:snap-x md:snap-mandatory md:overflow-x-auto md:scroll-smooth md:[scrollbar-width:thin]"
        role="tablist"
        aria-label="Conference eras"
      >
        <div className="pointer-events-none absolute left-6 right-6 top-7 hidden h-px bg-charcoal/15 md:block" />
        {conferenceEras.map((era) => {
          const explored = getEraExplored(era.id, exploredSchools).length;
          const complete = isEraComplete(era, exploredSchools);
          const selected = currentEra.id === era.id;
          const percent = Math.round((explored / era.schools.length) * 100);

          return (
            <button
              key={era.id}
              data-era-id={era.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onSelectEra(era.id)}
              className={`relative min-w-0 overflow-hidden rounded-md border px-4 py-3 text-left transition duration-300 hover:-translate-y-0.5 md:min-w-[16rem] md:snap-center ${
                selected
                  ? 'border-gold bg-charcoal text-cream shadow-exhibit'
                  : complete
                    ? 'border-emerald-600 bg-emerald-50 text-charcoal shadow-sm'
                    : 'border-charcoal/12 bg-white text-charcoal shadow-sm hover:border-crimson'
              }`}
            >
              <span
                className="absolute inset-x-0 top-0 h-1"
                style={{ backgroundColor: selected || complete ? era.accent : 'rgba(50, 50, 50, 0.12)' }}
              />
              <span className="flex items-center justify-between gap-2">
                <span className="font-display text-xl font-bold">{era.label}</span>
                <span className={`flex h-7 w-7 items-center justify-center rounded-full ${complete ? 'bg-emerald-700 text-white animate-[pulseCorrect_0.55s_ease-out]' : selected ? 'bg-gold text-charcoal' : 'bg-charcoal/10 text-charcoal/45'}`}>
                  {complete ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : explored}
                </span>
              </span>
              <span className={`mt-1 block text-[11px] font-black uppercase tracking-[0.14em] ${selected ? 'text-gold/90' : 'text-brass'}`}>
                {era.conference}
              </span>
              <span className={`mt-1 block text-xs font-black uppercase tracking-[0.14em] ${selected ? 'text-white/80' : 'text-charcoal/55'}`}>
                {era.years}
              </span>
              <span className={`mt-2 block text-xs leading-5 ${selected ? 'text-white/82' : 'text-charcoal/66'}`}>
                {era.changeSummary}
              </span>
              <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-charcoal/10">
                <span className="block h-full rounded-full bg-crimson transition-all duration-500" style={{ width: `${percent}%` }} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ExplorationProgress({ era, exploredSchools }: { era: ConferenceEra; exploredSchools: ExploredSchools }) {
  const explored = getEraExplored(era.id, exploredSchools).length;
  const total = era.schools.length;
  const percent = Math.round((explored / total) * 100);

  return (
    <section
      className={`rounded-md border p-5 shadow-sm transition duration-300 ${
        isEraComplete(era, exploredSchools)
          ? 'border-emerald-600 bg-emerald-50 animate-[eraComplete_0.7s_ease-out]'
          : 'border-charcoal/10 bg-white/80'
      }`}
      aria-label={`${era.eraName} exploration progress`}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-charcoal/55">Unlock progress</p>
        <p className="font-display text-2xl font-bold text-crimson">
          {explored} / {total}
        </p>
      </div>
      <div className="h-4 overflow-hidden rounded-full bg-charcoal/10 p-1">
        <div className="h-full rounded-full bg-crimson transition-all duration-700" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-3 text-sm font-bold text-charcoal/70">
        {isEraComplete(era, exploredSchools) ? `${era.eraName} complete. Nice work.` : `${total - explored} school${total - explored === 1 ? '' : 's'} left in this era.`}
      </p>
    </section>
  );
}

function ContinueFooter({
  complete,
  onComplete,
}: {
  complete: boolean;
  onComplete: () => void;
}) {
  return (
    <footer className={`mt-6 flex flex-wrap items-center justify-between gap-3 rounded-md border p-5 shadow-exhibit transition duration-300 ${complete ? 'border-emerald-600 bg-emerald-50 animate-[eraComplete_0.7s_ease-out]' : 'border-charcoal/10 bg-white/80'}`}>
      <div className="flex items-center gap-3">
        {complete ? <Sparkles className="h-5 w-5 text-emerald-700" aria-hidden="true" /> : <Info className="h-5 w-5 text-crimson" aria-hidden="true" />}
        <p className="text-sm font-semibold text-charcoal/70">
          {complete ? 'Exploration complete. The assessment path is unlocked.' : 'Completion rule: click every school marker in every major era.'}
        </p>
      </div>
      <PrimaryButton disabled={!complete} onClick={onComplete}>
        Continue to Timeline
      </PrimaryButton>
    </footer>
  );
}

function StoryPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-md border border-charcoal/10 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-charcoal/50">{title}</p>
      <p className="mt-1 text-sm leading-6 text-charcoal/74">{children}</p>
    </section>
  );
}

function ConferenceLogoBadge({
  eraId,
  conference,
}: {
  eraId: string;
  conference: string;
}) {
  return (
    <ConferenceLogo
      snapshotId={eraId}
      alt={`${conference} logo`}
      size="md"
      fallbackLabel={conference.toUpperCase()}
      className="bg-transparent px-1 text-charcoal shadow-[0_8px_18px_rgba(0,0,0,0.08)] transition-opacity duration-500 ease-in-out"
      imageClassName="drop-shadow-[0_6px_12px_rgba(0,0,0,0.14)]"
    />
  );
}
function ConferenceDetailPanel({ era, school }: { era: ConferenceEra; school: ConferenceSchool }) {
  const [activeTab, setActiveTab] = useState<'info' | 'history'>('info');
  const seriesHistory = ouSeriesHistory[school.id];

  useEffect(() => {
    setActiveTab('info');
  }, [school.id]);

  return (
    <aside className="overflow-hidden rounded-md border border-charcoal/10 bg-white/90 shadow-exhibit animate-[fadeIn_0.25s_ease-out]" aria-live="polite">
      <div className="h-2" style={{ backgroundColor: school.isOU ? '#841617' : era.accent }} />
      <div className="p-6">
        <div className="mb-5 flex items-start gap-4">
          <div className={`flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md border-2 text-xl font-black text-white shadow-lg ${school.isOU ? 'border-gold bg-crimson' : 'border-charcoal/10 bg-charcoal'}`}>
            {school.logo.light ? <img src={school.logo.light} alt={school.logo.alt} className="h-full w-full object-contain bg-white p-1" loading="lazy" /> : school.shortName}
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brass">Conference placard</p>
            <h2 className="mt-1 font-display text-4xl font-bold leading-none text-charcoal">{school.name}</h2>
            <p className="mt-2 text-sm font-bold text-charcoal/60">{school.mascot} | {school.city}, {school.state}</p>
            <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-charcoal/45">{era.label} | {era.years}</p>
          </div>
        </div>
        <div className="mb-4 flex gap-2 border-b border-charcoal/10 pb-4" role="tablist" aria-label={`${school.name} detail tabs`}>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'info'}
            onClick={() => setActiveTab('info')}
            className={`rounded-md px-3 py-2 text-xs font-black uppercase tracking-[0.12em] transition ${
              activeTab === 'info' ? 'bg-charcoal text-white' : 'bg-cream text-charcoal/70 hover:bg-cream/70'
            }`}
          >
            School Info
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'history'}
            onClick={() => setActiveTab('history')}
            className={`rounded-md px-3 py-2 text-xs font-black uppercase tracking-[0.12em] transition ${
              activeTab === 'history' ? 'bg-charcoal text-white' : 'bg-cream text-charcoal/70 hover:bg-cream/70'
            }`}
          >
            OU Series History
          </button>
        </div>

        {activeTab === 'info' ? (
          <div className="grid gap-3">
            <StoryPanel title="Why it matters">{school.note}</StoryPanel>
            <StoryPanel title="OU context">{school.ouContext}</StoryPanel>
          </div>
        ) : (
          <OpponentSeriesHistory history={seriesHistory} />
        )}
      </div>
    </aside>
  );
}

function NflDetailPanel({
  viewMode,
  selectedPlayer,
  selectedPlayerRoutes,
  selectedTeam,
  teamPlayers,
  allPlayers,
  onSelectPlayer,
  showOrigin,
}: {
  viewMode: 'teams' | 'player';
  selectedPlayer: NFLMapPlayerRoute | undefined;
  selectedPlayerRoutes: NFLMapPlayerRoute[];
  selectedTeam: NFLDestinationMarker | undefined;
  teamPlayers: NFLMapPlayerRoute[];
  allPlayers: NFLMapPlayerRoute[];
  onSelectPlayer: (playerId: string) => void;
  showOrigin: boolean;
}) {
  return (
    <aside className="overflow-hidden rounded-md border border-charcoal/10 bg-white/90 shadow-exhibit animate-[fadeIn_0.25s_ease-out]" aria-live="polite">
      <div className="h-2 bg-sky" />
      <div className="p-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-brass">Norman to the NFL</p>
        <div className="mb-4 mt-3 flex items-center gap-3">
          {showOrigin ? (
            <BrandLogo
              src={getOUOriginLogo()}
              alt="Oklahoma Sooners logo"
              fallback="OU"
              className="h-14 w-14 border border-charcoal/10 shadow-sm"
              imageClassName="p-1.5"
            />
          ) : (
            <NFLLogoBadge
              teamAbbreviation={viewMode === 'player' ? selectedPlayer?.teamAbbreviation : selectedTeam?.teamAbbreviation}
              teamName={viewMode === 'player' ? selectedPlayer?.teamName ?? 'NFL team' : selectedTeam?.teamName ?? 'NFL team'}
              className="h-14 w-14"
              imageClassName="p-1.5"
            />
          )}
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-charcoal/45">
              {showOrigin ? 'Origin marker' : 'Destination marker'}
            </p>
          </div>
        </div>
        <h2 className="mt-1 font-display text-4xl font-bold leading-none text-charcoal">
          {showOrigin
            ? 'Norman, Oklahoma'
            : viewMode === 'player'
            ? selectedPlayer?.playerName ?? 'Select a player'
            : selectedTeam?.teamName ?? 'Select a team'}
        </h2>
        <p className="mt-2 text-sm font-bold text-charcoal/60">
          {showOrigin
            ? 'OU origin | Pipeline anchor'
            : viewMode === 'player'
            ? `${selectedPlayer?.position ?? '--'} | ${selectedPlayerRoutes.length} destination${selectedPlayerRoutes.length === 1 ? '' : 's'}`
            : `${selectedTeam?.city ?? '--'}, ${selectedTeam?.state ?? '--'} | ${teamPlayers.length} Sooner${teamPlayers.length === 1 ? '' : 's'}`}
        </p>
        <div className="mt-5 grid gap-3">
          {showOrigin ? (
            <>
              <StoryPanel title="OU to NFL pipeline">Norman is the origin point for this layer, showing how Oklahoma’s program connects to NFL destinations around the country.</StoryPanel>
              <StoryPanel title="How to use the map">Select a team destination to inspect which Sooners are tied to that franchise, or switch to player-centric mode to trace one player’s route.</StoryPanel>
            </>
          ) : viewMode === 'player' && selectedPlayer ? (
            <>
              <StoryPanel title="OU profile">{selectedPlayer.ouSummary}</StoryPanel>
              <StoryPanel title="NFL profile">{selectedPlayer.nflSummary}</StoryPanel>
              <StoryPanel title="Destinations">
                {selectedPlayerRoutes.map((route) => `${route.teamName} (${route.city})`).join(', ')}
              </StoryPanel>
            </>
          ) : (
            <>
              <StoryPanel title="Team context">
                {selectedTeam ? `${selectedTeam.teamName} is linked to ${teamPlayers.length} OU player${teamPlayers.length === 1 ? '' : 's'} in this starter data set.` : 'Select a destination marker or player to inspect the OU pipeline.'}
              </StoryPanel>
              <section className="rounded-md border border-charcoal/10 bg-white p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-charcoal/50">Associated Sooners</p>
                <div className="mt-3 grid gap-2">
                  {teamPlayers.map((player) => (
                    <button key={player.id} type="button" onClick={() => onSelectPlayer(player.playerId)} className="rounded-md border border-charcoal/10 px-3 py-2 text-left text-xs font-black uppercase tracking-[0.08em] transition hover:bg-cream">
                      {player.playerName} | {player.position}
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
        <div className="mt-5 border-t border-charcoal/10 pt-4">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-charcoal/45">Player index</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {allPlayers.map((player) => (
              <button
                key={player.id}
                type="button"
                onClick={() => onSelectPlayer(player.playerId)}
                className={`rounded-md border px-3 py-2 text-left text-xs font-black uppercase tracking-[0.08em] transition ${
                  selectedPlayer?.playerId === player.playerId ? 'border-sky bg-sky/30 text-charcoal' : 'border-charcoal/10 bg-white hover:bg-cream'
                }`}
              >
                {player.playerName}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

const nflOriginCoordinates = {
  latitude: 35.2226,
  longitude: -97.4395,
};

function RivalryDetailPanel({
  selected,
  profile,
  onSelect,
  all,
}: {
  selected: RivalryConnection;
  profile: RivalryProfile | undefined;
  onSelect: (id: string) => void;
  all: RivalryConnection[];
}) {
  const logo = getSchoolLogo('sec-current', selected.rivalSchoolId, selected.schoolName);

  return (
    <aside className="overflow-hidden rounded-md border border-charcoal/10 bg-white/90 shadow-exhibit animate-[fadeIn_0.25s_ease-out]" aria-live="polite">
      <div className="h-2 bg-crimson" />
      <div className="p-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-brass">Rivalries and Regions</p>
        <div className="mt-3 mb-4 flex items-start gap-4">
          <BrandLogo
            src={logo.light ?? ''}
            alt={logo.alt}
            fallback={selected.schoolName
              .split(/\s+/)
              .map((part) => part[0])
              .join('')
              .slice(0, 3)
              .toUpperCase()}
            className="h-16 w-16 border border-charcoal/10 shadow-sm"
            imageClassName="p-1.5"
          />
          <div>
            <h2 className="font-display text-4xl font-bold leading-none text-charcoal">{selected.schoolName}</h2>
            <p className="mt-2 text-sm font-bold text-charcoal/60">{selected.city}, {selected.state}</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3">
          <StoryPanel title="Rivalry label">{selected.rivalryLabel}</StoryPanel>
          <StoryPanel title="Why it mattered">{selected.summary}</StoryPanel>
          <StoryPanel title="Emotional tone">{selected.tone ?? profile?.emotionalTone ?? 'Historic, regional, and identity-defining.'}</StoryPanel>
          {profile && <RelatedLinks links={profile.relatedLinks} onNavigate={(_screen, _targetId) => undefined} />}
        </div>
        <div className="mt-5 border-t border-charcoal/10 pt-4">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-charcoal/45">Rivalry index</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {all.map((rivalry) => (
              <button
                key={rivalry.id}
                type="button"
                onClick={() => onSelect(rivalry.rivalryId)}
                className={`rounded-md border px-3 py-2 text-left text-xs font-black uppercase tracking-[0.08em] transition ${
                  selected.rivalryId === rivalry.rivalryId ? 'border-crimson bg-crimson text-white' : 'border-charcoal/10 bg-white hover:bg-cream'
                }`}
              >
                {rivalry.schoolName}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

function RecruitingDetailPanel({
  selected,
  regions,
  onSelectRegion,
}: {
  selected: RecruitingRegion;
  regions: RecruitingRegion[];
  onSelectRegion: (id: string) => void;
}) {
  return (
    <aside className="overflow-hidden rounded-md border border-charcoal/10 bg-white/90 shadow-exhibit animate-[fadeIn_0.25s_ease-out]" aria-live="polite">
      <div className="h-2 bg-crimson" />
      <div className="p-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-brass">Recruiting Footprint</p>
        <h2 className="mt-1 font-display text-4xl font-bold leading-none text-charcoal">{selected.label}</h2>
        <p className="mt-2 text-sm font-bold text-charcoal/60">{selected.cityOrRegion}, {selected.state}</p>
        <div className="mt-5 grid gap-3">
          <StoryPanel title="Key recruiting region">{selected.summary}</StoryPanel>
          <StoryPanel title="Era focus">{selected.eras.join(' | ')}</StoryPanel>
          <StoryPanel title="Position trends">{selected.positionTrends.join(', ')}</StoryPanel>
          <StoryPanel title="Data status">{selected.dataStatus === 'starter' ? 'Starter regional footprint data for museum interpretation.' : 'Needs verification.'}</StoryPanel>
          <section className="rounded-md border border-charcoal/10 bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-charcoal/50">Notable players</p>
            <p className="mt-2 text-sm text-charcoal/72">{selected.notablePlayers.join(', ') || 'Starter region entry; add notable players later.'}</p>
          </section>
        </div>
        <div className="mt-5 border-t border-charcoal/10 pt-4">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-charcoal/45">Region index</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {regions.map((region) => (
              <button
                key={region.id}
                type="button"
                onClick={() => onSelectRegion(region.id)}
                className={`rounded-md border px-3 py-2 text-left text-xs font-black uppercase tracking-[0.08em] transition ${
                  selected.id === region.id ? 'border-crimson bg-crimson text-white' : 'border-charcoal/10 bg-white hover:bg-cream'
                }`}
              >
                {region.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export function ConferenceExplorerScreen({ exploredSchools, onExploreSchool, onComplete, onNavigate }: ConferenceExplorerScreenProps) {
  const defaultConferenceEra = conferenceEras.find((era) => era.id === 'big-12-current') ?? conferenceEras[0];
  const [currentEraId, setCurrentEraId] = useState(defaultConferenceEra.id);
  const [activeLayer, setActiveLayer] = useState<MapLayerId>('conference');
  const [selectedSchoolId, setSelectedSchoolId] = useState(getPreferredEraSchool(defaultConferenceEra).id);
  const [mapFocusRequest, setMapFocusRequest] = useState(0);
  const [nflViewMode, setNflViewMode] = useState<'teams' | 'player'>('teams');
  const [selectedNflPlayerId, setSelectedNflPlayerId] = useState(nflMapRoutes[0]?.playerId ?? '');
  const [selectedNflTeam, setSelectedNflTeam] = useState(nflDestinationMarkers[0]?.teamName ?? '');
  const [selectedNflOrigin, setSelectedNflOrigin] = useState(false);
  const [nflSearch, setNflSearch] = useState('');
  const [nflStatus, setNflStatus] = useState<'all' | 'active' | 'retired' | 'practice squad' | 'historical'>('all');
  const [nflPosition, setNflPosition] = useState('all');
  const [nflTeam, setNflTeam] = useState('all');
  const [nflFeaturedOnly, setNflFeaturedOnly] = useState(false);
  const [selectedRivalryId, setSelectedRivalryId] = useState(rivalryConnections[0]?.rivalryId ?? '');
  const [rivalryEraFilter, setRivalryEraFilter] = useState<'all' | 'early' | 'big-eight' | 'big-12' | 'modern'>('all');
  const [recruitingEraFilter, setRecruitingEraFilter] = useState<'all' | 'wilkinson' | 'switzer' | 'stoops' | 'riley' | 'venables'>('all');
  const [selectedRecruitingRegionId, setSelectedRecruitingRegionId] = useState(recruitingRegions[0]?.id ?? '');

  const currentEra = conferenceEras.find((era) => era.id === currentEraId) ?? conferenceEras[0];
  const currentIndex = conferenceEras.findIndex((era) => era.id === currentEra.id);
  const selectedSchool = currentEra.schools.find((school) => school.id === selectedSchoolId) ?? currentEra.schools[0];
  const exploredSchoolIds = getEraExplored(currentEra.id, exploredSchools);
  const complete = isConferenceExplorationComplete(exploredSchools);

  const totalExplored = useMemo(
    () => conferenceEras.reduce((sum, era) => sum + getEraExplored(era.id, exploredSchools).length, 0),
    [exploredSchools],
  );
  const totalSchools = useMemo(() => conferenceEras.reduce((sum, era) => sum + era.schools.length, 0), []);

  useEffect(() => {
    const selectedYear = getEraTitleYear(currentEra);
    document.title = selectedYear ? `${selectedYear} Map | OU Interactive Museum` : 'OU Interactive Museum';
  }, [currentEra]);

  const selectEra = (eraId: string) => {
    const nextEra = conferenceEras.find((era) => era.id === eraId) ?? conferenceEras[0];
    const nextSelected = getPreferredEraSchool(nextEra);
    setCurrentEraId(nextEra.id);
    setSelectedSchoolId(nextSelected.id);
    setMapFocusRequest((request) => request + 1);
  };

  const selectSchool = (school: ConferenceSchool) => {
    setSelectedSchoolId(school.id);
    setMapFocusRequest((request) => request + 1);
    onExploreSchool(currentEra.id, school.id);
  };

  const nflPositions = useMemo(() => Array.from(new Set(nflMapRoutes.map((route) => route.position))).sort(), []);
  const nflTeams = useMemo(() => Array.from(new Set(nflMapRoutes.map((route) => route.teamName))).sort(), []);
  const filteredNflRoutes = useMemo(
    () =>
      nflMapRoutes.filter((route) => {
        const query = `${route.playerName} ${route.teamName} ${route.position}`.toLowerCase();
        return (
          query.includes(nflSearch.toLowerCase()) &&
          (nflStatus === 'all' || route.nflStatus === nflStatus) &&
          (nflPosition === 'all' || route.position === nflPosition) &&
          (nflTeam === 'all' || route.teamName === nflTeam) &&
          (!nflFeaturedOnly || route.featured)
        );
      }),
    [nflFeaturedOnly, nflPosition, nflSearch, nflStatus, nflTeam],
  );

  const filteredNflPlayers = useMemo(() => {
    const seen = new Set<string>();
    return filteredNflRoutes.filter((route) => {
      if (seen.has(route.playerId)) return false;
      seen.add(route.playerId);
      return true;
    });
  }, [filteredNflRoutes]);

  const visibleNflRoutes =
    nflViewMode === 'player' ? filteredNflRoutes.filter((route) => route.playerId === selectedNflPlayerId) : filteredNflRoutes;
  const visibleNflDestinations = useMemo(() => {
    const visibleTeams = new Set(visibleNflRoutes.map((route) => route.teamName));
    return nflDestinationMarkers.filter((marker) => visibleTeams.has(marker.teamName));
  }, [visibleNflRoutes]);
  const selectedNflPlayer = filteredNflPlayers.find((route) => route.playerId === selectedNflPlayerId) ?? filteredNflPlayers[0];
  const selectedNflPlayerRoutes = filteredNflRoutes.filter((route) => route.playerId === selectedNflPlayerId);
  const selectedNflDestination = visibleNflDestinations.find((marker) => marker.teamName === selectedNflTeam) ?? visibleNflDestinations[0];
  const selectedTeamPlayers = filteredNflRoutes
    .filter((route) => route.teamName === selectedNflDestination?.teamName)
    .sort((left, right) => Number(right.active) - Number(left.active));

  const filteredRivalries = useMemo(() => {
    return rivalryConnections.filter((rivalry) => {
      if (rivalryEraFilter === 'all') return true;
      const eras = rivalry.keyEras.join(' ').toLowerCase();
      if (rivalryEraFilter === 'early') return eras.includes('early');
      if (rivalryEraFilter === 'big-eight') return eras.includes('big eight');
      if (rivalryEraFilter === 'big-12') return eras.includes('big 12');
      return eras.includes('sec') || eras.includes('bridge');
    });
  }, [rivalryEraFilter]);
  const selectedRivalry = filteredRivalries.find((rivalry) => rivalry.rivalryId === selectedRivalryId) ?? filteredRivalries[0];
  const selectedRivalryProfile = rivalries.find((rivalry) => rivalry.id === selectedRivalry?.rivalryId);
  const visibleRivalryRoutes = rivalryRouteLines.filter((route) => filteredRivalries.some((rivalry) => route.id.includes(rivalry.rivalryId)));

  const filteredRecruitingRegions = useMemo(() => {
    if (recruitingEraFilter === 'all') return recruitingRegions;
    const matchLabel =
      recruitingEraFilter === 'wilkinson'
        ? 'Wilkinson'
        : recruitingEraFilter === 'switzer'
          ? 'Switzer'
          : recruitingEraFilter === 'stoops'
            ? 'Stoops'
            : recruitingEraFilter === 'riley'
              ? 'Riley'
              : 'Venables';
    return recruitingRegions.filter((region) => region.eras.some((era) => era.includes(matchLabel)));
  }, [recruitingEraFilter]);
  const selectedRecruitingRegion =
    filteredRecruitingRegions.find((region) => region.id === selectedRecruitingRegionId) ?? filteredRecruitingRegions[0];

  useEffect(() => {
    if (currentEra.schools.some((school) => school.id === selectedSchoolId)) return;
    setSelectedSchoolId(getPreferredEraSchool(currentEra).id);
  }, [currentEra, selectedSchoolId]);

  useEffect(() => {
    if (filteredNflPlayers.some((player) => player.playerId === selectedNflPlayerId)) return;
    setSelectedNflPlayerId(filteredNflPlayers[0]?.playerId ?? '');
  }, [filteredNflPlayers, selectedNflPlayerId]);

  useEffect(() => {
    if (visibleNflDestinations.some((destination) => destination.teamName === selectedNflTeam)) return;
    setSelectedNflTeam(visibleNflDestinations[0]?.teamName ?? '');
  }, [selectedNflTeam, visibleNflDestinations]);

  useEffect(() => {
    if (nflViewMode === 'player' && selectedNflOrigin) {
      setSelectedNflOrigin(false);
    }
  }, [nflViewMode, selectedNflOrigin]);

  useEffect(() => {
    if (filteredRivalries.some((rivalry) => rivalry.rivalryId === selectedRivalryId)) return;
    setSelectedRivalryId(filteredRivalries[0]?.rivalryId ?? '');
  }, [filteredRivalries, selectedRivalryId]);

  useEffect(() => {
    if (filteredRecruitingRegions.some((region) => region.id === selectedRecruitingRegionId)) return;
    setSelectedRecruitingRegionId(filteredRecruitingRegions[0]?.id ?? '');
  }, [filteredRecruitingRegions, selectedRecruitingRegionId]);

  const legendItems: MapLegendItem[] =
    activeLayer === 'conference'
      ? [
          { id: 'selected', label: 'Selected school', tone: 'selected' },
          { id: 'explored', label: 'Explored school', tone: 'explored' },
          { id: 'conference', label: 'Conference marker', tone: 'conference' },
          { id: 'anchor', label: 'OU anchor', tone: 'anchor' },
        ]
      : activeLayer === 'nfl'
          ? [
              { id: 'anchor', label: 'Norman origin', tone: 'anchor' },
              { id: 'nfl', label: 'NFL destination', tone: 'nfl' },
              { id: 'route', label: 'Pipeline route', tone: 'route' },
            ]
          : activeLayer === 'recruiting'
              ? [
                  { id: 'recruiting', label: 'Recruiting region', tone: 'recruiting' },
                  { id: 'selected', label: 'Selected region', tone: 'selected' },
                ]
              : [
                  { id: 'anchor', label: 'Norman anchor', tone: 'anchor' },
                  { id: 'rivalry', label: 'Rival marker', tone: 'rivalry' },
                  { id: 'route', label: 'Rivalry route', tone: 'route' },
                ];

  const mapHeaderTitle =
    activeLayer === 'conference'
      ? `${currentEra.eraName} Members`
      : activeLayer === 'nfl'
          ? 'Norman to the NFL'
          : activeLayer === 'recruiting'
              ? 'Recruiting Footprint'
              : 'Rivalries and Regions';

  const selectionTitle =
    activeLayer === 'conference'
      ? selectedSchool.name
      : activeLayer === 'nfl'
          ? selectedNflOrigin && nflViewMode === 'teams'
            ? 'Norman, Oklahoma'
            : nflViewMode === 'player'
            ? selectedNflPlayer?.playerName ?? 'Select a player'
            : selectedNflDestination?.teamName ?? 'Select a team'
          : activeLayer === 'recruiting'
              ? selectedRecruitingRegion?.label ?? 'Select a region'
              : selectedRivalry?.schoolName ?? 'Select a rival';

  const selectionSubtitle =
    activeLayer === 'conference'
      ? `${selectedSchool.city}, ${selectedSchool.state}`
      : activeLayer === 'nfl'
          ? selectedNflOrigin && nflViewMode === 'teams'
            ? 'OU origin marker'
            : nflViewMode === 'player'
            ? `${selectedNflPlayer?.position ?? '--'} | ${selectedNflPlayerRoutes.length} destination${selectedNflPlayerRoutes.length === 1 ? '' : 's'}`
            : `${selectedNflDestination?.city ?? '--'}, ${selectedNflDestination?.state ?? '--'}`
          : activeLayer === 'recruiting'
              ? `${selectedRecruitingRegion?.cityOrRegion ?? '--'}, ${selectedRecruitingRegion?.state ?? '--'}`
              : `${selectedRivalry?.city ?? '--'}, ${selectedRivalry?.state ?? '--'}`;

  const selectionMeta =
    activeLayer === 'conference'
      ? `${exploredSchoolIds.length} of ${currentEra.schools.length} explored`
      : activeLayer === 'nfl'
          ? `${visibleNflDestinations.length} destinations | ${visibleNflRoutes.length} routes`
          : activeLayer === 'recruiting'
              ? `${filteredRecruitingRegions.length} regions`
              : `${filteredRivalries.length} rivalry links`;

  const focusTarget =
    activeLayer === 'conference'
      ? Number.isFinite(selectedSchool.latitude) && Number.isFinite(selectedSchool.longitude)
        ? { label: selectedSchool.name, latitude: selectedSchool.latitude, longitude: selectedSchool.longitude }
        : null
      : activeLayer === 'nfl'
          ? selectedNflOrigin && nflViewMode === 'teams'
            ? {
                label: normanAnchor.label,
                latitude: nflOriginCoordinates.latitude,
                longitude: nflOriginCoordinates.longitude,
              }
            : nflViewMode === 'player'
            ? {
                label: selectedNflPlayer?.playerName ?? normanAnchor.label,
                latitude: selectedNflPlayerRoutes[0]?.latitude ?? nflOriginCoordinates.latitude,
                longitude: selectedNflPlayerRoutes[0]?.longitude ?? nflOriginCoordinates.longitude,
              }
            : {
                label: selectedNflDestination?.teamName ?? normanAnchor.label,
                latitude: selectedNflDestination?.latitude ?? nflOriginCoordinates.latitude,
                longitude: selectedNflDestination?.longitude ?? nflOriginCoordinates.longitude,
              }
            : activeLayer === 'recruiting'
              ? selectedRecruitingRegion
              ? {
                  label: selectedRecruitingRegion.label,
                  latitude: selectedRecruitingRegion.latitude,
                  longitude: selectedRecruitingRegion.longitude,
                }
                : null
              : {
                  label: selectedRivalry?.schoolName ?? normanAnchor.label,
                  latitude: selectedRivalry?.latitude ?? normanAnchor.latitude,
                  longitude: selectedRivalry?.longitude ?? normanAnchor.longitude,
                };

  const mapViewKey = activeLayer === 'conference' ? `${activeLayer}:${currentEra.id}` : activeLayer;

  return (
    <section>
      <SectionHero eyebrow="Conference Gallery" title="Conference Gallery" meta="Required first gallery">
        Trace OU football through conference geography, NFL destinations, rival regions, and recruiting footprint on one shared map.
      </SectionHero>
      <GalleryPlaque eyebrow="Curator Note" title="One map. Four ways to read the program.">
        Start with conference geography, then switch layers to see how Sooners spread into the NFL, how rivalries gave the program regional shape, and which recruiting regions fed the roster across eras.
      </GalleryPlaque>

      {activeLayer === 'conference' && (
        <div className="mb-5 grid gap-3 md:grid-cols-2">
          {earlyContextCards.map((card) => (
            <article key={card.title} className="rounded-md border border-charcoal/10 bg-white/70 p-4 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-brass">{card.title}</p>
              <p className="mt-1 text-sm leading-6 text-charcoal/70">{card.body}</p>
            </article>
          ))}
        </div>
      )}

      <MapLayerSwitcher activeLayer={activeLayer} onChange={setActiveLayer} />

      {activeLayer === 'conference' && (
        <section className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-md border border-charcoal/10 bg-white/82 p-4 shadow-sm">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brass">National landscape</p>
            <p className="text-sm font-semibold text-charcoal/68">Open the separate 2026 FBS alignment map without leaving this museum flow.</p>
          </div>
          <PrimaryButton onClick={() => onNavigate('fbs-landscape')}>2026 FBS Landscape</PrimaryButton>
        </section>
      )}

      <div className="my-5 grid w-full items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,360px)]">
        <div className="mx-auto w-full min-w-0 max-w-[980px] space-y-4">
          {activeLayer === 'conference' ? (
            <>
              <EraSelector currentEra={currentEra} exploredSchools={exploredSchools} onSelectEra={selectEra} />
              <div className="rounded-md border border-charcoal/10 bg-white/80 p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-brass">{currentEra.conference} | {currentEra.years}</p>
                    <h2 className="font-display text-4xl font-bold leading-tight">{currentEra.label}</h2>
                    <p className="mt-1 text-sm leading-6 text-charcoal/70">{currentEra.description}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <ConferenceLogoBadge eraId={currentEra.id} conference={currentEra.conference} />
                    <MapControls
                      previousDisabled={currentIndex === 0}
                      nextDisabled={currentIndex === conferenceEras.length - 1}
                      onPrevious={() => selectEra(conferenceEras[currentIndex - 1].id)}
                      onNext={() => selectEra(conferenceEras[currentIndex + 1].id)}
                    />
                  </div>
                </div>
                <div className="mt-4 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
                  <section className="rounded-md border border-charcoal/10 bg-cream/80 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-brass">What Changed?</p>
                    <p className="mt-2 text-sm leading-6 text-charcoal/72">{currentEra.changeSummary}</p>
                    {currentEra.id === 'big-12-current' && (
                      <p className="mt-3 inline-flex rounded-full bg-charcoal px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white">
                        New Era | Rebuilt Conference
                      </p>
                    )}
                  </section>
                  <section className="rounded-md border border-charcoal/10 bg-white p-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-charcoal/45">Membership shift</p>
                    <div className="mt-2 grid gap-2 text-sm text-charcoal/70">
                      <p>
                        <span className="font-black text-sky">Added:</span>{' '}
                        {currentEra.addedSchoolIds.length > 0
                          ? currentEra.addedSchoolIds
                              .map((schoolId) => currentEra.schools.find((school) => school.id === schoolId)?.name ?? schoolId)
                              .join(', ')
                          : 'No new schools in this snapshot.'}
                      </p>
                      <p>
                        <span className="font-black text-charcoal/70">Removed:</span>{' '}
                        {currentEra.removedSchoolIds.length > 0
                          ? currentEra.removedSchoolIds
                              .map((schoolId) => schoolId.replaceAll('-', ' '))
                              .join(', ')
                          : 'No schools removed from the previous snapshot.'}
                      </p>
                    </div>
                  </section>
                </div>
                <div className="mt-3">
                  <HistoricalNotesPanel title="Historical Notes" notes={historicalNotes[currentEra.id]} compact />
                </div>
              </div>
            </>
          ) : (
            <section className="rounded-md border border-charcoal/10 bg-white/82 p-4 shadow-sm">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-brass">Layer controls</p>
              {activeLayer === 'nfl' && (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.15fr_repeat(4,0.9fr)]">
                  <input
                    value={nflSearch}
                    onChange={(event) => setNflSearch(event.target.value)}
                    placeholder="Search player or team..."
                    className="rounded-md border border-charcoal/15 bg-cream px-3 py-3 text-sm font-semibold xl:col-span-1"
                  />
                  <select value={nflViewMode} onChange={(event) => setNflViewMode(event.target.value as 'teams' | 'player')} className="rounded-md border border-charcoal/15 bg-cream px-3 py-3 text-sm font-bold">
                    <option value="teams">Team-centric</option>
                    <option value="player">Player-centric</option>
                  </select>
                  <select value={nflStatus} onChange={(event) => setNflStatus(event.target.value as typeof nflStatus)} className="rounded-md border border-charcoal/15 bg-cream px-3 py-3 text-sm font-bold">
                    <option value="all">All statuses</option>
                    <option value="active">Active</option>
                    <option value="retired">Retired</option>
                    <option value="practice squad">Practice squad</option>
                    <option value="historical">Historical</option>
                  </select>
                  <select value={nflPosition} onChange={(event) => setNflPosition(event.target.value)} className="rounded-md border border-charcoal/15 bg-cream px-3 py-3 text-sm font-bold">
                    <option value="all">All positions</option>
                    {nflPositions.map((position) => <option key={position} value={position}>{position}</option>)}
                  </select>
                  <select value={nflTeam} onChange={(event) => setNflTeam(event.target.value)} className="rounded-md border border-charcoal/15 bg-cream px-3 py-3 text-sm font-bold">
                    <option value="all">All teams</option>
                    {nflTeams.map((team) => <option key={team} value={team}>{team}</option>)}
                  </select>
                  <label className="inline-flex items-center gap-2 rounded-md border border-charcoal/15 bg-cream px-3 py-2 text-sm font-bold">
                    <input type="checkbox" checked={nflFeaturedOnly} onChange={(event) => setNflFeaturedOnly(event.target.checked)} />
                    Featured only
                  </label>
                </div>
              )}
              {activeLayer === 'rivalries' && (
                <div className="grid gap-3 md:grid-cols-2">
                  <select value={selectedRivalryId} onChange={(event) => setSelectedRivalryId(event.target.value)} className="rounded-md border border-charcoal/15 bg-cream px-3 py-3 text-sm font-bold">
                    {rivalryConnections.map((rivalry) => <option key={rivalry.rivalryId} value={rivalry.rivalryId}>{rivalry.schoolName}</option>)}
                  </select>
                  <select value={rivalryEraFilter} onChange={(event) => setRivalryEraFilter(event.target.value as typeof rivalryEraFilter)} className="rounded-md border border-charcoal/15 bg-cream px-3 py-3 text-sm font-bold">
                    <option value="all">All eras</option>
                    <option value="early">Early era</option>
                    <option value="big-eight">Big Eight era</option>
                    <option value="big-12">Big 12 era</option>
                    <option value="modern">Modern / transition</option>
                  </select>
                </div>
              )}
              {activeLayer === 'recruiting' && (
                <div className="grid gap-3 md:grid-cols-2">
                  <select
                    value={recruitingEraFilter}
                    onChange={(event) => setRecruitingEraFilter(event.target.value as typeof recruitingEraFilter)}
                    className="rounded-md border border-charcoal/15 bg-cream px-3 py-3 text-sm font-bold"
                  >
                    <option value="all">All recruiting eras</option>
                    <option value="wilkinson">Wilkinson / early dynasty</option>
                    <option value="switzer">Switzer era</option>
                    <option value="stoops">Stoops era</option>
                    <option value="riley">Riley era</option>
                    <option value="venables">Venables / SEC era</option>
                  </select>
                  <div className="rounded-md border border-charcoal/15 bg-white px-3 py-3 text-sm font-semibold text-charcoal/70">
                    Intensity reads as an educational footprint, not a statistical recruiting ranking.
                  </div>
                </div>
              )}
            </section>
          )}

          <USConferenceMap
            viewKey={mapViewKey}
            activeLayer={activeLayer}
            legendItems={legendItems}
            headerTitle={mapHeaderTitle}
            selectionTitle={selectionTitle}
            selectionSubtitle={selectionSubtitle}
            meta={selectionMeta}
            focusTarget={focusTarget}
            focusKey={mapFocusRequest}
            defaultView={activeLayer === 'conference' ? { zoom: 1.22 } : undefined}
          >
            {activeLayer === 'conference' && (
              <MarkerLayer
                schools={currentEra.schools}
                eraName={currentEra.label}
                selectedSchoolId={selectedSchool.id}
                exploredSchoolIds={exploredSchoolIds}
                addedSchoolIds={currentEra.addedSchoolIds}
                onSelectSchool={selectSchool}
              />
            )}
            {activeLayer === 'nfl' && (
              <NFLLayer
                norman={{ label: normanAnchor.label, latitude: nflOriginCoordinates.latitude, longitude: nflOriginCoordinates.longitude }}
                destinations={visibleNflDestinations}
                routes={visibleNflRoutes.map((route) => ({
                  id: `nfl-line-${route.id}`,
                  fromId: normanAnchor.id,
                  toId: route.id,
                  fromLatitude: nflOriginCoordinates.latitude,
                  fromLongitude: nflOriginCoordinates.longitude,
                  toLatitude: route.latitude,
                  toLongitude: route.longitude,
                  kind: 'nfl',
                  emphasis: route.active ? 'medium' : 'low',
                }))}
                selectedTeamName={nflViewMode === 'teams' ? selectedNflDestination?.teamName : undefined}
                selectedOrigin={selectedNflOrigin && nflViewMode === 'teams'}
                onSelectTeam={(teamName) => {
                  setSelectedNflOrigin(false);
                  setSelectedNflTeam(teamName);
                }}
                onSelectOrigin={() => {
                  setSelectedNflOrigin(true);
                  setSelectedNflTeam('');
                }}
              />
            )}
            {activeLayer === 'rivalries' && selectedRivalry && (
              <RivalryLayer
                norman={{ label: normanAnchor.label, latitude: normanAnchor.latitude, longitude: normanAnchor.longitude }}
                rivalries={filteredRivalries}
                routes={visibleRivalryRoutes}
                selectedRivalryId={selectedRivalry.rivalryId}
                onSelectRivalry={setSelectedRivalryId}
              />
            )}
            {activeLayer === 'recruiting' && selectedRecruitingRegion && (
              <RecruitingLayer
                regions={filteredRecruitingRegions}
                selectedRegionId={selectedRecruitingRegion.id}
                onSelectRegion={setSelectedRecruitingRegionId}
              />
            )}
          </USConferenceMap>
        </div>

        <div className="mx-auto w-full max-w-[360px] space-y-4 xl:sticky xl:top-32 xl:self-start">
          <ExplorationProgress era={currentEra} exploredSchools={exploredSchools} />
          {activeLayer === 'conference' && <ConferenceDetailPanel era={currentEra} school={selectedSchool} />}
          {activeLayer === 'nfl' && (
            <NflDetailPanel
              viewMode={nflViewMode}
              selectedPlayer={selectedNflPlayer}
              selectedPlayerRoutes={selectedNflPlayerRoutes}
              selectedTeam={selectedNflDestination}
              teamPlayers={selectedTeamPlayers}
              allPlayers={filteredNflPlayers}
              onSelectPlayer={(playerId) => {
                setSelectedNflOrigin(false);
                setSelectedNflPlayerId(playerId);
              }}
              showOrigin={selectedNflOrigin && nflViewMode === 'teams'}
            />
          )}
          {activeLayer === 'rivalries' && selectedRivalry && (
            <RivalryDetailPanel selected={selectedRivalry} profile={selectedRivalryProfile} onSelect={setSelectedRivalryId} all={filteredRivalries} />
          )}
          {activeLayer === 'recruiting' && selectedRecruitingRegion && (
            <RecruitingDetailPanel selected={selectedRecruitingRegion} regions={filteredRecruitingRegions} onSelectRegion={setSelectedRecruitingRegionId} />
          )}
          <section className="rounded-md border border-charcoal/10 bg-charcoal p-5 text-cream shadow-sm">
            <div className="flex items-center gap-3">
              <MapPinned className="h-5 w-5 text-gold" aria-hidden="true" />
              <h3 className="font-display text-2xl font-bold">Total Exploration</h3>
            </div>
            <p className="mt-2 text-sm font-semibold text-cream/72">
              {totalExplored} / {totalSchools} school-era stops explored
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gold transition-all duration-700" style={{ width: `${Math.round((totalExplored / totalSchools) * 100)}%` }} />
            </div>
          </section>
        </div>
      </div>

      <ContinueFooter complete={complete} onComplete={onComplete} />
    </section>
  );
}
