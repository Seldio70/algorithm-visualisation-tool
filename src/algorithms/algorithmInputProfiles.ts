import type { AlgorithmMeta } from "../types";
import { encodeText, encodeTextPair } from "./inputEncoding";

export type AlgorithmInputSource = "best" | "average" | "worst" | "custom";
export type AlgorithmInputPreset = Exclude<AlgorithmInputSource, "custom">;

interface InputPattern {
  label: string;
  values: number[];
}

export interface AlgorithmInputProfile {
  patterns: Record<AlgorithmInputPreset, InputPattern>;
  customLabel: string;
  placeholder: string;
  help: string;
  parse: (raw: string) => { ok: true; values: number[] } | { ok: false; error: string };
}

function parseNumberList(
  raw: string,
  options: { minItems: number; maxItems: number; min: number; max: number }
) {
  const tokens = raw.trim().split(/[\s,]+/).filter(Boolean);
  if (tokens.length < options.minItems || tokens.length > options.maxItems) {
    return { ok: false as const, error: `Use ${options.minItems}–${options.maxItems} values.` };
  }
  if (tokens.some((token) => !/^-?\d+$/.test(token))) {
    return { ok: false as const, error: "Use whole numbers separated by commas or spaces." };
  }
  const values = tokens.map(Number);
  if (values.some((value) => value < options.min || value > options.max)) {
    return { ok: false as const, error: `Values must be between ${options.min} and ${options.max}.` };
  }
  return { ok: true as const, values };
}

function arrayProfile(
  meta: AlgorithmMeta,
  overrides?: Partial<Record<AlgorithmInputPreset, InputPattern>>
): AlgorithmInputProfile {
  const average = [...meta.defaultInput];
  const ascending = [...average].sort((a, b) => a - b);
  const descending = [...ascending].reverse();
  return {
    patterns: {
      best: overrides?.best ?? { label: "Sorted values", values: ascending },
      average: overrides?.average ?? { label: "Mixed values", values: average },
      worst: overrides?.worst ?? { label: "Reverse values", values: descending },
    },
    customLabel: "Use your own values",
    placeholder: "8, 3, 5, 1",
    help: "Enter 2–8 whole numbers from 0–99.",
    parse: (raw) => parseNumberList(raw, { minItems: 2, maxItems: 8, min: 0, max: 99 }),
  };
}

function textProfile(
  patterns: Record<AlgorithmInputPreset, InputPattern>,
  placeholder: string,
  help = "Enter 1–24 characters."
): AlgorithmInputProfile {
  return {
    patterns,
    customLabel: "Use your own text",
    placeholder,
    help,
    parse: (raw) => {
      if (!raw.length || raw.length > 24) {
        return { ok: false, error: "Use between 1 and 24 characters." };
      }
      return { ok: true, values: encodeText(raw) };
    },
  };
}

function pairedTextProfile(
  patterns: Record<AlgorithmInputPreset, InputPattern>,
  placeholder: string,
  help: string
): AlgorithmInputProfile {
  return {
    patterns,
    customLabel: "Use your own values",
    placeholder,
    help,
    parse: (raw) => {
      const parts = raw.split("|").map((part) => part.trim());
      if (parts.length !== 2 || !parts[0] || !parts[1]) {
        return { ok: false, error: "Separate the two values with |." };
      }
      if (parts[0].length > 18 || parts[1].length > 18) {
        return { ok: false, error: "Keep each value at 18 characters or fewer." };
      }
      return { ok: true, values: encodeTextPair(parts[0], parts[1]) };
    },
  };
}

function searchProfile(meta: AlgorithmMeta): AlgorithmInputProfile {
  const defaultArray = meta.defaultInput.slice(0, -1);
  const defaultTarget = meta.defaultInput.at(-1) ?? defaultArray[0];
  const firstTarget = defaultArray[0];
  const lastTarget = defaultArray.at(-1) ?? firstTarget;
  return {
    patterns: {
      best: { label: "Target near start", values: [...defaultArray, firstTarget] },
      average: { label: "Target in middle", values: [...defaultArray, defaultTarget] },
      worst: { label: "Target near end", values: [...defaultArray, lastTarget] },
    },
    customLabel: "Use your own values",
    placeholder: "4, 2, 7, 1 | 7",
    help: "Enter array values, then | and the target.",
    parse: (raw) => {
      const [arrayRaw, targetRaw, ...extra] = raw.split("|");
      if (extra.length || targetRaw === undefined || !/^-?\d+$/.test(targetRaw.trim())) {
        return { ok: false, error: "Use the format: 4, 2, 7, 1 | 7" };
      }
      const parsed = parseNumberList(arrayRaw, { minItems: 2, maxItems: 8, min: 0, max: 99 });
      if (!parsed.ok) return parsed;
      const target = Number(targetRaw.trim());
      if (target < 0 || target > 99) return { ok: false, error: "Target must be between 0 and 99." };
      return { ok: true, values: [...parsed.values, target] };
    },
  };
}

export function getAlgorithmInputProfile(meta: AlgorithmMeta): AlgorithmInputProfile {
  if (["bubble-sort", "selection-sort", "insertion-sort", "merge-sort", "quick-sort"].includes(meta.id)) {
    if (meta.id === "bubble-sort") {
      const ascending = [...meta.defaultInput].sort((a, b) => a - b);
      return arrayProfile(meta, {
        best: { label: "Best case", values: ascending },
        average: { label: "Average case", values: [...meta.defaultInput] },
        worst: { label: "Worst case", values: [...ascending].reverse() },
      });
    }
    return arrayProfile(meta);
  }
  if (meta.id === "two-pointers") {
    const profile = searchProfile(meta);
    profile.patterns = {
      best: { label: "Pair at both ends", values: [1, 2, 4, 6, 8, 9, 11, 15, 16] },
      average: { label: "Pair inside array", values: [...meta.defaultInput] },
      worst: { label: "No matching pair", values: [1, 2, 4, 6, 8, 9, 11, 15, 99] },
    };
    profile.help = "Enter sorted values, then | and the target sum.";
    return profile;
  }
  if (["linear-search", "binary-search"].includes(meta.id)) {
    return searchProfile(meta);
  }
  if (["bfs", "dfs"].includes(meta.id)) {
    return {
      patterns: {
        best: { label: "Start at node A", values: [0] },
        average: { label: "Start at node C", values: [2] },
        worst: { label: "Start at node F", values: [5] },
      },
      customLabel: "Use your own start node",
      placeholder: "0–5",
      help: "Choose a node index from 0 (A) to 5 (F).",
      parse: (raw) => parseNumberList(raw, { minItems: 1, maxItems: 1, min: 0, max: 5 }),
    };
  }
  if (meta.id === "dijkstra") {
    return {
      patterns: {
        best: { label: "Route A → B", values: [0, 1] },
        average: { label: "Route A → E", values: [0, 4] },
        worst: { label: "Route E → A", values: [4, 0] },
      },
      customLabel: "Use source and target",
      placeholder: "0, 4",
      help: "Enter source and target node indices from 0 (A) to 4 (E).",
      parse: (raw) => parseNumberList(raw, { minItems: 2, maxItems: 2, min: 0, max: 4 }),
    };
  }
  if (meta.id === "fibonacci") {
    return {
      patterns: {
        best: { label: "Small n = 3", values: [3] },
        average: { label: "Medium n = 5", values: [5] },
        worst: { label: "Large n = 8", values: [8] },
      },
      customLabel: "Use your own n",
      placeholder: "0–8",
      help: "Choose n from 0–8 to keep the recursive animation manageable.",
      parse: (raw) => parseNumberList(raw, { minItems: 1, maxItems: 1, min: 0, max: 8 }),
    };
  }
  if (["tree-traversal", "bst-insert"].includes(meta.id)) {
    const profile = arrayProfile(meta, {
      best: { label: "Balanced tree", values: [8, 3, 10, 1, 6, 14, 4] },
      average: { label: "Mixed tree", values: [...meta.defaultInput] },
      worst: { label: "Skewed tree", values: [1, 2, 3, 4, 5, 6] },
    });
    profile.help = "Enter 2–8 whole-number node values from 1–99.";
    profile.parse = (raw) => parseNumberList(raw, { minItems: 2, maxItems: 8, min: 1, max: 99 });
    return profile;
  }
  if (meta.id === "ft-itoa") {
    return {
      patterns: {
        best: { label: "Single digit", values: [7] },
        average: { label: "Negative number", values: [-42] },
        worst: { label: "INT_MIN", values: [-2147483648] },
      },
      customLabel: "Use your own integer",
      placeholder: "-42",
      help: "Enter one 32-bit signed integer.",
      parse: (raw) => parseNumberList(raw, { minItems: 1, maxItems: 1, min: -2147483648, max: 2147483647 }),
    };
  }
  if (meta.id === "ft-atoi") {
    return textProfile({
      best: { label: "Digits only", values: encodeText("42") },
      average: { label: "Signed text", values: encodeText("  -42abc") },
      worst: { label: "Long prefix", values: encodeText("\t  +12345xyz") },
    }, "  -42abc");
  }
  if (meta.id === "last-word") {
    return textProfile({
      best: { label: "Single word", values: encodeText("Hello") },
      average: { label: "Trailing spaces", values: encodeText("Hello World  ") },
      worst: { label: "Many words", values: encodeText("one two three final   ") },
    }, "Hello World  ");
  }
  if (meta.id === "ft-split") {
    const profile = pairedTextProfile({
      best: { label: "Single word", values: encodeTextPair("hello", " ") },
      average: { label: "Space-separated", values: encodeTextPair("hello world 42", " ") },
      worst: { label: "Repeated delimiters", values: encodeTextPair("one,,two,,,three", ",") },
    }, "hello world | space", "Enter text, then | and one delimiter. Write “space” for a space.");
    profile.parse = (raw) => {
      const separatorAt = raw.lastIndexOf("|");
      if (separatorAt < 1) return { ok: false, error: "Use the format: hello world | space" };
      const source = raw.slice(0, separatorAt).trim();
      const rawDelimiter = raw.slice(separatorAt + 1).trim();
      const delimiter = rawDelimiter.toLowerCase() === "space" ? " " : rawDelimiter;
      if (!source || source.length > 24 || delimiter.length !== 1) {
        return { ok: false, error: "Use 1–24 text characters and exactly one delimiter." };
      }
      return { ok: true, values: encodeTextPair(source, delimiter) };
    };
    return profile;
  }
  if (["ft-union", "ft-inter"].includes(meta.id)) {
    return pairedTextProfile({
      best: { label: "Short strings", values: encodeTextPair("abc", "bcd") },
      average: { label: "Some overlap", values: encodeTextPair("hello", "world") },
      worst: { label: "Many duplicates", values: encodeTextPair("aabbcc", "bbccdd") },
    }, "hello | world", "Enter two strings separated by |.");
  }
  return arrayProfile(meta);
}
