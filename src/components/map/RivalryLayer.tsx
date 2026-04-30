import type { RivalryConnection, RouteLine } from '../../types/content';
import { projectSchoolCoordinates } from '../../utils/mapProjection';
import { getSchoolLogo } from '../../utils/getSchoolLogo';
import { getOUOriginLogo } from '../../utils/getNFLLogo';
import { RouteLayer } from './RouteLayer';
import { ThematicMarker } from './ThematicMarker';

export function RivalryLayer({
  norman,
  rivalries,
  routes,
  selectedRivalryId,
  onSelectRivalry,
}: {
  norman: { label: string; latitude: number; longitude: number };
  rivalries: RivalryConnection[];
  routes: RouteLine[];
  selectedRivalryId: string;
  onSelectRivalry: (id: string) => void;
}) {
  const normanPoint = projectSchoolCoordinates(norman.latitude, norman.longitude);

  return (
    <>
      <RouteLayer routes={routes} selectedRouteIds={routes.filter((route) => route.id.includes(selectedRivalryId)).map((route) => route.id)} />
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
          onSelect={() => undefined}
        />
      )}
      {rivalries.map((rivalry) => {
        const point = projectSchoolCoordinates(rivalry.latitude, rivalry.longitude);
        if (!point) return null;
        const logo = getSchoolLogo('sec-current', rivalry.rivalSchoolId, rivalry.schoolName);

        return (
          <ThematicMarker
            key={rivalry.id}
            x={point.percentX}
            y={point.percentY}
            label={`${rivalry.schoolName}, ${rivalry.city}, ${rivalry.state}`}
            tone="rivalry"
            selected={selectedRivalryId === rivalry.rivalryId}
            imageUrl={logo.light}
            imageAlt={logo.alt}
            fallbackText={rivalry.schoolName
              .split(/\s+/)
              .map((part) => part[0])
              .join('')
              .slice(0, 3)
              .toUpperCase()}
            onSelect={() => onSelectRivalry(rivalry.rivalryId)}
          />
        );
      })}
    </>
  );
}
