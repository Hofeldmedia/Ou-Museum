import type { NFLDestinationMarker, NFLMapPlayerRoute, RouteLine } from '../../types/content';
import { projectSchoolCoordinates } from '../../utils/mapProjection';
import { getNFLLogo, getOUOriginLogo } from '../../utils/getNFLLogo';
import { RouteLayer } from './RouteLayer';
import { ThematicMarker } from './ThematicMarker';

const nflNormanAnchor = {
  latitude: 35.2226,
  longitude: -97.4395,
};

export function NFLLayer({
  norman,
  destinations,
  routes,
  selectedTeamName,
  selectedOrigin = false,
  onSelectTeam,
  onSelectOrigin,
}: {
  norman: { label: string; latitude: number; longitude: number };
  destinations: NFLDestinationMarker[];
  routes: RouteLine[];
  selectedTeamName?: string;
  selectedOrigin?: boolean;
  onSelectTeam: (teamName: string) => void;
  onSelectOrigin: () => void;
}) {
  const normanPoint = projectSchoolCoordinates(nflNormanAnchor.latitude, nflNormanAnchor.longitude);

  return (
    <>
      <RouteLayer
        routes={routes}
        selectedRouteIds={
          selectedTeamName ? routes.filter((route) => route.id.includes(selectedTeamName.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-'))).map((route) => route.id) : []
        }
        activeKind="nfl"
        animateOnMount
      />
      {normanPoint && (
        <ThematicMarker
          x={normanPoint.percentX}
          y={normanPoint.percentY}
          label={norman.label}
          tone="anchor"
          selected={selectedOrigin}
          imageUrl={getOUOriginLogo()}
          imageAlt="Oklahoma Sooners logo"
          fallbackText="OU"
          markerClassName="min-h-[4.75rem] min-w-[4.75rem] animate-[nflOriginIn_0.55s_cubic-bezier(0.22,1,0.36,1)_both]"
          badgeClassName="h-10 w-10 border-charcoal/10 bg-white text-crimson shadow-[0_0_26px_rgba(255,255,255,0.45)] sm:h-11 sm:w-11 md:h-12 md:w-12"
          imageClassName="h-[78%] w-[78%] opacity-100"
          onSelect={onSelectOrigin}
        />
      )}
      {destinations.map((destination, index) => {
        const point = projectSchoolCoordinates(destination.latitude, destination.longitude);
        if (!point) return null;

        return (
          <ThematicMarker
            key={destination.id}
            x={point.percentX}
            y={point.percentY}
            label={`${destination.teamName} in ${destination.city}`}
            tone="nfl"
            selected={selectedTeamName === destination.teamName}
            imageUrl={getNFLLogo(destination.teamAbbreviation, destination.teamEspnId)}
            imageAlt={`${destination.teamName} logo`}
            fallbackText={destination.teamAbbreviation.toUpperCase()}
            markerClassName="animate-[nflMarkerIn_0.65s_cubic-bezier(0.22,1,0.36,1)_both]"
            markerStyle={{ animationDelay: `${180 + index * 45}ms` }}
            onSelect={() => onSelectTeam(destination.teamName)}
          />
        );
      })}
    </>
  );
}
