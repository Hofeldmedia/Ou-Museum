import type { ConferenceSchool } from '../types/content';

export type MarkerAnchor = {
  school: ConferenceSchool;
  anchorX: number;
  anchorY: number;
};

export type MarkerLayout = MarkerAnchor & {
  x: number;
  y: number;
  displaced: boolean;
};

const MIN_DISTANCE = 44;
const MAX_OFFSET = 34;
const ITERATIONS = 70;

export function getMarkerLayouts(anchors: MarkerAnchor[], bounds: { width: number; height: number }) {
  const layouts: MarkerLayout[] = anchors.map((anchor) => ({
    ...anchor,
    x: anchor.anchorX,
    y: anchor.anchorY,
    displaced: false,
  }));

  for (let iteration = 0; iteration < ITERATIONS; iteration += 1) {
    for (let i = 0; i < layouts.length; i += 1) {
      for (let j = i + 1; j < layouts.length; j += 1) {
        const first = layouts[i];
        const second = layouts[j];
        const dx = second.x - first.x;
        const dy = second.y - first.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 0.01;

        if (distance >= MIN_DISTANCE) continue;

        const push = (MIN_DISTANCE - distance) / 2;
        const ux = dx / distance;
        const uy = dy / distance;
        first.x -= ux * push;
        first.y -= uy * push;
        second.x += ux * push;
        second.y += uy * push;
      }
    }

    layouts.forEach((layout) => {
      const anchorPull = layout.school.isOU ? 0.12 : 0.08;
      layout.x += (layout.anchorX - layout.x) * anchorPull;
      layout.y += (layout.anchorY - layout.y) * anchorPull;
      constrainToAnchor(layout);
      layout.x = clamp(layout.x, 18, bounds.width - 18);
      layout.y = clamp(layout.y, 18, bounds.height - 18);
    });
  }

  return layouts.map((layout) => {
    const dx = layout.x - layout.anchorX;
    const dy = layout.y - layout.anchorY;
    return {
      ...layout,
      displaced: Math.sqrt(dx * dx + dy * dy) > 8,
    };
  });
}

function constrainToAnchor(layout: MarkerLayout) {
  const dx = layout.x - layout.anchorX;
  const dy = layout.y - layout.anchorY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance <= MAX_OFFSET) return;

  const scale = MAX_OFFSET / distance;
  layout.x = layout.anchorX + dx * scale;
  layout.y = layout.anchorY + dy * scale;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
