import type { AlgorithmDefinition, Step, ElementState, VisualElement } from "../../types";
import { ATOI_LEGEND } from "../../constants/legends";
import { decodeText, encodeText } from "../inputEncoding";

const CODE = `int ft_atoi(const char *str) {
  int r = 0;
  int sg = 1;
  while (*str == ' ' || *str == '\\t')
    str++;
  if (*str == '-' || *str == '+') {
    if (*str == '-')
      sg = -1;
    str++;
  }
  while (*str >= '0' && *str <= '9') {
    r = r * 10 + (*str - '0');
    str++;
  }
  return (r * sg);
}`;

function display(ch: string): string {
  if (ch === " ") return "␣";
  if (ch === "\t") return "⇥";
  return ch;
}

function makeStr(str: string, states: Record<number, ElementState>): VisualElement[] {
  return [...str].map((ch, i) => ({
    id: `c-${i}`,
    value: display(ch),
    state: states[i] ?? "default",
  }));
}

function generateSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const STR = decodeText(input, "  -42abc");
  const base: Record<number, ElementState> = {};

  let r = 0;
  let sg = 1;
  let i = 0;

  steps.push({
    id: stepId++,
    elements: makeStr(STR, {}),
    highlightedLines: [2, 3],
    explanation: `ft_atoi("${STR}") parses the leading integer. Start with r = 0 (result) and sg = 1 (sign).`,
    variables: { r, sg, str: `"${STR}"` },
  });

  // Skip whitespace
  while (STR[i] === " " || STR[i] === "\t") {
    steps.push({
      id: stepId++,
      elements: makeStr(STR, { ...base, [i]: "current" }),
      highlightedLines: [4, 5],
      explanation: `str[${i}] is whitespace ('${display(STR[i])}') → skip it.`,
      variables: { r, sg },
      pointers: [{ name: "str", targetId: `c-${i}` }],
    });
    base[i] = "visited";
    i++;
  }

  // Sign
  if (STR[i] === "-" || STR[i] === "+") {
    if (STR[i] === "-") sg = -1;
    steps.push({
      id: stepId++,
      elements: makeStr(STR, { ...base, [i]: "inserting" }),
      highlightedLines: [6, 7, 8],
      explanation: `str[${i}] = '${STR[i]}' is a sign → sg = ${sg}, then move past it.`,
      variables: { r, sg },
      pointers: [{ name: "str", targetId: `c-${i}` }],
    });
    base[i] = "sorted";
    i++;
  }

  // Digits
  while (STR[i] >= "0" && STR[i] <= "9") {
    const digit = STR.charCodeAt(i) - 48;
    r = r * 10 + digit;
    steps.push({
      id: stepId++,
      elements: makeStr(STR, { ...base, [i]: "current" }),
      highlightedLines: [12, 13, 14],
      explanation: `str[${i}] = '${STR[i]}' is a digit → r = r * 10 + ${digit} = ${r}.`,
      variables: { r, sg, digit },
      pointers: [{ name: "str", targetId: `c-${i}` }],
    });
    base[i] = "sorted";
    i++;
  }

  // Stop on first non-digit (if any)
  if (i < STR.length) {
    steps.push({
      id: stepId++,
      elements: makeStr(STR, { ...base, [i]: "comparing" }),
      highlightedLines: [12],
      explanation: `str[${i}] = '${STR[i]}' is not a digit → stop parsing. The rest of the string is ignored.`,
      variables: { r, sg },
      pointers: [{ name: "str", targetId: `c-${i}` }],
    });
  }

  steps.push({
    id: stepId,
    elements: makeStr(STR, base),
    highlightedLines: [16],
    explanation: `✅ ft_atoi returns r * sg = ${r} * ${sg} = ${r * sg}.\n\n📚 What to learn: this version (like the original) doesn't guard against int overflow on huge inputs — the strict libft/get_next_line use cases usually do. Note '+'/'-' is read only once, and parsing halts at the first non-digit.`,
    variables: { result: r * sg },
  });

  return steps;
}

export const ftAtoi: AlgorithmDefinition = {
  meta: {
    id: "ft-atoi",
    name: "ft_atoi",
    category: "42 Tirana",
    difficulty: "Beginner",
    layout: "linear",
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    description:
      "Parses the leading integer from a string: skip whitespace, read an optional sign, then accumulate digits (r = r * 10 + digit).",
    defaultInput: encodeText("  -42abc"),
    accent: "violet",
    fortyTwoNote: "libft ft_atoi — the inverse of ft_itoa; core to parsing input across 42 projects.",
    code: CODE,
    legend: ATOI_LEGEND,
  },
  generateSteps,
};
