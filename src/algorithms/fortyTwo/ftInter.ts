import type { AlgorithmDefinition, Step, ElementState, VisualElement } from "../../types";
import { INTER_LEGEND } from "../../constants/legends";

const S1 = "hello";
const S2 = "world";

const CODE = `void ft_inter(char *s1, char *s2) {
  int i = 0;
  char map[256] = {0};
  while (s2[i]) {
    map[(unsigned char)s2[i]] = 1;
    i++;
  }
  i = 0;
  while (s1[i]) {
    if (map[(unsigned char)s1[i]] == 1) {
      write(1, &s1[i], 1);
      map[(unsigned char)s1[i]] = 0;
    }
    i++;
  }
}`;

function chars(prefix: string, s: string, states: Record<number, ElementState>): VisualElement[] {
  return [...s].map((ch, i) => ({ id: `${prefix}-${i}`, value: ch, state: states[i] ?? "default" }));
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
  const map: Record<string, number> = {};
  const order: string[] = []; // unique chars of s2, in insertion order
  const out: string[] = [];
  const baseA: Record<number, ElementState> = {};
  const baseB: Record<number, ElementState> = {};

  const makeMap = (highlight: string | null): VisualElement[] =>
    order.map((c, k) => ({
      id: `set-${k}`,
      value: c,
      state:
        map[c] === 1
          ? c === highlight
            ? ("inserting" as ElementState)
            : ("sorted" as ElementState)
          : ("visited" as ElementState),
    }));

  const snapshot = (
    aStates: Record<number, ElementState>,
    bStates: Record<number, ElementState>,
    mapHighlight: string | null,
    justAddedOut: boolean
  ): VisualElement[] => [
    ...chars("a", S1, aStates),
    ...chars("b", S2, bStates),
    ...makeMap(mapHighlight),
    ...makeOut(out, justAddedOut),
  ];

  steps.push({
    id: stepId++,
    elements: snapshot({}, {}, null, false),
    highlightedLines: [1, 3],
    explanation: `ft_inter prints the intersection: characters of s1 that also appear in s2, each only once. First it marks every char of s2 in a map[256] table.`,
    variables: { s1: `"${S1}"`, s2: `"${S2}"` },
  });

  // Phase 1: build map from s2
  for (let i = 0; i < S2.length; i++) {
    const c = S2[i];
    const isNew = map[c] !== 1;
    map[c] = 1;
    if (isNew) order.push(c);
    baseB[i] = "sorted";
    steps.push({
      id: stepId++,
      elements: snapshot({}, { ...baseB, [i]: "current" }, c, false),
      highlightedLines: [4, 5, 6],
      explanation: `Mark s2[${i}] = '${c}' in the map: map['${c}'] = 1.${isNew ? "" : " (already marked)"}`,
      variables: { i, char: `'${c}'` },
      pointers: [{ name: "i", targetId: `b-${i}` }],
    });
  }

  steps.push({
    id: stepId++,
    elements: snapshot({}, baseB, null, false),
    highlightedLines: [8, 9],
    explanation: `The map now holds every character of s2. Reset i = 0 and scan s1, printing only chars that are in the map.`,
    variables: {},
  });

  // Phase 2: scan s1
  for (let i = 0; i < S1.length; i++) {
    const c = S1[i];
    if (map[c] === 1) {
      out.push(c);
      map[c] = 0; // consume so it prints only once
      baseA[i] = "sorted";
      steps.push({
        id: stepId++,
        elements: snapshot({ ...baseA, [i]: "current" }, baseB, c, true),
        highlightedLines: [10, 11, 12],
        explanation: `s1[${i}] = '${c}' is in the map → print it, then set map['${c}'] = 0 so a repeat won't print again.`,
        variables: { i, char: `'${c}'`, output: `"${out.join("")}"` },
        pointers: [{ name: "i", targetId: `a-${i}` }],
      });
    } else {
      baseA[i] = "visited";
      steps.push({
        id: stepId++,
        elements: snapshot({ ...baseA, [i]: "comparing" }, baseB, null, false),
        highlightedLines: [10, 14],
        explanation: `s1[${i}] = '${c}' is ${map[c] === 0 && order.includes(c) ? "already consumed" : "not in s2"} → skip it.`,
        variables: { i, char: `'${c}'`, output: `"${out.join("")}"` },
        pointers: [{ name: "i", targetId: `a-${i}` }],
      });
    }
  }

  steps.push({
    id: stepId,
    elements: snapshot(baseA, baseB, null, false),
    highlightedLines: [16],
    explanation: `✅ ft_inter prints "${out.join("")}" — characters present in both strings, each once, in s1's order.\n\n📚 What to learn: setting map = 0 after printing is what dedupes the output. The two passes give O(n + m) time with a fixed 256-byte table (O(1) space).`,
    variables: { result: `"${out.join("")}"` },
  });

  return steps;
}

export const ftInter: AlgorithmDefinition = {
  meta: {
    id: "ft-inter",
    name: "ft_inter",
    category: "42 Tirana",
    difficulty: "Beginner",
    layout: "string-set",
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    description:
      "Prints the intersection of two strings — characters in s1 that also appear in s2, each only once, using a map[256] lookup.",
    defaultInput: [0],
    accent: "violet",
    fortyTwoNote: "42 exam (Rank 02) — companion to ft_union; same 256-entry lookup-table technique.",
    code: CODE,
    legend: INTER_LEGEND,
  },
  generateSteps,
};
