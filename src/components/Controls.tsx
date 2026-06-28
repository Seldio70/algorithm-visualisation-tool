import type { ThemeAccent } from "../types";
import { ACCENT } from "../constants/theme";
import { PLAYBACK_SPEEDS } from "../constants/playback";

interface ControlsProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onReset: () => void;
  onPrev: () => void;
  onTogglePlay: () => void;
  onNext: () => void;
  onSeek: (stepIndex: number) => void;
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
  onSeek,
  onSpeedChange,
  accent = "cyan",
  compact = false,
}: ControlsProps) {
  const a = ACCENT[accent];
  const atEnd = currentStep === totalSteps - 1;
  const playGlow = accent === "violet" ? "shadow-violet-500/25" : "shadow-cyan-500/25";
  const speedIndex = Math.max(0, PLAYBACK_SPEEDS.findIndex(({ delay }) => delay === speed));
  const speedOption = PLAYBACK_SPEEDS[speedIndex];
  const progressStyle = {
    background: `linear-gradient(to right, ${
      accent === "violet" ? "#8b5cf6" : "#06b6d4"
    } 0%, ${accent === "violet" ? "#8b5cf6" : "#06b6d4"} ${
      totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0
    }%, rgb(30 41 59) ${
      totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0
    }%, rgb(30 41 59) 100%)`,
  };

  if (compact) {
    return (
      <div className="px-3 py-2">
        <input
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={currentStep}
          onChange={(event) => onSeek(Number(event.target.value))}
          aria-label="Animation step"
          aria-valuetext={`Step ${currentStep + 1} of ${totalSteps}`}
          className={`timeline-slider mb-2 w-full sm:hidden ${a.slider}`}
          style={progressStyle}
        />
        <div className="flex items-center gap-2">
          <input
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={currentStep}
          onChange={(event) => onSeek(Number(event.target.value))}
          aria-label="Animation step"
          aria-valuetext={`Step ${currentStep + 1} of ${totalSteps}`}
          className={`timeline-slider hidden max-w-[8rem] min-w-0 flex-1 sm:block ${a.slider}`}
          style={progressStyle}
        />
        <button
          onClick={onReset}
          className="glass-control flex h-11 w-11 items-center justify-center rounded-xl text-slate-300 transition-colors sm:h-8 sm:w-8"
          title="Reset (R)"
          aria-label="Reset animation"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 2v6h6" />
            <path d="M3 8A9 9 0 1 1 5.7 19.3" />
          </svg>
        </button>
        <button
          onClick={onPrev}
          disabled={currentStep === 0}
          className="glass-control flex h-11 w-11 items-center justify-center rounded-xl text-slate-300 transition-colors disabled:opacity-30 sm:h-8 sm:w-8"
          title="Previous (←)"
          aria-label="Previous step"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="19 20 9 12 19 4 19 20" />
            <line x1="5" y1="19" x2="5" y2="5" />
          </svg>
        </button>
        <button
          onClick={onTogglePlay}
          className={`flex h-11 items-center gap-1.5 rounded-xl px-4 text-xs font-semibold text-slate-950 shadow-lg transition-all hover:-translate-y-px sm:h-8 ${a.primary} ${playGlow}`}
          title="Play/Pause (Space)"
          aria-label={isPlaying ? "Pause animation" : atEnd ? "Replay animation" : "Play animation"}
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
          className="glass-control flex h-11 w-11 items-center justify-center rounded-xl text-slate-300 transition-colors disabled:opacity-30 sm:h-8 sm:w-8"
          title="Next (→)"
          aria-label="Next step"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 4 15 12 5 20 5 4" />
            <line x1="19" y1="5" x2="19" y2="19" />
          </svg>
        </button>
        <input
          type="range"
          min={0}
          max={PLAYBACK_SPEEDS.length - 1}
          step={1}
          value={speedIndex}
          onChange={(event) => onSpeedChange(PLAYBACK_SPEEDS[Number(event.target.value)].delay)}
          className={`w-14 ${a.slider}`}
          title={`Speed: ${speedOption.description}`}
          aria-label="Playback speed"
          aria-valuetext={`${speedOption.description}, ${speedOption.label} per step`}
        />
          <span className="text-[10px] text-slate-500 font-mono ml-auto hidden sm:inline">
            {currentStep + 1}/{totalSteps}
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 pt-3 pb-1">
        <input
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={currentStep}
          onChange={(event) => onSeek(Number(event.target.value))}
          aria-label="Animation step"
          aria-valuetext={`Step ${currentStep + 1} of ${totalSteps}`}
          className={`timeline-slider w-full ${a.slider}`}
          style={progressStyle}
        />
      </div>
      <div className="px-4 pb-4 pt-2 flex items-center gap-2 sm:gap-3 flex-wrap">
        <button
          onClick={onReset}
          className="glass-control rounded-xl p-2 text-slate-300 transition-colors duration-300"
          title="Reset (R)"
          aria-label="Reset animation"
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
          aria-label="Previous step"
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
          aria-label={isPlaying ? "Pause animation" : atEnd ? "Replay animation" : "Play animation"}
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
          aria-label="Next step"
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
            min={0}
            max={PLAYBACK_SPEEDS.length - 1}
            step={1}
            value={speedIndex}
            onChange={(event) => onSpeedChange(PLAYBACK_SPEEDS[Number(event.target.value)].delay)}
            className={`w-16 ${a.slider}`}
            aria-label="Playback speed"
            aria-valuetext={`${speedOption.description}, ${speedOption.label} per step`}
          />
          <span className="min-w-8 font-mono text-[10px] text-slate-400">{speedOption.label}</span>
        </div>
      </div>
    </>
  );
}
