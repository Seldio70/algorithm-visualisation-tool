import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import type { AlgorithmDefinition, ThemeAccent } from "../types";
import { ACCENT, CATEGORY_ORDER } from "../constants/theme";

interface AlgorithmSidebarProps {
  algorithms: AlgorithmDefinition[];
  selectedId: string;
  basePath?: string;
  accent?: ThemeAccent;
}

const DIFFICULTY_DOT: Record<AlgorithmDefinition["meta"]["difficulty"], string> = {
  Beginner: "bg-emerald-400",
  Intermediate: "bg-amber-400",
  Advanced: "bg-rose-400",
};

function CategoryIcon({ category }: { category: string }) {
  if (category === "Sorting") {
    return (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 2v12m0-12L2 4m2-2 2 2M12 14V2m0 12-2-2m2 2 2-2" />
      </svg>
    );
  }
  if (category === "Searching") {
    return (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="7" cy="7" r="4" />
        <path d="m10 10 3.5 3.5" />
      </svg>
    );
  }
  if (category === "Graph" || category === "Tree") {
    return (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="3" r="1.5" />
        <circle cx="3.5" cy="12.5" r="1.5" />
        <circle cx="12.5" cy="12.5" r="1.5" />
        <path d="M7.3 4.4 4.2 11m4.5-6.6 3.1 6.6" />
      </svg>
    );
  }
  if (category === "42 Tirana") {
    return <span className="text-[10px] font-bold leading-none">42</span>;
  }
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5.5 2.5 2 8l3.5 5.5M10.5 2.5 14 8l-3.5 5.5" />
    </svg>
  );
}

export function AlgorithmSidebar({
  algorithms,
  selectedId,
  basePath = "/learn",
  accent = "cyan",
}: AlgorithmSidebarProps) {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const activeLinkRef = useRef<HTMLAnchorElement>(null);
  const a = ACCENT[accent];
  const focusRing = accent === "violet" ? "focus-visible:ring-violet-400" : "focus-visible:ring-cyan-400";
  const activeBar = accent === "violet" ? "bg-violet-400" : "bg-cyan-400";
  const activeNumber = accent === "violet"
    ? "border-violet-400/40 bg-violet-400/15 text-violet-300"
    : "border-cyan-400/40 bg-cyan-400/15 text-cyan-300";

  const normalizedQuery = query.trim().toLowerCase();
  const visibleAlgorithms = normalizedQuery
    ? algorithms.filter(({ meta }) =>
        [meta.name, meta.category, meta.difficulty, meta.description]
          .some((value) => value.toLowerCase().includes(normalizedQuery))
      )
    : algorithms;

  const grouped = visibleAlgorithms.reduce<Record<string, AlgorithmDefinition[]>>((acc, algo) => {
    if (!acc[algo.meta.category]) acc[algo.meta.category] = [];
    acc[algo.meta.category].push(algo);
    return acc;
  }, {});
  const categories = CATEGORY_ORDER.filter((category) => grouped[category]?.length);

  useEffect(() => {
    activeLinkRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [selectedId]);

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if (
        event.key !== "/" ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      event.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  return (
    <aside
      aria-label="Algorithm exercises"
      className={`glass-sidebar themed-scrollbar ${accent === "violet" ? "themed-scrollbar-violet" : "themed-scrollbar-cyan"} w-full max-h-[40dvh] overflow-y-auto border-b sm:max-h-none sm:w-64 sm:shrink-0 sm:border-r sm:border-b-0`}
    >
      <div className="glass-header sticky top-0 z-10 border-b p-3">
        <div className="mb-2.5 flex items-center justify-between px-0.5">
          <div>
            <p className="text-sm font-semibold text-slate-200">Exercises</p>
            <p className="text-[11px] text-slate-500">{algorithms.length} visualizations</p>
          </div>
          <span className={`glass-control rounded-full px-2 py-0.5 text-[10px] font-semibold ${a.text}`}>
            V1
          </span>
        </div>

        <label className="relative block">
          <span className="sr-only">Search exercises</span>
          <svg
            viewBox="0 0 16 16"
            className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="7" cy="7" r="4" />
            <path d="m10 10 3.5 3.5" />
          </svg>
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find an exercise..."
            className={`glass-field w-full rounded-xl py-2 pr-8 pl-8 text-xs text-slate-200 outline-none placeholder:text-slate-600 focus:border-white/20 focus-visible:ring-1 ${focusRing}`}
          />
          {!query && (
            <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-slate-700 px-1.5 py-0.5 font-mono text-[9px] text-slate-500">
              /
            </kbd>
          )}
        </label>
      </div>

      <nav aria-label="Exercise list" className="p-2.5">
        {categories.map((category) => (
          <section key={category} aria-labelledby={`sidebar-${category.replace(/\s+/g, "-").toLowerCase()}`} className="mb-4 last:mb-1">
            <div className="mb-1.5 flex items-center gap-2 px-1.5">
              <span className="glass-control flex h-5 w-5 items-center justify-center rounded-md text-slate-500">
                <CategoryIcon category={category} />
              </span>
              <h2
                id={`sidebar-${category.replace(/\s+/g, "-").toLowerCase()}`}
                className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500"
              >
                {category}
              </h2>
              <span className="ml-auto text-[10px] tabular-nums text-slate-600">{grouped[category].length}</span>
            </div>

            <div className="space-y-1">
              {grouped[category].map((algo) => {
                const isSelected = selectedId === algo.meta.id;
                const exerciseNumber = algorithms.findIndex((item) => item.meta.id === algo.meta.id) + 1;

                return (
                  <NavLink
                    key={algo.meta.id}
                    ref={isSelected ? activeLinkRef : undefined}
                    to={`${basePath}/${algo.meta.id}`}
                    title={`${algo.meta.name} — ${algo.meta.difficulty}, average ${algo.meta.timeComplexity.average}`}
                    className={`relative flex w-full items-center gap-2.5 overflow-hidden rounded-xl border px-2.5 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset ${focusRing} ${
                      isSelected
                        ? `${a.bg} ${a.border} text-white shadow-lg shadow-black/20 backdrop-blur-xl`
                        : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.05] hover:text-slate-200"
                    }`}
                  >
                    {isSelected && <span aria-hidden="true" className={`absolute inset-y-2 left-0 w-0.5 rounded-r ${activeBar}`} />}
                    <span
                      aria-hidden="true"
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border font-mono text-[11px] font-semibold ${
                        isSelected
                          ? activeNumber
                          : "glass-control border-white/10 text-slate-500"
                      }`}
                    >
                      {String(exerciseNumber).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 block text-[13px] font-medium leading-tight">{algo.meta.name}</span>
                      <span className="mt-0.5 flex items-center gap-1.5 text-[10px] text-slate-500">
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${DIFFICULTY_DOT[algo.meta.difficulty]}`} />
                        <span className="truncate">{algo.meta.difficulty}</span>
                        <span aria-hidden="true" className="text-slate-700">•</span>
                        <span className="shrink-0 font-mono">{algo.meta.timeComplexity.average}</span>
                      </span>
                    </span>
                    {isSelected && (
                      <svg aria-hidden="true" viewBox="0 0 16 16" className={`h-3.5 w-3.5 shrink-0 ${a.text}`} fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="m6 3 5 5-5 5" />
                      </svg>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </section>
        ))}

        {categories.length === 0 && (
          <div className="px-3 py-8 text-center">
            <p className="text-sm text-slate-400">No exercises found</p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className={`mt-2 text-xs ${a.text} rounded focus-visible:outline-none focus-visible:ring-2 ${focusRing}`}
            >
              Clear search
            </button>
          </div>
        )}
      </nav>
    </aside>
  );
}
