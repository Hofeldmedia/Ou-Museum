import type { HeismanHometownMarker, RouteLine } from '../../types/content';
import { projectSchoolCoordinates } from '../../utils/mapProjection';
import { getOUOriginLogo } from '../../utils/getNFLLogo';
import { RouteLayer } from './RouteLayer';
import { ThematicMarker } from './ThematicMarker';

export function HeismanLayer({
  norman,
  markers,
  routes,
  selectedPlayerId,
  onSelectPlayer,
}: {
  norman: { label: string; latitude: number; longitude: number };
  markers: HeismanHometownMarker[];
  routes: RouteLine[];
  selectedPlayerId: string;
  onSelectPlayer: (playerId: string) => void;
}) {
  const normanPoint = projectSchoolCoordinates(norman.latitude, norman.longitude);
  const selectedRouteIds = routes.filter((route) => route.id.includes(selectedPlayerId)).map((route) => route.id);

  return (
    <>
      <RouteLayer routes={routes} selectedRouteIds={selectedRouteIds} activeKind="heisman" />
      {normanPoint && (
        <ThematicMarker
          x={normanPoint.percentX}
          y={normanPoint.percentY}
          label={norman.label}
          tone="anchor"
          selected={false}
          imageUrl={getOUOriginLogo()}
          imageAlt="Oklahoma Sooners logo"
          fallbackText="OU"
          muted={selectedRouteIds.length > 0}
          labelClassName="font-black text-[12px] tracking-[0.08em]"
          onSelect={() => undefined}
        />
      )}
      {markers.map((marker) => {
        const point = projectSchoolCoordinates(marker.latitude, marker.longitude);
        if (!point) {
          if (import.meta.env.DEV) {
            console.warn('[HeismanLayer] Skipping hometown marker: invalid projected coordinates.', marker);
          }
          return null;
        }

        return (
          <ThematicMarker
            key={marker.id}
            x={point.percentX}
            y={point.percentY}
            label={`${marker.playerName}, ${marker.year}, ${marker.hometownCity}, ${marker.state}`}
            tone="heisman"
            selected={selectedPlayerId === marker.playerId}
            muted={selectedPlayerId !== marker.playerId}
            labelClassName="font-black text-[12px] tracking-[0.04em]"
            badge={String(marker.year).slice(2)}
            onSelect={() => onSelectPlayer(marker.playerId)}
          />
        );
      })}
    </>
  );
}
