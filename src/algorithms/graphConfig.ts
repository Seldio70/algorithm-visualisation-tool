import type { GraphLayout } from "../types";

/** Shared 6-node graph used by BFS, DFS, and Dijkstra visualizations. */
export const SHARED_GRAPH_LAYOUT: GraphLayout = {
  nodes: [
    { id: "el-0", x: 50, y: 12 },
    { id: "el-1", x: 22, y: 42 },
    { id: "el-2", x: 78, y: 42 },
    { id: "el-3", x: 10, y: 78 },
    { id: "el-4", x: 38, y: 78 },
    { id: "el-5", x: 72, y: 78 },
  ],
  edges: [
    { from: "el-0", to: "el-1" },
    { from: "el-0", to: "el-2" },
    { from: "el-1", to: "el-3" },
    { from: "el-2", to: "el-3" },
    { from: "el-2", to: "el-4" },
    { from: "el-3", to: "el-5" },
    { from: "el-4", to: "el-5" },
  ],
};

export const SHARED_GRAPH_EDGES: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [4, 5],
];

export const SHARED_GRAPH_LABELS = ["A", "B", "C", "D", "E", "F"];

export function edgeKey(a: string, b: string): string {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

export function edgeId(from: number, to: number): { from: string; to: string } {
  return { from: `el-${from}`, to: `el-${to}` };
}

export function nodeEdgeId(fromIdx: number, toIdx: number): { from: string; to: string } {
  return edgeId(fromIdx, toIdx);
}

/** Dijkstra demo graph (5 nodes A–E). */
export const DIJKSTRA_GRAPH_LAYOUT: GraphLayout = {
  nodes: [
    { id: "el-0", x: 50, y: 14 },
    { id: "el-1", x: 22, y: 44 },
    { id: "el-2", x: 78, y: 44 },
    { id: "el-3", x: 32, y: 78 },
    { id: "el-4", x: 68, y: 78 },
  ],
  edges: [
    { from: "el-0", to: "el-1" },
    { from: "el-0", to: "el-2" },
    { from: "el-1", to: "el-2" },
    { from: "el-1", to: "el-3" },
    { from: "el-2", to: "el-3" },
    { from: "el-2", to: "el-4" },
    { from: "el-3", to: "el-4" },
  ],
};

export const DIJKSTRA_EDGES: [number, number, number][] = [
  [0, 1, 4], [0, 2, 2], [1, 2, 1], [1, 3, 5], [2, 3, 8], [2, 4, 10], [3, 4, 2],
];
