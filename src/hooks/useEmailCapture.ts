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
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      const existing = Array.isArray(parsed)
        ? parsed.filter((value): value is string => typeof value === "string")
        : [];
      if (existing.includes(trimmed)) {
        setToast("This email is already saved on this device.");
        return true;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, trimmed]));
      setToast("Saved on this device only. Nothing was submitted or sent.");
      return true;
    } catch {
      setToast("Your browser could not save this email locally.");
      return false;
    }
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  return { capture, toast, dismissToast };
}
