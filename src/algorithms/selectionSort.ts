import type { AlgorithmDefinition, Step, ElementState } from "../types";
import { makeElements, sortedStates } from "./helpers";
import { SELECTION_LEGEND } from "../constants/legends";

function generateSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  const arr = [...input];
  const n = arr.length;
  const sorted = new Set<number>();
  let stepId = 0;
  let swaps = 0;

  steps.push({
    id: stepId++,
    elements: makeElements(arr),
    highlightedLines: [1],
    explanation: `Selection Sort divides the array into sorted (left) and unsorted (right) portions. Each pass finds the minimum in the unsorted portion and places it at the correct position.`,
    variables: { pass: 0 },
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    steps.push({
      id: stepId++,
      elements: makeElements(arr, { ...sortedStates(sorted), [i]: "min" }),
      highlightedLines: [2],
      explanation: `Pass ${i + 1}: Assume index ${i} (value ${arr[i]}) is the minimum. We'll scan the rest to verify.`,
      variables: { pass: i + 1, minIdx, minValue: arr[minIdx] },
      pointers: [{ name: "min", targetId: `el-${minIdx}` }],
    });

    for (let j = i + 1; j < n; j++) {
      const base = sortedStates(sorted);

      steps.push({
        id: stepId++,
        elements: makeElements(arr, { ...base, [minIdx]: "min", [j]: "comparing" }),
        highlightedLines: [4, 5],
        explanation: `Checking arr[${j}]=${arr[j]} against current min ${arr[minIdx]}. ${
          arr[j] < arr[minIdx]
            ? `${arr[j]} is smaller! New minimum found.`
            : `${arr[j]} is not smaller. Keep current min.`
        }`,
        variables: { minIdx, minValue: arr[minIdx], checking: arr[j] },
        pointers: [
          { name: "min", targetId: `el-${minIdx}` },
          { name: "j", targetId: `el-${j}` },
        ],
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      const base = sortedStates(sorted);
      steps.push({
        id: stepId++,
        elements: makeElements(arr, { ...base, [i]: "swapping", [minIdx]: "swapping" }),
        highlightedLines: [7],
        explanation: `Minimum of unsorted portion is ${arr[minIdx]} at index ${minIdx}. Swapping with index ${i} (value ${arr[i]}).`,
        variables: { swapping: `arr[${i}]=${arr[i]} ↔ arr[${minIdx}]=${arr[minIdx]}` },
      });

      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      swaps++;
    }

    sorted.add(i);
    steps.push({
      id: stepId++,
      elements: makeElements(arr, sortedStates(sorted)),
      highlightedLines: [8],
      explanation: `${arr[i]} is now in its final correct position. Sorted portion: [${[...sorted].map((k) => arr[k]).join(", ")}].`,
      variables: { pass: i + 1, swaps },
    });
  }

  sorted.add(n - 1);
  steps.push({
    id: stepId,
    elements: makeElements(arr, Object.fromEntries(arr.map((_, i) => [i, "sorted" as ElementState]))),
    highlightedLines: [9],
    explanation: `✅ Done! [${arr.join(", ")}]. Selection sort makes at most n-1 meaningful swaps — useful when writes are expensive. Time complexity: O(n²).`,
    variables: { sorted: "complete", swaps },
  });

  return steps;
}

export const selectionSort: AlgorithmDefinition = {
  meta: {
    id: "selection-sort",
    name: "Selection Sort",
    category: "Sorting",
    difficulty: "Beginner",
    layout: "array",
    legend: SELECTION_LEGEND,
    timeComplexity: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    description:
      "Divides the array into sorted and unsorted regions. Each pass selects the minimum from the unsorted region and moves it to the sorted region.",
    defaultInput: [64, 25, 12, 22, 11],
    code: `function selectionSort(arr) {\n  for (let i = 0; i < arr.length - 1; i++) {\n    let minIdx = i;\n    for (let j = i + 1; j < arr.length; j++) {\n      if (arr[j] < arr[minIdx]) minIdx = j;\n    }\n    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];\n  }   // array sorted\n}`,
  },
  generateSteps,
};
