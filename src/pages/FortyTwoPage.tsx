import { Link, Navigate, useParams } from "react-router-dom";
import { fortyTwoAlgorithms, fortyTwoMap } from "../algorithms";
import { AlgorithmWorkspace } from "./LearnPage";

export function FortyTwoPage() {
  const { algorithmId } = useParams<{ algorithmId?: string }>();

  if (algorithmId) {
    const algo = fortyTwoMap[algorithmId];
    if (!algo) {
      return <Navigate to="/42" replace />;
    }
    return (
      <AlgorithmWorkspace
        key={algo.meta.id}
        algo={algo}
        selectedId={algorithmId}
        basePath="/42"
        forceAccent="violet"
        sidebarAlgorithms={fortyTwoAlgorithms}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-500 rounded-xl flex items-center justify-center">
            <span className="font-bold text-sm">42</span>
          </div>
          <span className="font-bold">AlgoVisualisation × 42 Tirana</span>
        </Link>
        <Link to="/learn" className="text-sm text-cyan-400 hover:underline">
          Main App →
        </Link>
      </header>

      <section className="px-6 pt-16 pb-12 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">
          Built for <span className="text-violet-400">42 Tirana</span> students
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Algorithms you'll actually encounter in the 42 curriculum — linked lists, malloc internals,
          flood fill, maze pathfinding, and sorting strategies. Each visualization notes which project it maps to.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 text-left">
          {fortyTwoAlgorithms.map((algo) => (
            <Link
              key={algo.meta.id}
              to={`/42/${algo.meta.id}`}
              className="bg-white/5 backdrop-blur border border-violet-500/20 rounded-xl p-5 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all duration-300 group"
            >
              <h3 className="font-semibold text-violet-300 group-hover:text-violet-200 mb-1">
                {algo.meta.name}
              </h3>
              <p className="text-sm text-slate-400 mb-3">{algo.meta.description}</p>
              {algo.meta.fortyTwoNote && (
                <p className="text-xs text-violet-400/70">{algo.meta.fortyTwoNote}</p>
              )}
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-800 px-6 py-8 text-center text-sm text-slate-500">
        <p>Not affiliated with 42 — built by students, for students.</p>
      </footer>
    </div>
  );
}
