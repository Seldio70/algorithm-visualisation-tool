import type { AlgorithmDefinition, Step, ElementState } from "../types";
import { makeElements, finalStep } from "./helpers";
import { MERGE_LEGEND } from "../constants/legends";

function generateSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const arr = [...input];

  steps.push({
    id: stepId++,
    elements: makeElements(arr),
    highlightedLines: [1],
    explanation: `Merge Sort uses divide-and-conquer: split the array in half recursively until single elements, then merge sorted halves back together.`,
    variables: { length: arr.length },
    callStack: ["mergeSort([...])"],
  });

  function mergeSort(lo: number, hi: number, stack: string[]): void {
    if (lo >= hi) return;

    const mid = Math.floor((lo + hi) / 2);
    const leftStack = [...stack, `mergeSort(${lo}, ${mid})`];
    const rightStack = [...stack, `mergeSort(${mid + 1}, ${hi})`];

    steps.push({
      id: stepId++,
      elements: makeElements(arr, highlightRange(lo, hi, mid)),
      highlightedLines: [2, 3],
      explanation: `Split range [${lo}..${hi}] at mid=${mid}. Left: [${lo}..${mid}], Right: [${mid + 1}..${hi}].`,
      variables: { lo, hi, mid },
      callStack: [...stack, `split(${lo}, ${hi})`],
    });

    mergeSort(lo, mid, leftStack);
    mergeSort(mid + 1, hi, rightStack);

    const temp = arr.slice(lo, hi + 1);
    let i = lo;
    let j = mid + 1;
    let k = lo;

    steps.push({
      id: stepId++,
      elements: makeElements(arr, highlightRange(lo, hi, mid, "comparing")),
      highlightedLines: [4, 5],
      explanation: `Merging [${lo}..${mid}] and [${mid + 1}..${hi}]. Compare the front elements of each half.`,
      variables: { lo, hi, mid, i, j },
      callStack: [...stack, `merge(${lo}, ${mid}, ${hi})`],
    });

    while (i <= mid && j <= hi) {
      if (arr[i] <= arr[j]) {
        temp[k - lo] = arr[i++];
      } else {
        temp[k - lo] = arr[j++];
      }
      k++;
    }
    while (i <= mid) temp[k++ - lo] = arr[i++];
    while (j <= hi) temp[k++ - lo] = arr[j++];

    for (let t = 0; t < temp.length; t++) arr[lo + t] = temp[t];

    steps.push({
      id: stepId++,
      elements: makeElements(arr, highlightRange(lo, hi, -1, "sorted")),
      highlightedLines: [6],
      explanation: `Merged! Range [${lo}..${hi}] is now sorted: [${arr.slice(lo, hi + 1).join(", ")}].`,
      variables: { lo, hi },
      callStack: stack,
    });
  }

  mergeSort(0, arr.length - 1, ["mergeSort(0, n-1)"]);

  steps.push(
    finalStep(
      stepId,
      makeElements(arr, Object.fromEntries(arr.map((_, i) => [i, "sorted" as ElementState]))),
      `✅ Fully sorted: [${arr.join(", ")}]. Merge Sort guarantees O(n log n) in all cases.`,
      "Merge sort teaches divide-and-conquer and stable sorting. Its predictable O(n log n) makes it ideal when stability matters — used in TimSort and external sorting.",
      7
    )
  );

  return steps;
}

function highlightRange(
  lo: number,
  hi: number,
  mid: number,
  state: ElementState = "highlight"
): Record<number, ElementState> {
  const s: Record<number, ElementState> = {};
  for (let i = lo; i <= hi; i++) {
    if (mid >= 0 && i <= mid) s[i] = "comparing";
    else if (mid >= 0) s[i] = "current";
    else s[i] = state;
  }
  return s;
}

export const mergeSort: AlgorithmDefinition = {
  meta: {
    id: "merge-sort",
    name: "Merge Sort",
    category: "Sorting",
    difficulty: "Intermediate",
    layout: "array",
    legend: MERGE_LEGEND,
    timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
    spaceComplexity: "O(n)",
    description: "Divides the array in half recursively, sorts each half, then merges them. Stable and predictable O(n log n).",
    defaultInput: [38, 27, 43, 3, 9, 82, 10],
    code: `function mergeSort(arr, lo, hi) {\n  if (lo >= hi) return;\n  const mid = Math.floor((lo + hi) / 2); // split\n  mergeSort(arr, lo, mid); mergeSort(arr, mid + 1, hi);\n  merge(arr, lo, mid, hi); // merge both sorted halves\n  return arr;\n}`,
  },
  generateSteps,
};
