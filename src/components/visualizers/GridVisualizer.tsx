import { motion } from "framer-motion";
import type { Pointer, VisualElement } from "../../types";
import { STATE_STYLES } from "../../constants/theme";
import { GRID_FLOOR, GRID_GOAL, GRID_START, GRID_WALL } from "../../constants/grid";

interface GridVisualizerProps {
  elements: VisualElement[];
  gridCols: number;
  pointers?: Pointer[];
  pointerColor: string;
}

const GRID_SPRING = {
  type: "spring" as const,
  stiffness: 210,
  damping: 24,
  mass: 0.65,
};

function baseCellClass(value: number | string): string {
  const v = Number(value);
  if (v === 1) return GRID_WALL;
  if (v === 2) return GRID_START;
  if (v === 3) return GRID_GOAL;
  return GRID_FLOOR;
}

function cellLabel(value: number | string): string {
  const v = Number(value);
  if (v === 2) return "S";
  if (v === 3) return "G";
  if (v === 1) return "";
  return "";
}

function overlayClass(state: VisualElement["state"], isWall: boolean): string {
  if (isWall && state === "default") return "";
  if (state !== "default") return STATE_STYLES[state];
  return "";
}

export function GridVisualizer({ elements, gridCols, pointers, pointerColor }: GridVisualizerProps) {
  return (
    <div
      className="grid gap-1.5 mx-auto"
      style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
    >
      {elements.map((el) => {
        const isWall = Number(el.value) === 1;
        const label = cellLabel(el.value);
        const pointer = pointers?.find((p) => p.targetId === el.id);
        const stateOverlay = overlayClass(el.state, isWall);
        const emphasized = ["current", "highlight", "path", "comparing"].includes(el.state);

        return (
          <motion.div
            key={el.id}
            layout
            initial={{ opacity: 0, scale: 0.78 }}
            animate={{
              opacity: 1,
              scale: emphasized ? 1.08 : 1,
              y: el.state === "current" ? -2 : 0,
            }}
            transition={GRID_SPRING}
            className={`relative w-10 h-10 sm:w-12 sm:h-12 border-2 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-colors duration-300 ${baseCellClass(el.value)} ${stateOverlay}`}
          >
            {pointer && (
              <motion.span
                initial={{ opacity: 0, y: 3, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.18 }}
                className={`absolute -top-5 text-[10px] font-bold ${pointerColor}`}
              >
                {pointer.name}
              </motion.span>
            )}
            {label || (!isWall && el.state === "default" ? "" : null)}
          </motion.div>
        );
      })}
    </div>
  );
}
