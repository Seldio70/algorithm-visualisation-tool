import type { AlgorithmDefinition, Step, ElementState } from "../types";
import { finalStep } from "./helpers";

const GRAPH = {
  nodes: ["A", "B", "C", "D", "E", "F"],
  edges: [
    [0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [4, 5],
  ],
};

function makeGraphElements(states: Record<number, ElementState>) {
  return GRAPH.nodes.map((label, i) => ({
    id: `el-${i}`,
    value: i,
    label,
    state: states[i] ?? "default",
  }));
}

function generateSteps(_input: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const visited = new Set<number>();
  const queue: number[] = [0];
  const parent: Record<number, number> = {};

  steps.push({
    id: stepId++,
    elements: makeGraphElements({ 0: "current" }),
    highlightedLines: [1, 2],
    explanation: `BFS explores a graph level by level using a queue. Starting from node A (index 0).`,
    variables: { queue: "A", visited: "A" },
  });

  visited.add(0);

  while (queue.length > 0) {
    const node = queue.shift()!;

    steps.push({
      id: stepId++,
      elements: makeGraphElements({
        ...Object.fromEntries([...visited].map((v) => [v, "visited" as ElementState])),
        [node]: "current",
      }),
      highlightedLines: [3, 4],
      explanation: `Dequeue node ${GRAPH.nodes[node]}. Visit all unvisited neighbors.`,
      variables: { current: GRAPH.nodes[node], queueSize: queue.length },
    });

    for (const [a, b] of GRAPH.edges) {
      const neighbor = a === node ? b : b === node ? a : -1;
      if (neighbor === -1 || visited.has(neighbor)) continue;

      visited.add(neighbor);
      parent[neighbor] = node;
      queue.push(neighbor);

      steps.push({
        id: stepId++,
        elements: makeGraphElements({
          ...Object.fromEntries([...visited].map((v) => [v, "visited" as ElementState])),
          [neighbor]: "highlight",
        }),
        highlightedLines: [5, 6],
        explanation: `Discover neighbor ${GRAPH.nodes[neighbor]} from ${GRAPH.nodes[node]}. Enqueue it.`,
        variables: { discovered: GRAPH.nodes[neighbor], queue: queue.map((n) => GRAPH.nodes[n]).join(", ") },
      });
    }
  }

  steps.push(
    finalStep(
      stepId,
      makeGraphElements(Object.fromEntries(GRAPH.nodes.map((_, i) => [i, "path" as ElementState]))),
      `✅ BFS visited all reachable nodes in level order: ${GRAPH.nodes.join(" → ")}.`,
      "BFS finds shortest paths in unweighted graphs. It's the foundation of maze solving, social network degrees, and GPS routing.",
      7
    )
  );

  return steps;
}

export const bfs: AlgorithmDefinition = {
  meta: {
    id: "bfs",
    name: "Breadth-First Search",
    category: "Graph",
    difficulty: "Intermediate",
    layout: "graph",
    timeComplexity: { best: "O(V+E)", average: "O(V+E)", worst: "O(V+E)" },
    spaceComplexity: "O(V)",
    description: "Explores a graph level by level using a queue. Finds shortest paths in unweighted graphs.",
    defaultInput: [0],
    code: `function bfs(graph, start) {\n  const queue = [start];\n  const visited = new Set([start]);\n  while (queue.length) {\n    const node = queue.shift();\n    for (const neighbor of graph[node]) {\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        queue.push(neighbor);\n      }\n    }\n  }\n}`,
  },
  generateSteps,
};
