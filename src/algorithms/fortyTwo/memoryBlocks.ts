import type { AlgorithmDefinition, Step, ElementState } from "../../types";
import { finalStep } from "../helpers";

type Block = { id: string; label: string; value: string; state: ElementState };

function makeHeap(blocks: Block[]) {
  return blocks.map((b, i) => ({ id: `el-${i}`, value: b.value, state: b.state, label: b.label }));
}

function generateSteps(_input: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;

  let blocks: Block[] = [
    { id: "b0", label: "0x0000", value: "FREE (64B)", state: "default" },
    { id: "b1", label: "0x0040", value: "FREE (64B)", state: "default" },
    { id: "b2", label: "0x0080", value: "FREE (64B)", state: "default" },
    { id: "b3", label: "0x00C0", value: "FREE (64B)", state: "default" },
  ];

  steps.push({
    id: stepId++,
    elements: makeHeap(blocks),
    highlightedLines: [1],
    explanation: `Conceptual heap visualization: memory starts as one large free block. malloc() splits blocks; free() coalesces neighbors. Essential for understanding 42's malloc project.`,
    variables: { heapSize: "256B", freeBlocks: 4 },
  });

  blocks = blocks.map((b, i) => ({ ...b, state: i === 0 ? "current" : "default" }));
  steps.push({
    id: stepId++,
    elements: makeHeap(blocks),
    highlightedLines: [2, 3],
    explanation: `malloc(32): Find first free block ≥ 32 bytes. Split block at 0x0000 — allocate 32B, leave remainder free.`,
    variables: { request: "32B", found: "0x0000" },
  });

  blocks = [
    { id: "b0", label: "0x0000", value: "USED (32B)", state: "highlight" },
    { id: "b1", label: "0x0020", value: "FREE (32B)", state: "default" },
    { id: "b2", label: "0x0040", value: "FREE (64B)", state: "default" },
    { id: "b3", label: "0x0080", value: "FREE (64B)", state: "default" },
  ];
  steps.push({
    id: stepId++,
    elements: makeHeap(blocks),
    highlightedLines: [4],
    explanation: `Block split complete. Allocated chunk marked USED. Remainder stays on free list.`,
    variables: { allocated: "0x0000", size: "32B" },
  });

  blocks[0] = { ...blocks[0], state: "comparing" };
  blocks[1] = { ...blocks[1], state: "current" };
  steps.push({
    id: stepId++,
    elements: makeHeap(blocks),
    highlightedLines: [5, 6],
    explanation: `malloc(48): Next request needs 48B. First block (32B free) too small. Try next block (64B) — fits!`,
    variables: { request: "48B", skip: "0x0020 (too small)" },
  });

  blocks = [
    { id: "b0", label: "0x0000", value: "USED (32B)", state: "highlight" },
    { id: "b1", label: "0x0020", value: "FREE (32B)", state: "default" },
    { id: "b2", label: "0x0040", value: "USED (48B)", state: "current" },
    { id: "b3", label: "0x0070", value: "FREE (16B)", state: "default" },
  ];
  steps.push({
    id: stepId++,
    elements: makeHeap(blocks),
    highlightedLines: [7],
    explanation: `Second allocation at 0x0040. 16B remainder left free — fragmentation begins.`,
    variables: { allocated: "0x0040", fragmentation: "16B" },
  });

  blocks[0] = { ...blocks[0], state: "swapping" };
  steps.push({
    id: stepId++,
    elements: makeHeap(blocks),
    highlightedLines: [8, 9],
    explanation: `free(0x0000): Mark block FREE. Coalesce with adjacent free blocks if possible. 0x0000 (32B free) + 0x0020 (32B free) → merged 64B block.`,
    variables: { freed: "0x0000", coalesced: "yes" },
  });

  blocks = [
    { id: "b0", label: "0x0000", value: "FREE (64B)", state: "sorted" },
    { id: "b1", label: "0x0040", value: "USED (48B)", state: "highlight" },
    { id: "b2", label: "0x0070", value: "FREE (16B)", state: "default" },
  ];

  steps.push(
    finalStep(
      stepId,
      makeHeap(blocks),
      `✅ Heap state after alloc/free cycle. Watch for fragmentation and coalescing — key malloc design decisions.`,
      "The malloc project requires implementing this yourself. Understanding block splitting, free lists, and coalescing is non-negotiable at 42.",
      10
    )
  );

  return steps;
}

export const memoryBlocks: AlgorithmDefinition = {
  meta: {
    id: "memory-blocks",
    name: "Memory Blocks (malloc)",
    category: "42 Tirana",
    difficulty: "Advanced",
    layout: "memory",
    timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(n)",
    description: "Visualizes heap allocation: malloc splits free blocks, free coalesces neighbors. Conceptual malloc internals.",
    defaultInput: [0],
    accent: "violet",
    fortyTwoNote: "Directly maps to the 42 malloc project.",
    code: `void *malloc(size_t size) {\n  // find free block >= size\n  // split if larger than needed\n  // mark as allocated, return pointer\n}\nvoid free(void *ptr) {\n  // mark block as free\n  // coalesce with adjacent free blocks\n}`,
  },
  generateSteps,
};
