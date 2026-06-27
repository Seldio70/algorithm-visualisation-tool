import type { GraphLayout, Step, VisualizerLayout, ThemeAccent } from "../../types";
import { ACCENT } from "../../constants/theme";
import { ArrayVisualizer, LinkedListVisualizer, StackVisualizer, MemoryVisualizer } from "./ArrayVisualizer";
import { GraphVisualizer } from "./GraphVisualizer";
import { TreeVisualizer } from "./TreeVisualizer";
import { GridVisualizer } from "./GridVisualizer";

export interface VisualizerProps {
  step: Step;
  layout: VisualizerLayout;
  gridCols?: number;
  graphLayout?: GraphLayout;
  accent?: ThemeAccent;
  compact?: boolean;
}

export function Visualizer({
  step,
  layout,
  gridCols,
  graphLayout,
  accent = "cyan",
  compact = false,
}: VisualizerProps) {
  const { elements, pointers, edges } = step;
  const pointerColor = ACCENT[accent].pointer;

  if (elements.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 px-4 py-3 text-sm text-slate-500">
          {layout === "tree" ? "The tree is empty — the first node will become the root." : "No elements yet — press Play to begin."}
        </p>
      </div>
    );
  }

  if (layout === "grid" && gridCols) {
    return (
      <GridVisualizer
        elements={elements}
        gridCols={gridCols}
        pointers={pointers}
        pointerColor={pointerColor}
      />
    );
  }

  if (layout === "graph" && graphLayout) {
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

  if (layout === "tree") {
    return <TreeVisualizer elements={elements} pointers={pointers} accent={accent} />;
  }

  if (layout === "linked-list") {
    return <LinkedListVisualizer elements={elements} pointers={pointers} pointerColor={pointerColor} />;
  }

  if (layout === "stack") {
    return <StackVisualizer elements={elements} compact={compact} />;
  }

  if (layout === "memory") {
    return <MemoryVisualizer elements={elements} />;
  }

  return (
    <ArrayVisualizer
      elements={elements}
      layout={layout}
      pointers={pointers}
      pointerColor={pointerColor}
      compact={compact}
    />
  );
}

export { GRID_LEGEND } from "../../constants/grid";
