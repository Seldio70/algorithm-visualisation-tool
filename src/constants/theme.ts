import type { ElementState, ThemeAccent } from "../types";

export const STATE_STYLES: Record<ElementState, string> = {
  default: "bg-slate-700 border-slate-600",
  comparing: "bg-amber-500 border-amber-400 shadow-amber-500/50 shadow-lg",
  swapping: "bg-rose-500 border-rose-400 shadow-rose-500/50 shadow-lg",
  sorted: "bg-emerald-500 border-emerald-400",
  pivot: "bg-purple-500 border-purple-400 shadow-purple-500/50 shadow-lg",
  current: "bg-cyan-500 border-cyan-400 shadow-cyan-500/50 shadow-lg",
  visited: "bg-slate-600 border-slate-500 opacity-40",
  path: "bg-emerald-400 border-emerald-300 shadow-emerald-400/50 shadow-lg",
  highlight: "bg-sky-500 border-sky-400",
  min: "bg-orange-500 border-orange-400 shadow-orange-500/50 shadow-lg",
  inserting: "bg-violet-500 border-violet-400",
};

export const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: "text-emerald-400 bg-emerald-400/10",
  Intermediate: "text-amber-400 bg-amber-400/10",
  Advanced: "text-rose-400 bg-rose-400/10",
};

export const LEGEND: { state: ElementState; label: string }[] = [
  { state: "comparing", label: "Comparing" },
  { state: "swapping", label: "Swapping" },
  { state: "sorted", label: "Sorted" },
  { state: "current", label: "Current / Found" },
  { state: "visited", label: "Eliminated" },
  { state: "min", label: "Minimum" },
];

export const ACCENT: Record<
  ThemeAccent,
  {
    primary: string;
    primaryHover: string;
    text: string;
    bg: string;
    border: string;
    progress: string;
    pointer: string;
    codeHighlight: string;
    codeText: string;
    ring: string;
    slider: string;
  }
> = {
  cyan: {
    primary: "bg-cyan-500 hover:bg-cyan-400",
    primaryHover: "hover:bg-cyan-400",
    text: "text-cyan-300",
    bg: "bg-cyan-500/15",
    border: "border-cyan-500/30",
    progress: "bg-cyan-500",
    pointer: "text-cyan-400",
    codeHighlight: "bg-cyan-500/20 border-cyan-400",
    codeText: "text-cyan-200",
    ring: "bg-cyan-500/20 border-cyan-500/40",
    slider: "accent-cyan-500",
  },
  violet: {
    primary: "bg-violet-500 hover:bg-violet-400",
    primaryHover: "hover:bg-violet-400",
    text: "text-violet-300",
    bg: "bg-violet-500/15",
    border: "border-violet-500/30",
    progress: "bg-violet-500",
    pointer: "text-violet-400",
    codeHighlight: "bg-violet-500/20 border-violet-400",
    codeText: "text-violet-200",
    ring: "bg-violet-500/20 border-violet-500/40",
    slider: "accent-violet-500",
  },
};

export const CATEGORY_ORDER: string[] = [
  "Sorting",
  "Searching",
  "Graph",
  "Tree",
  "Classic",
  "42 Tirana",
];
