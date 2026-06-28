import { useEffect, useRef } from "react";
import type { ThemeAccent } from "../types";
import { ACCENT } from "../constants/theme";

interface CodePanelProps {
  code: string;
  highlightedLines: number[];
  accent?: ThemeAccent;
}

export function CodePanel({ code, highlightedLines, accent = "cyan" }: CodePanelProps) {
  const a = ACCENT[accent];
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const firstHighlightedLine = highlightedLines[0];
    if (!firstHighlightedLine) return;
    const line = containerRef.current?.querySelector<HTMLElement>(
      `[data-code-line="${firstHighlightedLine}"]`
    );
    line?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [highlightedLines]);

  return (
    <div
      ref={containerRef}
      role="list"
      aria-label="Algorithm pseudocode"
      tabIndex={0}
      className={`themed-scrollbar ${accent === "violet" ? "themed-scrollbar-violet" : "themed-scrollbar-cyan"} h-full overflow-auto rounded-lg font-mono text-[13px] leading-relaxed focus-visible:outline-none focus-visible:ring-2 ${accent === "violet" ? "focus-visible:ring-violet-400/60" : "focus-visible:ring-cyan-400/60"}`}
    >
      {code.split("\n").map((line, i) => {
        const lineNum = i + 1;
        const isHighlighted = highlightedLines.includes(lineNum);
        return (
          <div
            key={i}
            role="listitem"
            data-code-line={lineNum}
            aria-current={isHighlighted ? "step" : undefined}
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
