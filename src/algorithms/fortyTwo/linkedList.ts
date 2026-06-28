import type { AlgorithmDefinition, Step, ElementState } from "../../types";
import { finalStep } from "../helpers";
import { LINKED_LIST_LEGEND } from "../../constants/legends";

interface ListNode {
  id: string;
  value: number;
}

function makeList(nodes: ListNode[], states: Record<number, ElementState> = {}) {
  return nodes.map((node, i) => ({
    id: node.id,
    value: node.value,
    state: states[i] ?? "default",
    label: i === 0 ? "head" : undefined,
  }));
}

function generateSteps(): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  let list: ListNode[] = [10, 20, 30, 40].map((value) => ({ id: `node-${value}`, value }));
  const values = () => list.map((node) => node.value);

  steps.push({
    id: stepId++,
    elements: makeList(list),
    highlightedLines: [1],
    explanation: `Linked List: nodes connected by pointers. Starting list: ${values().join(" → ")} → null. We'll insert 25, delete 30, then reverse.`,
    variables: { operation: "init" },
  });

  // Insert 25 after 20
  steps.push({
    id: stepId++,
    elements: makeList(list, { 1: "current", 2: "highlight" }),
    highlightedLines: [2, 3],
    explanation: `INSERT: Traverse to node 20. Create new node 25 pointing to 30.`,
    variables: { insert: 25, after: 20 },
    pointers: [{ name: "curr", targetId: "node-20" }],
  });
  list = [...list.slice(0, 2), { id: "node-25", value: 25 }, ...list.slice(2)];
  steps.push({
    id: stepId++,
    elements: makeList(list, { 2: "inserting" }),
    highlightedLines: [3],
    explanation: `Node 25 inserted. List: ${values().join(" → ")}.`,
    variables: { length: list.length },
  });

  // Delete 30
  steps.push({
    id: stepId++,
    elements: makeList(list, { 2: "current", 3: "comparing" }),
    highlightedLines: [5, 6],
    explanation: `DELETE: Find node 30. Bypass it by linking 25 directly to 40.`,
    variables: { delete: 30 },
    pointers: [{ name: "prev", targetId: "node-25" }],
  });
  list = list.filter((node) => node.value !== 30);
  steps.push({
    id: stepId++,
    elements: makeList(list, { 2: "current" }),
    highlightedLines: [6],
    explanation: `Node 30 removed. List: ${values().join(" → ")}.`,
    variables: { length: list.length },
  });

  // Reverse
  steps.push({
    id: stepId++,
    elements: makeList(list, { 0: "current" }),
    highlightedLines: [8, 9],
    explanation: `REVERSE: Use three pointers (prev, curr, next). Flip each link one at a time.`,
    variables: { prev: "null", curr: "head" },
    pointers: [{ name: "curr", targetId: "node-10" }],
  });
  list = [...list].reverse();
  steps.push({
    id: stepId++,
    elements: makeList(list, { 0: "sorted" }),
    highlightedLines: [10, 11, 12],
    explanation: `All links reversed. New head is 40. List: ${values().join(" → ")} → null.`,
    variables: { newHead: 40 },
  });

  steps.push(
    finalStep(
      stepId,
      makeList(list, Object.fromEntries(list.map((_, i) => [i, "sorted" as ElementState]))),
      `✅ Linked list operations complete. Insert O(n), delete O(n), reverse O(n).`,
      "Master linked lists before push_swap and minishell. Pointer manipulation is the core skill 42 tests repeatedly.",
      11
    )
  );

  return steps;
}

export const linkedList: AlgorithmDefinition = {
  meta: {
    id: "linked-list",
    name: "Linked List Operations",
    category: "42 Tirana",
    difficulty: "Intermediate",
    layout: "linked-list",
    legend: LINKED_LIST_LEGEND,
    timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    description: "Insert, delete, and reverse a singly linked list with pointer visualization.",
    defaultInput: [10, 20, 30, 40],
    accent: "violet",
    fortyTwoNote: "Core data structure in libft lists, push_swap, and minishell.",
    code: `// Insert after node\nnewNode.next = curr.next;\ncurr.next = newNode;\n\n// Delete node\nprev.next = curr.next;\n\n// Reverse\nwhile (curr) {\n  next = curr.next;\n  curr.next = prev;\n  prev = curr; curr = next;\n}`,
  },
  generateSteps,
};
