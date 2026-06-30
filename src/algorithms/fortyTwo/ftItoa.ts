import type { AlgorithmDefinition, Step, ElementState, VisualElement } from "../../types";
import { ITOA_LEGEND } from "../../constants/legends";

const N = -42;

const CODE = `int get_length(long n) {
  int len = 0;
  if (n <= 0)
    len++;
  while (n != 0) {
    n /= 10;
    len++;
  }
  return len;
}

char *ft_itoa(int n) {
  long num = n;
  int len = get_length(num);
  char *dest = malloc(sizeof(char) * len + 1);
  if (!dest)
    return NULL;
  dest[len] = '\\0';
  if (num < 0) {
    dest[0] = '-';
    num = -num;
  }
  if (num == 0)
    dest[0] = '0';
  while (num > 0) {
    len--;
    dest[len] = (num % 10) + '0';
    num /= 10;
  }
  return dest;
}`;

function getLength(n: number): number {
  let len = 0;
  if (n <= 0) len++;
  while (n !== 0) {
    n = Math.trunc(n / 10);
    len++;
  }
  return len;
}

function makeBuf(buf: string[], states: Record<number, ElementState>): VisualElement[] {
  return buf.map((ch, i) => ({
    id: `d-${i}`,
    value: ch === "" ? "·" : ch,
    state: states[i] ?? "default",
  }));
}

function generateSteps(): Step[] {
  const steps: Step[] = [];
  let stepId = 0;

  const len = getLength(N); // 3 for -42
  const size = len + 1; // includes '\0'
  const buf: string[] = Array(size).fill("");
  const base: Record<number, ElementState> = {};

  steps.push({
    id: stepId++,
    elements: makeBuf(buf, {}),
    highlightedLines: [13, 14],
    explanation: `ft_itoa(${N}): copy n into a long num first — so INT_MIN can be negated safely. Then get_length figures out how many chars the string needs.`,
    variables: { n: N, num: N },
  });

  // get_length walkthrough
  let g = N;
  let runningLen = 0;
  if (g <= 0) {
    runningLen++;
    steps.push({
      id: stepId++,
      elements: makeBuf(buf, {}),
      highlightedLines: [3, 4],
      explanation: `get_length: num <= 0, so reserve one extra slot — for the '-' sign (or the digit '0'). len = ${runningLen}.`,
      variables: { n: g, len: runningLen },
    });
  }
  while (g !== 0) {
    g = Math.trunc(g / 10);
    runningLen++;
    steps.push({
      id: stepId++,
      elements: makeBuf(buf, {}),
      highlightedLines: [5, 6, 7],
      explanation: `get_length: divide by 10 → ${g}, len = ${runningLen}.${g === 0 ? " num is 0, loop ends." : ""}`,
      variables: { n: g, len: runningLen },
    });
  }

  // allocate + null terminator
  buf[len] = "\\0";
  base[len] = "sorted";
  steps.push({
    id: stepId++,
    elements: makeBuf(buf, base),
    highlightedLines: [15, 18],
    explanation: `malloc ${size} bytes (len + 1). Place the null terminator: dest[${len}] = '\\0'. Now fill the digits.`,
    variables: { len, size },
  });

  let num = N;
  let writeIdx = len;

  if (num < 0) {
    buf[0] = "-";
    base[0] = "sorted";
    num = -num;
    steps.push({
      id: stepId++,
      elements: makeBuf(buf, { ...base, 0: "current" }),
      highlightedLines: [19, 20, 21],
      explanation: `num < 0 → write '-' at dest[0], then num = -num = ${num}. The sign slot is the one we reserved earlier.`,
      variables: { num },
      pointers: [{ name: "0", targetId: "d-0" }],
    });
  }

  if (num === 0) {
    buf[0] = "0";
    base[0] = "sorted";
    steps.push({
      id: stepId++,
      elements: makeBuf(buf, { ...base, 0: "current" }),
      highlightedLines: [23, 24],
      explanation: `num == 0 → write the single digit '0'.`,
      variables: { num },
    });
  }

  // fill digits right-to-left
  while (num > 0) {
    writeIdx--;
    const digit = num % 10;
    buf[writeIdx] = String(digit);
    base[writeIdx] = "sorted";
    num = Math.trunc(num / 10);
    steps.push({
      id: stepId++,
      elements: makeBuf(buf, { ...base, [writeIdx]: "current" }),
      highlightedLines: [26, 27, 28],
      explanation: `len-- → ${writeIdx}. dest[${writeIdx}] = (num % 10) + '0' = '${digit}'. Then num /= 10 → ${num}. Digits fill from the right.`,
      variables: { num, digit, len: writeIdx },
      pointers: [{ name: "len", targetId: `d-${writeIdx}` }],
    });
  }

  const result = buf.slice(0, len).join("");
  steps.push({
    id: stepId,
    elements: makeBuf(buf, Object.fromEntries(buf.map((_, i) => [i, "sorted" as ElementState]))),
    highlightedLines: [30],
    explanation: `✅ ft_itoa returns "${result}" (a malloc'd, null-terminated string).\n\n📚 What to learn: copying n into a long is the trick that makes INT_MIN (-2147483648) work — negating it as an int would overflow. The caller owns the returned pointer and must free it.`,
    variables: { returned: `"${result}"` },
  });

  return steps;
}

export const ftItoa: AlgorithmDefinition = {
  meta: {
    id: "ft-itoa",
    name: "ft_itoa",
    category: "42 Tirana",
    difficulty: "Intermediate",
    layout: "linear",
    timeComplexity: { best: "O(d)", average: "O(d)", worst: "O(d)" },
    spaceComplexity: "O(d)",
    description:
      "Converts an int into a malloc'd, null-terminated string — digits filled right-to-left. The classic libft ft_itoa.",
    defaultInput: [0],
    accent: "violet",
    fortyTwoNote: "libft ft_itoa — handles negatives and INT_MIN via a long. Used everywhere you print numbers.",
    code: CODE,
    legend: ITOA_LEGEND,
  },
  generateSteps,
};
