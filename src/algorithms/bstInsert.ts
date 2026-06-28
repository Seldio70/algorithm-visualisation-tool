import type { AlgorithmDefinition, Step, ElementState, VisualElement } from "../types";
import { finalStep } from "./helpers";
import { TREE_LEGEND } from "../constants/legends";

interface BstNode {
  id: string;
  value: number;
  parentId: string | null;
}

function leftChild(nodes: BstNode[], parent: BstNode): BstNode | undefined {
  return nodes.find((n) => n.parentId === parent.id && n.value < parent.value);
}

function rightChild(nodes: BstNode[], parent: BstNode): BstNode | undefined {
  return nodes.find((n) => n.parentId === parent.id && n.value > parent.value);
}

function toElements(nodes: BstNode[], states: Record<string, ElementState>): VisualElement[] {
  return nodes.map((n) => ({
    id: n.id,
    value: n.value,
    parentId: n.parentId,
    state: states[n.id] ?? "default",
  }));
}

function generateSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const values = [...input];
  const nodes: BstNode[] = [];
  let idCounter = 0;

  steps.push({
    id: stepId++,
    elements: [],
    highlightedLines: [1],
    explanation: `BST Insert maintains the property: left child < node < right child. We'll insert values one by one into an empty tree.`,
    variables: { toInsert: values.join(", ") },
  });

  for (const val of values) {
    if (nodes.length === 0) {
      const id = `el-${idCounter++}`;
      nodes.push({ id, value: val, parentId: null });
      steps.push({
        id: stepId++,
        elements: toElements(nodes, { [id]: "current" }),
        highlightedLines: [2],
        explanation: `Tree is empty. ${val} becomes the root.`,
        variables: { inserted: val, position: "root" },
      });
      continue;
    }

    let cur = nodes[0];
    const pathStates: Record<string, ElementState> = {};

    while (true) {
      pathStates[cur.id] = "current";
      steps.push({
        id: stepId++,
        elements: toElements(nodes, { ...pathStates, [cur.id]: "comparing" }),
        highlightedLines: [3, 5],
        explanation: `Insert ${val}: compare with node ${cur.value}. ${val < cur.value ? `${val} < ${cur.value} → go LEFT.` : `${val} > ${cur.value} → go RIGHT.`}`,
        variables: { inserting: val, current: cur.value, compare: val < cur.value ? "<" : ">" },
        pointers: [{ name: "curr", targetId: cur.id }],
      });

      if (val < cur.value) {
        const left = leftChild(nodes, cur);
        if (!left) {
          const id = `el-${idCounter++}`;
          nodes.push({ id, value: val, parentId: cur.id });
          steps.push({
            id: stepId++,
            elements: toElements(nodes, { [cur.id]: "visited", [id]: "inserting" }),
            highlightedLines: [4],
            explanation: `Insert ${val} as left child of ${cur.value}.`,
            variables: { inserted: val, parent: cur.value, side: "left" },
          });
          break;
        }
        pathStates[cur.id] = "visited";
        cur = left;
      } else {
        const right = rightChild(nodes, cur);
        if (!right) {
          const id = `el-${idCounter++}`;
          nodes.push({ id, value: val, parentId: cur.id });
          steps.push({
            id: stepId++,
            elements: toElements(nodes, { [cur.id]: "visited", [id]: "inserting" }),
            highlightedLines: [6],
            explanation: `Insert ${val} as right child of ${cur.value}.`,
            variables: { inserted: val, parent: cur.value, side: "right" },
          });
          break;
        }
        pathStates[cur.id] = "visited";
        cur = right;
      }
    }
  }

  steps.push({
    ...finalStep(
      stepId,
      toElements(nodes, Object.fromEntries(nodes.map((n) => [n.id, "sorted" as ElementState]))),
      `✅ BST built with ${values.length} insertions. Inorder traversal would yield sorted values.`,
      "BST insert is O(h) where h is height — O(log n) for balanced trees, O(n) worst case. Self-balancing trees (AVL, Red-Black) fix the worst case.",
      7
    ),
  });

  return steps;
}

export const bstInsert: AlgorithmDefinition = {
  meta: {
    id: "bst-insert",
    name: "BST Insert",
    category: "Tree",
    difficulty: "Intermediate",
    layout: "tree",
    legend: TREE_LEGEND,
    timeComplexity: { best: "O(log n)", average: "O(log n)", worst: "O(n)" },
    spaceComplexity: "O(h)",
    description: "Inserts a value into a Binary Search Tree while maintaining the BST property.",
    defaultInput: [8, 3, 10, 1, 6],
    code: `function insert(root, val) {\n  if (!root) return new Node(val);\n  if (val < root.val)\n    root.left = insert(root.left, val);\n  else\n    root.right = insert(root.right, val);\n  return root;\n}`,
  },
  generateSteps,
};
