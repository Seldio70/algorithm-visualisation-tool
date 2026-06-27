import { motion } from "framer-motion";
import type { ThemeAccent } from "../types";
import { ACCENT } from "../constants/theme";

interface StepExplanationProps {
  explanation: string;
  accent?: ThemeAccent;
}

export function StepExplanation({ explanation, accent = "cyan" }: StepExplanationProps) {
  const a = ACCENT[accent];
  return (
    <div className={`themed-scrollbar ${accent === "violet" ? "themed-scrollbar-violet" : "themed-scrollbar-cyan"} px-4 py-2 lg:h-[4.5rem] lg:shrink-0 lg:overflow-y-auto bg-slate-900/40 border-b border-slate-800`}>
      <div className="flex items-start gap-2">
        <div className={`w-4 h-4 rounded-full ${a.ring} border flex items-center justify-center shrink-0 mt-0.5`}>
          <div className={`w-1 h-1 rounded-full ${accent === "violet" ? "bg-violet-400" : "bg-cyan-400"}`} />
        </div>
        <motion.p
          key={explanation}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="text-xs sm:text-sm text-slate-300 leading-snug whitespace-pre-line"
        >
          {explanation}
        </motion.p>
      </div>
    </div>
  );
}
