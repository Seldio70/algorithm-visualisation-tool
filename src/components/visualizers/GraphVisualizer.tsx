import { motion } from "framer-motion";
import type { GraphEdge, GraphLayout, Pointer, VisualElement, ThemeAccent } from "../../types";
import { ACCENT } from "../../constants/theme";
import { STATE_NODE_FILL, STATE_NODE_STROKE } from "../../constants/nodeColors";

interface GraphVisualizerProps {
  elements: VisualElement[];
  graphLayout: GraphLayout;
  stepEdges?: GraphEdge[];
  pointers?: Pointer[];
  accent?: ThemeAccent;
  weighted?: boolean;
}

const EDGE_STROKE: Record<string, string> = {
  default: "#475569",
  visited: "#64748b",
  current: "#22d3ee",
  highlight: "#38bdf8",
  path: "#34d399",
  comparing: "#f59e0b",
};

const GRAPH_SPRING = {
  type: "spring" as const,
  stiffness: 190,
  damping: 22,
  mass: 0.65,
};

function edgeStroke(state: string | undefined): string {
  return EDGE_STROKE[state ?? "default"] ?? EDGE_STROKE.default;
}

function nodeRadius(state: VisualElement["state"]): number {
  if (state === "current" || state === "highlight") return 7;
  return 6;
}

export function GraphVisualizer({
  elements,
  graphLayout,
  stepEdges,
  pointers,
  accent = "cyan",
  weighted = false,
}: GraphVisualizerProps) {
  const pointerColor = ACCENT[accent].pointer;
  const nodeMap = new Map(graphLayout.nodes.map((node) => [node.id, node]));
  const elementMap = new Map(elements.map((element) => [element.id, element]));

  const edgeStates = new Map<string, GraphEdge>();
  for (const edge of stepEdges ?? []) {
    const key = edge.from < edge.to ? `${edge.from}-${edge.to}` : `${edge.to}-${edge.from}`;
    edgeStates.set(key, edge);
  }

  const weightMap = new Map<string, number>();
  if (weighted) {
    for (const edge of stepEdges ?? []) {
      if (edge.weight !== undefined) {
        const key = edge.from < edge.to ? `${edge.from}-${edge.to}` : `${edge.to}-${edge.from}`;
        weightMap.set(key, edge.weight);
      }
    }
  }

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      {graphLayout.edges.map((edge, edgeIndex) => {
        const from = nodeMap.get(edge.from);
        const to = nodeMap.get(edge.to);
        if (!from || !to) return null;
        const key = edge.from < edge.to ? `${edge.from}-${edge.to}` : `${edge.to}-${edge.from}`;
        const stepEdge = edgeStates.get(key);
        const weight = weightMap.get(key);
        const mx = (from.x + to.x) / 2;
        const my = (from.y + to.y) / 2;
        const isActive = stepEdge?.state && stepEdge.state !== "default";

        return (
          <g key={key}>
            <motion.line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: stepEdge?.state === "visited" ? 0.5 : 0.9,
                stroke: edgeStroke(stepEdge?.state),
                strokeWidth: isActive ? 1.8 : 1.2,
              }}
              transition={{
                pathLength: { duration: 0.45, delay: edgeIndex * 0.025, ease: "easeOut" },
                opacity: { duration: 0.25 },
                stroke: { duration: 0.28 },
                strokeWidth: GRAPH_SPRING,
              }}
            />
            {weight !== undefined && (
              <motion.text
                x={mx}
                y={my - 2}
                textAnchor="middle"
                fill="#fcd34d"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, delay: 0.15 + edgeIndex * 0.025 }}
                style={{ fontSize: "4px", transformOrigin: `${mx}px ${my - 2}px` }}
              >
                {weight}
              </motion.text>
            )}
          </g>
        );
      })}

      {graphLayout.nodes.map((node, nodeIndex) => {
        const element = elementMap.get(node.id);
        if (!element) return null;
        const pointer = pointers?.find((candidate) => candidate.targetId === element.id);
        const radius = nodeRadius(element.state);

        return (
          <motion.g
            key={node.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: nodeIndex * 0.035 }}
          >
            <motion.circle
              cx={node.x}
              cy={node.y}
              initial={{ r: 0 }}
              animate={{
                r: radius,
                fill: STATE_NODE_FILL[element.state],
                stroke: STATE_NODE_STROKE[element.state],
              }}
              transition={GRAPH_SPRING}
              strokeWidth={1.5}
            />
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#fff"
              style={{ fontSize: "5px", fontFamily: "monospace", fontWeight: 700 }}
            >
              {element.label ?? element.value}
            </text>
            {pointer && (
              <motion.text
                x={node.x}
                y={node.y - radius - 3}
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
