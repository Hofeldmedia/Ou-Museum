import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type WheelEvent as ReactWheelEvent } from 'react';
import type { MapLayerId, MapLegendItem } from '../../types/content';
import { clampMapPan, getCenteredMapPan, hasValidMapCoordinates } from '../../utils/mapFocus';
import { usMapViewBox, usNationPath, usStateBordersPath } from '../../utils/mapProjection';
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
  focusKey?: string | number;
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

function getMarkerSizes(zoom: number) {
  const outerMax = 42;
  const outerMin = 26;
  const logoMax = 30;
  const logoMin = 20;

  return {
    outer: clamp(outerMax - (zoom - 1) * 6, outerMin, outerMax),
    logo: clamp(logoMax - (zoom - 1) * 2, logoMin, logoMax),
  };
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
  focusKey,
  defaultView,
  children,
}: USConferenceMapProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: usMapViewBox.width, height: usMapViewBox.height });
  const defaultZoom = defaultView?.zoom ?? 1;
  const [zoom, setZoom] = useState(defaultZoom);
  const markerSizes = getMarkerSizes(zoom);
  const markerTouchSize = Math.max(44, markerSizes.outer + 12);
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

  const clampPan = (nextZoom: number, nextPan: { x: number; y: number }) => clampMapPan(viewportSize, nextZoom, nextPan);

  const resetView = () => {
    setZoom(defaultZoom);
    setPan(clampPan(defaultZoom, getCenteredPan(defaultZoom)));
  };

  useEffect(() => {
    setZoom(defaultZoom);
    setPan(clampPan(defaultZoom, getCenteredPan(defaultZoom)));
  }, [defaultZoom, viewKey, viewportSize.width, viewportSize.height]);

  const focusLocation = (target: { latitude: number; longitude: number }) => {
    if (!hasValidMapCoordinates(target)) {
      if (import.meta.env.DEV) {
        console.warn('[USConferenceMap] Skipping focus: invalid coordinates.', target);
      }
      return;
    }

    const targetZoom = Math.max(FOCUS_ZOOM, zoom);
    const nextPan = getCenteredMapPan(viewportSize, target, targetZoom);
    if (!nextPan) {
      if (import.meta.env.DEV) {
        console.warn('[USConferenceMap] Skipping focus: projection returned null.', target);
      }
      return;
    }

    setZoom(targetZoom);
    setPan(nextPan);
  };

  useEffect(() => {
    if (!focusTarget) return;
    focusLocation(focusTarget);
  }, [focusTarget?.latitude, focusTarget?.longitude, focusTarget?.label, focusKey]);

  const zoomTo = (nextZoom: number) => {
    const clampedZoom = clamp(Number(nextZoom.toFixed(2)), 1, MAX_ZOOM);
    setZoom(clampedZoom);
    setPan((currentPan) => clampPan(clampedZoom, currentPan));
  };

  const adjustZoom = (direction: 1 | -1) => {
    zoomTo(zoom + direction * ZOOM_STEP);
  };

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) < 2) return;
    event.preventDefault();
    zoomTo(zoom + (event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP));
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
    <section key={viewKey ?? activeLayer} className="rounded-md border border-charcoal/10 bg-charcoal p-3 shadow-sm animate-[mapEraIn_0.38s_ease-out] sm:p-4">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-gold">Map view</p>
          <h2 className="font-display text-2xl font-bold text-cream sm:text-3xl">{headerTitle}</h2>
        </div>
        <SharedLegend items={legendItems} />
      </div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-md bg-white/88 px-3 py-2">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-charcoal/45">Current selection</p>
          <p className="font-display text-xl font-bold text-charcoal sm:text-2xl">{selectionTitle}</p>
        </div>
        <div className="text-right text-xs font-semibold text-charcoal/62">
          <p>{selectionSubtitle}</p>
          <p>{meta}</p>
        </div>
      </div>
      <div
        ref={viewportRef}
        className={`relative aspect-[1.15] min-h-[320px] touch-none overflow-hidden rounded-md border border-white/10 bg-[#dbe4ea] sm:aspect-[1.35] md:aspect-[1.55] md:min-h-[500px] xl:min-h-[580px] ${zoom > defaultZoom ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'}`}
        onPointerDown={startPan}
        onWheel={handleWheel}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.42),rgba(219,228,234,0.95))]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] map-line" />
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
          style={{
            '--map-marker-size': `${markerSizes.outer / zoom}px`,
            '--map-logo-size': `${markerSizes.logo / zoom}px`,
            '--map-touch-size': `${markerTouchSize / zoom}px`,
            transformOrigin: '0 0',
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          } as CSSProperties}
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
        <div className="pointer-events-none absolute bottom-3 left-3 hidden rounded-md bg-white/78 px-3 py-2 text-xs font-semibold text-charcoal/68 backdrop-blur md:block">
          {layerCopy[activeLayer]}
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
    </section>
  );
}
