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
  parentId?: string | null;
}

export interface Pointer {
  name: string;
  targetId: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
  state?: ElementState;
}

export interface GraphLayout {
  nodes: { id: string; x: number; y: number }[];
  edges: { from: string; to: string }[];
}

export interface Step {
  id: number;
  elements: VisualElement[];
  layoutOverride?: VisualizerLayout;
  pointers?: Pointer[];
  highlightedLines: number[];
  explanation: string;
  variables?: Record<string, number | string | boolean>;
  callStack?: string[];
  edges?: GraphEdge[];
}

export type VisualizerLayout =
  | "array"
  | "linear"
  | "graph"
  | "tree"
  | "grid"
  | "linked-list"
  | "stack"
  | "queue"
  | "memory"
  | "split"
  | "string-set";

export type GridVariant = "maze" | "fill";

export type LegendTone =
  | ElementState
  | "wall"
  | "floor"
  | "start"
  | "goal"
  | "filled";

export interface LegendItem {
  tone: LegendTone;
  label: string;
}

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
  graphLayout?: GraphLayout;
  gridVariant?: GridVariant;
  legend: LegendItem[];
}

export interface AlgorithmDefinition {
  meta: AlgorithmMeta;
  generateSteps: (input: number[]) => Step[];
}
