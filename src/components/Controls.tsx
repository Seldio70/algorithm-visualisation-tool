import type { ThemeAccent } from "../types";
import { ACCENT } from "../constants/theme";

interface ControlsProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onReset: () => void;
  onPrev: () => void;
  onTogglePlay: () => void;
  onNext: () => void;
  onSpeedChange: (speed: number) => void;
  accent?: ThemeAccent;
  compact?: boolean;
}

export function Controls({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  onReset,
  onPrev,
  onTogglePlay,
  onNext,
  onSpeedChange,
  accent = "cyan",
  compact = false,
}: ControlsProps) {
  const a = ACCENT[accent];
  const atEnd = currentStep === totalSteps - 1;
  const playGlow = accent === "violet" ? "shadow-violet-500/25" : "shadow-cyan-500/25";

  if (compact) {
    return (
      <div className="px-3 py-2 flex items-center gap-2">
        <div className="glass-field hidden h-1 max-w-[8rem] min-w-0 flex-1 overflow-hidden rounded-full sm:block">
          <div
            className={`h-full ${a.progress} rounded-full transition-all duration-200`}
            style={{ width: `${totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0}%` }}
          />
        </div>
        <button
          onClick={onReset}
          className="glass-control rounded-lg p-1.5 text-slate-300 transition-colors"
          title="Reset (R)"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 2v6h6" />
            <path d="M3 8A9 9 0 1 1 5.7 19.3" />
          </svg>
        </button>
        <button
          onClick={onPrev}
          disabled={currentStep === 0}
          className="glass-control rounded-lg p-1.5 text-slate-300 transition-colors disabled:opacity-30"
          title="Previous (←)"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="19 20 9 12 19 4 19 20" />
            <line x1="5" y1="19" x2="5" y2="5" />
          </svg>
        </button>
        <button
          onClick={onTogglePlay}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-lg transition-all hover:-translate-y-px ${a.primary} ${playGlow}`}
          title="Play/Pause (Space)"
        >
          {isPlaying ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
              Pause
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              {atEnd ? "Replay" : "Play"}
            </>
          )}
        </button>
        <button
          onClick={onNext}
          disabled={atEnd}
          className="glass-control rounded-lg p-1.5 text-slate-300 transition-colors disabled:opacity-30"
          title="Next (→)"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 4 15 12 5 20 5 4" />
            <line x1="19" y1="5" x2="19" y2="19" />
          </svg>
        </button>
        <input
          type="range"
          min={100}
          max={1500}
          step={100}
          value={1600 - speed}
          onChange={(e) => onSpeedChange(1600 - Number(e.target.value))}
          className={`w-14 ${a.slider}`}
          title="Speed"
        />
        <span className="text-[10px] text-slate-500 font-mono ml-auto hidden sm:inline">
          {currentStep + 1}/{totalSteps}
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 pt-3 pb-1">
        <div className="glass-field h-1 w-full overflow-hidden rounded-full">
          <div
            className={`h-full ${a.progress} rounded-full transition-all duration-200`}
            style={{ width: `${totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0}%` }}
          />
        </div>
      </div>
      <div className="px-4 pb-4 pt-2 flex items-center gap-2 sm:gap-3 flex-wrap">
        <button
          onClick={onReset}
          className="glass-control rounded-xl p-2 text-slate-300 transition-colors duration-300"
          title="Reset (R)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 2v6h6" />
            <path d="M3 8A9 9 0 1 1 5.7 19.3" />
          </svg>
        </button>
        <button
          onClick={onPrev}
          disabled={currentStep === 0}
          className="glass-control rounded-xl p-2 text-slate-300 transition-colors duration-300 disabled:opacity-30"
          title="Previous (←)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="19 20 9 12 19 4 19 20" />
            <line x1="5" y1="19" x2="5" y2="5" />
          </svg>
        </button>
        <button
          onClick={onTogglePlay}
          className={`flex min-w-[8rem] flex-1 items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold text-slate-950 shadow-lg transition-all duration-300 hover:-translate-y-px ${a.primary} ${playGlow}`}
          title="Play/Pause (Space)"
        >
          {isPlaying ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
              Pause
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              {atEnd ? "Replay" : "Play"}
            </>
          )}
        </button>
        <button
          onClick={onNext}
          disabled={atEnd}
          className="glass-control rounded-xl p-2 text-slate-300 transition-colors duration-300 disabled:opacity-30"
          title="Next (→)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 4 15 12 5 20 5 4" />
            <line x1="19" y1="5" x2="19" y2="19" />
          </svg>
        </button>
        <div className="flex items-center gap-2 ml-1" title="Speed">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          <input
            type="range"
            min={100}
            max={1500}
            step={100}
            value={1600 - speed}
            onChange={(e) => onSpeedChange(1600 - Number(e.target.value))}
            className={`w-16 ${a.slider}`}
          />
        </div>
      </div>
    </>
  );
}
