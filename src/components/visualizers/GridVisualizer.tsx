import { motion } from "framer-motion";
import type { GridVariant, Pointer, VisualElement } from "../../types";
import { STATE_STYLES } from "../../constants/theme";
import { GRID_FILLED, GRID_FLOOR, GRID_GOAL, GRID_START, GRID_WALL } from "../../constants/grid";

interface GridVisualizerProps {
  elements: VisualElement[];
  gridCols: number;
  pointers?: Pointer[];
  pointerColor: string;
  variant: GridVariant;
}

const GRID_SPRING = {
  type: "spring" as const,
  stiffness: 210,
  damping: 24,
  mass: 0.65,
};

function baseCellClass(value: number | string, variant: GridVariant): string {
  const v = Number(value);
  if (v === 1) return GRID_WALL;
  if (variant === "fill" && v === 2) return GRID_FILLED;
  if (v === 2) return GRID_START;
  if (v === 3) return GRID_GOAL;
  return GRID_FLOOR;
}

function cellLabel(value: number | string, variant: GridVariant): string {
  if (variant === "fill") return "";
  const v = Number(value);
  if (v === 2) return "S";
  if (v === 3) return "G";
  if (v === 1) return "";
  return "";
}

function overlayClass(
  state: VisualElement["state"],
  isWall: boolean,
  isFilled: boolean,
  variant: GridVariant
): string {
  if (isWall && state === "default") return "";
  if (variant === "fill" && isFilled) {
    if (state === "current" || state === "highlight") return STATE_STYLES[state];
    if (state === "visited") return "opacity-70";
    return "";
  }
  if (state !== "default") return STATE_STYLES[state];
  return "";
}

export function GridVisualizer({ elements, gridCols, pointers, pointerColor, variant }: GridVisualizerProps) {
  return (
    <div
      className="grid gap-1.5 mx-auto"
      style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
    >
      {elements.map((el) => {
        const isWall = Number(el.value) === 1;
        const isFilled = variant === "fill" && Number(el.value) === 2;
        const label = cellLabel(el.value, variant);
        const pointer = pointers?.find((p) => p.targetId === el.id);
        const stateOverlay = overlayClass(el.state, isWall, isFilled, variant);
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
            className={`relative w-10 h-10 sm:w-12 sm:h-12 border-2 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-colors duration-300 ${baseCellClass(el.value, variant)} ${stateOverlay}`}
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
