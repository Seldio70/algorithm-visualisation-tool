import type { AlgorithmDefinition, Step, ElementState } from "../types";
import { makeElements, finalStep } from "./helpers";

function generateSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  const arr = [...input].sort((a, b) => a - b);
  let stepId = 0;
  let left = 0;
  let right = arr.length - 1;
  const target = arr[Math.floor(arr.length / 2)] + arr[Math.ceil(arr.length / 2)];

  steps.push({
    id: stepId++,
    elements: makeElements(arr, { [left]: "current", [right]: "current" }),
    highlightedLines: [1, 2],
    explanation: `Two Pointers technique: use left and right pointers moving toward each other. Sorted array [${arr.join(", ")}]. Find pair summing to ${target}.`,
    variables: { left, right, target, sum: arr[left] + arr[right] },
    pointers: [
      { name: "L", targetId: `el-${left}` },
      { name: "R", targetId: `el-${right}` },
    ],
  });

  while (left < right) {
    const sum = arr[left] + arr[right];
    const states: Record<number, ElementState> = {};
    for (let i = 0; i < arr.length; i++) {
      if (i === left || i === right) states[i] = "comparing";
      else if (i < left || i > right) states[i] = "visited";
    }

    steps.push({
      id: stepId++,
      elements: makeElements(arr, states),
      highlightedLines: [3, 4],
      explanation: `Sum = arr[${left}]+arr[${right}] = ${arr[left]}+${arr[right]} = ${sum}. ${sum === target ? "Found target!" : sum < target ? "Too small → move left right." : "Too large → move right left."}`,
      variables: { left, right, sum, target },
      pointers: [
        { name: "L", targetId: `el-${left}` },
        { name: "R", targetId: `el-${right}` },
      ],
    });

    if (sum === target) {
      steps.push(
        finalStep(
          stepId,
          makeElements(arr, { [left]: "path", [right]: "path" }),
          `✅ Found pair: arr[${left}]=${arr[left]} + arr[${right}]=${arr[right]} = ${target}. Only O(n) time!`,
          "Two pointers works on sorted arrays for pair sums, palindromes, and container problems. The sorted order lets you eliminate half the search space each step.",
          5
        )
      );
      return steps;
    }

    if (sum < target) left++;
    else right--;
  }

  steps.push(
    finalStep(
      stepId,
      makeElements(arr),
      `No pair sums to ${target}. Pointers crossed without a match.`,
      "When two pointers cross, you've checked all valid pairs in O(n) — much better than O(n²) brute force.",
      6
    )
  );

  return steps;
}

export const twoPointers: AlgorithmDefinition = {
  meta: {
    id: "two-pointers",
    name: "Two Pointers",
    category: "Classic",
    difficulty: "Intermediate",
    layout: "linear",
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    description: "Uses two pointers moving toward each other (or same direction) to solve problems in O(n) on sorted arrays.",
    defaultInput: [1, 2, 4, 6, 8, 9, 11, 15],
    code: `function twoSum(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left < right) {\n    const sum = arr[left] + arr[right];\n    if (sum === target) return [left, right];\n    else if (sum < target) left++;\n    else right--;\n  }\n}`,
  },
  generateSteps,
};
