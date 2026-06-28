import type { AlgorithmDefinition, Step, ElementState } from "../../types";
import { makeGridElements, finalStep } from "../helpers";
import { MAZE_LEGEND } from "../../constants/legends";

const COLS = 7;
// 0=path, 1=wall, 2=start, 3=goal
const MAZE = [
  1, 1, 1, 1, 1, 1, 1,
  1, 2, 0, 1, 0, 0, 1,
  1, 1, 0, 1, 0, 1, 1,
  1, 0, 0, 0, 0, 0, 1,
  1, 0, 1, 1, 1, 3, 1,
  1, 1, 1, 1, 1, 1, 1,
];

function generateSteps(): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const grid = [...MAZE];
  const start = grid.indexOf(2);
  const goal = grid.indexOf(3);
  const visited = new Set<number>();
  const queue: number[] = [start];
  const parent: Record<number, number> = {};

  steps.push({
    id: stepId++,
    elements: makeGridElements(grid, COLS, { [start]: "current", [goal]: "highlight" }),
    highlightedLines: [1, 2],
    explanation: `BFS on a maze grid finds the shortest path from start (S) to goal (G). Explore level by level — guarantees shortest path in unweighted grids.`,
    variables: { start, goal },
  });

  visited.add(start);

  while (queue.length > 0) {
    const idx = queue.shift()!;
    if (idx === goal) break;

    const row = Math.floor(idx / COLS);
    const col = idx % COLS;

    steps.push({
      id: stepId++,
      elements: makeGridElements(
        grid,
        COLS,
        {
          ...Object.fromEntries([...visited].map((v) => [v, "visited" as ElementState])),
          [idx]: "current",
          [goal]: "highlight",
        }
      ),
      highlightedLines: [4, 5],
      explanation: `Dequeue cell (${row},${col}). Check all 4 neighbors for paths (0) or goal.`,
      variables: { row, col, queueSize: queue.length },
    });

    for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
      const nr = row + dr;
      const nc = col + dc;
      const nIdx = nr * COLS + nc;
      if (nr < 0 || nc < 0 || nr >= 6 || nc >= COLS) continue;
      if (grid[nIdx] === 1 || visited.has(nIdx)) continue;

      visited.add(nIdx);
      parent[nIdx] = idx;
      queue.push(nIdx);

      steps.push({
        id: stepId++,
        elements: makeGridElements(
          grid,
          COLS,
          {
            ...Object.fromEntries([...visited].map((v) => [v, "visited" as ElementState])),
            [nIdx]: "comparing",
            [goal]: "highlight",
          }
        ),
        highlightedLines: [7, 8],
        explanation: `Discover (${nr},${nc}). Enqueue for later. ${nIdx === goal ? "Reached the goal!" : "Keep exploring."}`,
        variables: { discovered: `(${nr},${nc})` },
      });
    }
  }

  const path = new Set<number>();
  let cur = goal;
  while (cur !== undefined) {
    path.add(cur);
    cur = parent[cur];
  }

  steps.push(
    finalStep(
      stepId,
      makeGridElements(
        grid,
        COLS,
        Object.fromEntries(grid.map((_, i) => [
          i,
          path.has(i) ? "path" as ElementState : grid[i] === 1 ? "default" as ElementState : "visited" as ElementState,
        ]))
      ),
      `✅ Shortest path found via BFS! Green cells show the optimal route through the maze.`,
      "so_long and cub3d use this exact pattern for map validation and pathfinding. BFS on grids is one of the most practical algorithms at 42.",
      6
    )
  );

  return steps;
}

export const bfsMaze: AlgorithmDefinition = {
  meta: {
    id: "bfs-maze",
    name: "BFS Maze Pathfinding",
    category: "42 Tirana",
    difficulty: "Intermediate",
    layout: "grid",
    gridVariant: "maze",
    legend: MAZE_LEGEND,
    gridCols: 7,
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(n)",
    description: "Finds the shortest path through a maze using BFS on a 2D grid.",
    defaultInput: [0],
    accent: "violet",
    fortyTwoNote: "so_long map validation, cub3d raycasting prep.",
    code: `function bfsMaze(grid, start, goal) {\n  const queue = [start];\n  const visited = new Set([start]);\n  while (queue.length) {\n    const cell = queue.shift();\n    if (cell === goal) return reconstructPath();\n    for (const neighbor of getNeighbors(cell))\n      if (!visited.has(neighbor)) queue.push(neighbor);\n  }\n}`,
  },
  generateSteps,
};
