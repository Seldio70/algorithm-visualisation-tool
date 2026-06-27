import type { AlgorithmDefinition, Step, ElementState } from "../types";
import { finalStep } from "./helpers";

function generateSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const values = [...input];
  const tree: (number | null)[] = [];

  steps.push({
    id: stepId++,
    elements: [{ id: "el-0", value: "∅", state: "default", label: "root" }],
    highlightedLines: [1],
    explanation: `BST Insert maintains the property: left child < node < right child. We'll insert values one by one into an empty tree.`,
    variables: { toInsert: values.join(", ") },
  });

  for (const val of values) {
    let idx = 0;
    const nodes: { idx: number; val: number | null; state: ElementState }[] = [];

    if (tree.length === 0) {
      tree.push(val);
      steps.push({
        id: stepId++,
        elements: [{ id: "el-0", value: val, state: "current", label: "root" }],
        highlightedLines: [2],
        explanation: `Tree is empty. ${val} becomes the root.`,
        variables: { inserted: val, position: "root" },
      });
      continue;
    }

    while (true) {
      nodes.push({ idx, val: tree[idx] ?? null, state: "comparing" });
      const current = tree[idx]!;

      steps.push({
        id: stepId++,
        elements: tree.map((v, i) => ({
          id: `el-${i}`,
          value: v ?? "∅",
          state: i === idx ? "current" : nodes.some((n) => n.idx === i) ? "visited" : "default",
          label: i === 0 ? "root" : undefined,
        })),
        highlightedLines: [3, 4],
        explanation: `Insert ${val}: compare with node ${current}. ${val < current ? `${val} < ${current} → go LEFT.` : `${val} > ${current} → go RIGHT.`}`,
        variables: { inserting: val, current, compare: val < current ? "<" : ">" },
        pointers: [{ name: "curr", targetId: `el-${idx}` }],
      });

      if (val < current) {
        const left = idx * 2 + 1;
        if (left >= tree.length || tree[left] == null) {
          while (tree.length <= left) tree.push(null);
          tree[left] = val;
          steps.push({
            id: stepId++,
            elements: tree.map((v, i) => ({
              id: `el-${i}`,
              value: v ?? "∅",
              state: i === left ? "inserting" : i === idx ? "visited" : "default",
            })),
            highlightedLines: [5],
            explanation: `Insert ${val} as left child of ${current}.`,
            variables: { inserted: val, parent: current, side: "left" },
          });
          break;
        }
        idx = left;
      } else {
        const right = idx * 2 + 2;
        if (right >= tree.length || tree[right] == null) {
          while (tree.length <= right) tree.push(null);
          tree[right] = val;
          steps.push({
            id: stepId++,
            elements: tree.map((v, i) => ({
              id: `el-${i}`,
              value: v ?? "∅",
              state: i === right ? "inserting" : i === idx ? "visited" : "default",
            })),
            highlightedLines: [6],
            explanation: `Insert ${val} as right child of ${current}.`,
            variables: { inserted: val, parent: current, side: "right" },
          });
          break;
        }
        idx = right;
      }
    }
  }

  steps.push(
    finalStep(
      stepId,
      tree.map((v, i) => ({
        id: `el-${i}`,
        value: v ?? "∅",
        state: "sorted" as ElementState,
      })),
      `✅ BST built with ${values.length} insertions. Inorder traversal would yield sorted values.`,
      "BST insert is O(h) where h is height — O(log n) for balanced trees, O(n) worst case. Self-balancing trees (AVL, Red-Black) fix the worst case.",
      7
    )
  );

  return steps;
}

export const bstInsert: AlgorithmDefinition = {
  meta: {
    id: "bst-insert",
    name: "BST Insert",
    category: "Tree",
    difficulty: "Intermediate",
    layout: "tree",
    timeComplexity: { best: "O(log n)", average: "O(log n)", worst: "O(n)" },
    spaceComplexity: "O(h)",
    description: "Inserts a value into a Binary Search Tree while maintaining the BST property.",
    defaultInput: [8, 3, 10, 1, 6],
    code: `function insert(root, val) {\n  if (!root) return new Node(val);\n  if (val < root.val) root.left = insert(root.left, val);\n  else root.right = insert(root.right, val);\n  return root;\n}`,
  },
  generateSteps,
};
