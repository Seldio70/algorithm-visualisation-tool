import { bubbleSort } from "./bubbleSort";
import { selectionSort } from "./selectionSort";
import { insertionSort } from "./insertionSort";
import { mergeSort } from "./mergeSort";
import { quickSort } from "./quickSort";
import { linearSearch } from "./linearSearch";
import { binarySearch } from "./binarySearch";
import { bfs } from "./bfs";
import { dfs } from "./dfs";
import { dijkstra } from "./dijkstra";
import { treeTraversal } from "./treeTraversal";
import { bstInsert } from "./bstInsert";
import { fibonacci } from "./fibonacci";
import { twoPointers } from "./twoPointers";
import { ftSplit } from "./fortyTwo/ftSplit";
import { ftItoa } from "./fortyTwo/ftItoa";
import { ftUnion } from "./fortyTwo/ftUnion";
import { ftInter } from "./fortyTwo/ftInter";
import { ftAtoi } from "./fortyTwo/ftAtoi";
import { lastWord } from "./fortyTwo/lastWord";
import type { AlgorithmDefinition } from "../types";

export const mainAlgorithms: AlgorithmDefinition[] = [
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  linearSearch,
  binarySearch,
  bfs,
  dfs,
  dijkstra,
  treeTraversal,
  bstInsert,
  fibonacci,
  twoPointers,
];

export const fortyTwoAlgorithms: AlgorithmDefinition[] = [
  ftSplit,
  ftItoa,
  ftAtoi,
  ftUnion,
  ftInter,
  lastWord,
];

export const algorithms: AlgorithmDefinition[] = [
  ...mainAlgorithms,
  ...fortyTwoAlgorithms,
];

export const algorithmMap = Object.fromEntries(
  algorithms.map((a) => [a.meta.id, a])
);

export const fortyTwoMap = Object.fromEntries(
  fortyTwoAlgorithms.map((a) => [a.meta.id, a])
);
