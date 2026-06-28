import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { bubbleSort } from "../algorithms/bubbleSort";
import { PLAYBACK_SPEED_KEY } from "../constants/playback";
import { useAlgorithm } from "./useAlgorithm";

describe("useAlgorithm", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("plays, pauses, seeks, and replays", () => {
    const { result } = renderHook(() => useAlgorithm(bubbleSort));

    act(() => result.current.togglePlay());
    expect(result.current.isPlaying).toBe(true);
    act(() => vi.advanceTimersByTime(result.current.speed));
    expect(result.current.currentStep).toBe(1);

    act(() => result.current.seek(5));
    expect(result.current.currentStep).toBe(5);
    expect(result.current.isPlaying).toBe(false);

    act(() => result.current.seek(result.current.steps.length - 1));
    act(() => result.current.togglePlay());
    expect(result.current.currentStep).toBe(0);
    expect(result.current.isPlaying).toBe(true);
  });

  it("persists only supported speed presets", () => {
    const { result } = renderHook(() => useAlgorithm(bubbleSort));
    act(() => result.current.setSpeed(400));
    expect(result.current.speed).toBe(400);
    expect(localStorage.getItem(PLAYBACK_SPEED_KEY)).toBe("400");

    act(() => result.current.setSpeed(333));
    expect(result.current.speed).toBe(700);
  });

  it("does not trigger global shortcuts from interactive controls", () => {
    const button = document.createElement("button");
    document.body.append(button);
    button.focus();
    const { result } = renderHook(() => useAlgorithm(bubbleSort));

    act(() => button.dispatchEvent(new KeyboardEvent("keydown", { code: "Space", bubbles: true })));
    expect(result.current.isPlaying).toBe(false);
    button.remove();
  });
});
