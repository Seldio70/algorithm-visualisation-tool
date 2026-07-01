import { describe, expect, it } from "vitest";
import { algorithms } from "./index";
import { getAlgorithmInputProfile } from "./algorithmInputProfiles";

describe("algorithm contracts", () => {
  it.each(algorithms.map((algorithm) => [algorithm.meta.id, algorithm] as const))(
    "%s generates structurally valid steps",
    (_, algorithm) => {
      const steps = algorithm.generateSteps(algorithm.meta.defaultInput);
      const codeLineCount = algorithm.meta.code.split("\n").length;

      expect(steps.length).toBeGreaterThan(0);
      expect(algorithm.meta.legend.length).toBeGreaterThan(0);

      steps.forEach((step, index) => {
        expect(step.id).toBe(index);
        expect(step.explanation.trim()).not.toBe("");
        expect(new Set(step.elements.map((element) => element.id)).size).toBe(step.elements.length);

        step.highlightedLines.forEach((line) => {
          expect(line).toBeGreaterThanOrEqual(1);
          expect(line).toBeLessThanOrEqual(codeLineCount);
        });

        const elementIds = new Set(step.elements.map((element) => element.id));
        step.pointers?.forEach((pointer) => expect(elementIds.has(pointer.targetId)).toBe(true));
        step.edges?.forEach((edge) => {
          expect(elementIds.has(edge.from)).toBe(true);
          expect(elementIds.has(edge.to)).toBe(true);
        });
      });
    }
  );

  it.each(
    algorithms
      .filter(({ meta }) => meta.category === "Sorting" || meta.id === "merge-sort-42" || meta.id === "quick-sort-42")
      .map((algorithm) => [algorithm.meta.id, algorithm] as const)
  )("%s ends with a sorted array", (_, algorithm) => {
    const lastStep = algorithm.generateSteps(algorithm.meta.defaultInput).at(-1)!;
    const values = lastStep.elements.map((element) => Number(element.value));
    expect(values).toEqual([...values].sort((a, b) => a - b));
  });

  it("uses teaching examples with multiple decisions", () => {
    const binary = algorithms.find(({ meta }) => meta.id === "binary-search")!;
    const twoPointers = algorithms.find(({ meta }) => meta.id === "two-pointers")!;
    expect(binary.generateSteps(binary.meta.defaultInput).length).toBeGreaterThanOrEqual(5);
    expect(twoPointers.generateSteps(twoPointers.meta.defaultInput).length).toBeGreaterThanOrEqual(6);
  });

  it("reserves path state for reconstructed paths", () => {
    for (const id of ["bfs", "dfs"]) {
      const algorithm = algorithms.find(({ meta }) => meta.id === id)!;
      const finalStep = algorithm.generateSteps(algorithm.meta.defaultInput).at(-1)!;
      expect(finalStep.elements.some(({ state }) => state === "path")).toBe(false);
      expect(finalStep.edges?.some(({ state }) => state === "path")).toBe(false);
    }
  });

  it("keeps identity stable for pointer-based visualizations", () => {
    const split = algorithms.find(({ meta }) => meta.id === "ft-split")!;
    const splitSteps = split.generateSteps(split.meta.defaultInput);
    // Input characters keep stable ids across every step.
    expect(splitSteps[0].elements.some(({ id }) => id === "c-0")).toBe(true);
    expect(splitSteps.at(-1)!.elements.some(({ id }) => id === "c-0")).toBe(true);
    // Once a word is emitted, its id (w-0) persists to the final step.
    expect(splitSteps.at(-1)!.elements.some(({ id }) => id === "w-0")).toBe(true);
  });

  it("shows Dijkstra's best-known routes before the final result", () => {
    const dijkstra = algorithms.find(({ meta }) => meta.id === "dijkstra")!;
    const steps = dijkstra.generateSteps(dijkstra.meta.defaultInput);
    const progressiveRouteSteps = steps
      .slice(0, -2)
      .filter((step) => step.edges?.some(({ state }) => state === "path"));

    expect(progressiveRouteSteps.length).toBeGreaterThan(2);
    expect(progressiveRouteSteps.every((step) => step.variables?.route)).toBe(true);
  });

  it.each(algorithms.map((algorithm) => [algorithm.meta.id, algorithm] as const))(
    "%s accepts every input pattern",
    (_, algorithm) => {
      const profile = getAlgorithmInputProfile(algorithm.meta);
      for (const pattern of Object.values(profile.patterns)) {
        const steps = algorithm.generateSteps(pattern.values);
        expect(steps.length).toBeGreaterThan(0);
        expect(steps[0].explanation.trim()).not.toBe("");
      }
    }
  );
});
