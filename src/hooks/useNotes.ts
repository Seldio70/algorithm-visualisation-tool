import { useCallback, useEffect, useRef, useState } from "react";

const NOTES_KEY_PREFIX = "algoviz-notes-";
const NOTES_KEY_VERSION = "v1";
const AUTOSAVE_DELAY_MS = 600;

export type NoteSaveStatus = "saved" | "saving" | "error";

function notesKey(algorithmId: string): string {
  return `${NOTES_KEY_PREFIX}${algorithmId}-${NOTES_KEY_VERSION}`;
}

function readNotes(algorithmId: string): string {
  try {
    return localStorage.getItem(notesKey(algorithmId)) ?? "";
  } catch {
    return "";
  }
}

/**
 * Per-algorithm notepad persistence. Each algorithm gets its own localStorage
 * key, so notes never leak between exercises. Edits are debounced to autosave,
 * and any pending edit is flushed immediately on unmount (e.g. switching tabs
 * or navigating to a different algorithm) so nothing is lost.
 */
export function useNotes(algorithmId: string) {
  const [content, setContent] = useState(() => readNotes(algorithmId));
  const [status, setStatus] = useState<NoteSaveStatus>("saved");
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const timeoutRef = useRef<number | undefined>(undefined);
  const contentRef = useRef(content);

  const persist = useCallback(
    (value: string) => {
      try {
        if (value) {
          localStorage.setItem(notesKey(algorithmId), value);
        } else {
          localStorage.removeItem(notesKey(algorithmId));
        }
        setStatus("saved");
        setSavedAt(Date.now());
      } catch {
        setStatus("error");
      }
    },
    [algorithmId]
  );

  const update = useCallback(
    (value: string) => {
      setContent(value);
      contentRef.current = value;
      setStatus("saving");
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => persist(value), AUTOSAVE_DELAY_MS);
    },
    [persist]
  );

  const saveNow = useCallback(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    persist(contentRef.current);
  }, [persist]);

  // Flush any pending autosave before this algorithm's notepad unmounts
  // (tab switch or navigating to a different algorithm).
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        persist(contentRef.current);
      }
    };
  }, [persist]);

  return { content, update, saveNow, status, savedAt };
}
