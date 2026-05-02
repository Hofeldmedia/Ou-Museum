import { memo, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type WheelEvent as ReactWheelEvent } from 'react';
import { Globe2, Search, X } from 'lucide-react';
import { fbs2026Conferences } from '../data/fbs2026Conferences';
import { historicalNotes } from '../data/historicalNotes';
import { getSchoolLogo } from '../utils/getSchoolLogo';
import { fbsSchoolRegistry } from '../data/fbsSchoolRegistry';
import type { FbsConference, FbsConferenceId, FbsSchool } from '../types/fbs';
import { clampMapPan, getCenteredMapPan, hasValidMapCoordinates } from '../utils/mapFocus';
import { projectSchoolCoordinates, usMapViewBox, usNationPath, usStateBordersPath } from '../utils/mapProjection';
import { HistoricalNotesPanel, SectionHero } from '../components/MuseumComponents';
import { ConferenceLogo } from '../components/ui/ConferenceLogo';
import { SharedZoomControls } from '../components/map/SharedZoomControls';

const FOCUS_ZOOM = 1.9;
const ZOOM_STEP = 0.3;
const MAX_ZOOM = 3.4;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getMarkerSize(zoom: number) {
  const maxSize = 34;
  const minSize = 18;
  const size = maxSize - (zoom - 1) * 7;
  return clamp(size, minSize, maxSize);
}

function initials(school: FbsSchool) {
  return school.shortName
    .split(/\s|-/)
    .map((part) => part[0])
    .join('')
    .slice(0, 4)
    .toUpperCase();
}

function getConference(id: FbsConferenceId) {
  return fbs2026Conferences.find((conference) => conference.id === id)!;
}

function FbsSchoolLogoImage({
  school,
  imageClassName,
  fallbackClassName,
}: {
  school: FbsSchool;
  imageClassName: string;
  fallbackClassName: string;
}) {
  const [logoFailed, setLogoFailed] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const logo = getSchoolLogo('sec-current', school.id, school.name, school.espnId);
  const logoSrc = useFallback ? logo.dark : logo.light;

  if (logoSrc && !logoFailed) {
    return (
      <img
        src={logoSrc}
        alt={logo.alt}
        className={imageClassName}
        onError={() => {
          if (!useFallback && logo.dark) {
            setUseFallback(true);
            return;
          }
          setLogoFailed(true);
        }}
        loading="lazy"
      />
    );
  }

  return <span className={fallbackClassName}>{initials(school)}</span>;
}

const FbsMarker = memo(function FbsMarker({ school, selected, allMode, iconSize, touchSize, onSelect }: { school: FbsSchool; selected: boolean; allMode: boolean; iconSize: number; touchSize: number; onSelect: () => void }) {
  const point = projectSchoolCoordinates(school.latitude, school.longitude);
  if (!point) return null;

  const conference = getConference(school.conferenceId);

  return (
    <button
      type="button"
      aria-label={`Select ${school.name}, ${conference.shortName}`}
      aria-pressed={selected}
      title={`${school.name} - ${conference.shortName}`}
      onClick={onSelect}
      className={`group absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-2 transition duration-200 focus:z-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70 ${
        selected ? 'z-40 scale-125' : 'z-20 hover:z-30 hover:scale-110'
      }`}
      style={{ left: `${(point.x / usMapViewBox.width) * 100}%`, top: `${(point.y / usMapViewBox.height) * 100}%`, minWidth: `${touchSize}px`, minHeight: `${touchSize}px` }}
    >
      <span className="absolute inset-0 rounded-full bg-transparent" aria-hidden="true" />
      <span
        className={`relative flex items-center justify-center overflow-hidden rounded-full border-2 bg-white text-center font-black leading-none shadow-lg ${allMode ? 'text-[8px]' : 'text-[9px]'} ${selected ? 'border-white ring-4 ring-gold/60' : 'border-white/80'}`}
        style={{ width: `${iconSize}px`, height: `${iconSize}px`, boxShadow: `0 0 ${selected ? 26 : 12}px ${conference.colorToken}66`, color: conference.colorToken }}
      >
        <span className="absolute inset-x-0 bottom-0 h-1" style={{ backgroundColor: conference.colorToken }} />
        <FbsSchoolLogoImage
          school={school}
          imageClassName="h-full w-full bg-white object-contain p-0.5"
          fallbackClassName="flex h-full w-full items-center justify-center px-1 text-center text-[10px] font-black leading-none"
        />
      </span>
      <span className={`pointer-events-none absolute left-1/2 top-full mt-1 hidden -translate-x-1/2 whitespace-nowrap rounded-sm bg-charcoal/90 px-2 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-white shadow-lg md:block ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'}`}>
        {school.shortName}
      </span>
    </button>
  );
});

function FbsMap({ schools, selectedSchool, selectedConferenceId, onSelectSchool }: { schools: FbsSchool[]; selectedSchool: FbsSchool | null; selectedConferenceId: FbsConferenceId | 'all'; onSelectSchool: (school: FbsSchool) => void }) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: usMapViewBox.width, height: usMapViewBox.height });
  const [zoom, setZoom] = useState(1);
  const markerSize = getMarkerSize(zoom);
  const markerTouchSize = Math.max(44, markerSize + 14);
  const markerIconSize = markerSize / zoom;
  const markerTargetSize = markerTouchSize / zoom;
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return undefined;
    const observer = new ResizeObserver(([entry]) => setViewportSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const conferenceCounts = useMemo(() => {
    return fbs2026Conferences.reduce<Record<FbsConferenceId, number>>((counts, conference) => {
      counts[conference.id] = schools.filter((school) => school.conferenceId === conference.id).length;
      return counts;
    }, {} as Record<FbsConferenceId, number>);
  }, [schools]);

  const clampPan = (nextZoom: number, nextPan: { x: number; y: number }) => clampMapPan(viewportSize, nextZoom, nextPan);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const focusSchool = (school: FbsSchool | null) => {
    if (!hasValidMapCoordinates(school)) return;
    const targetZoom = Math.max(FOCUS_ZOOM, zoom);
    const nextPan = getCenteredMapPan(viewportSize, school, targetZoom);
    if (!nextPan) return;
    setZoom(targetZoom);
    setPan(nextPan);
  };

  useEffect(() => {
    if (!selectedSchool) return;
    focusSchool(selectedSchool);
  }, [selectedSchool?.id]);

  const selectSchool = (school: FbsSchool) => {
    onSelectSchool(school);
    focusSchool(school);
  };

  const zoomTo = (nextZoom: number) => {
    const clampedZoom = clamp(Number(nextZoom.toFixed(2)), 1, MAX_ZOOM);
    setZoom(clampedZoom);
    setPan((current) => clampPan(clampedZoom, current));
  };

  const adjustZoom = (direction: 1 | -1) => {
    zoomTo(zoom + direction * ZOOM_STEP);
  };

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) < 2) return;
    event.preventDefault();
    zoomTo(zoom + (event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP));
  };

  const startPan = (event: ReactPointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest('button') || zoom <= 1) return;
    setDragging(true);
    const start = { x: event.clientX, y: event.clientY };
    const origin = { ...pan };
    const handleMove = (moveEvent: PointerEvent) => setPan(clampPan(zoom, { x: origin.x + moveEvent.clientX - start.x, y: origin.y + moveEvent.clientY - start.y }));
    const handleUp = () => {
      setDragging(false);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
  };

  return (
    <section className="rounded-md border border-charcoal/10 bg-charcoal p-3 shadow-sm sm:p-4">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-gold">Map view</p>
          <h2 className="font-display text-2xl font-bold text-cream sm:text-3xl">{selectedConferenceId === 'all' ? 'All FBS Conferences' : getConference(selectedConferenceId).name}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-md bg-white/88 px-3 py-2 text-xs font-bold text-charcoal/76">
          {fbs2026Conferences.map((conference) => {
            const count = conferenceCounts[conference.id] ?? 0;
            if (!count && selectedConferenceId !== conference.id) return null;
            return (
              <span key={conference.id} className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: conference.colorToken }} />
                {conference.shortName}: {count}
              </span>
            );
          })}
        </div>
      </div>
      <div
        ref={viewportRef}
        className={`relative aspect-[1.15] min-h-[320px] touch-none overflow-hidden rounded-md border border-white/10 bg-[#dbe4ea] sm:aspect-[1.35] md:aspect-[1.55] md:min-h-[520px] ${zoom > 1 ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'}`}
        onPointerDown={startPan}
        onWheel={handleWheel}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.42),rgba(219,228,234,0.95))]" />
        <div className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform" style={{ transformOrigin: '0 0', transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
          <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${usMapViewBox.width} ${usMapViewBox.height}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label="Map of the United States">
            <path d={usNationPath} fill="#f8f9fb" stroke="#323232" strokeWidth={1.6} />
            <path d={usStateBordersPath} fill="none" stroke="#69757f" strokeWidth={0.8} opacity={0.5} />
          </svg>
          {schools.map((school) => (
            <FbsMarker
              key={school.id}
              school={school}
              selected={selectedSchool?.id === school.id}
              allMode={selectedConferenceId === 'all'}
              iconSize={(selectedConferenceId === 'all' ? markerIconSize * 0.82 : markerIconSize)}
              touchSize={markerTargetSize}
              onSelect={() => selectSchool(school)}
            />
          ))}
        </div>
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-white/78 px-3 py-2 text-xs font-semibold text-charcoal/68 backdrop-blur">
          {schools.length} visible schools
        </div>
        <SharedZoomControls
          onZoomIn={() => adjustZoom(1)}
          onZoomOut={() => adjustZoom(-1)}
          onFocus={() => focusSchool(selectedSchool)}
          onReset={resetView}
          focusLabel={selectedSchool ? `Focus map on ${selectedSchool.name}` : 'Select a school to focus'}
          focusDisabled={!selectedSchool}
        />
      </div>
    </section>
  );
}

function LandscapeSidePanel({ selectedSchool, selectedConference, visibleSchools, onSelectSchool }: { selectedSchool: FbsSchool | null; selectedConference: FbsConference | null; visibleSchools: FbsSchool[]; onSelectSchool: (school: FbsSchool) => void }) {
  if (selectedSchool) {
    const conference = getConference(selectedSchool.conferenceId);
    return (
      <aside className="rounded-md border border-charcoal/10 bg-white/86 p-4">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-charcoal/10 bg-white shadow-sm">
            <FbsSchoolLogoImage
              school={selectedSchool}
              imageClassName="h-full w-full object-contain p-1"
              fallbackClassName="flex h-full w-full items-center justify-center bg-charcoal px-1 text-center text-[10px] font-black leading-none text-gold"
            />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-brass">Selected school</p>
            <h2 className="font-display text-3xl font-bold leading-none text-charcoal">{selectedSchool.name}</h2>
            <p className="mt-2 text-sm font-bold text-charcoal/60">{conference.name}</p>
          </div>
        </div>
        <div className="grid gap-3">
          <section className="rounded-md bg-cream/70 p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.12em] text-charcoal/48">Location</p>
            <p className="mt-1 text-sm font-bold text-charcoal">{selectedSchool.city}, {selectedSchool.state}</p>
          </section>
          <section className="rounded-md bg-cream/70 p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.12em] text-charcoal/48">Stadium</p>
            <p className="mt-1 text-sm font-bold text-charcoal">{selectedSchool.stadiumName ?? 'Data pending'}</p>
          </section>
          <section className="rounded-md bg-white/80 p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.12em] text-charcoal/48">Notes</p>
            <p className="mt-1 text-sm leading-6 text-charcoal/70">{selectedSchool.notes ?? 'Projected 2026 conference landscape entry.'}</p>
          </section>
        </div>
      </aside>
    );
  }

  if (selectedConference) {
    return (
      <aside className="rounded-md border border-charcoal/10 bg-white/86 p-4">
        <div className="mb-4 flex items-start gap-3">
          <ConferenceLogo conferenceId={selectedConference.id} alt={`${selectedConference.name} logo`} size="sm" fallbackLabel={selectedConference.shortName} />
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-brass">Conference view</p>
            <h2 className="font-display text-3xl font-bold leading-none text-charcoal">{selectedConference.name}</h2>
            <p className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-charcoal/50">{selectedConference.status.replace('-', ' ')}</p>
          </div>
        </div>
        <p className="text-sm leading-6 text-charcoal/70">{selectedConference.description}</p>
        <div className="mt-4 rounded-md bg-cream/70 p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-charcoal/48">Visible members</p>
          <p className="font-display text-3xl font-bold text-charcoal">{visibleSchools.length}</p>
        </div>
        <div className="mt-4 max-h-[22rem] overflow-y-auto pr-1">
          <div className="grid gap-2">
            {visibleSchools.map((school) => (
              <button key={school.id} type="button" onClick={() => onSelectSchool(school)} className="rounded-md border border-charcoal/10 bg-white px-3 py-2 text-left text-sm font-bold text-charcoal transition hover:border-crimson/35 hover:bg-cream focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-crimson/15">
                {school.name}<span className="block text-xs font-semibold text-charcoal/50">{school.city}, {school.state}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="rounded-md border border-charcoal/10 bg-white/92 p-5 shadow-exhibit">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-charcoal text-gold"><Globe2 className="h-5 w-5" aria-hidden="true" /></span>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-brass">Landscape overview</p>
          <h2 className="font-display text-3xl font-bold leading-none text-charcoal">2026 FBS</h2>
        </div>
      </div>
      <p className="text-sm leading-6 text-charcoal/70">Explore projected FBS football membership by conference. Select a conference to reduce clutter, then click a marker for school details.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        <section className="rounded-md border border-charcoal/10 bg-cream/70 p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-charcoal/48">Conferences</p>
          <p className="font-display text-3xl font-bold text-charcoal">{fbs2026Conferences.length}</p>
        </section>
        <section className="rounded-md border border-charcoal/10 bg-cream/70 p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-charcoal/48">Seeded schools</p>
          <p className="font-display text-3xl font-bold text-charcoal">{fbsSchoolRegistry.length}</p>
        </section>
      </div>
    </aside>
  );
}

export function FbsLandscapePage() {
  const [selectedConferenceId, setSelectedConferenceId] = useState<FbsConferenceId | 'all'>('all');
  const [schoolSearch, setSchoolSearch] = useState('');

  useEffect(() => {
    document.title = '2026 Map | OU Interactive Museum';
  }, []);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);

  const visibleSchools = useMemo(() => {
    const query = schoolSearch.trim().toLowerCase();
    return fbsSchoolRegistry.filter((school) => {
      const matchesConference = selectedConferenceId === 'all' || school.conferenceId === selectedConferenceId;
      const matchesSearch = !query || `${school.name} ${school.shortName} ${school.city} ${school.state}`.toLowerCase().includes(query);
      return matchesConference && matchesSearch;
    });
  }, [selectedConferenceId, schoolSearch]);
  const selectedSchool = visibleSchools.find((school) => school.id === selectedSchoolId) ?? null;
  const selectedConference = selectedConferenceId === 'all' ? null : getConference(selectedConferenceId);

  const setConference = (conferenceId: FbsConferenceId | 'all') => {
    setSelectedConferenceId(conferenceId);
    setSelectedSchoolId(null);
  };

  const resetFilters = () => {
    setSelectedConferenceId('all');
    setSchoolSearch('');
    setSelectedSchoolId(null);
  };

  return (
    <section>
      <SectionHero eyebrow="National Landscape" title="2026 FBS Conference Landscape">
        Explore the projected national alignment of every FBS conference beginning in 2026.
      </SectionHero>
      <section className="mb-5 rounded-md border border-charcoal/10 bg-white/78 p-4">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brass">Conference filter</p>
            <p className="text-sm font-semibold text-charcoal/62">View all FBS schools or isolate one conference.</p>
          </div>
          <button type="button" onClick={resetFilters} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-charcoal/10 bg-charcoal px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-cream transition hover:bg-crimson focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-crimson/20">
            <X className="h-3.5 w-3.5" aria-hidden="true" /> Show all
          </button>
        </div>
        <label className="mb-3 flex min-h-11 w-full items-center gap-2 rounded-md border border-charcoal/10 bg-cream px-3 py-2 text-sm font-semibold text-charcoal shadow-inner sm:max-w-md">
          <Search className="h-4 w-4 text-charcoal/45" aria-hidden="true" />
          <input
            value={schoolSearch}
            onChange={(event) => {
              setSchoolSearch(event.target.value);
              setSelectedSchoolId(null);
            }}
            placeholder="Search school, city, or state"
            className="w-full bg-transparent outline-none placeholder:text-charcoal/45"
          />
        </label>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold text-charcoal/58">
          <span className="rounded-sm bg-cream px-2 py-1">{visibleSchools.length} visible</span>
          {selectedConference && <span className="rounded-sm bg-gold/20 px-2 py-1">{selectedConference.shortName}</span>}
          {schoolSearch.trim() && <span className="rounded-sm bg-sky/20 px-2 py-1">Search: {schoolSearch.trim()}</span>}
        </div>
        <details className="rounded-md border border-charcoal/10 bg-white/70 p-2">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-sm px-2 text-xs font-black uppercase tracking-[0.14em] text-charcoal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-crimson/15">
            Choose conference
            <span className="text-charcoal/45">{selectedConference ? selectedConference.shortName : 'All'}</span>
          </summary>
          <div className="mt-2 flex flex-wrap gap-2 border-t border-charcoal/10 pt-3">
            <button type="button" onClick={() => setConference('all')} className={`min-h-11 rounded-md px-3 py-2 text-xs font-black uppercase tracking-[0.12em] transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-crimson/15 ${selectedConferenceId === 'all' ? 'bg-charcoal text-white' : 'bg-cream text-charcoal/70 hover:bg-white'}`}>
              All FBS ({fbsSchoolRegistry.length})
            </button>
            {fbs2026Conferences.map((conference) => {
              const count = fbsSchoolRegistry.filter((school) => school.conferenceId === conference.id).length;
              return (
                <button key={conference.id} type="button" onClick={() => setConference(conference.id)} className={`inline-flex min-h-11 items-center gap-2 rounded-md px-3 py-2 text-xs font-black uppercase tracking-[0.12em] transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-crimson/15 ${selectedConferenceId === conference.id ? 'bg-charcoal text-white' : 'bg-cream text-charcoal/70 hover:bg-white'}`}>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: conference.colorToken }} />
                  {conference.shortName} ({count})
                </button>
              );
            })}
          </div>
        </details>
      </section>

      <div className="grid w-full items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,360px)]">
        <div className="space-y-4">
          <FbsMap schools={visibleSchools} selectedSchool={selectedSchool} selectedConferenceId={selectedConferenceId} onSelectSchool={(school) => setSelectedSchoolId(school.id)} />
        </div>
        <div className="mx-auto w-full max-w-[360px] space-y-4 xl:sticky xl:top-32">
          <LandscapeSidePanel selectedSchool={selectedSchool} selectedConference={selectedConference} visibleSchools={visibleSchools} onSelectSchool={(school) => setSelectedSchoolId(school.id)} />
        </div>
      </div>

      <div className="mt-5">
        <HistoricalNotesPanel title="What Changed in 2026?" notes={historicalNotes['2026']} compact />
      </div>
    </section>
  );
}
