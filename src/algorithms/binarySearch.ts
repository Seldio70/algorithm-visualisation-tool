import type { AlgorithmDefinition, Step, ElementState } from "../types";
import { makeElements } from "./helpers";
import { SEARCH_LEGEND } from "../constants/legends";

function generateSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  const arr = [...input].sort((a, b) => a - b);
  const target = arr[Math.max(0, arr.length - 3)];
  let stepId = 0;

  steps.push({
    id: stepId++,
    elements: makeElements(arr),
    highlightedLines: [1],
    explanation: `Array must be sorted first: [${arr.join(", ")}]. We're searching for ${target}. Binary search halves the search space each step — that's why it's O(log n).`,
    variables: { target, left: 0, right: arr.length - 1 },
  });

  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const states: Record<number, ElementState> = {};

    for (let i = 0; i < arr.length; i++) {
      if (i < left || i > right) states[i] = "visited";
      else if (i === mid) states[i] = "current";
    }

    steps.push({
      id: stepId++,
      elements: makeElements(arr, states),
      highlightedLines: [3, 4],
      explanation: `Search range: [${left}...${right}]. Mid = ${mid}, arr[mid] = ${arr[mid]}. Is ${arr[mid]} equal to ${target}?`,
      variables: { target, left, right, mid, "arr[mid]": arr[mid] },
      pointers: [
        { name: "L", targetId: `el-${left}` },
        { name: "mid", targetId: `el-${mid}` },
        { name: "R", targetId: `el-${right}` },
      ],
    });

    if (arr[mid] === target) {
      const fs: Record<number, ElementState> = {};
      for (let i = 0; i < arr.length; i++) {
        fs[i] = i === mid ? "path" : i < left || i > right ? "visited" : "default";
      }
      steps.push({
        id: stepId,
        elements: makeElements(arr, fs),
        highlightedLines: [5],
        explanation: `✅ Found ${target} at index ${mid}! Binary search only needed ${steps.length} steps for an array of ${arr.length} elements. Linear search could've taken up to ${arr.length}.`,
        variables: { target, foundAt: mid },
      });
      break;
    } else if (arr[mid] < target) {
      steps.push({
        id: stepId++,
        elements: makeElements(arr, states),
        highlightedLines: [6],
        explanation: `${arr[mid]} < ${target} → target is in the RIGHT half. Move left to ${mid + 1}. Left half eliminated.`,
        variables: { target, left: mid + 1, right },
      });
      left = mid + 1;
    } else {
      steps.push({
        id: stepId++,
        elements: makeElements(arr, states),
        highlightedLines: [7],
        explanation: `${arr[mid]} > ${target} → target is in the LEFT half. Move right to ${mid - 1}. Right half eliminated.`,
        variables: { target, left, right: mid - 1 },
      });
      right = mid - 1;
    }
  }

  return steps;
}

export const binarySearch: AlgorithmDefinition = {
  meta: {
    id: "binary-search",
    name: "Binary Search",
    category: "Searching",
    difficulty: "Beginner",
    layout: "linear",
    legend: SEARCH_LEGEND,
    timeComplexity: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    spaceComplexity: "O(1)",
    description:
      "Finds a target in a sorted array by repeatedly halving the search space. Incredibly efficient for large datasets.",
    defaultInput: [3, 7, 12, 19, 24, 31, 38, 45, 56, 72],
    code: `function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    else if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}`,
  },
  generateSteps,
};
