import { motion } from "framer-motion";
import type { Pointer, VisualElement, ThemeAccent } from "../../types";
import { ACCENT } from "../../constants/theme";
import { STATE_NODE_FILL, STATE_NODE_STROKE } from "../../constants/nodeColors";
import { computeTreeLayout } from "../../utils/treeLayout";

interface TreeVisualizerProps {
  elements: VisualElement[];
  pointers?: Pointer[];
  accent?: ThemeAccent;
}

const TREE_SPRING = {
  type: "spring" as const,
  stiffness: 190,
  damping: 22,
  mass: 0.65,
};

export function TreeVisualizer({ elements, pointers, accent = "cyan" }: TreeVisualizerProps) {
  const pointerColor = ACCENT[accent].pointer;
  const positions = computeTreeLayout(elements);
  const positionMap = new Map(positions.map((position) => [position.id, position]));
  const elementMap = new Map(elements.map((element) => [element.id, element]));
  const links = elements.filter((element) => element.parentId && positionMap.has(element.parentId));

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      {links.map((element, linkIndex) => {
        const from = positionMap.get(element.parentId!);
        const to = positionMap.get(element.id);
        if (!from || !to) return null;
        return (
          <motion.line
            key={`link-${element.id}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="#475569"
            strokeWidth={1.2}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.38, delay: linkIndex * 0.035, ease: "easeOut" }}
          />
        );
      })}

      {positions.map((position, nodeIndex) => {
        const element = elementMap.get(position.id);
        if (!element) return null;
        const pointer = pointers?.find((candidate) => candidate.targetId === element.id);
        const display = element.value === 0 || element.value === "…" ? "…" : String(element.value);
        const emphasized = ["current", "highlight", "inserting"].includes(element.state);

        return (
          <motion.g
            key={element.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.22, delay: nodeIndex * 0.035 }}
          >
            <motion.circle
              cx={position.x}
              cy={position.y}
              initial={{ r: 0 }}
              animate={{
                r: emphasized ? 6.7 : 6,
                fill: STATE_NODE_FILL[element.state],
                stroke: STATE_NODE_STROKE[element.state],
              }}
              transition={TREE_SPRING}
              strokeWidth={1.5}
            />
            <text
              x={position.x}
              y={position.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#fff"
              style={{ fontSize: "5px", fontFamily: "monospace", fontWeight: 700 }}
            >
              {display}
            </text>
            {pointer && (
              <motion.text
                x={position.x}
                y={position.y - 10}
                textAnchor="middle"
                className={pointerColor}
                fill="currentColor"
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                style={{ fontSize: "4.5px", fontFamily: "monospace", fontWeight: 700 }}
              >
                {pointer.name}
              </motion.text>
            )}
          </motion.g>
        );
      })}
    </svg>
  );
}
