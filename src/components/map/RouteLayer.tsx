import { useEffect, useMemo, useState } from 'react';
import { projectSchoolCoordinates, usMapViewBox } from '../../utils/mapProjection';
import type { RouteLine } from '../../types/content';

export function RouteLayer({
  routes,
  selectedRouteIds = [],
  activeKind,
  animateOnMount = false,
}: {
  routes: RouteLine[];
  selectedRouteIds?: string[];
  activeKind?: RouteLine['kind'];
  animateOnMount?: boolean;
}) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [animatingRouteIds, setAnimatingRouteIds] = useState<string[]>([]);

  const routeSignature = useMemo(() => routes.map((route) => route.id).join('|'), [routes]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches);
    syncPreference();
    mediaQuery.addEventListener('change', syncPreference);
    return () => mediaQuery.removeEventListener('change', syncPreference);
  }, []);

  useEffect(() => {
    if (!animateOnMount || activeKind !== 'nfl' || prefersReducedMotion) {
      setAnimatingRouteIds([]);
      return;
    }

    const ids = routes.map((route) => route.id);
    setAnimatingRouteIds(ids);
    const timeout = window.setTimeout(() => setAnimatingRouteIds([]), 1400 + ids.length * 60);
    return () => window.clearTimeout(timeout);
  }, [activeKind, animateOnMount, prefersReducedMotion, routeSignature, routes]);

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${usMapViewBox.width} ${usMapViewBox.height}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {routes.map((route) => {
        const from = projectSchoolCoordinates(route.fromLatitude, route.fromLongitude);
        const to = projectSchoolCoordinates(route.toLatitude, route.toLongitude);
        if (!from || !to) return null;

        const selected = selectedRouteIds.includes(route.id);
        const deltaX = to.x - from.x;
        const deltaY = to.y - from.y;
        const controlX = from.x + deltaX / 2;
        const controlY = from.y + deltaY / 2 - Math.min(55, Math.abs(deltaX) * 0.08 + Math.abs(deltaY) * 0.12);
        const strokeWidth =
          route.kind === 'rivalry' ? (route.emphasis === 'high' ? 4.5 : 3.3) : route.kind === 'nfl' ? 2.4 : route.kind === 'championship' ? 2.6 : 1.8;
        const stroke =
          route.kind === 'rivalry' ? '#841617' : route.kind === 'nfl' ? '#4a7f99' : route.kind === 'championship' ? '#c7a35a' : '#c7a35a';
        const shouldAnimate = animatingRouteIds.includes(route.id);
        const opacity =
          activeKind === 'heisman'
            ? selected
              ? 0.92
              : selectedRouteIds.length > 0
                ? 0.06
                : 0.12
            : selected
              ? 0.92
              : route.kind === 'rivalry'
                ? 0.75
                : route.kind === 'nfl'
                  ? 0.55
                  : route.kind === 'championship'
                    ? 0.58
                    : 0.45;

        return (
          <path
            key={route.id}
            d={`M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`}
            fill="none"
            stroke={stroke}
            strokeOpacity={opacity}
            strokeWidth={activeKind === 'heisman' ? (selected ? 3 : 1.2) : selected ? strokeWidth + 1 : strokeWidth}
            strokeLinecap="round"
            strokeDasharray={route.kind === 'heisman' ? (selected ? '8 6' : '5 8') : route.kind === 'championship' ? '8 7' : undefined}
            pathLength={shouldAnimate ? 1 : undefined}
            style={
              shouldAnimate
                ? {
                    strokeDasharray: 1,
                    strokeDashoffset: 1,
                    animation: `drawRoute 1.05s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
                    animationDelay: `${routes.findIndex((item) => item.id === route.id) * 60}ms`,
                  }
                : undefined
            }
          />
        );
      })}
    </svg>
  );
}
