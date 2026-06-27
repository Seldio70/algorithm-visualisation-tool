import { Link } from "react-router-dom";
import type { ThemeAccent } from "../types";
import { ACCENT } from "../constants/theme";

interface AppHeaderProps {
  onToggleSidebar: () => void;
  currentStep?: number;
  totalSteps?: number;
  accent?: ThemeAccent;
  showNav?: boolean;
}

export function AppHeader({
  onToggleSidebar,
  currentStep,
  totalSteps,
  accent = "cyan",
  showNav = true,
}: AppHeaderProps) {
  const logoBg = accent === "violet" ? "bg-violet-500" : "bg-cyan-500";

  return (
    <header className="border-b border-slate-800 px-4 py-3 flex items-center justify-between bg-slate-950/80 backdrop-blur sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {showNav && (
          <button
            onClick={onToggleSidebar}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors duration-300"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
        <Link to="/" className="flex items-center gap-2">
          <div className={`w-7 h-7 ${logoBg} rounded-lg flex items-center justify-center`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <span className="font-bold text-white tracking-tight">AlgoVisualisation</span>
        </Link>
      </div>
      <div className="flex items-center gap-3">
        {showNav && (
          <>
            <Link to="/learn" className={`text-xs hidden sm:inline ${ACCENT.cyan.text} hover:underline`}>
              Learn
            </Link>
            <Link to="/42" className="text-xs hidden sm:inline text-violet-400 hover:underline">
              42 Tirana
            </Link>
          </>
        )}
        {currentStep !== undefined && totalSteps !== undefined && (
          <>
            <span className="text-xs text-slate-500 font-mono hidden md:inline">
              Space = play · ← → = step · R = reset
            </span>
            <span className="text-xs text-slate-500">
              Step {currentStep + 1} / {totalSteps}
            </span>
          </>
        )}
      </div>
    </header>
  );
}

interface CallStackPanelProps {
  callStack?: string[];
}

export function CallStackPanel({ callStack }: CallStackPanelProps) {
  if (!callStack?.length) return null;
  return (
    <div className="border-t border-slate-800 p-3">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Call Stack</p>
      <div className="flex flex-col-reverse gap-1">
        {callStack.map((frame, i) => (
          <div key={i} className="font-mono text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-slate-300">
            {frame}
          </div>
        ))}
      </div>
    </div>
  );
}
