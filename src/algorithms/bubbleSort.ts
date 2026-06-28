import type { AlgorithmDefinition, Step, ElementState } from "../types";
import { makeElements, sortedStates } from "./helpers";
import { BUBBLE_LEGEND } from "../constants/legends";

function generateSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  const arr = [...input];
  const n = arr.length;
  const sorted = new Set<number>();
  let stepId = 0;
  let comparisons = 0;
  let swaps = 0;

  steps.push({
    id: stepId++,
    elements: makeElements(arr),
    highlightedLines: [1],
    explanation: `Starting with [${arr.join(", ")}]. Bubble Sort compares adjacent pairs and swaps them if out of order. The largest value "bubbles up" to its correct position each pass.`,
    variables: { pass: 0, comparisons: 0, swaps: 0 },
  });

  for (let pass = 0; pass < n - 1; pass++) {
    steps.push({
      id: stepId++,
      elements: makeElements(arr, sortedStates(sorted)),
      highlightedLines: [2],
      explanation: `Pass ${pass + 1} of ${n - 1} begins. We walk through the unsorted portion (indices 0 to ${n - 2 - pass}).`,
      variables: { pass: pass + 1, comparisons, swaps },
    });

    for (let j = 0; j < n - 1 - pass; j++) {
      comparisons++;
      const base = sortedStates(sorted);

      steps.push({
        id: stepId++,
        elements: makeElements(arr, { ...base, [j]: "comparing", [j + 1]: "comparing" }),
        highlightedLines: [3, 4],
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
          highlightedLines: [5],
          explanation: `Swapping ${arr[j]} ↔ ${arr[j + 1]}.`,
          variables: { j, swapping: `${arr[j]} ↔ ${arr[j + 1]}`, comparisons, swaps },
          pointers: [
            { name: "j", targetId: `el-${j}` },
            { name: "j+1", targetId: `el-${j + 1}` },
          ],
        });

        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;

        steps.push({
          id: stepId++,
          elements: makeElements(arr, { ...base, [j]: "highlight", [j + 1]: "highlight" }),
          highlightedLines: [5],
          explanation: `Swap done. Array is now [${arr.join(", ")}].`,
          variables: { j, comparisons, swaps },
        });
      }
    }

    sorted.add(n - 1 - pass);
    steps.push({
      id: stepId++,
      elements: makeElements(arr, sortedStates(sorted)),
      highlightedLines: [7],
      explanation: `Pass ${pass + 1} complete. ${arr[n - 1 - pass]} is now in its correct final position ✓`,
      variables: { pass: pass + 1, comparisons, swaps },
    });
  }

  steps.push({
    id: stepId,
    elements: makeElements(arr, Object.fromEntries(arr.map((_, i) => [i, "sorted" as ElementState]))),
    highlightedLines: [8],
    explanation: `✅ Sorted! [${arr.join(", ")}]. Total comparisons: ${comparisons}, swaps: ${swaps}. Time complexity: O(n²).`,
    variables: { sorted: "complete", comparisons, swaps },
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
    defaultInput: [64, 34, 25, 12, 22, 11, 90],
    code: `function bubbleSort(arr) {\n  for (let i = 0; i < arr.length - 1; i++) {\n    for (let j = 0; j < arr.length - 1 - i; j++) {\n      if (arr[j] > arr[j + 1]) {\n        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];\n      }\n    } // end inner loop\n  }   // array sorted\n}`,
  },
  generateSteps,
};
