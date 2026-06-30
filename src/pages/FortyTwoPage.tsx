import { Link, useParams } from "react-router-dom";
import { fortyTwoAlgorithms, fortyTwoMap } from "../algorithms";
import { AlgorithmWorkspace } from "./LearnPage";
import { NotFoundPage } from "./NotFoundPage";
import { usePageMetadata } from "../hooks/usePageMetadata";

export function FortyTwoPage() {
  const { algorithmId } = useParams<{ algorithmId?: string }>();

  if (algorithmId) {
    const algo = fortyTwoMap[algorithmId];
    if (!algo) {
      return <NotFoundPage message="That 42 Tirana exercise could not be found." />;
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

  return <FortyTwoHub />;
}

function FortyTwoHub() {
  usePageMetadata("42 Tirana exercises · AlgoVisualisation", "violet");

  return (
    <div className="glass-canvas min-h-screen text-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <header className="glass-header sticky top-0 z-50 flex items-center justify-between border-b px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="glass-logo flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500 text-violet-300">
            <span className="font-bold text-sm">42</span>
          </div>
          <span className="font-bold">AlgoVisualisation × 42 Tirana</span>
        </Link>
        <Link to="/learn" className="text-sm text-cyan-400 hover:underline">
          Main App →
        </Link>
      </header>

      <section className="px-6 pt-16 pb-12 max-w-4xl mx-auto text-center">
        <h1 className="mb-4 text-4xl font-bold">
          Built for <span className="bg-gradient-to-r from-violet-300 to-fuchsia-400 bg-clip-text text-transparent">42 Tirana</span> students
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Functions you'll actually implement in the 42 curriculum — libft staples like ft_split, ft_itoa
          and ft_atoi, plus exam classics like ft_union, ft_inter and last_word. Each visualization notes
          which project it maps to.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 text-left">
          {fortyTwoAlgorithms.map((algo) => (
            <Link
              key={algo.meta.id}
              to={`/42/${algo.meta.id}`}
              className="glass-card group rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/30"
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

      <footer className="glass-header border-t px-6 py-8 text-center text-sm text-slate-500">
        <p>Not affiliated with 42 — built by students, for students.</p>
      </footer>
    </div>
  );
}
