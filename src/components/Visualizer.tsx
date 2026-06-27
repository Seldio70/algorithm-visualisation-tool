import { motion } from "framer-motion";
import type { Step, VisualizerLayout, ThemeAccent } from "../types";
import { STATE_STYLES, ACCENT } from "../constants/theme";

interface VisualizerProps {
  step: Step;
  layout: VisualizerLayout;
  gridCols?: number;
  accent?: ThemeAccent;
  compact?: boolean;
}

export function Visualizer({ step, layout, gridCols, accent = "cyan", compact = false }: VisualizerProps) {
  const { elements, pointers } = step;
  const pointerColor = ACCENT[accent].pointer;

  if (layout === "grid" && gridCols) {
    return (
      <div
        className="grid gap-1.5 mx-auto"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {elements.map((el) => (
          <GridCell key={el.id} el={el} pointers={pointers} pointerColor={pointerColor} />
        ))}
      </div>
    );
  }

  if (layout === "linked-list") {
    return (
      <div className="flex items-center justify-center gap-1 flex-wrap px-4">
        {elements.map((el, i) => (
          <div key={el.id} className="flex items-center gap-1">
            <NodeCell el={el} pointers={pointers} pointerColor={pointerColor} />
            {i < elements.length - 1 && (
              <span className="text-slate-500 font-mono text-lg px-1">→</span>
            )}
          </div>
        ))}
        <span className="text-slate-600 font-mono text-sm ml-1">null</span>
      </div>
    );
  }

  if (layout === "stack") {
    return (
      <div className={`flex flex-col-reverse items-center gap-1.5 justify-end ${compact ? "min-h-[6rem]" : "min-h-[12rem]"}`}>
        {elements.map((el, i) => (
          <motion.div
            key={el.id}
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`w-32 h-10 border-2 rounded-xl flex items-center justify-center font-mono text-sm font-bold ${STATE_STYLES[el.state]}`}
          >
            {el.label ?? el.value}
            {i === elements.length - 1 && (
              <span className="absolute -right-16 text-xs text-slate-500">top ↑</span>
            )}
          </motion.div>
        ))}
      </div>
    );
  }

  if (layout === "memory") {
    return (
      <div className="flex flex-col gap-2 w-full max-w-lg mx-auto">
        {elements.map((el) => (
          <motion.div
            key={el.id}
            layout
            transition={{ duration: 0.3 }}
            className={`border-2 rounded-xl px-4 py-2 flex items-center justify-between font-mono text-sm ${STATE_STYLES[el.state]}`}
          >
            <span className="text-slate-400 text-xs">{el.label}</span>
            <span className="font-bold">{el.value}</span>
          </motion.div>
        ))}
      </div>
    );
  }

  if (layout === "tree") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3 px-4">
        {elements.map((el) => (
          <div key={el.id} className="flex flex-col items-center gap-1 relative">
            <PointerLabel el={el} pointers={pointers} color={pointerColor} />
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono text-sm font-bold ${STATE_STYLES[el.state]}`}
            >
              {el.value === 0 ? "∅" : el.value}
            </motion.div>
            {el.label && <span className="text-xs text-slate-500">{el.label}</span>}
          </div>
        ))}
      </div>
    );
  }

  if (layout === "graph") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4 px-4">
        {elements.map((el) => (
          <div key={el.id} className="flex flex-col items-center gap-1 relative">
            <PointerLabel el={el} pointers={pointers} color={pointerColor} />
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center font-mono text-sm font-bold ${STATE_STYLES[el.state]}`}
            >
              {el.label ?? el.value}
            </motion.div>
          </div>
        ))}
      </div>
    );
  }

  const maxVal = Math.max(...elements.map((e) => Number(e.value)), 1);
  const isBarChart = layout === "array";

  const barHeight = compact ? "h-full max-h-28" : "h-48";

  return (
    <div className={`flex items-end justify-center gap-2 ${barHeight} w-full px-2 relative`}>
      {elements.map((el) => {
        const heightPct = isBarChart ? (Number(el.value) / maxVal) * 100 : 100;
        return (
          <div
            key={el.id}
            className="flex flex-col items-center gap-1 relative"
            style={{ minWidth: isBarChart ? (compact ? "28px" : "36px") : compact ? "36px" : "44px" }}
          >
            <PointerLabel el={el} pointers={pointers} color={pointerColor} />
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`w-full border-2 rounded-t-md flex items-end justify-center ${STATE_STYLES[el.state]}`}
              style={{ height: isBarChart ? `${heightPct}%` : "100%", minHeight: "32px" }}
            >
              <span className="text-xs font-bold text-white pb-1 font-mono">{el.value}</span>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

function PointerLabel({
  el,
  pointers,
  color,
}: {
  el: { id: string };
  pointers?: { name: string; targetId: string }[];
  color: string;
}) {
  const pointer = pointers?.find((p) => p.targetId === el.id);
  if (!pointer) return <div className="h-7" />;
  return (
    <div className={`absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-mono font-bold whitespace-nowrap ${color}`}>
      {pointer.name}↓
    </div>
  );
}

function GridCell({
  el,
  pointers,
  pointerColor,
}: {
  el: { id: string; value: number | string; state: keyof typeof STATE_STYLES };
  pointers?: { name: string; targetId: string }[];
  pointerColor: string;
}) {
  const pointer = pointers?.find((p) => p.targetId === el.id);
  return (
    <motion.div
      layout
      transition={{ duration: 0.3 }}
      className={`relative w-10 h-10 sm:w-12 sm:h-12 border-2 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${STATE_STYLES[el.state]}`}
    >
      {pointer && (
        <span className={`absolute -top-5 text-[10px] font-bold ${pointerColor}`}>{pointer.name}</span>
      )}
      {el.value}
    </motion.div>
  );
}

function NodeCell({
  el,
  pointers,
  pointerColor,
}: {
  el: { id: string; value: number | string; state: keyof typeof STATE_STYLES; label?: string };
  pointers?: { name: string; targetId: string }[];
  pointerColor: string;
}) {
  const pointer = pointers?.find((p) => p.targetId === el.id);
  return (
    <div className="relative flex flex-col items-center">
      {pointer && (
        <span className={`text-xs font-mono font-bold mb-1 ${pointerColor}`}>{pointer.name}↓</span>
      )}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`w-14 h-14 border-2 rounded-xl flex flex-col items-center justify-center font-mono text-sm font-bold ${STATE_STYLES[el.state]}`}
      >
        {el.value}
        {el.label && <span className="text-[10px] opacity-60">{el.label}</span>}
      </motion.div>
    </div>
  );
}
