import type { AlgorithmDefinition, Step, ElementState } from "../types";
import { makeElements, finalStep } from "./helpers";
import { QUICK_LEGEND } from "../constants/legends";

function generateSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const arr = [...input];

  steps.push({
    id: stepId++,
    elements: makeElements(arr),
    highlightedLines: [1],
    explanation: `Quick Sort picks a pivot, partitions elements smaller/larger than pivot, then recurses on each side. Average O(n log n), but worst case O(n²).`,
    variables: { length: arr.length },
  });

  function partition(lo: number, hi: number): number {
    const pivot = arr[hi];
    steps.push({
      id: stepId++,
      elements: makeElements(arr, { ...rangeState(lo, hi, "default"), [hi]: "pivot" }),
      highlightedLines: [2],
      explanation: `Partition [${lo}..${hi}]. Pivot = arr[${hi}] = ${pivot}. All elements ≤ pivot go left.`,
      variables: { lo, hi, pivot },
      pointers: [{ name: "pivot", targetId: `el-${hi}` }],
    });

    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      steps.push({
        id: stepId++,
        elements: makeElements(arr, {
          ...rangeState(lo, hi, "default"),
          [hi]: "pivot",
          [j]: "comparing",
          ...(i >= lo ? { [i]: "current" } : {}),
        }),
        highlightedLines: [3, 4],
        explanation: `Compare arr[${j}]=${arr[j]} with pivot ${pivot}. ${arr[j] <= pivot ? "≤ pivot → swap to left partition." : "> pivot → skip."}`,
        variables: { i, j, pivot },
        pointers: [
          { name: "j", targetId: `el-${j}` },
          { name: "pivot", targetId: `el-${hi}` },
        ],
      });

      if (arr[j] <= pivot) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          steps.push({
            id: stepId++,
            elements: makeElements(arr, { [i]: "swapping", [j]: "swapping", [hi]: "pivot" }),
            highlightedLines: [5],
            explanation: `Swap arr[${i}] and arr[${j}].`,
            variables: { i, j },
          });
        }
      }
    }

    [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
    const pivotIdx = i + 1;

    steps.push({
      id: stepId++,
      elements: makeElements(arr, { [pivotIdx]: "sorted" }),
      highlightedLines: [6],
      explanation: `Pivot ${pivot} placed at index ${pivotIdx}. Left side ≤ pivot, right side > pivot.`,
      variables: { pivotIdx, pivot },
      pointers: [{ name: "pivot", targetId: `el-${pivotIdx}` }],
    });

    return pivotIdx;
  }

  function quickSort(lo: number, hi: number): void {
    if (lo >= hi) return;
    const p = partition(lo, hi);
    quickSort(lo, p - 1);
    quickSort(p + 1, hi);
  }

  quickSort(0, arr.length - 1);

  steps.push(
    finalStep(
      stepId,
      makeElements(arr, Object.fromEntries(arr.map((_, i) => [i, "sorted" as ElementState]))),
      `✅ Sorted! [${arr.join(", ")}]. Quick Sort is in-place and cache-friendly.`,
      "Quick sort is the most-used sorting algorithm in practice. Watch how pivot choice affects performance — random pivots avoid worst-case O(n²).",
      7
    )
  );

  return steps;
}

function rangeState(lo: number, hi: number, state: ElementState): Record<number, ElementState> {
  const s: Record<number, ElementState> = {};
  for (let i = lo; i <= hi; i++) s[i] = state;
  return s;
}

export const quickSort: AlgorithmDefinition = {
  meta: {
    id: "quick-sort",
    name: "Quick Sort",
    category: "Sorting",
    difficulty: "Intermediate",
    layout: "array",
    legend: QUICK_LEGEND,
    timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)" },
    spaceComplexity: "O(log n)",
    description: "Picks a pivot, partitions the array around it, then recursively sorts the partitions. Fast in practice.",
    defaultInput: [8, 3, 1, 7, 0, 10, 2],
    code: `function quickSort(arr, lo, hi) {\n  const pivot = arr[hi]; // begin partition\n  for (let j = lo; j < hi; j++) {\n    if (arr[j] <= pivot)\n      moveToLeftPartition(arr, j);\n  } // place pivot in its final position\n  quickSort(left); quickSort(right);\n}`,
  },
  generateSteps,
};
