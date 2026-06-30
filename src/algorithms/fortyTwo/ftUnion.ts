import type { AlgorithmDefinition, Step, ElementState, VisualElement } from "../../types";
import { UNION_LEGEND } from "../../constants/legends";

const S1 = "hello";
const S2 = "world";

const CODE = `void ft_union(char *s1, char *s2) {
  char seen[256] = {0};
  int i = 0;
  while (s1[i]) {
    if (seen[(unsigned char)s1[i]] == 0) {
      write(1, &s1[i], 1);
      seen[(unsigned char)s1[i]] = 1;
    }
    i++;
  }
  i = 0;
  while (s2[i]) {
    if (seen[(unsigned char)s2[i]] == 0) {
      write(1, &s2[i], 1);
      seen[(unsigned char)s2[i]] = 1;
    }
    i++;
  }
}`;

function chars(prefix: string, s: string, states: Record<number, ElementState>): VisualElement[] {
  return [...s].map((ch, i) => ({ id: `${prefix}-${i}`, value: ch, state: states[i] ?? "default" }));
}

function makeSet(order: string[], justAdded: string | null): VisualElement[] {
  return order.map((c, k) => ({
    id: `set-${k}`,
    value: c,
    state: c === justAdded ? ("inserting" as ElementState) : ("sorted" as ElementState),
  }));
}

function makeOut(out: string[], justAdded: boolean): VisualElement[] {
  return out.map((c, k) => ({
    id: `o-${k}`,
    value: c,
    state: justAdded && k === out.length - 1 ? ("inserting" as ElementState) : ("sorted" as ElementState),
  }));
}

function generateSteps(): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const seen: Record<string, boolean> = {};
  const order: string[] = [];
  const out: string[] = [];
  const baseA: Record<number, ElementState> = {};
  const baseB: Record<number, ElementState> = {};

  const snapshot = (
    aStates: Record<number, ElementState>,
    bStates: Record<number, ElementState>,
    justAddedSet: string | null,
    justAddedOut: boolean
  ): VisualElement[] => [
    ...chars("a", S1, aStates),
    ...chars("b", S2, bStates),
    ...makeSet(order, justAddedSet),
    ...makeOut(out, justAddedOut),
  ];

  steps.push({
    id: stepId++,
    elements: snapshot({}, {}, null, false),
    highlightedLines: [1, 2],
    explanation: `ft_union prints every character of s1 then s2, but each character only once. A seen[256] table acts as a set to remember what's already been printed.`,
    variables: { s1: `"${S1}"`, s2: `"${S2}"` },
  });

  const scan = (
    s: string,
    prefix: "a" | "b",
    base: Record<number, ElementState>,
    otherBase: Record<number, ElementState>,
    lines: { write: number[]; skip: number[] }
  ) => {
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      const aStates = prefix === "a" ? base : otherBase;
      const bStates = prefix === "b" ? base : otherBase;
      if (!seen[c]) {
        seen[c] = true;
        order.push(c);
        out.push(c);
        base[i] = "sorted";
        steps.push({
          id: stepId++,
          elements: snapshot(
            prefix === "a" ? { ...base, [i]: "current" } : aStates,
            prefix === "b" ? { ...base, [i]: "current" } : bStates,
            c,
            true
          ),
          highlightedLines: lines.write,
          explanation: `${prefix === "a" ? "s1" : "s2"}[${i}] = '${c}' is not in seen → write it and mark seen['${c}'] = 1.`,
          variables: { i, char: `'${c}'`, output: `"${out.join("")}"` },
          pointers: [{ name: "i", targetId: `${prefix}-${i}` }],
        });
      } else {
        base[i] = "visited";
        steps.push({
          id: stepId++,
          elements: snapshot(
            prefix === "a" ? { ...base, [i]: "comparing" } : aStates,
            prefix === "b" ? { ...base, [i]: "comparing" } : bStates,
            null,
            false
          ),
          highlightedLines: lines.skip,
          explanation: `${prefix === "a" ? "s1" : "s2"}[${i}] = '${c}' is already in seen → skip it (no duplicates).`,
          variables: { i, char: `'${c}'`, output: `"${out.join("")}"` },
          pointers: [{ name: "i", targetId: `${prefix}-${i}` }],
        });
      }
    }
  };

  scan(S1, "a", baseA, baseB, { write: [5, 6, 7], skip: [5, 9] });

  steps.push({
    id: stepId++,
    elements: snapshot(baseA, baseB, null, false),
    highlightedLines: [12, 13],
    explanation: `Done with s1. Reset i = 0 and scan s2 with the SAME seen[] table — so characters already printed from s1 are skipped.`,
    variables: { output: `"${out.join("")}"` },
  });

  scan(S2, "b", baseB, baseA, { write: [14, 15, 16], skip: [14, 18] });

  steps.push({
    id: stepId++,
    elements: snapshot(baseA, baseB, null, false),
    highlightedLines: [19],
    explanation: `✅ ft_union prints "${out.join("")}" — the union of s1 and s2, each character once, in order of first appearance.\n\n📚 What to learn: a 256-entry array indexed by (unsigned char) is the standard O(1) "set" trick for ASCII. Casting to unsigned char avoids negative indexing on bytes ≥ 128.`,
    variables: { result: `"${out.join("")}"` },
  });

  return steps;
}

export const ftUnion: AlgorithmDefinition = {
  meta: {
    id: "ft-union",
    name: "ft_union",
    category: "42 Tirana",
    difficulty: "Beginner",
    layout: "string-set",
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    description:
      "Prints the union of two strings — every character from s1 then s2, each one only once, using a seen[256] set.",
    defaultInput: [0],
    accent: "violet",
    fortyTwoNote: "42 exam (Rank 02) — the seen[256] set pattern reappears in many pool/exam exercises.",
    code: CODE,
    legend: UNION_LEGEND,
  },
  generateSteps,
};
