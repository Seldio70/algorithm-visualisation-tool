import type { AlgorithmDefinition, Step, ElementState, GraphEdge, VisualElement } from "../types";
import { finalStep } from "./helpers";
import { SHARED_GRAPH_EDGES, SHARED_GRAPH_LABELS, SHARED_GRAPH_LAYOUT, edgeId } from "./graphConfig";
import { GRAPH_LEGEND } from "../constants/legends";

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

function generateSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const start = Math.min(SHARED_GRAPH_LABELS.length - 1, Math.max(0, input[0] ?? 0));
  const visited = new Set<number>();
  const stack: number[] = [start];

  steps.push({
    id: stepId++,
    elements: makeGraphElements({ [start]: "current" }),
    edges: buildEdges({ [start]: "current" }),
    highlightedLines: [1, 2],
    explanation: `DFS explores as deep as possible before backtracking, using a stack (or recursion). Starting from node ${SHARED_GRAPH_LABELS[start]}.`,
    variables: { stack: SHARED_GRAPH_LABELS[start] },
    callStack: [`dfs(${SHARED_GRAPH_LABELS[start]})`],
  });

  while (stack.length > 0) {
    const node = stack.pop()!;
    if (visited.has(node)) continue;

    visited.add(node);
    const nodeStates: Record<number, ElementState> = {
      ...Object.fromEntries([...visited].map((v) => [v, "visited" as ElementState])),
      [node]: "current",
    };

    steps.push({
      id: stepId++,
      elements: makeGraphElements(nodeStates),
      edges: buildEdges(nodeStates),
      highlightedLines: [3, 4, 5],
      explanation: `Pop ${SHARED_GRAPH_LABELS[node]} from stack. Mark visited. Push unvisited neighbors.`,
      variables: { current: SHARED_GRAPH_LABELS[node], visited: [...visited].map((n) => SHARED_GRAPH_LABELS[n]).join(", ") },
      callStack: [`dfs(${SHARED_GRAPH_LABELS[node]})`],
    });

    const neighbors = SHARED_GRAPH_EDGES
      .flatMap(([a, b]) => (a === node ? [b] : b === node ? [a] : []))
      .filter((n) => !visited.has(n));

    for (const n of neighbors.reverse()) {
      stack.push(n);
      const pushStates: Record<number, ElementState> = {
        ...Object.fromEntries([...visited].map((v) => [v, "visited" as ElementState])),
        [n]: "highlight",
      };
      steps.push({
        id: stepId++,
        elements: makeGraphElements(pushStates),
        edges: buildEdges(pushStates, [node, n]),
        highlightedLines: [6, 7],
        explanation: `Push neighbor ${SHARED_GRAPH_LABELS[n]} onto stack for later exploration.`,
        variables: { pushed: SHARED_GRAPH_LABELS[n], stack: stack.map((x) => SHARED_GRAPH_LABELS[x]).join(", ") },
      });
    }
  }

  const finalStates = Object.fromEntries(SHARED_GRAPH_LABELS.map((_, i) => [i, "sorted" as ElementState]));
  steps.push({
    ...finalStep(
      stepId,
      makeGraphElements(finalStates),
      `✅ DFS completed. Visit order depends on stack ordering — goes deep before wide.`,
      "DFS uses less memory than BFS for deep graphs and is key for cycle detection, topological sort, and maze solving.",
      8
    ),
    edges: SHARED_GRAPH_EDGES.map(([a, b]) => ({ ...edgeId(a, b), state: "visited" as ElementState })),
  });

  return steps;
}

export const dfs: AlgorithmDefinition = {
  meta: {
    id: "dfs",
    name: "Depth-First Search",
    category: "Graph",
    difficulty: "Intermediate",
    layout: "graph",
    legend: GRAPH_LEGEND,
    graphLayout: SHARED_GRAPH_LAYOUT,
    timeComplexity: { best: "O(V+E)", average: "O(V+E)", worst: "O(V+E)" },
    spaceComplexity: "O(V)",
    description: "Explores as far as possible along each branch before backtracking. Uses a stack or recursion.",
    defaultInput: [0],
    code: `function dfs(graph, start) {\n  const stack = [start], visited = new Set();\n  while (stack.length) {\n    const node = stack.pop();\n    if (visited.has(node)) continue; visited.add(node);\n    for (const neighbor of graph[node])\n      if (!visited.has(neighbor)) stack.push(neighbor);\n}`,
  },
  generateSteps,
};
