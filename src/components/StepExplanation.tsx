import { motion } from "framer-motion";
import type { ThemeAccent } from "../types";
import { ACCENT } from "../constants/theme";

interface StepExplanationProps {
  explanation: string;
  accent?: ThemeAccent;
  isPlaying?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

// ── Step classification ──────────────────────────────────────────────────────

type StepKind =
  | "init"
  | "pass-start"
  | "comparing"
  | "swapping"
  | "swap-done"
  | "pass-complete"
  | "complete"
  | "info";

interface KindConfig {
  badge: string;
  badgeClasses: string;
  borderColor: string;
}

// Full class-name strings so Tailwind picks them up at build time.
const KIND_CONFIG: Record<StepKind, KindConfig> = {
  init: {
    badge: "INIT",
    badgeClasses: "bg-slate-700 text-slate-400 border-slate-600",
    borderColor: "border-l-slate-500",
  },
  "pass-start": {
    badge: "NEW PASS",
    badgeClasses: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    borderColor: "border-l-sky-500",
  },
  comparing: {
    badge: "COMPARE",
    badgeClasses: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    borderColor: "border-l-amber-500",
  },
  swapping: {
    badge: "SWAP",
    badgeClasses: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    borderColor: "border-l-rose-500",
  },
  "swap-done": {
    badge: "SWAPPED",
    badgeClasses: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    borderColor: "border-l-violet-500",
  },
  "pass-complete": {
    badge: "PASS DONE",
    badgeClasses: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    borderColor: "border-l-emerald-500",
  },
  complete: {
    badge: "COMPLETE",
    badgeClasses: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    borderColor: "border-l-emerald-400",
  },
  info: {
    badge: "STEP",
    badgeClasses: "bg-slate-700/60 text-slate-400 border-slate-600/60",
    borderColor: "border-l-slate-600",
  },
};

function classifyStep(text: string): StepKind {
  if (text.includes("✅")) return "complete";
  if (/pass \d+ complete|correct final position/i.test(text)) return "pass-complete";
  if (/^swap done|^swap complete/i.test(text.trim())) return "swap-done";
  if (/^swapping\b/i.test(text.trim())) return "swapping";
  if (/\bpass \d+ of \d+ begins\b/i.test(text)) return "pass-start";
  if (/\bcomparing\b|\bchecking\b/i.test(text)) return "comparing";
  if (/^starting with\b|^initializ/i.test(text.trim())) return "init";
  return "info";
}

function getBadgeLabel(kind: StepKind, text: string): string {
  if (kind === "pass-start") {
    const m = text.match(/[Pp]ass (\d+) of (\d+)/);
    if (m) return `PASS ${m[1]}/${m[2]}`;
  }
  return KIND_CONFIG[kind].badge;
}

// ── Component ────────────────────────────────────────────────────────────────

export function StepExplanation({
  explanation,
  accent = "cyan",
  isPlaying = false,
  currentStep,
  totalSteps,
}: StepExplanationProps) {
  const a = ACCENT[accent];
  const kind = classifyStep(explanation);
  const cfg = KIND_CONFIG[kind];
  const badgeLabel = getBadgeLabel(kind, explanation);
  const progress =
    currentStep !== undefined && totalSteps !== undefined && totalSteps > 0
      ? Math.round(((currentStep + 1) / totalSteps) * 100)
      : null;

  return (
    <div
      className={`relative shrink-0 border-b border-white/10 border-l-4 transition-colors duration-300 ${cfg.borderColor}`}
    >
      <motion.div
        key={explanation}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="px-4 py-4 pb-5"
        aria-live={isPlaying ? "off" : "polite"}
        aria-atomic="true"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <span
              className={`mt-0.5 shrink-0 rounded px-2 py-0.5 text-xs font-bold tracking-wide uppercase border ${cfg.badgeClasses}`}
            >
              {badgeLabel}
            </span>
            <p className="text-base text-slate-100 leading-snug whitespace-pre-line min-w-0">
              {explanation}
            </p>
          </div>
          {currentStep !== undefined && totalSteps !== undefined && (
            <span className="shrink-0 tabular-nums text-xs font-mono text-slate-500 mt-0.5">
              {currentStep + 1}/{totalSteps}
            </span>
          )}
        </div>
      </motion.div>

      {progress !== null && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
          <motion.div
            className={`h-full ${a.progress}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          />
        </div>
      )}
    </div>
  );
}
