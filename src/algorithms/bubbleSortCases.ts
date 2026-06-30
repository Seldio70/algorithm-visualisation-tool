export type BubbleSortPreset = "best" | "average" | "worst";
export type BubbleSortInputSource = BubbleSortPreset | "custom";

const AVERAGE_INPUT = [64, 34, 25, 12, 22, 11, 90];

export const BUBBLE_SORT_PRESETS: Record<BubbleSortPreset, number[]> = {
  best: [...AVERAGE_INPUT].sort((a, b) => a - b),
  average: [...AVERAGE_INPUT],
  worst: [...AVERAGE_INPUT].sort((a, b) => b - a),
};

export type BubbleSortInputResult =
  | { ok: true; values: number[] }
  | { ok: false; error: string };

export function parseBubbleSortInput(raw: string): BubbleSortInputResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: "Enter between 2 and 8 numbers." };
  }

  const tokens = trimmed.split(/[\s,]+/);
  if (tokens.length < 2 || tokens.length > 8) {
    return { ok: false, error: "Use between 2 and 8 numbers." };
  }

  if (tokens.some((token) => !/^\d+$/.test(token))) {
    return { ok: false, error: "Use whole numbers only, separated by commas or spaces." };
  }

  const values = tokens.map(Number);
  if (values.some((value) => value < 1 || value > 99)) {
    return { ok: false, error: "Every number must be between 1 and 99." };
  }

  return { ok: true, values };
}
