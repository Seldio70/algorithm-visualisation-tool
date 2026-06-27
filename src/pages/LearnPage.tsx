import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { algorithms, algorithmMap } from "../algorithms";
import { useAlgorithm } from "../hooks/useAlgorithm";
import { AppHeader, Legend, CallStackPanel } from "../components/AppHeader";
import { AlgorithmSidebar } from "../components/AlgorithmSidebar";
import { Visualizer } from "../components/Visualizer";
import { CodePanel } from "../components/CodePanel";
import { VariablesPanel } from "../components/VariablesPanel";
import { Controls } from "../components/Controls";
import { StepExplanation } from "../components/StepExplanation";
import { ACCENT, DIFFICULTY_COLOR } from "../constants/theme";
import type { ThemeAccent } from "../types";

export function LearnPage() {
  const { algorithmId } = useParams<{ algorithmId: string }>();
  const defaultId = algorithms[0].meta.id;

  if (!algorithmId) {
    return <Navigate to={`/learn/${defaultId}`} replace />;
  }

  const algo = algorithmMap[algorithmId];
  if (!algo) {
    return <Navigate to={`/learn/${defaultId}`} replace />;
  }

  return <AlgorithmWorkspace algo={algo} selectedId={algorithmId} basePath="/learn" />;
}

interface AlgorithmWorkspaceProps {
  algo: (typeof algorithms)[0];
  selectedId: string;
  basePath: string;
  forceAccent?: ThemeAccent;
}

export function AlgorithmWorkspace({ algo, selectedId, basePath, forceAccent }: AlgorithmWorkspaceProps) {
  const [view, setView] = useState<"visualizer" | "about">("visualizer");
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
  const filterAlgos = basePath === "/42"
    ? algorithms.filter((x) => x.meta.category === "42 Tirana")
    : algorithms;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <AppHeader
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
        currentStep={currentStep}
        totalSteps={steps.length}
        accent={accent}
      />

      <div className="flex flex-1 overflow-hidden flex-col sm:flex-row">
        {sidebarOpen && (
          <AlgorithmSidebar
            algorithms={filterAlgos}
            selectedId={selectedId}
            basePath={basePath}
            accent={accent}
          />
        )}

        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="px-4 sm:px-5 pt-4 pb-3 border-b border-slate-800 flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-lg font-bold">{meta.name}</h1>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_COLOR[meta.difficulty]}`}>
                  {meta.difficulty}
                </span>
                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{meta.category}</span>
              </div>
              <p className="text-sm text-slate-400 max-w-xl">{meta.description}</p>
              {meta.fortyTwoNote && (
                <p className="text-xs text-violet-400/80 mt-1">42 Project: {meta.fortyTwoNote}</p>
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
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
              <div className="flex flex-col overflow-hidden min-w-0 lg:flex-1 lg:max-w-[52%]">
                <div className="shrink-0 bg-white/5 backdrop-blur border-b border-white/10 p-3 sm:p-4">
                  <div className="h-32 sm:h-36 flex items-center justify-center overflow-hidden">
                    {step && (
                      <Visualizer
                        step={step}
                        layout={meta.layout}
                        gridCols={meta.gridCols}
                        accent={accent}
                        compact
                      />
                    )}
                  </div>
                  <Legend />
                </div>

                {step && <StepExplanation explanation={step.explanation} accent={accent} />}

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
                />
              </div>

              <div className="flex-1 lg:flex-none lg:w-[48%] lg:min-w-[22rem] border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col bg-slate-900/50 overflow-hidden min-h-[14rem] lg:min-h-0">
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
