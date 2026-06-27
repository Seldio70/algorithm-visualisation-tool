import { quickSort } from "../quickSort";
import type { AlgorithmDefinition } from "../../types";

export const quickSort42: AlgorithmDefinition = {
  ...quickSort,
  meta: {
    ...quickSort.meta,
    id: "quick-sort-42",
    category: "42 Tirana",
    accent: "violet",
    fortyTwoNote: "Sorting algorithms appear in push_swap and exam preparation.",
    description:
      "Quick Sort with partition step highlighted — watch the pivot move to its final position each round. Essential sorting intuition for 42 exams.",
  },
};
