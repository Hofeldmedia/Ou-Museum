import type { MapLayerId } from '../../types/content';

const layerLabels: Array<{ id: MapLayerId; label: string }> = [
  { id: 'conference', label: 'Conference Geography' },
  { id: 'nfl', label: 'Norman to the NFL' },
  { id: 'rivalries', label: 'Rivalries and Regions' },
  { id: 'recruiting', label: 'Recruiting Footprint' },
];

export function MapLayerSwitcher({
  activeLayer,
  onChange,
}: {
  activeLayer: MapLayerId;
  onChange: (layer: MapLayerId) => void;
}) {
  return (
    <div className="rounded-md border border-charcoal/10 bg-white/84 p-3 shadow-sm">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-brass">Map Layers</p>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Interactive U.S. map layers">
        {layerLabels.map((layer) => (
          <button
            key={layer.id}
            type="button"
            role="tab"
            aria-selected={activeLayer === layer.id}
            onClick={() => onChange(layer.id)}
            className={`rounded-md px-3 py-2 text-xs font-black uppercase tracking-[0.12em] transition ${
              activeLayer === layer.id
                ? 'bg-crimson text-white shadow-[0_0_16px_rgba(132,22,23,0.22)]'
                : 'bg-cream text-charcoal/65 hover:bg-crimson/10 hover:text-charcoal'
            }`}
          >
            {layer.label}
          </button>
        ))}
      </div>
    </div>
  );
}
