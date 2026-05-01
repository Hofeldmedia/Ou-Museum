import { projectSchoolCoordinates, usMapViewBox } from './mapProjection';

type Coordinates = {
  latitude: number;
  longitude: number;
};

type Size = {
  width: number;
  height: number;
};

type Pan = {
  x: number;
  y: number;
};

export function hasValidMapCoordinates(target: Coordinates | null | undefined): target is Coordinates {
  return Boolean(
    target &&
      Number.isFinite(target.latitude) &&
      Number.isFinite(target.longitude) &&
      Math.abs(target.latitude) <= 90 &&
      Math.abs(target.longitude) <= 180,
  );
}

export function clampMapPan(viewportSize: Size, nextZoom: number, nextPan: Pan): Pan {
  const minPanX = viewportSize.width - viewportSize.width * nextZoom;
  const minPanY = viewportSize.height - viewportSize.height * nextZoom;

  return {
    x: clamp(nextPan.x, minPanX, 0),
    y: clamp(nextPan.y, minPanY, 0),
  };
}

export function getCenteredMapPan(viewportSize: Size, target: Coordinates, zoom: number): Pan | null {
  if (!hasValidMapCoordinates(target)) return null;

  const point = projectSchoolCoordinates(target.latitude, target.longitude);
  if (!point) return null;

  const pointX = (point.x / usMapViewBox.width) * viewportSize.width;
  const pointY = (point.y / usMapViewBox.height) * viewportSize.height;

  return clampMapPan(viewportSize, zoom, {
    x: viewportSize.width / 2 - pointX * zoom,
    y: viewportSize.height / 2 - pointY * zoom,
  });
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
