import { NavLink } from "react-router-dom";
import type { AlgorithmDefinition, ThemeAccent } from "../types";
import { ACCENT, CATEGORY_ORDER } from "../constants/theme";

interface AlgorithmSidebarProps {
  algorithms: AlgorithmDefinition[];
  selectedId: string;
  basePath?: string;
  accent?: ThemeAccent;
}

export function AlgorithmSidebar({
  algorithms,
  selectedId,
  basePath = "/learn",
  accent = "cyan",
}: AlgorithmSidebarProps) {
  const a = ACCENT[accent];
  const grouped = algorithms.reduce<Record<string, AlgorithmDefinition[]>>((acc, algo) => {
    if (!acc[algo.meta.category]) acc[algo.meta.category] = [];
    acc[algo.meta.category].push(algo);
    return acc;
  }, {});

  const categories = CATEGORY_ORDER.filter((c) => grouped[c]?.length);

  return (
    <aside className="w-full sm:w-56 border-r border-slate-800 bg-slate-950 overflow-y-auto flex-shrink-0">
      <div className="p-3">
        {categories.map((category) => (
          <div key={category} className="mb-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 px-1">
              {category}
            </p>
            {grouped[category].map((algo) => (
              <NavLink
                key={algo.meta.id}
                to={`${basePath}/${algo.meta.id}`}
                className={`block w-full text-left px-3 py-2.5 rounded-xl mb-1 transition-all duration-300 text-sm ${
                  selectedId === algo.meta.id
                    ? `${a.bg} ${a.text} border ${a.border}`
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <div className="font-medium">{algo.meta.name}</div>
                <div className="text-xs mt-0.5 opacity-60">{algo.meta.timeComplexity.average}</div>
              </NavLink>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
}
