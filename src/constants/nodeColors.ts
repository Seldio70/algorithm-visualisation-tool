import type { ElementState, GraphEdge } from "../types";

export const STATE_NODE_FILL: Record<ElementState, string> = {
  default: "#334155",
  comparing: "#f59e0b",
  swapping: "#f43f5e",
  sorted: "#10b981",
  pivot: "#a855f7",
  current: "#06b6d4",
  visited: "#475569",
  path: "#34d399",
  highlight: "#0ea5e9",
  min: "#f97316",
  inserting: "#8b5cf6",
};

export const STATE_NODE_STROKE: Record<ElementState, string> = {
  default: "#475569",
  comparing: "#fbbf24",
  swapping: "#fb7185",
  sorted: "#34d399",
  pivot: "#c084fc",
  current: "#22d3ee",
  visited: "#64748b",
  path: "#6ee7b7",
  highlight: "#38bdf8",
  min: "#fb923c",
  inserting: "#a78bfa",
};

export function edgeId(from: number, to: number): GraphEdge {
  return { from: `el-${from}`, to: `el-${to}` };
}

export function edgeIdStr(from: string, to: string, state: ElementState, weight?: number): GraphEdge {
  return { from, to, state, weight };
}
