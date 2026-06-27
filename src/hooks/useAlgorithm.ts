import { useState, useEffect, useRef, useCallback } from "react";
import type { AlgorithmDefinition, Step } from "../types";

export function useAlgorithm(algo: AlgorithmDefinition | undefined) {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!algo) return;
    const s = algo.generateSteps(algo.meta.defaultInput);
    setSteps(s);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [algo]);

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
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((p) => !p);
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
  }, [steps.length]);

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

  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);

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
    togglePlay,
  };
}
