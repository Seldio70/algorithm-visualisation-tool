import type { ThemeAccent } from "../types";
import { ACCENT } from "../constants/theme";

interface StepExplanationProps {
  explanation: string;
  accent?: ThemeAccent;
}

export function StepExplanation({ explanation, accent = "cyan" }: StepExplanationProps) {
  const a = ACCENT[accent];
  return (
    <div className="px-4 py-3 bg-white/5 backdrop-blur border-b border-white/10 min-h-[72px]">
      <div className="flex items-start gap-2">
        <div className={`w-5 h-5 rounded-full ${a.ring} border flex items-center justify-center shrink-0 mt-0.5`}>
          <div className={`w-1.5 h-1.5 rounded-full ${accent === "violet" ? "bg-violet-400" : "bg-cyan-400"}`} />
        </div>
        <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">{explanation}</p>
      </div>
    </div>
  );
}
