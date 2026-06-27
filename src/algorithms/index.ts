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
import { linkedList } from "./fortyTwo/linkedList";
import { stackQueue } from "./fortyTwo/stackQueue";
import { floodFill } from "./fortyTwo/floodFill";
import { bfsMaze } from "./fortyTwo/bfsMaze";
import { memoryBlocks } from "./fortyTwo/memoryBlocks";
import { mergeSort42 } from "./fortyTwo/mergeSort42";
import { quickSort42 } from "./fortyTwo/quickSort42";
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
  linkedList,
  stackQueue,
  mergeSort42,
  quickSort42,
  floodFill,
  bfsMaze,
  memoryBlocks,
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
