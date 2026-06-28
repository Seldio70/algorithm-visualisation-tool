import type { AlgorithmDefinition, Step, ElementState } from "../../types";
import { makeGridElements, finalStep } from "../helpers";
import { FLOOD_FILL_LEGEND } from "../../constants/legends";

const COLS = 6;
const GRID = [
  1, 1, 1, 1, 1, 1,
  1, 0, 0, 0, 0, 1,
  1, 0, 1, 1, 0, 1,
  1, 0, 0, 0, 0, 1,
  1, 1, 1, 1, 1, 1,
];

function generateSteps(): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const colors = [...GRID];
  const startRow = 1;
  const startCol = 1;
  const newColor = 2;
  const oldColor = 0;
  const startIdx = startRow * COLS + startCol;

  steps.push({
    id: stepId++,
    elements: makeGridElements(colors, COLS, { [startIdx]: "current" }),
    highlightedLines: [1],
    explanation: `Flood Fill replaces all connected pixels of the same color starting from (${startRow},${startCol}). Like the paint bucket tool in graphics editors.`,
    variables: { startRow, startCol, oldColor, newColor },
    pointers: [{ name: "start", targetId: `el-${startIdx}` }],
  });

  const queue: number[] = [startIdx];
  colors[startIdx] = newColor;

  while (queue.length > 0) {
    const idx = queue.shift()!;
    const row = Math.floor(idx / COLS);
    const col = idx % COLS;

    for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
      const nr = row + dr;
      const nc = col + dc;
      const nIdx = nr * COLS + nc;
      if (nr < 0 || nc < 0 || nr >= 5 || nc >= COLS) continue;
      if (colors[nIdx] !== oldColor) continue;

      colors[nIdx] = newColor;
      queue.push(nIdx);

      const states: Record<number, ElementState> = {};
      colors.forEach((c, i) => {
        if (c === newColor) states[i] = i === nIdx ? "highlight" : "visited";
        else if (c === 1) states[i] = "default";
      });

      steps.push({
        id: stepId++,
        elements: makeGridElements(colors, COLS, states),
        highlightedLines: [3, 4, 5, 6, 7],
        explanation: `Fill neighbor (${nr},${nc}). Check 4 directions: up, down, left, right. Skip walls (1) and already-filled cells.`,
        variables: { row: nr, col: nc, queueSize: queue.length },
        pointers: [{ name: "fill", targetId: `el-${nIdx}` }],
      });
    }
  }

  const finalStates = Object.fromEntries(
    colors.map((c, i) => [i, c === newColor ? "default" as ElementState : c === 1 ? "default" as ElementState : "visited" as ElementState])
  );

  steps.push(
    finalStep(
      stepId,
      makeGridElements(colors, COLS, finalStates),
      `✅ Flood fill complete. All connected 0-cells replaced with color ${newColor}.`,
      "Flood fill appears in FdF (wireframe rendering) and game map parsing. It's DFS/BFS on a 2D grid — same pattern as so_long map validation.",
      9
    )
  );

  return steps;
}

export const floodFill: AlgorithmDefinition = {
  meta: {
    id: "flood-fill",
    name: "Flood Fill",
    category: "42 Tirana",
    difficulty: "Intermediate",
    layout: "grid",
    gridVariant: "fill",
    legend: FLOOD_FILL_LEGEND,
    gridCols: 6,
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(n)",
    description: "Fills all connected cells of the same color on a 2D grid, starting from a seed pixel.",
    defaultInput: [0],
    accent: "violet",
    fortyTwoNote: "FdF rendering, so_long map flood-fill validation.",
    code: `function floodFill(grid, start, oldColor, newColor) {\n  const queue = [start], visited = new Set([start]);\n  while (queue.length) {\n    const cell = queue.shift();\n    grid[cell.row][cell.col] = newColor;\n    for (const neighbor of getFourNeighbors(cell))\n      if (matches(neighbor, oldColor, visited)) queue.push(neighbor);\n  }\n}`,
  },
  generateSteps,
};
