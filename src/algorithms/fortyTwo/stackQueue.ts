import type { AlgorithmDefinition, Step, ElementState } from "../../types";
import { finalStep } from "../helpers";

function stackElements(items: string[], states: Record<number, ElementState> = {}) {
  return items.map((item, i) => ({
    id: `el-${i}`,
    value: item,
    state: states[i] ?? "default",
    label: i === items.length - 1 ? "top" : undefined,
  }));
}

function generateSteps(_input: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const stack: string[] = [];
  const queue: string[] = [];

  steps.push({
    id: stepId++,
    elements: stackElements([]),
    highlightedLines: [1],
    explanation: `Stack (LIFO) and Queue (FIFO) from scratch — no built-in libraries. Two fundamental ADTs used throughout 42 projects.`,
    variables: { stack: "[]", queue: "[]" },
  });

  for (const op of ["push A", "push B", "push C"]) {
    const val = op.split(" ")[1];
    stack.push(val);
    steps.push({
      id: stepId++,
      elements: stackElements(stack, { [stack.length - 1]: "inserting" }),
      highlightedLines: [2, 3],
      explanation: `STACK PUSH: Add ${val} to top. Last In, First Out — like a stack of plates.`,
      variables: { stack: stack.join(", "), top: val },
    });
  }

  const popped = stack.pop()!;
  steps.push({
    id: stepId++,
    elements: stackElements(stack, { [stack.length]: "highlight" }),
    highlightedLines: [4],
    explanation: `STACK POP: Remove top element ${popped}. Stack is now [${stack.join(", ")}].`,
    variables: { popped, stack: stack.join(", ") },
  });

  for (const val of ["X", "Y", "Z"]) {
    queue.push(val);
    steps.push({
      id: stepId++,
      elements: queue.map((item, i) => ({
        id: `el-${i}`,
        value: item,
        state: i === queue.length - 1 ? "inserting" : "default",
        label: i === 0 ? "front" : i === queue.length - 1 ? "back" : undefined,
      })),
      highlightedLines: [5, 6],
      explanation: `QUEUE ENQUEUE: Add ${val} to back. First In, First Out — like a line at a store.`,
      variables: { queue: queue.join(", ") },
    });
  }

  const dequeued = queue.shift()!;
  steps.push({
    id: stepId++,
    elements: queue.map((item, i) => ({
      id: `el-${i}`,
      value: item,
      state: i === 0 ? "current" : "default",
      label: i === 0 ? "front" : undefined,
    })),
    highlightedLines: [7],
    explanation: `QUEUE DEQUEUE: Remove front element ${dequeued}. Queue is now [${queue.join(", ")}].`,
    variables: { dequeued, queue: queue.join(", ") },
  });

  steps.push(
    finalStep(
      stepId,
      stackElements(stack, Object.fromEntries(stack.map((_, i) => [i, "sorted" as ElementState]))),
      `✅ Stack and Queue operations demonstrated. Implement these with linked lists or circular buffers.`,
      "push_swap uses stacks exclusively. so_long and cub3d use queue-like BFS. Build these from scratch before using library abstractions.",
      8
    )
  );

  return steps;
}

export const stackQueue: AlgorithmDefinition = {
  meta: {
    id: "stack-queue",
    name: "Stack & Queue",
    category: "42 Tirana",
    difficulty: "Beginner",
    layout: "stack",
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
