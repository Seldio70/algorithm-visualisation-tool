import type { VisualElement, ElementState, Step } from "../types";

export function makeElements(
  arr: number[],
  states: Record<number, ElementState> = {},
  labels?: Record<number, string>
): VisualElement[] {
  return arr.map((val, i) => ({
    id: `el-${i}`,
    value: val,
    state: states[i] ?? "default",
    label: labels?.[i],
  }));
}

export function makeGridElements(
  grid: number[],
  _cols: number,
  states: Record<number, ElementState> = {}
): VisualElement[] {
  return grid.map((val, i) => ({
    id: `el-${i}`,
    value: val,
    state: states[i] ?? "default",
  }));
}

export function sortedStates(sorted: Set<number>): Record<number, ElementState> {
  return Object.fromEntries([...sorted].map((i) => [i, "sorted" as ElementState]));
}

export function finalStep(
  stepId: number,
  elements: VisualElement[],
  explanation: string,
  learnNote: string,
  line: number
): Step {
  return {
    id: stepId,
    elements,
    highlightedLines: [line],
    explanation: `${explanation}\n\n📚 What to learn: ${learnNote}`,
  };
}
