import { mergeSort } from "../mergeSort";
import type { AlgorithmDefinition } from "../../types";

export const mergeSort42: AlgorithmDefinition = {
  ...mergeSort,
  meta: {
    ...mergeSort.meta,
    id: "merge-sort-42",
    category: "42 Tirana",
    accent: "violet",
    fortyTwoNote: "push_swap uses merge-sort-like strategies for sorting with limited operations.",
    description:
      "Merge Sort with recursive call stack visualization — see how the array splits and merges. Critical for understanding push_swap sorting strategies.",
  },
};
