import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { mainAlgorithms, algorithmMap } from "../algorithms";
import { useAlgorithm } from "../hooks/useAlgorithm";
import { AppHeader, CallStackPanel } from "../components/AppHeader";
import { Legend } from "../components/Legend";
import { AlgorithmSidebar } from "../components/AlgorithmSidebar";
import { Visualizer } from "../components/Visualizer";
import { CodePanel } from "../components/CodePanel";
import { VariablesPanel } from "../components/VariablesPanel";
import { Controls } from "../components/Controls";
import { StepExplanation } from "../components/StepExplanation";
import { ACCENT, DIFFICULTY_COLOR } from "../constants/theme";
import type { ThemeAccent, AlgorithmDefinition } from "../types";

export function LearnPage() {
  const { algorithmId } = useParams<{ algorithmId: string }>();
  const defaultId = mainAlgorithms[0].meta.id;

  if (!algorithmId) {
    return <Navigate to={`/learn/${defaultId}`} replace />;
  }

  const algo = algorithmMap[algorithmId];
  if (!algo || algo.meta.category === "42 Tirana") {
    return <Navigate to={`/learn/${defaultId}`} replace />;
  }

  return <AlgorithmWorkspace key={algo.meta.id} algo={algo} selectedId={algorithmId} basePath="/learn" sidebarAlgorithms={mainAlgorithms} />;
}

interface AlgorithmWorkspaceProps {
  algo: AlgorithmDefinition;
  selectedId: string;
  basePath: string;
  forceAccent?: ThemeAccent;
  sidebarAlgorithms: AlgorithmDefinition[];
}

export function AlgorithmWorkspace({ algo, selectedId, basePath, forceAccent, sidebarAlgorithms }: AlgorithmWorkspaceProps) {
  const [view, setView] = useState<"visualizer" | "about">("visualizer");
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 640px)").matches : true
  );
  const accent: ThemeAccent = forceAccent ?? algo.meta.accent ?? "cyan";
  const a = ACCENT[accent];

  const {
    steps,
    currentStep,
    step,
    isPlaying,
    speed,
    setSpeed,
    reset,
    prev,
    next,
    togglePlay,
  } = useAlgorithm(algo);

  const { meta } = algo;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const handler = (e: MediaQueryListEvent) => setSidebarOpen(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div className="h-dvh bg-slate-950 text-white flex flex-col overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <AppHeader
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
        currentStep={currentStep}
        totalSteps={steps.length}
        accent={accent}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden flex-col sm:flex-row">
        {sidebarOpen && (
          <AlgorithmSidebar
            algorithms={sidebarAlgorithms}
            selectedId={selectedId}
            basePath={basePath}
            accent={accent}
          />
        )}

        <main className="flex-1 flex flex-col min-h-0 overflow-hidden min-w-0">
          <div className="shrink-0 px-4 sm:px-5 py-2 border-b border-slate-800 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold">{meta.name}</h1>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_COLOR[meta.difficulty]}`}>
                  {meta.difficulty}
                </span>
                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{meta.category}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 line-clamp-2 max-w-xl">{meta.description}</p>
              {meta.fortyTwoNote && (
                <p className="text-xs text-violet-400/80 mt-0.5 line-clamp-1">42 Project: {meta.fortyTwoNote}</p>
              )}
            </div>
            <div className="flex gap-1 shrink-0">
              {(["visualizer", "about"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-colors duration-300 capitalize ${
                    view === v ? `${a.bg} ${a.text} border ${a.border}` : "text-slate-400 hover:text-white"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {view === "about" ? (
            <div className="flex-1 overflow-auto p-4 sm:p-6">
              <div className="max-w-2xl space-y-6">
                <p className="text-slate-300 text-sm leading-relaxed">{meta.description}</p>
                {meta.fortyTwoNote && (
                  <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
                    <p className="text-xs text-violet-400 font-semibold uppercase mb-1">42 Tirana</p>
                    <p className="text-sm text-slate-300">{meta.fortyTwoNote}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[["Best", meta.timeComplexity.best], ["Average", meta.timeComplexity.average], ["Worst", meta.timeComplexity.worst]].map(
                    ([label, val]) => (
                      <div key={label} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-3">
                        <div className="text-xs text-slate-500 mb-1">{label} case</div>
                        <div className={`font-mono font-bold ${a.text}`}>{val}</div>
                      </div>
                    )
                  )}
                </div>
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-3">
                  <div className="text-xs text-slate-500 mb-1">Space Complexity</div>
                  <div className="font-mono font-bold text-purple-400">{meta.spaceComplexity}</div>
                </div>
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
                  <CodePanel code={meta.code} highlightedLines={[]} accent={accent} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
              <div className="flex flex-col shrink-0 lg:shrink lg:flex-1 min-w-0 lg:max-w-[52%] overflow-hidden">
                <div className="shrink-0 lg:flex-1 lg:min-h-0 flex flex-col bg-white/5 backdrop-blur border-b border-white/10 p-3 sm:p-4">
                  <div className="h-36 sm:h-40 lg:h-auto lg:flex-1 lg:min-h-[12rem] flex items-center justify-center overflow-hidden">
                    {step && (
                      <Visualizer
                        step={step}
                        layout={meta.layout}
                        gridCols={meta.gridCols}
                        graphLayout={meta.graphLayout}
                        accent={accent}
                      />
                    )}
                  </div>
                  <Legend layout={meta.layout} />
                </div>

                {step && <StepExplanation explanation={step.explanation} accent={accent} />}

                <div className="shrink-0 border-t border-slate-800 bg-slate-950/90 backdrop-blur">
                  <Controls
                    isPlaying={isPlaying}
                    currentStep={currentStep}
                    totalSteps={steps.length}
                    speed={speed}
                    onReset={reset}
                    onPrev={prev}
                    onTogglePlay={togglePlay}
                    onNext={next}
                    onSpeedChange={setSpeed}
                    accent={accent}
                    compact
                  />
                </div>
              </div>

              <div className="flex flex-col min-h-0 min-w-0 flex-1 lg:flex-none lg:w-[48%] lg:min-w-[22rem] border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900/50 overflow-hidden max-h-[40vh] lg:max-h-none">
                <div className="px-4 py-2.5 border-b border-slate-800 shrink-0">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Code</p>
                </div>
                <div className="flex-1 overflow-auto p-3 min-h-0">
                  {step && <CodePanel code={meta.code} highlightedLines={step.highlightedLines} accent={accent} />}
                </div>
                {step?.variables && (
                  <div className="border-t border-slate-800 p-3 shrink-0">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Variables</p>
                    <VariablesPanel variables={step.variables} accent={accent} />
                  </div>
                )}
                <CallStackPanel callStack={step?.callStack} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
