import type { LegendItem } from "../types";

export const BUBBLE_LEGEND: LegendItem[] = [
  { tone: "comparing", label: "Comparing" },
  { tone: "swapping", label: "Swapping" },
  { tone: "sorted", label: "Sorted" },
  { tone: "highlight", label: "Updated" },
];

export const SELECTION_LEGEND: LegendItem[] = [
  { tone: "comparing", label: "Checking" },
  { tone: "min", label: "Minimum" },
  { tone: "swapping", label: "Swapping" },
  { tone: "sorted", label: "Sorted" },
];

export const INSERTION_LEGEND: LegendItem[] = [
  { tone: "current", label: "Key" },
  { tone: "comparing", label: "Comparing" },
  { tone: "inserting", label: "Inserting" },
  { tone: "sorted", label: "Sorted portion" },
];

export const MERGE_LEGEND: LegendItem[] = [
  { tone: "comparing", label: "Left half" },
  { tone: "current", label: "Right half" },
  { tone: "sorted", label: "Merged" },
];

export const QUICK_LEGEND: LegendItem[] = [
  { tone: "pivot", label: "Pivot" },
  { tone: "comparing", label: "Comparing" },
  { tone: "swapping", label: "Swapping" },
  { tone: "sorted", label: "Placed" },
];

export const SEARCH_LEGEND: LegendItem[] = [
  { tone: "current", label: "Current" },
  { tone: "visited", label: "Eliminated" },
  { tone: "path", label: "Found" },
];

export const GRAPH_LEGEND: LegendItem[] = [
  { tone: "current", label: "Current" },
  { tone: "highlight", label: "Discovered" },
  { tone: "visited", label: "Visited" },
  { tone: "sorted", label: "Complete" },
];

export const DIJKSTRA_LEGEND: LegendItem[] = [
  { tone: "current", label: "Current" },
  { tone: "highlight", label: "Relaxed" },
  { tone: "visited", label: "Finalized" },
  { tone: "path", label: "Shortest path" },
];

export const TREE_LEGEND: LegendItem[] = [
  { tone: "comparing", label: "Comparing" },
  { tone: "current", label: "Current" },
  { tone: "inserting", label: "Inserted" },
  { tone: "visited", label: "Visited" },
  { tone: "sorted", label: "Complete" },
];

export const LINKED_LIST_LEGEND: LegendItem[] = [
  { tone: "current", label: "Pointer" },
  { tone: "comparing", label: "Removing" },
  { tone: "inserting", label: "Inserted" },
  { tone: "sorted", label: "Complete" },
];

export const STACK_QUEUE_LEGEND: LegendItem[] = [
  { tone: "current", label: "Front / top" },
  { tone: "inserting", label: "Inserted" },
  { tone: "highlight", label: "Removed" },
  { tone: "sorted", label: "Complete" },
];

export const MEMORY_LEGEND: LegendItem[] = [
  { tone: "default", label: "Free" },
  { tone: "current", label: "Scanning" },
  { tone: "highlight", label: "Allocated" },
  { tone: "sorted", label: "Coalesced" },
];

export const MAZE_LEGEND: LegendItem[] = [
  { tone: "wall", label: "Wall" },
  { tone: "floor", label: "Open" },
  { tone: "start", label: "Start" },
  { tone: "goal", label: "Goal" },
  { tone: "visited", label: "Visited" },
  { tone: "path", label: "Path" },
];

export const FLOOD_FILL_LEGEND: LegendItem[] = [
  { tone: "wall", label: "Boundary" },
  { tone: "floor", label: "Unfilled" },
  { tone: "current", label: "Current" },
  { tone: "visited", label: "Queued" },
  { tone: "filled", label: "Filled" },
];
