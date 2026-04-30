import type { ConferenceSchool } from '../../types/content';
import { getMarkerLayouts } from '../../utils/markerLayout';
import { projectSchoolCoordinates, usMapViewBox } from '../../utils/mapProjection';
import { SchoolLogoMarker } from './SchoolLogoMarker';

type MarkerLayerProps = {
  schools: ConferenceSchool[];
  eraName: string;
  selectedSchoolId: string;
  exploredSchoolIds: string[];
  addedSchoolIds?: string[];
  onSelectSchool: (school: ConferenceSchool) => void;
};

export function MarkerLayer({ schools, eraName, selectedSchoolId, exploredSchoolIds, addedSchoolIds = [], onSelectSchool }: MarkerLayerProps) {
  const anchors = schools
    .map((school) => {
      const projected = projectSchoolCoordinates(school.latitude, school.longitude);
      if (!projected) return null;

      return {
        school,
        anchorX: projected.x,
        anchorY: projected.y,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  const layouts = getMarkerLayouts(anchors, usMapViewBox);

  return (
    <>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 ${usMapViewBox.width} ${usMapViewBox.height}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {layouts.map((layout) => {
          if (!layout.displaced) return null;
          const selected = selectedSchoolId === layout.school.id;
          const explored = exploredSchoolIds.includes(layout.school.id);

          return (
            <g key={layout.school.id}>
              <line
                x1={layout.anchorX}
                y1={layout.anchorY}
                x2={layout.x}
                y2={layout.y}
                stroke={selected ? '#841617' : explored ? '#10b981' : 'rgba(50,50,50,0.35)'}
                strokeWidth={selected ? 2.4 : 1.3}
                strokeDasharray={selected ? undefined : '3 4'}
              />
              <circle cx={layout.anchorX} cy={layout.anchorY} r={selected ? 4 : 3} fill={selected ? '#841617' : '#323232'} />
            </g>
          );
        })}
      </svg>
      {layouts.map((layout) => {
        const { school } = layout;
        return (
          <SchoolLogoMarker
            key={school.id}
            school={school}
            eraName={eraName}
            selected={selectedSchoolId === school.id}
            explored={exploredSchoolIds.includes(school.id)}
            newlyAdded={addedSchoolIds.includes(school.id)}
            x={(layout.x / usMapViewBox.width) * 100}
            y={(layout.y / usMapViewBox.height) * 100}
            onSelect={() => onSelectSchool(school)}
          />
        );
      })}
    </>
  );
}
