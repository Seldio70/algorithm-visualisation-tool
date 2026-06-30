import { describe, expect, it } from "vitest";
import { bubbleSort } from "./bubbleSort";
import {
  BUBBLE_SORT_PRESETS,
  parseBubbleSortInput,
} from "./bubbleSortCases";

describe("Bubble Sort input cases", () => {
  it("provides fixed best, average, and worst permutations", () => {
    expect(BUBBLE_SORT_PRESETS.average).toEqual([64, 34, 25, 12, 22, 11, 90]);
    expect(BUBBLE_SORT_PRESETS.best).toEqual([11, 12, 22, 25, 34, 64, 90]);
    expect(BUBBLE_SORT_PRESETS.worst).toEqual([90, 64, 34, 25, 22, 12, 11]);
  });

  it.each([
    ["8, 3, 5, 1", [8, 3, 5, 1]],
    ["8 3 5 1", [8, 3, 5, 1]],
    ["8, 3  5,1", [8, 3, 5, 1]],
    ["9, 3, 9, 1", [9, 3, 9, 1]],
  ])("parses valid custom input %s", (raw, expected) => {
    expect(parseBubbleSortInput(raw)).toEqual({ ok: true, values: expected });
  });

  it.each([
    "",
    "7",
    "1, 2, 3, 4, 5, 6, 7, 8, 9",
    "1, 2.5, 3",
    "1, two, 3",
    "0, 2",
    "1, 100",
    "-1, 2",
  ])("rejects invalid custom input %s", (raw) => {
    expect(parseBubbleSortInput(raw).ok).toBe(false);
  });

  it("makes the sorted preset exit after one pass", () => {
    const bestSteps = bubbleSort.generateSteps(BUBBLE_SORT_PRESETS.best);
    const averageSteps = bubbleSort.generateSteps(BUBBLE_SORT_PRESETS.average);
    const worstSteps = bubbleSort.generateSteps(BUBBLE_SORT_PRESETS.worst);
    const bestResult = bestSteps.at(-1)!;
    const worstResult = worstSteps.at(-1)!;

    expect(bestResult.variables).toMatchObject({
      passes: 1,
      swaps: 0,
      earlyExit: true,
    });
    expect(bestSteps.length).toBeLessThan(averageSteps.length / 2);
    expect(bestSteps.length).toBeLessThan(worstSteps.length / 2);
    expect(worstResult.variables).toMatchObject({
      swaps: 21,
      earlyExit: false,
    });
  });
});
