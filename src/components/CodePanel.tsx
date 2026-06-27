import type { ThemeAccent } from "../types";
import { ACCENT } from "../constants/theme";

interface CodePanelProps {
  code: string;
  highlightedLines: number[];
  accent?: ThemeAccent;
}

export function CodePanel({ code, highlightedLines, accent = "cyan" }: CodePanelProps) {
  const a = ACCENT[accent];
  return (
    <div className="font-mono text-[13px] leading-relaxed overflow-auto h-full">
      {code.split("\n").map((line, i) => {
        const lineNum = i + 1;
        const isHighlighted = highlightedLines.includes(lineNum);
        return (
          <div
            key={i}
            className={`flex gap-3 px-2 py-1 transition-colors duration-200 rounded border-l-2 ${
              isHighlighted ? a.codeHighlight : "border-transparent hover:bg-white/[0.03]"
            }`}
          >
            <span className="text-slate-500 select-none w-6 text-right shrink-0 tabular-nums">{lineNum}</span>
            <span className={`whitespace-pre ${isHighlighted ? `${a.codeText} font-medium` : "text-slate-300"}`}>
              {line}
            </span>
          </div>
        );
      })}
    </div>
  );
}
