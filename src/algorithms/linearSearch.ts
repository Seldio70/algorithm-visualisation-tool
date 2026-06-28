import type { AlgorithmDefinition, Step, ElementState } from "../types";
import { makeElements, finalStep } from "./helpers";
import { SEARCH_LEGEND } from "../constants/legends";

function generateSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  const arr = [...input];
  const target = arr[Math.floor(arr.length / 2)];
  let stepId = 0;

  steps.push({
    id: stepId++,
    elements: makeElements(arr, { [0]: "current" }),
    highlightedLines: [1, 2],
    explanation: `Linear Search scans every element one by one. Searching for ${target} in [${arr.join(", ")}]. No sorting required — works on any array.`,
    variables: { target, index: 0 },
    pointers: [{ name: "i", targetId: "el-0" }],
  });

  for (let i = 0; i < arr.length; i++) {
    const states: Record<number, ElementState> = {};
    for (let k = 0; k < arr.length; k++) {
      if (k < i) states[k] = "visited";
      else if (k === i) states[k] = "current";
    }

    steps.push({
      id: stepId++,
      elements: makeElements(arr, states),
      highlightedLines: [3, 4],
      explanation: `Check index ${i}: arr[${i}] = ${arr[i]}. ${arr[i] === target ? `Match! Found ${target}.` : `Not equal to ${target}. Keep scanning.`}`,
      variables: { target, i, "arr[i]": arr[i] },
      pointers: [{ name: "i", targetId: `el-${i}` }],
    });

    if (arr[i] === target) {
      steps.push(
        finalStep(
          stepId,
          makeElements(arr, { ...states, [i]: "path" }),
          `✅ Found ${target} at index ${i} after ${i + 1} comparisons.`,
          "Linear search is O(n) — simple but slow on large datasets. Use it when data is unsorted or small. Binary search needs sorted data but is much faster.",
          3
        )
      );
      return steps;
    }
  }

  steps.push(
    finalStep(
      stepId,
      makeElements(arr, Object.fromEntries(arr.map((_, i) => [i, "visited" as ElementState]))),
      `❌ ${target} not found after checking all ${arr.length} elements.`,
      "When search fails, linear search still costs O(n). Consider sorting first if you'll search repeatedly.",
      5
    )
  );

  return steps;
}

export const linearSearch: AlgorithmDefinition = {
  meta: {
    id: "linear-search",
    name: "Linear Search",
    category: "Searching",
    difficulty: "Beginner",
    layout: "linear",
    legend: SEARCH_LEGEND,
    timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    description: "Sequentially checks each element until the target is found or the array ends. Simple and works on unsorted data.",
    defaultInput: [4, 2, 7, 1, 9, 3, 8],
    code: `function linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) return i;\n  }\n  return -1;\n}`,
  },
  generateSteps,
};
