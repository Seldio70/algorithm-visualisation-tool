import type { AlgorithmDefinition, Step, ElementState } from "../types";
import { BUBBLE_LEGEND } from "../constants/legends";
import { makeElements, sortedStates } from "./helpers";
import { BUBBLE_SORT_PRESETS } from "./bubbleSortCases";

function generateSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  const arr = [...input];
  const n = arr.length;
  const sorted = new Set<number>();
  let stepId = 0;
  let comparisons = 0;
  let swaps = 0;
  let passes = 0;
  let earlyExit = false;

  steps.push({
    id: stepId++,
    elements: makeElements(arr),
    highlightedLines: [1],
    explanation: `Starting with [${arr.join(", ")}]. Bubble Sort compares adjacent pairs and swaps them if out of order. The largest value "bubbles up" to its correct position each pass.`,
    variables: { pass: 0, comparisons: 0, swaps: 0 },
  });

  for (let pass = 0; pass < n - 1; pass++) {
    let swapped = false;
    passes = pass + 1;

    steps.push({
      id: stepId++,
      elements: makeElements(arr, sortedStates(sorted)),
      highlightedLines: [2, 3],
      explanation: `Pass ${passes} of ${n - 1} begins. Reset swapped to false, then walk through indices 0 to ${n - 2 - pass}.`,
      variables: { pass: passes, swapped, comparisons, swaps },
    });

    for (let j = 0; j < n - 1 - pass; j++) {
      comparisons++;
      const base = sortedStates(sorted);

      steps.push({
        id: stepId++,
        elements: makeElements(arr, { ...base, [j]: "comparing", [j + 1]: "comparing" }),
        highlightedLines: [4, 5],
        explanation: `Comparing arr[${j}]=${arr[j]} and arr[${j + 1}]=${arr[j + 1]}. ${
          arr[j] > arr[j + 1]
            ? `${arr[j]} > ${arr[j + 1]} → need to swap!`
            : `${arr[j]} ≤ ${arr[j + 1]} → already in order, move on.`
        }`,
        variables: { j, "arr[j]": arr[j], "arr[j+1]": arr[j + 1], comparisons, swaps },
        pointers: [
          { name: "j", targetId: `el-${j}` },
          { name: "j+1", targetId: `el-${j + 1}` },
        ],
      });

      if (arr[j] > arr[j + 1]) {
        steps.push({
          id: stepId++,
          elements: makeElements(arr, { ...base, [j]: "swapping", [j + 1]: "swapping" }),
          highlightedLines: [6],
          explanation: `Swapping ${arr[j]} ↔ ${arr[j + 1]}.`,
          variables: { j, swapping: `${arr[j]} ↔ ${arr[j + 1]}`, comparisons, swaps },
          pointers: [
            { name: "j", targetId: `el-${j}` },
            { name: "j+1", targetId: `el-${j + 1}` },
          ],
        });

        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
        swaps++;

        steps.push({
          id: stepId++,
          elements: makeElements(arr, { ...base, [j]: "highlight", [j + 1]: "highlight" }),
          highlightedLines: [6, 7],
          explanation: `Swap done. Array is now [${arr.join(", ")}].`,
          variables: { j, swapped, comparisons, swaps },
        });
      }
    }

    if (!swapped) {
      earlyExit = true;
      steps.push({
        id: stepId++,
        elements: makeElements(
          arr,
          Object.fromEntries(arr.map((_, i) => [i, "sorted" as ElementState]))
        ),
        highlightedLines: [10],
        explanation: `No swaps happened in pass ${passes}. The array is already sorted, so Bubble Sort stops early.`,
        variables: { pass: passes, swapped, comparisons, swaps, earlyExit },
      });
      break;
    }

    sorted.add(n - 1 - pass);
    steps.push({
      id: stepId++,
      elements: makeElements(arr, sortedStates(sorted)),
      highlightedLines: [11],
      explanation: `Pass ${passes} complete. ${arr[n - 1 - pass]} is now in its correct final position ✓`,
      variables: { pass: passes, swapped, comparisons, swaps },
    });
  }

  steps.push({
    id: stepId,
    elements: makeElements(
      arr,
      Object.fromEntries(arr.map((_, i) => [i, "sorted" as ElementState]))
    ),
    highlightedLines: [12],
    explanation: `✅ Sorted! [${arr.join(", ")}]. Total passes: ${passes}, comparisons: ${comparisons}, swaps: ${swaps}.${earlyExit ? " Bubble Sort stopped as soon as a pass made no swaps." : ""}`,
    variables: { sorted: "complete", passes, comparisons, swaps, earlyExit },
  });

  return steps;
}

export const bubbleSort: AlgorithmDefinition = {
  meta: {
    id: "bubble-sort",
    name: "Bubble Sort",
    category: "Sorting",
    difficulty: "Beginner",
    layout: "array",
    legend: BUBBLE_LEGEND,
    timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    description:
      "Repeatedly compares adjacent elements and swaps them if out of order. The largest element bubbles to the end each pass.",
    defaultInput: BUBBLE_SORT_PRESETS.average,
    code: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let swapped = false;
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
}`,
  },
  generateSteps,
};
