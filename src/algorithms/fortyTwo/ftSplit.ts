import type { AlgorithmDefinition, Step, ElementState, VisualElement } from "../../types";
import { SPLIT_LEGEND } from "../../constants/legends";

const S = "hello world 42 school";
const SEP = " ";

const CODE = `int count_words(char const *s, char sep) {
  int i = 0, count = 0;
  while (s[i]) {
    if (!is_sep(s[i], sep) && is_sep(s[i + 1], sep))
      count++;
    i++;
  }
  return count;
}

char **ft_split(char const *s, char c) {
  int words = count_words(s, c);
  char **res = malloc(sizeof(char *) * (words + 1));
  if (!res)
    return 0;
  res[words] = 0;
  write_split(res, s, c);
  return res;
}

void write_split(char **res, char const *s, char c) {
  int i = 0, j, word = 0;
  while (s[i]) {
    if (is_sep(s[i], c))
      i++;
    else {
      j = 0;
      while (!is_sep(s[i + j], c))
        j++;
      res[word] = malloc(sizeof(char) * (j + 1));
      write_word(s + i, res[word], c);
      word++;
      i += j;
    }
  }
}`;

function isSep(ch: string | undefined): boolean {
  return ch === undefined || ch === SEP;
}

function makeChars(states: Record<number, ElementState>): VisualElement[] {
  return [...S].map((ch, i) => ({
    id: `c-${i}`,
    value: ch === " " ? "␣" : ch,
    state: states[i] ?? "default",
  }));
}

function makeWords(words: string[], newIndex: number): VisualElement[] {
  return words.map((w, k) => ({
    id: `w-${k}`,
    value: w,
    state: k === newIndex ? "inserting" : "sorted",
    label: `res[${k}]`,
  }));
}

function generateSteps(): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  // Persistent per-char states carried across steps (separators dimmed, copied chars green).
  const base: Record<number, ElementState> = {};

  // Intro
  steps.push({
    id: stepId++,
    elements: makeChars({}),
    highlightedLines: [14, 15],
    explanation: `ft_split breaks "${S}" into an array of words, splitting on '${SEP === " " ? "space" : SEP}'. First it calls count_words to know how many pointers to allocate.`,
    variables: { s: `"${S}"`, sep: "' '" },
  });

  // Phase 1: count_words — emit a step at each detected word end.
  let count = 0;
  for (let i = 0; i < S.length; i++) {
    const isWordEnd = !isSep(S[i]) && isSep(S[i + 1]);
    if (isWordEnd) {
      count++;
      steps.push({
        id: stepId++,
        elements: makeChars({ [i]: "current" }),
        highlightedLines: [3, 4, 5],
        explanation: `count_words: '${S[i]}' is a word char and the next is a separator (or end) — that's a word boundary. count = ${count}.`,
        variables: { i, count },
        pointers: [{ name: "i", targetId: `c-${i}` }],
      });
    }
  }

  // Allocate result array
  steps.push({
    id: stepId++,
    elements: makeChars({}),
    highlightedLines: [16, 18],
    explanation: `count_words returned ${count}. Allocate res = malloc(sizeof(char *) * ${count + 1}) — one slot per word plus a NULL terminator. Now write_split fills it.`,
    variables: { words: count, [`res[${count}]`]: "NULL" },
  });

  // Phase 2: write_split
  const words: string[] = [];
  let i = 0;
  let word = 0;
  while (i < S.length) {
    if (isSep(S[i])) {
      base[i] = "visited";
      i++;
      continue;
    }
    // Measure the word [i, i+j)
    let j = 0;
    while (!isSep(S[i + j])) j++;
    const wordStr = S.slice(i, i + j);

    const measuring: Record<number, ElementState> = { ...base };
    for (let k = i; k < i + j; k++) measuring[k] = "comparing";
    steps.push({
      id: stepId++,
      elements: [...makeChars(measuring), ...makeWords(words, -1)],
      highlightedLines: [26, 27, 28, 29],
      explanation: `Word start at i=${i}. Scan with j until a separator: word = "${wordStr}" (${j} chars). malloc(${j + 1}) for res[${word}] (+1 for '\\0').`,
      variables: { i, j, word, "res[word]": `"${wordStr}"` },
      pointers: [{ name: "i", targetId: `c-${i}` }],
    });

    // write_word: copy chars into res[word]
    for (let k = i; k < i + j; k++) base[k] = "sorted";
    words.push(wordStr);
    steps.push({
      id: stepId++,
      elements: [...makeChars(base), ...makeWords(words, words.length - 1)],
      highlightedLines: [30, 31, 32],
      explanation: `write_word copies "${wordStr}" into res[${word}], then advances i += j. ${words.length} of ${count} words written.`,
      variables: { word, [`res[${word}]`]: `"${wordStr}"` },
    });

    word++;
    i += j;
  }

  // Final
  steps.push({
    id: stepId,
    elements: [...makeChars(base), ...makeWords(words, -1)],
    highlightedLines: [20],
    explanation: `✅ ft_split returns res = [${words.map((w) => `"${w}"`).join(", ")}, NULL]. Each word is its own malloc'd string; the array ends with a NULL pointer.\n\n📚 What to learn: The caller must free every res[i] AND res itself. Forgetting either is a leak — the #1 thing 42's norm/moulinette and Valgrind check in libft.`,
    variables: { returned: `${words.length} words + NULL` },
  });

  return steps;
}

export const ftSplit: AlgorithmDefinition = {
  meta: {
    id: "ft-split",
    name: "ft_split",
    category: "42 Tirana",
    difficulty: "Intermediate",
    layout: "split",
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(n)",
    description:
      "Splits a string into a NULL-terminated array of words by a delimiter — the classic libft ft_split.",
    defaultInput: [0],
    accent: "violet",
    fortyTwoNote: "libft ft_split — foundation for get_next_line, parsing, and most 42 projects.",
    code: CODE,
    legend: SPLIT_LEGEND,
  },
  generateSteps,
};
