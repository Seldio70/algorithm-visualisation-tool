import type { AlgorithmDefinition, Step, ElementState, VisualElement } from "../types";
import { finalStep } from "./helpers";

/** Heap-array representation of a BST (index 0 = root). */
const TREE = [8, 3, 10, 1, 6, 0, 14, 0, 0, 4, 7, 0, 0, 0, 13];

function heapToElements(states: Record<number, ElementState>): VisualElement[] {
  const elements: VisualElement[] = [];
  for (let i = 0; i < TREE.length; i++) {
    if (TREE[i] === 0) continue;
    elements.push({
      id: `el-${i}`,
      value: TREE[i],
      parentId: i === 0 ? null : `el-${Math.floor((i - 1) / 2)}`,
      state: states[i] ?? "default",
    });
  }
  return elements;
}

function generateSteps(_input: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const visitedOrder: number[] = [];

  steps.push({
    id: stepId++,
    elements: heapToElements({}),
    highlightedLines: [1],
    explanation: `Binary tree traversals visit every node in a specific order. This BST has root 8. We'll demonstrate inorder: Left → Root → Right.`,
    variables: { order: "inorder" },
    callStack: ["inorder(root)"],
  });

  function walkInorder(idx: number, stack: string[]): void {
    if (idx >= TREE.length || TREE[idx] === 0) return;

    walkInorder(idx * 2 + 1, [...stack, `inorder(${TREE[idx * 2 + 1] ?? "null"})`]);

    visitedOrder.push(TREE[idx]);
    const nodeStates: Record<number, ElementState> = {};
    for (let i = 0; i < TREE.length; i++) {
      if (TREE[i] === 0) continue;
      const visitedIdx = visitedOrder.indexOf(TREE[i]);
      if (visitedIdx >= 0 && visitedIdx < visitedOrder.length - 1) nodeStates[i] = "visited";
    }
    nodeStates[idx] = "current";

    steps.push({
      id: stepId++,
      elements: heapToElements(nodeStates),
      highlightedLines: [2, 3],
      explanation: `Visit node ${TREE[idx]}. Inorder visits left subtree first, then root, then right.`,
      variables: { visited: visitedOrder.join(", ") },
      callStack: stack,
      pointers: [{ name: "node", targetId: `el-${idx}` }],
    });

    walkInorder(idx * 2 + 2, [...stack, `inorder(${TREE[idx * 2 + 2] ?? "null"})`]);
  }

  walkInorder(0, ["inorder(8)"]);

  const finalStates: Record<number, ElementState> = {};
  for (let i = 0; i < TREE.length; i++) {
    if (TREE[i] !== 0) finalStates[i] = "sorted";
  }

  steps.push(
    finalStep(
      stepId,
      heapToElements(finalStates),
      `✅ Inorder traversal: [${visitedOrder.join(", ")}]. For a BST, inorder gives sorted order!`,
      "Tree traversals (inorder, preorder, postorder) are fundamental for parsing, file systems, and expression trees. Inorder on a BST always yields sorted values.",
      4
    )
  );

  return steps;
}

export const treeTraversal: AlgorithmDefinition = {
  meta: {
    id: "tree-traversal",
    name: "Binary Tree Traversal",
    category: "Tree",
    difficulty: "Intermediate",
    layout: "tree",
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(h)",
    description: "Visits every node in a binary tree in a defined order: inorder (L-Root-R), preorder (Root-L-R), or postorder (L-R-Root).",
    defaultInput: [8, 3, 10, 1, 6, 14],
    code: `function inorder(node) {\n  if (!node) return;\n  inorder(node.left);\n  visit(node);\n  inorder(node.right);\n}`,
  },
  generateSteps,
};
