import type { LegendItem, LegendTone } from "../types";
import { STATE_STYLES } from "../constants/theme";
import {
  GRID_FILLED,
  GRID_FLOOR,
  GRID_GOAL,
  GRID_START,
  GRID_WALL,
} from "../constants/grid";

interface LegendProps {
  items: LegendItem[];
}

const SPECIAL_TONES: Record<Exclude<LegendTone, keyof typeof STATE_STYLES>, string> = {
  wall: GRID_WALL,
  floor: GRID_FLOOR,
  start: GRID_START,
  goal: GRID_GOAL,
  filled: GRID_FILLED,
};

function toneClass(tone: LegendTone): string {
  return tone in STATE_STYLES
    ? STATE_STYLES[tone as keyof typeof STATE_STYLES]
    : SPECIAL_TONES[tone as keyof typeof SPECIAL_TONES];
}

export function Legend({ items }: LegendProps) {
  return (
    <div className="mt-3 flex flex-wrap gap-2" aria-label="Visualization legend">
      {items.map(({ tone, label }) => (
        <div key={`${tone}-${label}`} className="flex shrink-0 items-center gap-1.5 text-xs text-slate-400">
          <div className={`h-3 w-3 rounded border ${toneClass(tone)}`} />
          {label}
        </div>
      ))}
    </div>
  );
}
