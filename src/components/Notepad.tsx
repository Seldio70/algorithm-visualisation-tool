import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ThemeAccent } from "../types";
import { ACCENT } from "../constants/theme";
import { useNotes } from "../hooks/useNotes";

interface NotepadProps {
  algorithmId: string;
  algorithmName: string;
  accent?: ThemeAccent;
}

const NOTEBOOK_LINE_HEIGHT = 32; // px — must match the textarea's leading-8

function notebookPaperStyle(accent: ThemeAccent): React.CSSProperties {
  const marginColor = accent === "violet" ? "139,92,246" : "6,182,212";
  return {
    backgroundImage: [
      `repeating-linear-gradient(to bottom, transparent, transparent ${NOTEBOOK_LINE_HEIGHT - 1}px, rgba(255,255,255,0.06) ${NOTEBOOK_LINE_HEIGHT - 1}px, rgba(255,255,255,0.06) ${NOTEBOOK_LINE_HEIGHT}px)`,
      `linear-gradient(to right, transparent 3.4rem, rgba(${marginColor},0.22) 3.4rem, rgba(${marginColor},0.22) calc(3.4rem + 1px), transparent calc(3.4rem + 1px))`,
    ].join(", "),
    backgroundAttachment: "local, local",
    backgroundPositionY: "1rem, 0",
  };
}

function formatSavedAt(savedAt: number | null): string {
  if (!savedAt) return "";
  const seconds = Math.round((Date.now() - savedAt) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  return `${minutes}m ago`;
}

/**
 * A notebook-styled, per-algorithm notepad. Notes are isolated by algorithmId
 * and autosave (debounced) to localStorage via useNotes — see that hook for
 * the persistence strategy and flush-on-unmount safety net.
 */
export function Notepad({ algorithmId, algorithmName, accent = "cyan" }: NotepadProps) {
  const a = ACCENT[accent];
  const { content, update, saveNow, status, savedAt } = useNotes(algorithmId);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "s") {
      event.preventDefault();
      saveNow();
    }
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.025] px-4 py-2.5">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">My Notes</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{algorithmName} — kept separate from every other exercise</p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <SaveStatusIndicator status={status} savedAt={savedAt} accent={accent} />
          <button
            type="button"
            onClick={saveNow}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-md transition-all duration-300 hover:-translate-y-px ${a.primary}`}
          >
            Save
          </button>
        </div>
      </div>

      <textarea
        ref={textareaRef}
        value={content}
        onChange={(event) => update(event.target.value)}
        onBlur={saveNow}
        onKeyDown={handleKeyDown}
        placeholder={`Jot down anything that helps ${algorithmName} click — key steps, gotchas, your own examples...`}
        aria-label={`Notes for ${algorithmName}`}
        spellCheck
        className="themed-scrollbar w-full resize-none border-0 bg-transparent pl-16 pr-5 py-4 font-serif text-[15px] leading-8 text-slate-200 placeholder:text-slate-500 focus:outline-none"
        style={{ minHeight: "18rem", ...notebookPaperStyle(accent) }}
      />

      <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.015] px-4 py-1.5 text-[11px] text-slate-500">
        <span>{content.length.toLocaleString()} characters</span>
        <span>Autosaves as you type · Ctrl/Cmd+S to save now</span>
      </div>
    </div>
  );
}

function SaveStatusIndicator({
  status,
  savedAt,
  accent,
}: {
  status: "saved" | "saving" | "error";
  savedAt: number | null;
  accent: ThemeAccent;
}) {
  const a = ACCENT[accent];
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={status}
        initial={{ opacity: 0, y: -2 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 2 }}
        transition={{ duration: 0.15 }}
        className="flex items-center gap-1.5 text-[11px] font-medium"
      >
        {status === "saving" && (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-300">Saving…</span>
          </>
        )}
        {status === "saved" && (
          <>
            <span className={`h-1.5 w-1.5 rounded-full ${a.progress}`} />
            <span className={a.text}>Saved{savedAt ? ` ${formatSavedAt(savedAt)}` : ""}</span>
          </>
        )}
        {status === "error" && (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            <span className="text-rose-400">Couldn't save — storage unavailable</span>
          </>
        )}
      </motion.span>
    </AnimatePresence>
  );
}
