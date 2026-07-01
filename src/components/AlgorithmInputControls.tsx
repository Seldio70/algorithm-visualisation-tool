import { useMemo, useState, type FormEvent } from "react";
import type { AlgorithmMeta, ThemeAccent } from "../types";
import {
  getAlgorithmInputProfile,
  type AlgorithmInputPreset,
  type AlgorithmInputSource,
} from "../algorithms/algorithmInputProfiles";

interface AlgorithmInputControlsProps {
  meta: AlgorithmMeta;
  accent: ThemeAccent;
  activeSource: AlgorithmInputSource;
  onApply: (input: number[], source: AlgorithmInputSource) => void;
}

export function AlgorithmInputControls({
  meta,
  accent,
  activeSource,
  onApply,
}: AlgorithmInputControlsProps) {
  const profile = useMemo(() => getAlgorithmInputProfile(meta), [meta]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const activeLabel = activeSource === "custom"
    ? "Custom"
    : profile.patterns[activeSource].label;

  const applyPreset = (preset: AlgorithmInputPreset) => {
    setError(null);
    onApply([...profile.patterns[preset].values], preset);
  };

  const applyCustom = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = profile.parse(draft);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    onApply(result.values, "custom");
  };

  const customAriaLabel = meta.id === "bubble-sort"
    ? "Custom Bubble Sort array"
    : `Custom ${meta.name} values`;
  const focusRing = accent === "violet"
    ? "focus-visible:ring-violet-400/50"
    : "focus-visible:ring-cyan-400/50";
  const primary = accent === "violet"
    ? "bg-violet-400 hover:bg-violet-300 shadow-violet-500/15 focus-visible:ring-violet-200"
    : "bg-cyan-400 hover:bg-cyan-300 shadow-cyan-500/15 focus-visible:ring-cyan-200";
  const activeTone = accent === "violet"
    ? "border-violet-400/20 bg-violet-400/[0.08] text-violet-300"
    : "border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-300";
  const activeDot = accent === "violet" ? "bg-violet-400" : "bg-cyan-400";

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-40 flex-1 sm:max-w-52">
          <label
            htmlFor={`${meta.id}-input-pattern`}
            className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500"
          >
            Input pattern
          </label>
          <div className="relative">
            <select
              id={`${meta.id}-input-pattern`}
              value={activeSource === "custom" ? "" : activeSource}
              onChange={(event) => applyPreset(event.target.value as AlgorithmInputPreset)}
              aria-label={`${meta.name} input case`}
              className={`algorithm-input-select h-10 w-full appearance-none rounded-xl border border-white/12 bg-slate-950/80 px-3 pr-9 text-xs font-semibold text-slate-100 outline-none transition hover:border-white/25 focus-visible:ring-2 ${focusRing}`}
            >
              <option value="" disabled>Input patterns</option>
              {(["best", "average", "worst"] as const).map((preset) => (
                <option key={preset} value={preset}>
                  {profile.patterns[preset].label}
                </option>
              ))}
            </select>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
            >
              <path fillRule="evenodd" d="M5.22 7.72a.75.75 0 0 1 1.06 0L10 11.44l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.78a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <form onSubmit={applyCustom} className="flex min-w-0 basis-full items-end gap-2 sm:basis-auto sm:flex-1">
          <div className="min-w-0 flex-1">
            <label
              htmlFor={`${meta.id}-custom-input`}
              className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500"
            >
              Use your own values
            </label>
            <input
              id={`${meta.id}-custom-input`}
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value);
                if (error) setError(null);
              }}
              placeholder={profile.placeholder}
              autoComplete="off"
              spellCheck={false}
              aria-label={customAriaLabel}
              aria-describedby={`${meta.id}-input-help`}
              aria-invalid={Boolean(error)}
              className={`glass-field h-10 w-full min-w-0 rounded-xl px-3 font-mono text-xs text-slate-100 outline-none placeholder:text-slate-600 focus-visible:ring-2 ${focusRing}`}
            />
          </div>
          <button
            type="submit"
            className={`h-10 shrink-0 rounded-xl px-4 text-xs font-bold text-slate-950 shadow-lg transition hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 ${primary}`}
          >
            Apply
          </button>
        </form>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p
          id={`${meta.id}-input-help`}
          role={error ? "alert" : undefined}
          className={`text-[10px] ${error ? "text-rose-300" : "text-slate-500"}`}
        >
          {error ?? profile.help}
        </p>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${activeTone}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${activeDot}`} />
          Active: {activeLabel}
        </span>
      </div>
    </div>
  );
}
