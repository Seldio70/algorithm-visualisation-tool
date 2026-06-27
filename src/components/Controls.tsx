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

  if (compact) {
    return (
      <div className="px-3 py-2 flex items-center gap-2">
        <div className="hidden sm:block flex-1 min-w-0 max-w-[8rem] h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${a.progress} rounded-full transition-all duration-200`}
            style={{ width: `${totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0}%` }}
          />
        </div>
        <button
          onClick={onReset}
          className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition-colors"
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
          className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 disabled:opacity-30 transition-colors"
          title="Previous (←)"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="19 20 9 12 19 4 19 20" />
            <line x1="5" y1="19" x2="5" y2="5" />
          </svg>
        </button>
        <button
          onClick={onTogglePlay}
          className={`px-4 py-1.5 rounded-lg ${a.primary} text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5`}
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
          className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 disabled:opacity-30 transition-colors"
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
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${a.progress} rounded-full transition-all duration-200`}
            style={{ width: `${totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0}%` }}
          />
        </div>
      </div>
      <div className="px-4 pb-4 pt-2 flex items-center gap-2 sm:gap-3 flex-wrap">
        <button
          onClick={onReset}
          className="p-2 rounded-xl bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 text-slate-300 transition-colors duration-300"
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
          className="p-2 rounded-xl bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 text-slate-300 disabled:opacity-30 transition-colors duration-300"
          title="Previous (←)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="19 20 9 12 19 4 19 20" />
            <line x1="5" y1="19" x2="5" y2="5" />
          </svg>
        </button>
        <button
          onClick={onTogglePlay}
          className={`flex-1 min-w-[8rem] py-2 rounded-xl ${a.primary} text-slate-950 font-semibold text-sm transition-colors duration-300 flex items-center justify-center gap-2`}
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
          className="p-2 rounded-xl bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 text-slate-300 disabled:opacity-30 transition-colors duration-300"
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
