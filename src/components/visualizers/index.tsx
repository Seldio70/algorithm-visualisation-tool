import type { GraphLayout, GridVariant, Step, VisualizerLayout, ThemeAccent } from "../../types";
import { ACCENT } from "../../constants/theme";
import { ArrayVisualizer, LinkedListVisualizer, StackVisualizer, QueueVisualizer, MemoryVisualizer, SplitVisualizer, StringSetVisualizer } from "./ArrayVisualizer";
import { GraphVisualizer } from "./GraphVisualizer";
import { TreeVisualizer } from "./TreeVisualizer";
import { GridVisualizer } from "./GridVisualizer";

export interface VisualizerProps {
  step: Step;
  layout: VisualizerLayout;
  gridCols?: number;
  graphLayout?: GraphLayout;
  gridVariant?: GridVariant;
  accent?: ThemeAccent;
  compact?: boolean;
}

export function Visualizer({
  step,
  layout,
  gridCols,
  graphLayout,
  gridVariant,
  accent = "cyan",
  compact = false,
}: VisualizerProps) {
  const { elements, pointers, edges } = step;
  const pointerColor = ACCENT[accent].pointer;

  const effectiveLayout = step.layoutOverride ?? layout;

  if (elements.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 px-4 py-3 text-sm text-slate-500">
          {effectiveLayout === "tree" ? "The tree is empty — the first node will become the root." : "No elements yet — press Play to begin."}
        </p>
      </div>
    );
  }

  if (effectiveLayout === "grid" && gridCols) {
    return (
      <GridVisualizer
        elements={elements}
        gridCols={gridCols}
        pointers={pointers}
        pointerColor={pointerColor}
        variant={gridVariant ?? "maze"}
      />
    );
  }

  if (effectiveLayout === "graph" && graphLayout) {
    return (
      <GraphVisualizer
        elements={elements}
        graphLayout={graphLayout}
        stepEdges={edges}
        pointers={pointers}
        accent={accent}
        weighted={edges?.some((e) => e.weight !== undefined)}
      />
    );
  }

  if (effectiveLayout === "tree") {
    return <TreeVisualizer elements={elements} pointers={pointers} accent={accent} />;
  }

  if (effectiveLayout === "linked-list") {
    return <LinkedListVisualizer elements={elements} pointers={pointers} pointerColor={pointerColor} />;
  }

  if (effectiveLayout === "stack") {
    return <StackVisualizer elements={elements} compact={compact} />;
  }

  if (effectiveLayout === "queue") {
    return <QueueVisualizer elements={elements} />;
  }

  if (effectiveLayout === "memory") {
    return <MemoryVisualizer elements={elements} />;
  }

  if (effectiveLayout === "split") {
    return <SplitVisualizer elements={elements} pointers={pointers} pointerColor={pointerColor} />;
  }

  if (effectiveLayout === "string-set") {
    return <StringSetVisualizer elements={elements} pointers={pointers} pointerColor={pointerColor} />;
  }

  return (
    <ArrayVisualizer
      elements={elements}
      layout={effectiveLayout}
      pointers={pointers}
      pointerColor={pointerColor}
      compact={compact}
    />
  );
}
