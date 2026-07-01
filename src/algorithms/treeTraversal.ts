import type { AlgorithmDefinition, Step, ElementState, VisualElement } from "../types";
import { finalStep } from "./helpers";
import { TREE_LEGEND } from "../constants/legends";

function buildHeapTree(values: number[]): number[] {
  const tree: number[] = [];
  for (const value of values) {
    let index = 0;
    while (tree[index] !== undefined) {
      index = value < tree[index] ? index * 2 + 1 : index * 2 + 2;
    }
    tree[index] = value;
  }
  return Array.from({ length: tree.length }, (_, index) => tree[index] ?? 0);
}

function heapToElements(tree: number[], states: Record<number, ElementState>): VisualElement[] {
  const elements: VisualElement[] = [];
  for (let i = 0; i < tree.length; i++) {
    if (tree[i] === 0) continue;
    elements.push({
      id: `el-${i}`,
      value: tree[i],
      parentId: i === 0 ? null : `el-${Math.floor((i - 1) / 2)}`,
      state: states[i] ?? "default",
    });
  }
  return elements;
}

function generateSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const TREE = buildHeapTree(input.length ? input : [8, 3, 10, 1, 6, 14]);
  const visitedOrder: number[] = [];

  steps.push({
    id: stepId++,
    elements: heapToElements(TREE, {}),
    highlightedLines: [1],
    explanation: `Binary tree traversals visit every node in a specific order. This BST has root ${TREE[0]}. We'll demonstrate inorder: Left → Root → Right.`,
    variables: { order: "inorder" },
    callStack: [`inorder(${TREE[0]})`],
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
      elements: heapToElements(TREE, nodeStates),
      highlightedLines: [3, 4],
      explanation: `Visit node ${TREE[idx]}. Inorder visits left subtree first, then root, then right.`,
      variables: { visited: visitedOrder.join(", ") },
      callStack: stack,
      pointers: [{ name: "node", targetId: `el-${idx}` }],
    });

    walkInorder(idx * 2 + 2, [...stack, `inorder(${TREE[idx * 2 + 2] ?? "null"})`]);
  }

  walkInorder(0, [`inorder(${TREE[0]})`]);

  const finalStates: Record<number, ElementState> = {};
  for (let i = 0; i < TREE.length; i++) {
    if (TREE[i] !== 0) finalStates[i] = "sorted";
  }

  steps.push(
    finalStep(
      stepId,
      heapToElements(TREE, finalStates),
      `✅ Inorder traversal: [${visitedOrder.join(", ")}]. For a BST, inorder gives sorted order!`,
      "Tree traversals (inorder, preorder, postorder) are fundamental for parsing, file systems, and expression trees. Inorder on a BST always yields sorted values.",
      6
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
    legend: TREE_LEGEND,
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(h)",
    description: "Visits every node in a binary search tree using inorder traversal: left subtree, root, then right subtree.",
    defaultInput: [8, 3, 10, 1, 6, 14],
    code: `function inorder(node) {\n  if (!node) return;\n  inorder(node.left);\n  visit(node);\n  inorder(node.right);\n}`,
  },
  generateSteps,
};
