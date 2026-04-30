import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { MapLayerId, MapLegendItem } from '../../types/content';
import { projectSchoolCoordinates, usMapViewBox, usNationPath, usStateBordersPath } from '../../utils/mapProjection';
import { SharedLegend } from './SharedLegend';
import { SharedZoomControls } from './SharedZoomControls';

type USConferenceMapProps = {
  viewKey?: string;
  activeLayer: MapLayerId;
  legendItems: MapLegendItem[];
  headerTitle: string;
  selectionTitle: string;
  selectionSubtitle: string;
  meta: string;
  focusTarget: { label: string; latitude: number; longitude: number } | null;
  defaultView?: {
    zoom: number;
    pan?: { x: number; y: number };
  };
  children: ReactNode;
};

const layerCopy: Record<MapLayerId, string> = {
  conference: 'Conference geography traces the schools and rival regions that shaped OU’s conference identity.',
  nfl: 'Norman to the NFL follows the professional destinations that extend OU’s pipeline beyond college football.',
  rivalries: 'Rivalries and Regions highlights the opponents that turned geography into identity and annual stakes.',
  recruiting: 'Recruiting Footprint highlights the regions that helped stock Oklahoma rosters across changing eras.',
};

const FOCUS_ZOOM = 1.85;
const ZOOM_STEP = 0.3;
const MAX_ZOOM = 3;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function hasValidCoordinates(target: { latitude: number; longitude: number } | null): target is { latitude: number; longitude: number } {
  return Boolean(
    target &&
      Number.isFinite(target.latitude) &&
      Number.isFinite(target.longitude) &&
      Math.abs(target.latitude) <= 90 &&
      Math.abs(target.longitude) <= 180,
  );
}

export function USConferenceMap({
  viewKey,
  activeLayer,
  legendItems,
  headerTitle,
  selectionTitle,
  selectionSubtitle,
  meta,
  focusTarget,
  defaultView,
  children,
}: USConferenceMapProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: usMapViewBox.width, height: usMapViewBox.height });
  const defaultZoom = defaultView?.zoom ?? 1;
  const [zoom, setZoom] = useState(defaultZoom);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return undefined;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setViewportSize({ width, height });
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const getCenteredPan = (nextZoom: number) => {
    if (defaultView?.pan) return defaultView.pan;
    return {
      x: (viewportSize.width * (1 - nextZoom)) / 2,
      y: (viewportSize.height * (1 - nextZoom)) / 2,
    };
  };

  const clampPan = (nextZoom: number, nextPan: { x: number; y: number }) => {
    const minPanX = viewportSize.width - (viewportSize.width * nextZoom);
    const minPanY = viewportSize.height - (viewportSize.height * nextZoom);
    return {
      x: clamp(nextPan.x, minPanX, 0),
      y: clamp(nextPan.y, minPanY, 0),
    };
  };

  const resetView = () => {
    setZoom(defaultZoom);
    setPan(clampPan(defaultZoom, getCenteredPan(defaultZoom)));
  };

  useEffect(() => {
    setZoom(defaultZoom);
    setPan(clampPan(defaultZoom, getCenteredPan(defaultZoom)));
  }, [defaultZoom, viewKey, viewportSize.width, viewportSize.height]);

  const focusLocation = (target: { latitude: number; longitude: number }) => {
    if (!hasValidCoordinates(target)) {
      if (import.meta.env.DEV) {
        console.warn('[USConferenceMap] Skipping focus: invalid coordinates.', target);
      }
      return;
    }

    const anchor = projectSchoolCoordinates(target.latitude, target.longitude);
    if (!anchor) {
      if (import.meta.env.DEV) {
        console.warn('[USConferenceMap] Skipping focus: projection returned null.', target);
      }
      return;
    }

    const centerX = viewportSize.width / 2;
    const centerY = viewportSize.height / 2;
    const pointX = (anchor.x / usMapViewBox.width) * viewportSize.width;
    const pointY = (anchor.y / usMapViewBox.height) * viewportSize.height;
    const targetZoom = FOCUS_ZOOM;

    const nextPan = clampPan(targetZoom, {
      x: centerX - pointX * targetZoom,
      y: centerY - pointY * targetZoom,
    });

    setZoom(targetZoom);
    setPan(nextPan);
  };

  const adjustZoom = (direction: 1 | -1) => {
    const nextZoom = clamp(Number((zoom + direction * ZOOM_STEP).toFixed(2)), 1, MAX_ZOOM);
    setZoom(nextZoom);
    setPan((currentPan) => clampPan(nextZoom, currentPan));
  };

  const startPan = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest('button')) return;
    if (zoom <= defaultZoom) return;

    setDragging(true);
    const start = { x: event.clientX, y: event.clientY };
    const origin = { ...pan };
    const pointerId = event.pointerId;
    event.currentTarget.setPointerCapture(pointerId);

    const handleMove = (moveEvent: PointerEvent) => {
      setPan(
        clampPan(zoom, {
          x: origin.x + (moveEvent.clientX - start.x),
          y: origin.y + (moveEvent.clientY - start.y),
        }),
      );
    };

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
    <section key={viewKey ?? activeLayer} className="rounded-md border border-charcoal/10 bg-charcoal p-4 shadow-exhibit animate-[mapEraIn_0.38s_ease-out]">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-gold">United States conference atlas</p>
          <h2 className="font-display text-3xl font-bold text-cream">{headerTitle}</h2>
        </div>
        <SharedLegend items={legendItems} />
      </div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-md border border-charcoal/10 bg-white/84 px-4 py-3 shadow-sm">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-charcoal/45">Current selection</p>
          <p className="font-display text-2xl font-bold text-charcoal">{selectionTitle}</p>
        </div>
        <div className="text-right text-xs font-semibold text-charcoal/62">
          <p>{selectionSubtitle}</p>
          <p>{meta}</p>
        </div>
      </div>
      <div
        ref={viewportRef}
        className={`relative aspect-[1.55] min-h-[430px] overflow-hidden rounded-md border border-white/10 bg-[#dbe4ea] md:min-h-[500px] xl:min-h-[580px] ${zoom > defaultZoom ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'}`}
        onPointerDown={startPan}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.42),rgba(219,228,234,0.95))]" />
        <div className="absolute inset-0 opacity-[0.08] map-line" />
        <div
          className="absolute inset-0 transition-transform duration-500 ease-out"
          style={{ transformOrigin: '0 0', transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        >
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${usMapViewBox.width} ${usMapViewBox.height}`}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Map of the United States"
          >
            <path d={usNationPath} fill="#f8f9fb" stroke="#323232" strokeWidth={1.6} />
            <path d={usStateBordersPath} fill="none" stroke="#69757f" strokeWidth={0.8} opacity={0.5} />
          </svg>
          {children}
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/45 to-transparent" />
        <div className="absolute left-4 top-4 hidden max-w-[20rem] rounded-md border border-charcoal/15 bg-white/82 px-3 py-2 text-xs font-bold leading-5 text-charcoal/75 shadow-lg backdrop-blur md:block">
          {layerCopy[activeLayer]}
        </div>
        <div className="absolute bottom-4 right-4 rounded-md border border-charcoal/10 bg-white/82 px-3 py-2 text-right text-xs font-bold text-charcoal/68 backdrop-blur">
          {meta}
        </div>
        <div className="pointer-events-none absolute bottom-4 left-4 rounded-md border border-charcoal/10 bg-white/82 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-charcoal/58 shadow-sm">
          Lower 48 campus locations
        </div>
        <SharedZoomControls
          onZoomIn={() => adjustZoom(1)}
          onZoomOut={() => adjustZoom(-1)}
          onFocus={() => {
            if (!focusTarget) return;
            focusLocation(focusTarget);
          }}
          onReset={resetView}
          focusLabel={focusTarget ? `Focus map on ${focusTarget.label}` : 'Focus map on current selection'}
          focusDisabled={!focusTarget}
        />
      </div>
      <div className="mt-3 rounded-md border border-charcoal/10 bg-white/84 p-3 shadow-sm">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-brass">Map guidance</p>
          <p className="text-xs font-semibold text-charcoal/55">{zoom > defaultZoom ? 'Drag the map to pan while zoomed.' : 'Use this when markers are close together.'}</p>
        </div>
        <p className="text-sm leading-6 text-charcoal/68">
          Switch layers to compare conference geography, NFL destinations, rivalry routes, and recruiting regions without leaving the shared U.S. map.
        </p>
      </div>
    </section>
  );
}
