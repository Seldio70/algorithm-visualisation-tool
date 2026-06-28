import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import type { AlgorithmDefinition, Step } from "../types";
import {
  DEFAULT_PLAYBACK_SPEED,
  PLAYBACK_SPEED_KEY,
  PLAYBACK_SPEEDS,
} from "../constants/playback";

function readStoredSpeed(): number {
  try {
    const stored = Number(localStorage.getItem(PLAYBACK_SPEED_KEY));
    return PLAYBACK_SPEEDS.some(({ delay }) => delay === stored)
      ? stored
      : DEFAULT_PLAYBACK_SPEED;
  } catch {
    return DEFAULT_PLAYBACK_SPEED;
  }
}

export function useAlgorithm(algo: AlgorithmDefinition | undefined) {
  const steps = useMemo<Step[]>(
    () => (algo ? algo.generateSteps(algo.meta.defaultInput) : []),
    [algo]
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeedState] = useState(readStoredSpeed);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, steps.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target instanceof HTMLElement ? e.target : null;
      if (target?.closest("input, textarea, select, button, a, [contenteditable='true']")) return;
      if (e.code === "Space") {
        e.preventDefault();
        if (isPlaying) {
          setIsPlaying(false);
        } else {
          if (currentStep >= steps.length - 1) setCurrentStep(0);
          setIsPlaying(true);
        }
      }
      if (e.code === "ArrowRight") {
        setIsPlaying(false);
        setCurrentStep((p) => Math.min(steps.length - 1, p + 1));
      }
      if (e.code === "ArrowLeft") {
        setIsPlaying(false);
        setCurrentStep((p) => Math.max(0, p - 1));
      }
      if (e.code === "KeyR") {
        setCurrentStep(0);
        setIsPlaying(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentStep, isPlaying, steps.length]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const prev = useCallback(() => {
    setCurrentStep((p) => Math.max(0, p - 1));
    setIsPlaying(false);
  }, []);

  const next = useCallback(() => {
    setCurrentStep((p) => Math.min(steps.length - 1, p + 1));
    setIsPlaying(false);
  }, [steps.length]);

  const seek = useCallback((stepIndex: number) => {
    const lastStep = Math.max(0, steps.length - 1);
    setCurrentStep(Math.min(lastStep, Math.max(0, Math.round(stepIndex))));
    setIsPlaying(false);
  }, [steps.length]);

  const setSpeed = useCallback((nextSpeed: number) => {
    const validSpeed = PLAYBACK_SPEEDS.some(({ delay }) => delay === nextSpeed)
      ? nextSpeed
      : DEFAULT_PLAYBACK_SPEED;
    setSpeedState(validSpeed);
    try {
      localStorage.setItem(PLAYBACK_SPEED_KEY, String(validSpeed));
    } catch {
      // Playback still works when storage is unavailable.
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  }, [currentStep, isPlaying, steps.length]);

  const step = steps[currentStep];
  const progress = steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0;

  return {
    steps,
    currentStep,
    step,
    isPlaying,
    speed,
    setSpeed,
    progress,
    reset,
    prev,
    next,
    seek,
    togglePlay,
  };
}
