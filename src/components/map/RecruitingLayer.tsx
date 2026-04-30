import type { RecruitingRegion } from '../../types/content';
import { projectSchoolCoordinates, usMapViewBox } from '../../utils/mapProjection';
import { ThematicMarker } from './ThematicMarker';

const intensityStyles: Record<RecruitingRegion['intensity'], { fill: string; opacity: number; scale: number }> = {
  core: { fill: '#841617', opacity: 0.2, scale: 1 },
  strong: { fill: '#841617', opacity: 0.15, scale: 0.9 },
  emerging: { fill: '#BCDCEB', opacity: 0.22, scale: 0.82 },
  historical: { fill: '#BEB4A5', opacity: 0.18, scale: 0.76 },
};

export function RecruitingLayer({
  regions,
  selectedRegionId,
  onSelectRegion,
}: {
  regions: RecruitingRegion[];
  selectedRegionId?: string;
  onSelectRegion: (regionId: string) => void;
}) {
  return (
    <>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${usMapViewBox.width} ${usMapViewBox.height}`}
        preserveAspectRatio="xMidYMid meet"
        aria-label="Recruiting footprint regions"
      >
        {regions.map((region) => {
          const point = projectSchoolCoordinates(region.latitude, region.longitude);
          if (!point) {
            if (import.meta.env.DEV) {
              console.warn('[RecruitingLayer] Skipping region with invalid projection.', region);
            }
            return null;
          }

          const style = intensityStyles[region.intensity];
          const radius = region.radius * style.scale;
          const selected = selectedRegionId === region.id;

          return (
            <g key={region.id}>
              <circle
                cx={point.x}
                cy={point.y}
                r={radius}
                fill={style.fill}
                fillOpacity={selected ? Math.min(style.opacity + 0.12, 0.34) : style.opacity}
                stroke={selected ? '#841617' : style.fill}
                strokeOpacity={selected ? 0.75 : 0.35}
                strokeWidth={selected ? 2.8 : 1.4}
              />
            </g>
          );
        })}
      </svg>
      {regions.map((region) => {
        const point = projectSchoolCoordinates(region.latitude, region.longitude);
        if (!point) return null;

        return (
          <ThematicMarker
            key={region.id}
            x={point.percentX}
            y={point.percentY}
            label={`${region.label} recruiting region`}
            tone="recruiting"
            selected={selectedRegionId === region.id}
            badge={region.intensity === 'core' ? 'Core' : region.intensity === 'strong' ? 'Strong' : region.intensity === 'emerging' ? 'New' : 'Hist'}
            onSelect={() => onSelectRegion(region.id)}
          />
        );
      })}
    </>
  );
}
