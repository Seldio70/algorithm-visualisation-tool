import { useState, useCallback } from "react";

const STORAGE_KEY = "algoviz-emails";

export function useEmailCapture() {
  const [toast, setToast] = useState<string | null>(null);

  const capture = useCallback((email: string) => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setToast("Please enter a valid email address.");
      return false;
    }
    const existing: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (existing.includes(trimmed)) {
      setToast("You're already on the list!");
      return true;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, trimmed]));
    setToast("Thanks! We'll notify you when new algorithms drop.");
    return true;
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  return { capture, toast, dismissToast };
}
