import type { AlgorithmDefinition, Step, ElementState, GraphEdge, VisualElement } from "../types";
import { finalStep } from "./helpers";
import { SHARED_GRAPH_EDGES, SHARED_GRAPH_LABELS, SHARED_GRAPH_LAYOUT, edgeId } from "./graphConfig";

function makeGraphElements(states: Record<number, ElementState>): VisualElement[] {
  return SHARED_GRAPH_LABELS.map((label, i) => ({
    id: `el-${i}`,
    value: i,
    label,
    state: states[i] ?? "default",
  }));
}

function buildEdges(nodeStates: Record<number, ElementState>, activeEdge?: [number, number]): GraphEdge[] {
  return SHARED_GRAPH_EDGES.map(([a, b]) => {
    if (activeEdge && ((activeEdge[0] === a && activeEdge[1] === b) || (activeEdge[0] === b && activeEdge[1] === a))) {
      return { ...edgeId(a, b), state: "highlight" as ElementState };
    }
    const aDone = nodeStates[a] === "visited" || nodeStates[a] === "path" || nodeStates[a] === "current";
    const bDone = nodeStates[b] === "visited" || nodeStates[b] === "path" || nodeStates[b] === "current";
    if (aDone && bDone) return { ...edgeId(a, b), state: "visited" as ElementState };
    return { ...edgeId(a, b), state: "default" as ElementState };
  });
}

function generateSteps(_input: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const visited = new Set<number>();
  const queue: number[] = [0];

  steps.push({
    id: stepId++,
    elements: makeGraphElements({ 0: "current" }),
    edges: buildEdges({ 0: "current" }),
    highlightedLines: [1, 2],
    explanation: `BFS explores a graph level by level using a queue. Starting from node A (index 0).`,
    variables: { queue: "A", visited: "A" },
  });

  visited.add(0);

  while (queue.length > 0) {
    const node = queue.shift()!;
    const nodeStates: Record<number, ElementState> = {
      ...Object.fromEntries([...visited].map((v) => [v, "visited" as ElementState])),
      [node]: "current",
    };

    steps.push({
      id: stepId++,
      elements: makeGraphElements(nodeStates),
      edges: buildEdges(nodeStates),
      highlightedLines: [3, 4],
      explanation: `Dequeue node ${SHARED_GRAPH_LABELS[node]}. Visit all unvisited neighbors.`,
      variables: { current: SHARED_GRAPH_LABELS[node], queueSize: queue.length },
    });

    for (const [a, b] of SHARED_GRAPH_EDGES) {
      const neighbor = a === node ? b : b === node ? a : -1;
      if (neighbor === -1 || visited.has(neighbor)) continue;

      visited.add(neighbor);
      queue.push(neighbor);

      const discoverStates: Record<number, ElementState> = {
        ...Object.fromEntries([...visited].map((v) => [v, "visited" as ElementState])),
        [neighbor]: "highlight",
      };

      steps.push({
        id: stepId++,
        elements: makeGraphElements(discoverStates),
        edges: buildEdges(discoverStates, [node, neighbor]),
        highlightedLines: [5, 6],
        explanation: `Discover neighbor ${SHARED_GRAPH_LABELS[neighbor]} from ${SHARED_GRAPH_LABELS[node]}. Enqueue it.`,
        variables: { discovered: SHARED_GRAPH_LABELS[neighbor], queue: queue.map((n) => SHARED_GRAPH_LABELS[n]).join(", ") },
      });
    }
  }

  const finalStates = Object.fromEntries(SHARED_GRAPH_LABELS.map((_, i) => [i, "path" as ElementState]));
  steps.push({
    ...finalStep(
      stepId,
      makeGraphElements(finalStates),
      `✅ BFS visited all reachable nodes in level order: ${SHARED_GRAPH_LABELS.join(" → ")}.`,
      "BFS finds shortest paths in unweighted graphs. It's the foundation of maze solving, social network degrees, and GPS routing.",
      7
    ),
    edges: SHARED_GRAPH_EDGES.map(([a, b]) => ({ ...edgeId(a, b), state: "path" as ElementState })),
  });

  return steps;
}

export const bfs: AlgorithmDefinition = {
  meta: {
    id: "bfs",
    name: "Breadth-First Search",
    category: "Graph",
    difficulty: "Intermediate",
    layout: "graph",
    graphLayout: SHARED_GRAPH_LAYOUT,
    timeComplexity: { best: "O(V+E)", average: "O(V+E)", worst: "O(V+E)" },
    spaceComplexity: "O(V)",
    description: "Explores a graph level by level using a queue. Finds shortest paths in unweighted graphs.",
    defaultInput: [0],
    code: `function bfs(graph, start) {\n  const queue = [start];\n  const visited = new Set([start]);\n  while (queue.length) {\n    const node = queue.shift();\n    for (const neighbor of graph[node]) {\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        queue.push(neighbor);\n      }\n    }\n  }\n}`,
  },
  generateSteps,
};
