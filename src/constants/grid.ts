import { STATE_STYLES } from "./theme";

export const GRID_WALL = "bg-slate-900 border-slate-700";
export const GRID_FLOOR = "bg-slate-700 border-slate-600";
export const GRID_START = "bg-slate-800 border-cyan-400 ring-1 ring-cyan-400/50";
export const GRID_GOAL = "bg-slate-800 border-emerald-400 ring-1 ring-emerald-400/50";

export const GRID_LEGEND = [
  { swatch: GRID_WALL, label: "Wall" },
  { swatch: GRID_FLOOR, label: "Open" },
  { swatch: GRID_START, label: "Start (S)" },
  { swatch: GRID_GOAL, label: "Goal (G)" },
  { swatch: STATE_STYLES.visited, label: "Visited" },
  { swatch: STATE_STYLES.path, label: "Path" },
];
