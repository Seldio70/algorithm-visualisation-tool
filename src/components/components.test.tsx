import { act, fireEvent, render, renderHook, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { CodePanel } from "./CodePanel";
import { Controls } from "./Controls";
import { StepExplanation } from "./StepExplanation";
import { BubbleSortInputControls } from "./BubbleSortInputControls";
import { CompletionCelebration } from "./CompletionCelebration";
import { useEmailCapture } from "../hooks/useEmailCapture";
import { LearnPage } from "../pages/LearnPage";
import { BUBBLE_SORT_PRESETS } from "../algorithms/bubbleSortCases";

describe("V1 interaction components", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(Element.prototype.scrollIntoView).mockClear();
  });

  it("scrolls highlighted code into view", () => {
    const { rerender } = render(
      <CodePanel code={"one\ntwo\nthree"} highlightedLines={[1]} />
    );
    rerender(<CodePanel code={"one\ntwo\nthree"} highlightedLines={[3]} />);
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    expect(screen.getByText("three").closest("[aria-current='step']")).toBeInTheDocument();
  });

  it("exposes seek and speed controls accessibly", () => {
    const onSeek = vi.fn();
    const onSpeedChange = vi.fn();
    render(
      <Controls
        isPlaying={false}
        currentStep={2}
        totalSteps={10}
        speed={700}
        onReset={vi.fn()}
        onPrev={vi.fn()}
        onTogglePlay={vi.fn()}
        onNext={vi.fn()}
        onSeek={onSeek}
        onSpeedChange={onSpeedChange}
        compact
      />
    );

    fireEvent.change(screen.getAllByRole("slider", { name: "Animation step" })[0], { target: { value: "6" } });
    fireEvent.change(screen.getByRole("slider", { name: "Playback speed" }), { target: { value: "3" } });
    expect(onSeek).toHaveBeenCalledWith(6);
    expect(onSpeedChange).toHaveBeenCalledWith(400);
    expect(screen.getByRole("button", { name: "Play animation" })).toBeInTheDocument();
  });

  it("states that saved email remains local", () => {
    const { result } = renderHook(() => useEmailCapture());
    act(() => expect(result.current.capture("student@example.com")).toBe(true));
    expect(result.current.toast).toContain("device only");
  });

  it("recovers from malformed local email storage", () => {
    localStorage.setItem("algoviz-emails", "{broken");
    const { result } = renderHook(() => useEmailCapture());
    act(() => expect(result.current.capture("student@example.com")).toBe(false));
    expect(result.current.toast).toContain("could not save");
  });

  it("controls live announcements during playback", () => {
    const { rerender } = render(<StepExplanation explanation="Compare values" />);
    expect(screen.getByText("Compare values")).toHaveAttribute("aria-live", "polite");
    rerender(<StepExplanation explanation="Swap values" isPlaying />);
    expect(screen.getByText("Swap values")).toHaveAttribute("aria-live", "off");
  });

  it("announces exercise completion only on the final step", () => {
    const { rerender } = render(<CompletionCelebration active={false} />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    rerender(<CompletionCelebration active />);
    expect(screen.getByRole("status")).toHaveTextContent("Exercise complete");
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  });

  it("applies Bubble Sort presets and validates custom arrays", async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    render(<BubbleSortInputControls activeSource="average" onApply={onApply} />);

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Bubble Sort input case" }),
      "worst"
    );
    expect(onApply).toHaveBeenLastCalledWith(BUBBLE_SORT_PRESETS.worst, "worst");

    const customInput = screen.getByRole("textbox", { name: "Custom Bubble Sort array" });
    await user.type(customInput, "9, 3 9, 1");
    await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(onApply).toHaveBeenLastCalledWith([9, 3, 9, 1], "custom");

    await user.clear(customInput);
    await user.type(customInput, "0, 100");
    await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(screen.getByRole("alert")).toHaveTextContent("between 1 and 99");
    expect(onApply).toHaveBeenCalledTimes(2);
  });

  it("regenerates and pauses Bubble Sort when custom input is applied", async () => {
    const user = userEvent.setup();
    const { container, unmount } = render(
      <MemoryRouter initialEntries={["/learn/bubble-sort"]}>
        <Routes>
          <Route path="/learn/:algorithmId" element={<LearnPage />} />
        </Routes>
      </MemoryRouter>
    );
    const workspace = within(container);

    await user.click(workspace.getByRole("button", { name: "Play animation" }));
    expect(workspace.getByRole("button", { name: "Pause animation" })).toBeInTheDocument();

    await user.type(
      workspace.getByRole("textbox", { name: "Custom Bubble Sort array" }),
      "9, 3, 9, 1"
    );
    await user.click(workspace.getByRole("button", { name: "Apply" }));

    expect(workspace.getByText("Active: Custom")).toBeInTheDocument();
    expect(workspace.getByRole("button", { name: "Play animation" })).toBeInTheDocument();
    expect(workspace.getByText(/Starting with \[9, 3, 9, 1\]/)).toBeInTheDocument();
    workspace.getAllByRole("slider", { name: "Animation step" }).forEach((slider) => {
      expect(slider).toHaveValue("0");
    });
    unmount();
  });

  it("opens, traps, and dismisses the mobile exercise drawer", async () => {
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/learn/bubble-sort"]}>
        <Routes>
          <Route path="/learn/:algorithmId" element={<LearnPage />} />
        </Routes>
      </MemoryRouter>
    );

    const trigger = screen.getByRole("button", { name: "Open exercise navigation" });
    await user.click(trigger);
    expect(screen.getByLabelText("Algorithm exercises")).toBeVisible();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByLabelText("Algorithm exercises")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
