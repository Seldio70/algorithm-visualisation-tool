import type { AlgorithmDefinition, Step, ElementState, VisualElement } from "../../types";
import { LAST_WORD_LEGEND } from "../../constants/legends";

const STR = "Hello World  ";

const CODE = `int is_space(char c) {
  return (c == ' ' || c == '\\t');
}

void last_word(char *str) {
  int i = 0;
  int end;
  while (str[i])
    i++;
  while (i > 0 && is_space(str[i - 1]))
    i--;
  end = i;
  while (i > 0 && !is_space(str[i - 1]))
    i--;
  while (i < end)
    write(1, &str[i++], 1);
}`;

function isSpace(ch: string | undefined): boolean {
  return ch === " " || ch === "\t";
}

function display(ch: string): string {
  if (ch === " ") return "␣";
  if (ch === "\t") return "⇥";
  return ch;
}

function makeStr(states: Record<number, ElementState>, pointers: Record<number, string>) {
  const els: VisualElement[] = [...STR].map((ch, i) => ({
    id: `c-${i}`,
    value: display(ch),
    state: states[i] ?? "default",
  }));
  const ptrs = Object.entries(pointers).map(([idx, name]) => ({ name, targetId: `c-${idx}` }));
  return { els, ptrs };
}

function generateSteps(): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const base: Record<number, ElementState> = {};
  let i = 0;

  const push = (
    lines: number[],
    explanation: string,
    transient: Record<number, ElementState>,
    pointers: Record<number, string>,
    variables: Record<string, number | string>
  ) => {
    const { els, ptrs } = makeStr({ ...base, ...transient }, pointers);
    steps.push({ id: stepId++, elements: els, highlightedLines: lines, explanation, variables, pointers: ptrs });
  };

  push(
    [5, 6],
    `last_word("${STR}") prints only the final word. The string has trailing spaces — note the ␣ markers.`,
    {},
    {},
    { str: `"${STR}"` }
  );

  // Walk to the end of the string
  i = STR.length;
  push(
    [8, 9],
    `Walk i to the end of the string: i = ${i} (the '\\0').`,
    {},
    { [STR.length - 1]: "i" },
    { i }
  );

  // Skip trailing spaces
  while (i > 0 && isSpace(STR[i - 1])) {
    i--;
    base[i] = "visited";
    push(
      [10, 11],
      `str[${i}] = '${display(STR[i])}' is a trailing space → i-- (now ${i}).`,
      { [i]: "comparing" },
      { [i]: "i" },
      { i }
    );
  }

  const end = i;
  push(
    [12],
    `No more trailing spaces. Mark end = i = ${end}: this is where the last word stops.`,
    {},
    { [Math.min(end, STR.length - 1)]: "end" },
    { i, end }
  );

  // Walk back over the last word
  while (i > 0 && !isSpace(STR[i - 1])) {
    i--;
    base[i] = "sorted";
    push(
      [13, 14],
      `str[${i}] = '${display(STR[i])}' is part of the word → i-- (now ${i}).`,
      { [i]: "current" },
      { [i]: "i", [Math.min(end, STR.length - 1)]: "end" },
      { i, end }
    );
  }

  // Write [i, end)
  const word = STR.slice(i, end);
  push(
    [15, 16],
    `✅ Write str[i..end): "${word}". last_word found the final word by scanning backwards.\n\n📚 What to learn: scanning from the end (skip trailing spaces, then skip the word) avoids tracking every word. is_space treats both ' ' and '\\t' as separators.`,
    Object.fromEntries(Array.from({ length: end - i }, (_, k) => [i + k, "sorted" as ElementState])),
    { [i]: "i", [Math.min(end, STR.length - 1)]: "end" },
    { result: `"${word}"` }
  );

  return steps;
}

export const lastWord: AlgorithmDefinition = {
  meta: {
    id: "last-word",
    name: "last_word",
    category: "42 Tirana",
    difficulty: "Beginner",
    layout: "linear",
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    description:
      "Prints the last word of a string by scanning backwards: skip trailing spaces, mark the end, then walk back over the word.",
    defaultInput: [0],
    accent: "violet",
    fortyTwoNote: "42 exam (Rank 02) — classic backwards-scan string exercise.",
    code: CODE,
    legend: LAST_WORD_LEGEND,
  },
  generateSteps,
};
