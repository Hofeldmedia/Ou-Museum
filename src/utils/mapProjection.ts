import { geoAlbersUsa, geoPath, type GeoPath, type GeoProjection } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import usAtlas from 'us-atlas/states-10m.json';

const VIEWBOX_WIDTH = 960;
const VIEWBOX_HEIGHT = 600;

const atlas = usAtlas as {
  objects: {
    nation: unknown;
    states: unknown;
  };
};

const nationFeature = feature(atlas as never, atlas.objects.nation as never);
const statesFeature = feature(atlas as never, atlas.objects.states as never);
const stateBorderMesh = mesh(atlas as never, atlas.objects.states as never, (a: unknown, b: unknown) => a !== b);

const projection = geoAlbersUsa().fitExtent(
  [
    [48, 30],
    [VIEWBOX_WIDTH - 48, VIEWBOX_HEIGHT - 34],
  ],
  nationFeature as never,
);

const path = geoPath(projection);

export const usMapViewBox = {
  width: VIEWBOX_WIDTH,
  height: VIEWBOX_HEIGHT,
};

export const usNationPath = path(nationFeature as never) ?? '';
export const usStateBordersPath = path(stateBorderMesh as never) ?? '';
export const usStateFeatures = 'features' in statesFeature ? statesFeature.features : [];

export function getUSProjection(): GeoProjection {
  return projection;
}

export function getUSPathGenerator(): GeoPath {
  return path;
}

export function projectSchoolCoordinates(latitude: number, longitude: number) {
  const point = projection([longitude, latitude]);

  if (!point) return null;

  return {
    x: point[0],
    y: point[1],
    percentX: (point[0] / VIEWBOX_WIDTH) * 100,
    percentY: (point[1] / VIEWBOX_HEIGHT) * 100,
  };
}
