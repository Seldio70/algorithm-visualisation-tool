import { useState, type FormEvent } from "react";
import {
  BUBBLE_SORT_PRESETS,
  parseBubbleSortInput,
  type BubbleSortInputSource,
  type BubbleSortPreset,
} from "../algorithms/bubbleSortCases";

interface BubbleSortInputControlsProps {
  activeSource: BubbleSortInputSource;
  onApply: (input: number[], source: BubbleSortInputSource) => void;
}

const SOURCE_LABELS: Record<BubbleSortInputSource, string> = {
  best: "Best case",
  average: "Average case",
  worst: "Worst case",
  custom: "Custom",
};

export function BubbleSortInputControls({
  activeSource,
  onApply,
}: BubbleSortInputControlsProps) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  const applyPreset = (preset: BubbleSortPreset) => {
    setError(null);
    onApply([...BUBBLE_SORT_PRESETS[preset]], preset);
  };

  const applyCustom = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = parseBubbleSortInput(draft);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    setError(null);
    onApply(result.values, "custom");
  };

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="bubble-sort-case" className="sr-only">
          Bubble Sort input case
        </label>
        <select
          id="bubble-sort-case"
          value={activeSource === "custom" ? "" : activeSource}
          onChange={(event) => applyPreset(event.target.value as BubbleSortPreset)}
          className="glass-control h-11 min-w-32 rounded-xl px-3 text-xs text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 sm:h-9"
          aria-label="Bubble Sort input case"
        >
          <option value="" disabled>
            Preset cases
          </option>
          <option value="best">Best case</option>
          <option value="average">Average case</option>
          <option value="worst">Worst case</option>
        </select>

        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-[10px] font-medium text-cyan-300">
          Active: {SOURCE_LABELS[activeSource]}
        </span>

        <form
          onSubmit={applyCustom}
          className="flex min-w-0 basis-full gap-2 sm:basis-auto sm:flex-1"
        >
          <label htmlFor="bubble-sort-custom-input" className="sr-only">
            Custom Bubble Sort array
          </label>
          <input
            id="bubble-sort-custom-input"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            spellCheck={false}
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. 8, 3, 5, 1"
            aria-label="Custom Bubble Sort array"
            aria-describedby={error ? "bubble-sort-input-error" : "bubble-sort-input-help"}
            aria-invalid={Boolean(error)}
            className="glass-field h-11 min-w-0 flex-1 rounded-xl px-3 font-mono text-xs text-slate-100 outline-none placeholder:text-slate-600 focus-visible:ring-2 focus-visible:ring-cyan-400/60 sm:h-9"
          />
          <button
            type="submit"
            className="h-11 shrink-0 rounded-xl bg-cyan-400 px-3 text-xs font-semibold text-slate-950 shadow-lg shadow-cyan-500/15 transition-colors hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 sm:h-9"
          >
            Apply
          </button>
        </form>
      </div>

      {error ? (
        <p id="bubble-sort-input-error" role="alert" className="text-[11px] text-rose-300">
          {error}
        </p>
      ) : (
        <p id="bubble-sort-input-help" className="text-[10px] text-slate-500">
          Enter 2–8 whole numbers from 1–99, separated by commas or spaces.
        </p>
      )}
    </div>
  );
}
