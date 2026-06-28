import type { AlgorithmDefinition, Step, ElementState } from "../../types";
import { finalStep } from "../helpers";
import { STACK_QUEUE_LEGEND } from "../../constants/legends";

interface Entry {
  id: string;
  value: string;
}

function stackElements(items: Entry[], states: Record<number, ElementState> = {}) {
  return items.map((item, i) => ({
    id: item.id,
    value: item.value,
    state: states[i] ?? "default",
    label: i === items.length - 1 ? "top" : undefined,
  }));
}

function queueElements(items: Entry[], states: Record<number, ElementState> = {}) {
  return items.map((item, index) => ({
    id: item.id,
    value: item.value,
    state: states[index] ?? "default" as ElementState,
  }));
}

function generateSteps(): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const stack: Entry[] = [];
  const queue: Entry[] = [];

  steps.push({
    id: stepId++,
    elements: [],
    highlightedLines: [1],
    explanation: `Stack (LIFO) and Queue (FIFO) from scratch — no built-in libraries. Two fundamental ADTs used throughout 42 projects.`,
    variables: { stack: "[]", queue: "[]" },
  });

  for (const op of ["push A", "push B", "push C"]) {
    const val = op.split(" ")[1];
    stack.push({ id: `stack-${val}`, value: val });
    steps.push({
      id: stepId++,
      elements: stackElements(stack, { [stack.length - 1]: "inserting" }),
      highlightedLines: [2],
      explanation: `STACK PUSH: Add ${val} to top. Last In, First Out — like a stack of plates.`,
      variables: { stack: stack.map((item) => item.value).join(", "), top: val },
    });
  }

  const popped = stack.pop()!;
  steps.push({
    id: stepId++,
    elements: stackElements(stack, { [stack.length - 1]: "current" }),
    highlightedLines: [3],
    explanation: `STACK POP: Remove top element ${popped.value}. Stack is now [${stack.map((item) => item.value).join(", ")}].`,
    variables: { popped: popped.value, stack: stack.map((item) => item.value).join(", ") },
  });

  for (const val of ["X", "Y", "Z"]) {
    queue.push({ id: `queue-${val}`, value: val });
    steps.push({
      id: stepId++,
      layoutOverride: "queue",
      elements: queueElements(queue, { [queue.length - 1]: "inserting" }),
      highlightedLines: [6],
      explanation: `QUEUE ENQUEUE: Add ${val} to back. First In, First Out — like a line at a store.`,
      variables: { queue: queue.map((item) => item.value).join(", ") },
    });
  }

  const dequeued = queue.shift()!;
  steps.push({
    id: stepId++,
    layoutOverride: "queue",
    elements: queueElements(queue, { 0: "current" }),
    highlightedLines: [7],
    explanation: `QUEUE DEQUEUE: Remove front element ${dequeued.value}. Queue is now [${queue.map((item) => item.value).join(", ")}].`,
    variables: { dequeued: dequeued.value, queue: queue.map((item) => item.value).join(", ") },
  });

  steps.push({
    ...finalStep(
      stepId,
      queueElements(queue, Object.fromEntries(queue.map((_, i) => [i, "sorted" as ElementState]))),
      `✅ Stack and Queue operations demonstrated. Implement these with linked lists or circular buffers.`,
      "push_swap uses stacks exclusively. so_long and cub3d use queue-like BFS. Build these from scratch before using library abstractions.",
      7
    ),
    layoutOverride: "queue",
    variables: {
      stack: stack.map((item) => item.value).join(", "),
      queue: queue.map((item) => item.value).join(", "),
    },
  });

  return steps;
}

export const stackQueue: AlgorithmDefinition = {
  meta: {
    id: "stack-queue",
    name: "Stack & Queue",
    category: "42 Tirana",
    difficulty: "Beginner",
    layout: "stack",
    legend: STACK_QUEUE_LEGEND,
    timeComplexity: { best: "O(1)", average: "O(1)", worst: "O(1)" },
    spaceComplexity: "O(n)",
    description: "Push/pop on a stack (LIFO) and enqueue/dequeue on a queue (FIFO), built from scratch.",
    defaultInput: [0],
    accent: "violet",
    fortyTwoNote: "push_swap (stacks), so_long/cub3d (BFS queues).",
    code: `// Stack\nfunction push(stack, val) { stack[stack.length] = val; }\nfunction pop(stack) { return stack[--stack.length]; }\n\n// Queue\nfunction enqueue(q, val) { q.push(val); }\nfunction dequeue(q) { return q.shift(); }`,
  },
  generateSteps,
};
