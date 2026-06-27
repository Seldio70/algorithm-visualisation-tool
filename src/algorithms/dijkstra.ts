import type { AlgorithmDefinition, Step, ElementState } from "../types";
import { finalStep } from "./helpers";

const NODES = [
  { id: 0, label: "A", dist: Infinity },
  { id: 1, label: "B", dist: Infinity },
  { id: 2, label: "C", dist: Infinity },
  { id: 3, label: "D", dist: Infinity },
  { id: 4, label: "E", dist: Infinity },
];

const EDGES: [number, number, number][] = [
  [0, 1, 4], [0, 2, 2], [1, 2, 1], [1, 3, 5], [2, 3, 8], [2, 4, 10], [3, 4, 2],
];

function makeNodes(states: Record<number, ElementState>, dists: number[]) {
  return NODES.map((n, i) => ({
    id: `el-${i}`,
    value: dists[i] === Infinity ? "∞" : dists[i],
    label: n.label,
    state: states[i] ?? "default",
  }));
}

function generateSteps(_input: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const dist = NODES.map(() => Infinity);
  const visited = new Set<number>();
  dist[0] = 0;

  steps.push({
    id: stepId++,
    elements: makeNodes({ 0: "current" }, dist),
    highlightedLines: [1, 2],
    explanation: `Dijkstra's finds shortest paths from source A to all nodes in a weighted graph. Initialize all distances to ∞, source to 0.`,
    variables: { source: "A", distA: 0 },
  });

  while (visited.size < NODES.length) {
    let u = -1;
    let minDist = Infinity;
    for (let i = 0; i < NODES.length; i++) {
      if (!visited.has(i) && dist[i] < minDist) {
        minDist = dist[i];
        u = i;
      }
    }
    if (u === -1) break;
    visited.add(u);

    steps.push({
      id: stepId++,
      elements: makeNodes(
        { ...Object.fromEntries([...visited].map((v) => [v, "visited" as ElementState])), [u]: "current" },
        dist
      ),
      highlightedLines: [3, 4],
      explanation: `Pick unvisited node ${NODES[u].label} with smallest distance (${dist[u]}). Relax its edges.`,
      variables: { current: NODES[u].label, distance: dist[u] },
    });

    for (const [a, b, w] of EDGES) {
      const v = a === u ? b : b === u ? a : -1;
      if (v === -1 || visited.has(v)) continue;
      const alt = dist[u] + w;
      if (alt < dist[v]) {
        dist[v] = alt;
        steps.push({
          id: stepId++,
          elements: makeNodes({ [v]: "highlight", [u]: "current" }, dist),
          highlightedLines: [5, 6],
          explanation: `Relax edge ${NODES[u].label}→${NODES[v].label} (weight ${w}). New distance to ${NODES[v].label}: ${alt}.`,
          variables: { edge: `${NODES[u].label}→${NODES[v].label}`, weight: w, newDist: alt },
        });
      }
    }
  }

  steps.push(
    finalStep(
      stepId,
      makeNodes(Object.fromEntries(NODES.map((_, i) => [i, "path" as ElementState])), dist),
      `✅ Shortest distances from A: ${NODES.map((n, i) => `${n.label}=${dist[i]}`).join(", ")}.`,
      "Dijkstra's powers GPS navigation and network routing. It requires non-negative weights — use Bellman-Ford for negative edges.",
      7
    )
  );

  return steps;
}

export const dijkstra: AlgorithmDefinition = {
  meta: {
    id: "dijkstra",
    name: "Dijkstra's Algorithm",
    category: "Graph",
    difficulty: "Advanced",
    layout: "graph",
    timeComplexity: { best: "O(E log V)", average: "O(E log V)", worst: "O(V²)" },
    spaceComplexity: "O(V)",
    description: "Finds shortest paths from a source node to all other nodes in a weighted graph with non-negative edges.",
    defaultInput: [0],
    code: `function dijkstra(graph, source) {\n  const dist = {};\n  dist[source] = 0;\n  while (unvisited.size) {\n    const u = minDist(unvisited, dist);\n    for (const [v, w] of graph[u]) {\n      if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;\n    }\n  }\n}`,
  },
  generateSteps,
};
