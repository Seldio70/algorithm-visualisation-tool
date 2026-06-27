export type ElementState =
  | "default"
  | "comparing"
  | "swapping"
  | "sorted"
  | "pivot"
  | "current"
  | "visited"
  | "path"
  | "highlight"
  | "min"
  | "inserting";

export interface VisualElement {
  id: string;
  value: number | string;
  state: ElementState;
  label?: string;
}

export interface Pointer {
  name: string;
  targetId: string;
}

export interface Step {
  id: number;
  elements: VisualElement[];
  pointers?: Pointer[];
  highlightedLines: number[];
  explanation: string;
  variables?: Record<string, number | string | boolean>;
  callStack?: string[];
}

export type VisualizerLayout =
  | "array"
  | "linear"
  | "graph"
  | "tree"
  | "grid"
  | "linked-list"
  | "stack"
  | "memory";

export type AlgorithmCategory =
  | "Sorting"
  | "Searching"
  | "Graph"
  | "Tree"
  | "Classic"
  | "42 Tirana";

export type ThemeAccent = "cyan" | "violet";

export interface AlgorithmMeta {
  id: string;
  name: string;
  category: AlgorithmCategory;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  layout: VisualizerLayout;
  timeComplexity: { best: string; average: string; worst: string };
  spaceComplexity: string;
  description: string;
  code: string;
  defaultInput: number[];
  gridCols?: number;
  fortyTwoNote?: string;
  accent?: ThemeAccent;
}

export interface AlgorithmDefinition {
  meta: AlgorithmMeta;
  generateSteps: (input: number[]) => Step[];
}
