import { AnimatePresence, motion } from "framer-motion";
import type { Pointer, VisualElement, VisualizerLayout } from "../../types";
import { STATE_STYLES } from "../../constants/theme";

interface ArrayVisualizerProps {
  elements: VisualElement[];
  layout: VisualizerLayout;
  pointers?: Pointer[];
  pointerColor: string;
  compact?: boolean;
}

const SOFT_SPRING = {
  type: "spring" as const,
  stiffness: 190,
  damping: 22,
  mass: 0.7,
};

function emphasisMotion(state: VisualElement["state"]) {
  const emphasized = ["comparing", "swapping", "current", "highlight", "min", "inserting", "path"].includes(state);
  return {
    scale: emphasized ? 1.035 : 1,
    y: state === "swapping" || state === "inserting" ? -4 : 0,
  };
}

function PointerLabel({
  el,
  pointers,
  color,
}: {
  el: { id: string };
  pointers?: Pointer[];
  color: string;
}) {
  const pointer = pointers?.find((p) => p.targetId === el.id);
  if (!pointer) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-xs font-bold ${color}`}
    >
      {pointer.name}↓
    </motion.div>
  );
}

export function ArrayVisualizer({
  elements,
  layout,
  pointers,
  pointerColor,
  compact = false,
}: ArrayVisualizerProps) {
  const maxVal = Math.max(...elements.map((e) => Number(e.value)), 1);
  const isBarChart = layout === "array";
  const visualizerHeight = isBarChart
    ? compact
      ? "h-full max-h-28"
      : "h-full"
    : compact
      ? "h-9"
      : "h-11";

  return (
    <div className={`relative flex w-full items-end justify-center gap-2 px-2 ${visualizerHeight} ${isBarChart ? "pt-7" : ""}`}>
      {elements.map((el) => {
        const heightPct = isBarChart ? (Number(el.value) / maxVal) * 100 : 100;
        const elementHeight = isBarChart ? `${heightPct}%` : compact ? 36 : 44;

        return (
          <motion.div
            key={el.id}
            layout
            initial={{ opacity: 0, y: 12, height: isBarChart ? "12%" : elementHeight }}
            animate={{ opacity: 1, y: 0, height: elementHeight }}
            transition={{ ...SOFT_SPRING, opacity: { duration: 0.2 } }}
            className="relative flex flex-col items-center gap-1"
            style={{
              minWidth: isBarChart ? (compact ? "28px" : "36px") : compact ? "36px" : "44px",
            }}
          >
            <PointerLabel el={el} pointers={pointers} color={pointerColor} />
            <motion.div
              layout
              animate={emphasisMotion(el.state)}
              transition={SOFT_SPRING}
              className={`flex w-full items-end justify-center rounded-t-md border-2 transition-colors duration-300 ${STATE_STYLES[el.state]}`}
              style={{ height: "100%", minHeight: "32px", transformOrigin: "bottom" }}
            >
              <span className="pb-1 font-mono text-xs font-bold text-white">{el.value}</span>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

function NodeCell({
  el,
  pointers,
  pointerColor,
}: {
  el: VisualElement;
  pointers?: Pointer[];
  pointerColor: string;
}) {
  const pointer = pointers?.find((p) => p.targetId === el.id);
  return (
    <div className="relative flex flex-col items-center">
      <AnimatePresence>
        {pointer && (
          <motion.span
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -3, scale: 0.9 }}
            transition={{ duration: 0.18 }}
            className={`absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-xs font-bold ${pointerColor}`}
          >
            {pointer.name}↓
          </motion.span>
        )}
      </AnimatePresence>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.82 }}
        animate={{ opacity: 1, ...emphasisMotion(el.state) }}
        transition={SOFT_SPRING}
        className={`flex h-14 w-14 flex-col items-center justify-center rounded-xl border-2 font-mono text-sm font-bold transition-colors duration-300 ${STATE_STYLES[el.state]}`}
      >
        {el.value}
        {el.label && <span className="text-[10px] opacity-60">{el.label}</span>}
      </motion.div>
    </div>
  );
}

export function LinkedListVisualizer({
  elements,
  pointers,
  pointerColor,
}: {
  elements: VisualElement[];
  pointers?: Pointer[];
  pointerColor: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1 px-4">
      <AnimatePresence mode="popLayout">
        {elements.map((el, i) => (
          <motion.div
            key={el.id}
            layout
            initial={{ opacity: 0, x: -12, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.85 }}
            transition={SOFT_SPRING}
            className="flex items-center gap-1"
          >
            <NodeCell el={el} pointers={pointers} pointerColor={pointerColor} />
            {i < elements.length - 1 && (
              <span className="px-1 font-mono text-lg text-slate-500">→</span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
      <span className="ml-1 font-mono text-sm text-slate-600">null</span>
    </div>
  );
}

export function StackVisualizer({
  elements,
  compact = false,
}: {
  elements: VisualElement[];
  compact?: boolean;
}) {
  return (
    <div className={`flex flex-col-reverse items-center justify-end gap-1.5 ${compact ? "min-h-[6rem]" : "min-h-[12rem]"}`}>
      <AnimatePresence mode="popLayout">
        {elements.map((el, i) => (
          <motion.div
            key={el.id}
            layout
            initial={{ opacity: 0, y: -18, scale: 0.92 }}
            animate={{ opacity: 1, ...emphasisMotion(el.state) }}
            exit={{ opacity: 0, x: 24, scale: 0.88 }}
            transition={SOFT_SPRING}
            className={`relative flex h-10 w-32 items-center justify-center rounded-xl border-2 font-mono text-sm font-bold transition-colors duration-300 ${STATE_STYLES[el.state]}`}
          >
            {el.label ?? el.value}
            {i === elements.length - 1 && (
              <span className="absolute -right-16 text-xs text-slate-500">top ↑</span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function MemoryVisualizer({ elements }: { elements: VisualElement[] }) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {elements.map((el) => (
          <motion.div
            key={el.id}
            layout
            initial={{ opacity: 0, x: -16, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, ...emphasisMotion(el.state) }}
            exit={{ opacity: 0, x: 18, scale: 0.96 }}
            transition={SOFT_SPRING}
            className={`flex items-center justify-between rounded-xl border-2 px-4 py-2 font-mono text-sm transition-colors duration-300 ${STATE_STYLES[el.state]}`}
          >
            <span className="text-xs text-slate-400">{el.label}</span>
            <span className="font-bold">{el.value}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
