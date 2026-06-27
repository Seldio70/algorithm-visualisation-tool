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
  const logoGlow = accent === "violet" ? "text-violet-400" : "text-cyan-400";

  return (
    <header className="glass-header sticky top-0 z-50 flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center gap-3">
        {showNav && (
          <button
            onClick={onToggleSidebar}
            className="glass-control rounded-xl p-1.5 text-slate-400 transition-colors duration-300 hover:text-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
        <Link to="/" className="flex items-center gap-2">
          <div className={`glass-logo flex h-7 w-7 items-center justify-center rounded-[10px] ${logoBg} ${logoGlow}`}>
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
            <Link to="/learn" className={`glass-control hidden rounded-full px-2.5 py-1 text-xs sm:inline ${ACCENT.cyan.text}`}>
              Learn
            </Link>
            <Link to="/42" className="glass-control hidden rounded-full px-2.5 py-1 text-xs text-violet-400 sm:inline">
              42 Tirana
            </Link>
          </>
        )}
        {currentStep !== undefined && totalSteps !== undefined && (
          <>
            <span className="text-xs text-slate-500 font-mono hidden md:inline">
              Space = play · ← → = step · R = reset
            </span>
            <span className="glass-control rounded-full px-2.5 py-1 text-xs text-slate-400">
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
    <div className="border-t border-white/10 p-3">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Call Stack</p>
      <div className="flex flex-col-reverse gap-1">
        {callStack.map((frame, i) => (
          <div key={i} className="glass-field rounded-lg px-2 py-1 font-mono text-xs text-slate-300">
            {frame}
          </div>
        ))}
      </div>
    </div>
  );
}
