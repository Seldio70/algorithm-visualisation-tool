import type { AlgorithmDefinition, Step, ElementState, GraphEdge, VisualElement } from "../types";
import { finalStep } from "./helpers";
import { DIJKSTRA_EDGES, DIJKSTRA_GRAPH_LAYOUT, edgeId } from "./graphConfig";
import { DIJKSTRA_LEGEND } from "../constants/legends";

const LABELS = ["A", "B", "C", "D", "E"];
const DEFAULT_SOURCE = 0;
const DEFAULT_TARGET = 4;

function edgeKey(a: number, b: number): string {
  const { from, to } = edgeId(a, b);
  return from < to ? `${from}-${to}` : `${to}-${from}`;
}

function makeNodes(
  states: Record<number, ElementState>,
  dists: number[],
  pathStep?: Record<number, number>
): VisualElement[] {
  return LABELS.map((label, i) => ({
    id: `el-${i}`,
    value: dists[i] === Infinity ? "∞" : dists[i],
    label: pathStep?.[i] !== undefined ? `${pathStep[i]}. ${label}` : label,
    state: states[i] ?? "default",
  }));
}

function buildEdges(
  nodeStates: Record<number, ElementState>,
  activeEdge?: [number, number],
  pathEdgeKeys?: Set<string>
): GraphEdge[] {
  return DIJKSTRA_EDGES.map(([a, b, w]) => {
    const base = edgeId(a, b);
    const key = edgeKey(a, b);
    const edge: GraphEdge = { ...base, weight: w };

    if (pathEdgeKeys?.has(key)) {
      edge.state = "path";
    } else if (activeEdge && ((activeEdge[0] === a && activeEdge[1] === b) || (activeEdge[0] === b && activeEdge[1] === a))) {
      edge.state = "highlight";
    } else if (nodeStates[a] === "visited" && nodeStates[b] === "visited") {
      edge.state = "visited";
    } else {
      edge.state = "default";
    }
    return edge;
  });
}

function reconstructPath(parent: (number | null)[], target: number): number[] {
  const path: number[] = [];
  let cur: number | null = target;
  while (cur !== null) {
    path.unshift(cur);
    cur = parent[cur];
  }
  return path;
}

function pathEdgesFromNodes(path: number[]): Set<string> {
  const keys = new Set<string>();
  for (let i = 0; i < path.length - 1; i++) {
    keys.add(edgeKey(path[i], path[i + 1]));
  }
  return keys;
}

function routeStates(
  visited: Set<number>,
  route: number[],
  current: number,
  highlighted?: number
): Record<number, ElementState> {
  const states: Record<number, ElementState> = Object.fromEntries(
    [...visited].map((node) => [node, "visited" as ElementState])
  );
  route.forEach((node) => {
    states[node] = "path";
  });
  states[current] = "current";
  if (highlighted !== undefined) states[highlighted] = "highlight";
  return states;
}

function generateSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const SOURCE = Math.min(LABELS.length - 1, Math.max(0, input[0] ?? DEFAULT_SOURCE));
  const TARGET = Math.min(LABELS.length - 1, Math.max(0, input[1] ?? DEFAULT_TARGET));
  const dist = LABELS.map(() => Infinity);
  const parent: (number | null)[] = LABELS.map(() => null);
  const visited = new Set<number>();
  dist[SOURCE] = 0;
  parent[SOURCE] = null;

  steps.push({
    id: stepId++,
    elements: makeNodes({ [SOURCE]: "current" }, dist),
    edges: buildEdges({ [SOURCE]: "current" }),
    highlightedLines: [1, 2],
    explanation: `Dijkstra's finds shortest paths from source ${LABELS[SOURCE]} to all nodes. Initialize distances to ∞, set ${LABELS[SOURCE]} = 0.`,
    variables: { source: LABELS[SOURCE], target: LABELS[TARGET] },
  });

  while (visited.size < LABELS.length) {
    let u = -1;
    let minDist = Infinity;
    for (let i = 0; i < LABELS.length; i++) {
      if (!visited.has(i) && dist[i] < minDist) {
        minDist = dist[i];
        u = i;
      }
    }
    if (u === -1) break;
    visited.add(u);

    const currentRoute = reconstructPath(parent, u);
    const pickStates = routeStates(visited, currentRoute, u);
    const currentRouteLabels = currentRoute.map((node) => LABELS[node]).join(" → ");

    steps.push({
      id: stepId++,
      elements: makeNodes(pickStates, dist),
      edges: buildEdges(pickStates, undefined, pathEdgesFromNodes(currentRoute)),
      highlightedLines: [3, 4],
      explanation: `Pick unvisited node ${LABELS[u]} with smallest distance (${dist[u]}). The green route shows the best path currently known to it.`,
      variables: { current: LABELS[u], distance: dist[u], route: currentRouteLabels },
      pointers: [{ name: LABELS[u], targetId: `el-${u}` }],
    });

    for (const [a, b, w] of DIJKSTRA_EDGES) {
      const v = a === u ? b : b === u ? a : -1;
      if (v === -1 || visited.has(v)) continue;
      const alt = dist[u] + w;
      if (alt < dist[v]) {
        dist[v] = alt;
        parent[v] = u;
        const tentativeRoute = reconstructPath(parent, v);
        const tentativeRouteLabels = tentativeRoute.map((node) => LABELS[node]).join(" → ");
        const relaxStates = routeStates(visited, tentativeRoute, u, v);
        steps.push({
          id: stepId++,
          elements: makeNodes(relaxStates, dist),
          edges: buildEdges(relaxStates, undefined, pathEdgesFromNodes(tentativeRoute)),
          highlightedLines: [5, 6],
          explanation: `Relax edge ${LABELS[u]}→${LABELS[v]} (weight ${w}). The green route is now the best known path to ${LABELS[v]}, with distance ${alt}.`,
          variables: {
            edge: `${LABELS[u]}→${LABELS[v]}`,
            weight: w,
            newDist: alt,
            route: tentativeRouteLabels,
          },
        });
      }
    }
  }

  const shortestPath = reconstructPath(parent, TARGET);
  const pathEdgeKeys = pathEdgesFromNodes(shortestPath);
  const pathStep: Record<number, number> = {};
  shortestPath.forEach((node, i) => {
    pathStep[node] = i + 1;
  });

  const pathLabels = shortestPath.map((n) => LABELS[n]).join(" → ");
  const pathCost = dist[TARGET];

  const finalNodeStates: Record<number, ElementState> = Object.fromEntries(
    LABELS.map((_, i) => [i, shortestPath.includes(i) ? ("path" as ElementState) : ("visited" as ElementState)])
  );

  steps.push({
    id: stepId++,
    elements: makeNodes(finalNodeStates, dist, pathStep),
    edges: buildEdges(finalNodeStates, undefined, pathEdgeKeys),
    highlightedLines: [7],
    explanation: `Shortest path ${LABELS[SOURCE]} → ${LABELS[TARGET]}: ${pathLabels} (total cost ${pathCost}). Only this route is highlighted — other nodes show final distances.`,
    variables: { path: pathLabels, cost: pathCost },
  });

  steps.push({
    ...finalStep(
      stepId,
      makeNodes(finalNodeStates, dist, pathStep),
      `✅ Shortest distances from ${LABELS[SOURCE]}: ${LABELS.map((l, i) => `${l}=${dist[i]}`).join(", ")}. Path to ${LABELS[TARGET]}: ${pathLabels} (${pathCost}).`,
      "Dijkstra's powers GPS navigation and network routing. It requires non-negative weights — use Bellman-Ford for negative edges.",
      8
    ),
    edges: buildEdges(finalNodeStates, undefined, pathEdgeKeys),
  });

  return steps;
}

export const dijkstra: AlgorithmDefinition = {
  meta: {
    id: "dijkstra",
    name: "Dijkstra's Algorithm",
    category: "Graph",
    difficulty: "Advanced",
    layout: "graph",
    legend: DIJKSTRA_LEGEND,
    graphLayout: DIJKSTRA_GRAPH_LAYOUT,
    timeComplexity: { best: "O(E log V)", average: "O(E log V)", worst: "O(V²)" },
    spaceComplexity: "O(V)",
    description: "Finds shortest paths from a source node to all other nodes in a weighted graph with non-negative edges.",
    defaultInput: [0, 4],
    code: `function dijkstra(graph, source) {\n  initialize(dist, parent, source);\n  while (unvisited.size) {\n    const u = minDist(unvisited, dist);\n    for (const [v, weight] of graph[u])\n      if (dist[u] + weight < dist[v]) update(dist, parent, u, v);\n  } // reconstruct the requested shortest path\n  return { dist, parent };\n}`,
  },
  generateSteps,
};
