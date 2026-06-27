import type { VisualElement } from "../types";

export interface TreeNodePosition {
  id: string;
  x: number;
  y: number;
}

interface TreeNodeInput {
  id: string;
  parentId?: string | null;
}

/** Assign x/y positions for a flat tree using level-order depth and sibling spread. */
export function computeTreeLayout(
  elements: TreeNodeInput[],
  width = 100,
  height = 100
): TreeNodePosition[] {
  if (elements.length === 0) return [];

  const byId = new Map(elements.map((el) => [el.id, el]));
  const children = new Map<string, string[]>();
  let rootId: string | null = null;

  for (const el of elements) {
    if (el.parentId == null || !byId.has(el.parentId)) {
      if (rootId === null) rootId = el.id;
    } else {
      const siblings = children.get(el.parentId) ?? [];
      siblings.push(el.id);
      children.set(el.parentId, siblings);
    }
  }

  if (!rootId) rootId = elements[0].id;

  const positions = new Map<string, { x: number; y: number }>();
  const depthOf = (id: string): number => {
    let d = 0;
    let cur = byId.get(id);
    while (cur?.parentId && byId.has(cur.parentId)) {
      d++;
      cur = byId.get(cur.parentId);
    }
    return d;
  };

  const maxDepth = Math.max(...elements.map((el) => depthOf(el.id)), 0);
  const yForDepth = (d: number) =>
    maxDepth === 0 ? height / 2 : 12 + (d / maxDepth) * (height - 24);

  function layoutSubtree(nodeId: string, left: number, right: number, depth: number): void {
    positions.set(nodeId, { x: (left + right) / 2, y: yForDepth(depth) });
    const kids = children.get(nodeId) ?? [];
    if (kids.length === 0) return;

    const segment = (right - left) / kids.length;
    kids.forEach((kid, i) => {
      layoutSubtree(kid, left + i * segment, left + (i + 1) * segment, depth + 1);
    });
  }

  layoutSubtree(rootId, 8, width - 8, 0);

  return elements.map((el) => {
    const pos = positions.get(el.id) ?? { x: width / 2, y: height / 2 };
    return { id: el.id, x: pos.x, y: pos.y };
  });
}

export function buildTreeElements(
  nodes: { id: string; value: number | string; parentId?: string | null; state?: VisualElement["state"]; label?: string }[]
): VisualElement[] {
  return nodes.map((n) => ({
    id: n.id,
    value: n.value,
    state: n.state ?? "default",
    parentId: n.parentId ?? null,
    label: n.label,
  }));
}
