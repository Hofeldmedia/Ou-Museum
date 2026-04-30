import type { ChampionshipVenueMarker, RouteLine } from '../../types/content';
import { projectSchoolCoordinates, usMapViewBox } from '../../utils/mapProjection';
import { RouteLayer } from './RouteLayer';
import { ThematicMarker } from './ThematicMarker';

export function ChampionshipLayer({
  norman,
  venues,
  routes,
  selectedRouteIds = [],
  selectedVenueId,
  onSelectVenue,
}: {
  norman: { label: string; latitude: number; longitude: number };
  venues: ChampionshipVenueMarker[];
  routes: RouteLine[];
  selectedRouteIds?: string[];
  selectedVenueId?: string;
  onSelectVenue: (venueId: string) => void;
}) {
  const normanPoint = projectSchoolCoordinates(norman.latitude, norman.longitude);

  return (
    <>
      <RouteLayer routes={routes} selectedRouteIds={selectedRouteIds} />
      {normanPoint && (
        <ThematicMarker
          x={normanPoint.percentX}
          y={normanPoint.percentY}
          label={norman.label}
          tone="anchor"
          selected={false}
          badge="OU"
          onSelect={() => undefined}
        />
      )}
      {venues.map((venue) => {
        const point = projectSchoolCoordinates(venue.latitude, venue.longitude);
        if (!point) {
          if (import.meta.env.DEV) {
            console.warn('[ChampionshipLayer] Skipping venue with invalid projection.', venue);
          }
          return null;
        }

        return (
          <ThematicMarker
            key={venue.id}
            x={point.percentX}
            y={point.percentY}
            label={`${venue.venueName} in ${venue.city}`}
            tone="championship"
            selected={selectedVenueId === venue.id}
            badge={venue.seasons.length > 1 ? String(venue.seasons.length) : String(venue.seasons[0]?.seasonYear).slice(2)}
            onSelect={() => onSelectVenue(venue.id)}
          />
        );
      })}
    </>
  );
}
