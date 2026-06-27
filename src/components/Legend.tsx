import type { VisualizerLayout } from "../types";
import { STATE_STYLES, LEGEND } from "../constants/theme";
import { GRID_LEGEND } from "../constants/grid";

interface LegendProps {
  layout?: VisualizerLayout;
}

export function Legend({ layout }: LegendProps) {
  if (layout === "grid") {
    return <GridLegend />;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {LEGEND.map(({ state, label }) => (
        <div key={state} className="flex items-center gap-1.5 text-xs text-slate-400">
          <div className={`w-3 h-3 rounded border ${STATE_STYLES[state]}`} />
          {label}
        </div>
      ))}
    </div>
  );
}

export function GridLegend() {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {GRID_LEGEND.map(({ swatch, label }) => (
        <div key={label} className="flex items-center gap-1.5 text-xs text-slate-400">
          <div className={`w-3 h-3 rounded border ${swatch}`} />
          {label}
        </div>
      ))}
    </div>
  );
}
