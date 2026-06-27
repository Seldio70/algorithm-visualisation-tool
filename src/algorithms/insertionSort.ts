import type { AlgorithmDefinition, Step, ElementState } from "../types";
import { makeElements, sortedStates, finalStep } from "./helpers";

function generateSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  const arr = [...input];
  const n = arr.length;
  const sorted = new Set<number>();
  let stepId = 0;

  steps.push({
    id: stepId++,
    elements: makeElements(arr),
    highlightedLines: [1],
    explanation: `Starting Insertion Sort on [${arr.join(", ")}]. Like sorting playing cards — pick each card and slide it into its correct position among the cards already in your hand.`,
    variables: { n },
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    steps.push({
      id: stepId++,
      elements: makeElements(arr, { ...sortedStates(sorted), [i]: "current" }),
      highlightedLines: [2, 3],
      explanation: `Pass ${i}: Pick up element at index ${i} (value ${key}). The sorted portion is indices 0..${i - 1}.`,
      variables: { i, key, j },
      pointers: [{ name: "i", targetId: `el-${i}` }],
    });

    while (j >= 0 && arr[j] > key) {
      steps.push({
        id: stepId++,
        elements: makeElements(arr, {
          ...sortedStates(sorted),
          [j]: "comparing",
          [j + 1]: "inserting",
        }),
        highlightedLines: [4, 5],
        explanation: `arr[${j}]=${arr[j]} > key=${key}. Shift ${arr[j]} one position to the right.`,
        variables: { key, j, "arr[j]": arr[j] },
        pointers: [
          { name: "j", targetId: `el-${j}` },
          { name: "key", targetId: `el-${j + 1}` },
        ],
      });
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = key;
    sorted.add(i);

    steps.push({
      id: stepId++,
      elements: makeElements(arr, sortedStates(new Set([...sorted, ...Array.from({ length: i + 1 }, (_, k) => k)]))),
      highlightedLines: [6],
      explanation: `Insert ${key} at index ${j + 1}. Sorted portion is now [${arr.slice(0, i + 1).join(", ")}].`,
      variables: { i, insertedAt: j + 1 },
    });
  }

  steps.push(
    finalStep(
      stepId,
      makeElements(arr, Object.fromEntries(arr.map((_, i) => [i, "sorted" as ElementState]))),
      `✅ Sorted! [${arr.join(", ")}]. Insertion sort is O(n²) worst case but O(n) on nearly sorted data.`,
      "Insertion sort shines when data is mostly sorted — it's stable, in-place, and intuitive. It's the algorithm behind TimSort's small-array optimization.",
      7
    )
  );

  return steps;
}

export const insertionSort: AlgorithmDefinition = {
  meta: {
    id: "insertion-sort",
    name: "Insertion Sort",
    category: "Sorting",
    difficulty: "Beginner",
    layout: "array",
    timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    description: "Builds the sorted array one element at a time by inserting each element into its correct position.",
    defaultInput: [12, 11, 13, 5, 6],
    code: `function insertionSort(arr) {\n  for (let i = 1; i < arr.length; i++) {\n    const key = arr[i];\n    let j = i - 1;\n    while (j >= 0 && arr[j] > key) {\n      arr[j + 1] = arr[j];\n      j--;\n    }\n    arr[j + 1] = key;\n  }\n}`,
  },
  generateSteps,
};
