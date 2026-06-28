import { useEffect } from "react";
import type { ThemeAccent } from "../types";

export function usePageMetadata(title: string, accent: ThemeAccent = "cyan") {
  useEffect(() => {
    document.title = title;
    document.documentElement.dataset.accent = accent;
  }, [accent, title]);
}
