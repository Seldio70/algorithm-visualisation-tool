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
  const stack: number[] = [0];

  steps.push({
    id: stepId++,
    elements: makeGraphElements({ 0: "current" }),
    highlightedLines: [1, 2],
    explanation: `DFS explores as deep as possible before backtracking, using a stack (or recursion). Starting from node A.`,
    variables: { stack: "A" },
    callStack: ["dfs(A)"],
  });

  while (stack.length > 0) {
    const node = stack.pop()!;
    if (visited.has(node)) continue;

    visited.add(node);
    steps.push({
      id: stepId++,
      elements: makeGraphElements({
        ...Object.fromEntries([...visited].map((v) => [v, "visited" as ElementState])),
        [node]: "current",
      }),
      highlightedLines: [3, 4],
      explanation: `Pop ${GRAPH.nodes[node]} from stack. Mark visited. Push unvisited neighbors.`,
      variables: { current: GRAPH.nodes[node], visited: [...visited].map((n) => GRAPH.nodes[n]).join(", ") },
      callStack: [`dfs(${GRAPH.nodes[node]})`],
    });

    const neighbors = GRAPH.edges
      .flatMap(([a, b]) => (a === node ? [b] : b === node ? [a] : []))
      .filter((n) => !visited.has(n));

    for (const n of neighbors.reverse()) {
      stack.push(n);
      steps.push({
        id: stepId++,
        elements: makeGraphElements({
          ...Object.fromEntries([...visited].map((v) => [v, "visited" as ElementState])),
          [n]: "highlight",
        }),
        highlightedLines: [5],
        explanation: `Push neighbor ${GRAPH.nodes[n]} onto stack for later exploration.`,
        variables: { pushed: GRAPH.nodes[n], stack: stack.map((x) => GRAPH.nodes[x]).join(", ") },
      });
    }
  }

  steps.push(
    finalStep(
      stepId,
      makeGraphElements(Object.fromEntries(GRAPH.nodes.map((_, i) => [i, "path" as ElementState]))),
      `✅ DFS completed. Visit order depends on stack ordering — goes deep before wide.`,
      "DFS uses less memory than BFS for deep graphs and is key for cycle detection, topological sort, and maze solving.",
      6
    )
  );

  return steps;
}

export const dfs: AlgorithmDefinition = {
  meta: {
    id: "dfs",
    name: "Depth-First Search",
    category: "Graph",
    difficulty: "Intermediate",
    layout: "graph",
    timeComplexity: { best: "O(V+E)", average: "O(V+E)", worst: "O(V+E)" },
    spaceComplexity: "O(V)",
    description: "Explores as far as possible along each branch before backtracking. Uses a stack or recursion.",
    defaultInput: [0],
    code: `function dfs(graph, node, visited = new Set()) {\n  visited.add(node);\n  for (const neighbor of graph[node]) {\n    if (!visited.has(neighbor)) dfs(graph, neighbor, visited);\n  }\n}`,
  },
  generateSteps,
};
