import type { TreeNodeData, TreeStep, TreeNodeState } from '../types';

// ── ID allocator (exported so hook can sync) ─────────────
let _nextId = 1;
export function resetIdCounter(val = 1) { _nextId = val; }
export function allocId() { return _nextId++; }

// ── Helpers ──────────────────────────────────────────────
function cloneNodes(nodes: Record<number, TreeNodeData>): Record<number, TreeNodeData> {
  const out: Record<number, TreeNodeData> = {};
  for (const [k, v] of Object.entries(nodes)) out[Number(k)] = { ...v };
  return out;
}

function snap(
  nodes: Record<number, TreeNodeData>,
  rootId: number | null,
  line: number,
  desc: string,
): TreeStep {
  return { nodes: cloneNodes(nodes), rootId, activeLine: line, description: desc };
}

function setAllStates(nodes: Record<number, TreeNodeData>, state: TreeNodeState) {
  for (const n of Object.values(nodes)) n.state = state;
}

function getHeight(nodes: Record<number, TreeNodeData>, id: number | null): number {
  if (id === null) return 0;
  const n = nodes[id];
  if (!n) return 0;
  return Math.max(getHeight(nodes, n.left), getHeight(nodes, n.right)) + 1;
}

function getBalance(nodes: Record<number, TreeNodeData>, id: number | null): number {
  if (id === null) return 0;
  const n = nodes[id];
  return getHeight(nodes, n.left) - getHeight(nodes, n.right);
}

// ════════════════════════════════════════════════════════
//  BINARY TREE  (level-order insert, BFS search)
// ════════════════════════════════════════════════════════
export function btInsert(
  inputNodes: Record<number, TreeNodeData>,
  inputRootId: number | null,
  value: number,
): { steps: TreeStep[]; newNodes: Record<number, TreeNodeData>; newRootId: number } {
  const steps: TreeStep[] = [];
  const nodes = cloneNodes(inputNodes);
  setAllStates(nodes, 'default');

  const newId = allocId();
  const newNode: TreeNodeData = { id: newId, value, left: null, right: null, height: 1, state: 'new', parent: null };

  if (inputRootId === null) {
    nodes[newId] = newNode;
    steps.push(snap(nodes, newId, 1, `Empty tree — inserting ${value} as root`));
    return { steps, newNodes: nodes, newRootId: newId };
  }

  // BFS level-order to find first empty slot
  const queue: number[] = [inputRootId];
  steps.push(snap(nodes, inputRootId, 3, `Level-order search for first empty slot`));

  while (queue.length > 0) {
    const cur = queue.shift()!;
    nodes[cur].state = 'comparing';
    steps.push(snap(nodes, inputRootId, 4, `Visiting node ${nodes[cur].value}`));

    if (nodes[cur].left === null) {
      newNode.parent = cur;
      nodes[newId] = newNode;
      nodes[cur].left = newId;
      steps.push(snap(nodes, inputRootId, 5, `Inserted ${value} as left child of ${nodes[cur].value}`));
      nodes[cur].state = 'default';
      return { steps, newNodes: nodes, newRootId: inputRootId };
    } else {
      queue.push(nodes[cur].left!);
    }

    if (nodes[cur].right === null) {
      newNode.parent = cur;
      nodes[newId] = newNode;
      nodes[cur].right = newId;
      steps.push(snap(nodes, inputRootId, 7, `Inserted ${value} as right child of ${nodes[cur].value}`));
      nodes[cur].state = 'default';
      return { steps, newNodes: nodes, newRootId: inputRootId };
    } else {
      queue.push(nodes[cur].right!);
    }
    nodes[cur].state = 'path';
  }

  nodes[newId] = newNode;
  return { steps, newNodes: nodes, newRootId: inputRootId };
}

export function btSearch(
  inputNodes: Record<number, TreeNodeData>,
  rootId: number | null,
  value: number,
): TreeStep[] {
  const steps: TreeStep[] = [];
  const nodes = cloneNodes(inputNodes);
  setAllStates(nodes, 'default');
  if (rootId === null) {
    steps.push(snap(nodes, null, 0, 'Tree is empty'));
    return steps;
  }

  steps.push(snap(nodes, rootId, 0, `BFS search for ${value}`));
  const queue: number[] = [rootId];

  while (queue.length > 0) {
    const cur = queue.shift()!;
    nodes[cur].state = 'comparing';
    steps.push(snap(nodes, rootId, 3, `Visiting node ${nodes[cur].value}`));

    if (nodes[cur].value === value) {
      nodes[cur].state = 'found';
      steps.push(snap(nodes, rootId, 4, `✓ Found ${value}!`));
      return steps;
    }
    nodes[cur].state = 'path';
    if (nodes[cur].left !== null) queue.push(nodes[cur].left!);
    if (nodes[cur].right !== null) queue.push(nodes[cur].right!);
  }

  steps.push(snap(nodes, rootId, 7, `✗ ${value} not found in tree`));
  return steps;
}

// ════════════════════════════════════════════════════════
//  BST — Binary Search Tree
// ════════════════════════════════════════════════════════
export function bstInsert(
  inputNodes: Record<number, TreeNodeData>,
  inputRootId: number | null,
  value: number,
): { steps: TreeStep[]; newNodes: Record<number, TreeNodeData>; newRootId: number } {
  const steps: TreeStep[] = [];
  const nodes = cloneNodes(inputNodes);
  setAllStates(nodes, 'default');

  const newId = allocId();
  const newNode: TreeNodeData = { id: newId, value, left: null, right: null, height: 1, state: 'new', parent: null };

  steps.push(snap(nodes, inputRootId, 0, `BST insert: ${value}`));

  if (inputRootId === null) {
    nodes[newId] = newNode;
    steps.push(snap(nodes, newId, 1, `Tree empty — ${value} becomes root`));
    return { steps, newNodes: nodes, newRootId: newId };
  }

  let cur = inputRootId;
  while (true) {
    nodes[cur].state = 'comparing';
    steps.push(snap(nodes, inputRootId, 4, `Compare ${value} with ${nodes[cur].value}`));

    if (value === nodes[cur].value) {
      nodes[cur].state = 'found';
      steps.push(snap(nodes, inputRootId, 5, `${value} already exists — no duplicates in BST`));
      delete nodes[newId];
      return { steps, newNodes: nodes, newRootId: inputRootId };
    } else if (value < nodes[cur].value) {
      nodes[cur].state = 'path';
      steps.push(snap(nodes, inputRootId, 7, `${value} < ${nodes[cur].value} → go left`));
      if (nodes[cur].left === null) {
        newNode.parent = cur;
        nodes[newId] = newNode;
        nodes[cur].left = newId;
        steps.push(snap(nodes, inputRootId, 9, `Inserted ${value} as left child of ${nodes[cur].value}`));
        return { steps, newNodes: nodes, newRootId: inputRootId };
      }
      cur = nodes[cur].left!;
    } else {
      nodes[cur].state = 'path';
      steps.push(snap(nodes, inputRootId, 11, `${value} > ${nodes[cur].value} → go right`));
      if (nodes[cur].right === null) {
        newNode.parent = cur;
        nodes[newId] = newNode;
        nodes[cur].right = newId;
        steps.push(snap(nodes, inputRootId, 13, `Inserted ${value} as right child of ${nodes[cur].value}`));
        return { steps, newNodes: nodes, newRootId: inputRootId };
      }
      cur = nodes[cur].right!;
    }
  }
}

export function bstSearch(
  inputNodes: Record<number, TreeNodeData>,
  rootId: number | null,
  value: number,
): TreeStep[] {
  const steps: TreeStep[] = [];
  const nodes = cloneNodes(inputNodes);
  setAllStates(nodes, 'default');

  steps.push(snap(nodes, rootId, 0, `BST search for ${value}`));

  let cur = rootId;
  while (cur !== null) {
    nodes[cur].state = 'comparing';
    steps.push(snap(nodes, rootId, 3, `Compare ${value} with ${nodes[cur].value}`));

    if (nodes[cur].value === value) {
      nodes[cur].state = 'found';
      steps.push(snap(nodes, rootId, 4, `✓ Found ${value}!`));
      return steps;
    } else if (value < nodes[cur].value) {
      nodes[cur].state = 'path';
      steps.push(snap(nodes, rootId, 6, `${value} < ${nodes[cur].value} → go left`));
      cur = nodes[cur].left;
    } else {
      nodes[cur].state = 'path';
      steps.push(snap(nodes, rootId, 8, `${value} > ${nodes[cur].value} → go right`));
      cur = nodes[cur].right;
    }
  }

  steps.push(snap(nodes, rootId, 11, `✗ ${value} not found`));
  return steps;
}

// BST delete helper: find in-order successor
function findMin(nodes: Record<number, TreeNodeData>, id: number): number {
  let cur = id;
  while (nodes[cur].left !== null) cur = nodes[cur].left!;
  return cur;
}

export function bstDelete(
  inputNodes: Record<number, TreeNodeData>,
  inputRootId: number | null,
  value: number,
): { steps: TreeStep[]; newNodes: Record<number, TreeNodeData>; newRootId: number | null } {
  const steps: TreeStep[] = [];
  const nodes = cloneNodes(inputNodes);
  setAllStates(nodes, 'default');

  steps.push(snap(nodes, inputRootId, 0, `BST delete: ${value}`));

  function deleteNode(rootId: number | null, val: number): number | null {
    if (rootId === null) {
      steps.push(snap(nodes, inputRootId, 1, `✗ ${val} not found`));
      return null;
    }

    nodes[rootId].state = 'comparing';
    steps.push(snap(nodes, inputRootId, 3, `Compare ${val} with ${nodes[rootId].value}`));

    if (val < nodes[rootId].value) {
      nodes[rootId].state = 'path';
      steps.push(snap(nodes, inputRootId, 5, `${val} < ${nodes[rootId].value} → go left`));
      nodes[rootId].left = deleteNode(nodes[rootId].left, val);
      return rootId;
    } else if (val > nodes[rootId].value) {
      nodes[rootId].state = 'path';
      steps.push(snap(nodes, inputRootId, 7, `${val} > ${nodes[rootId].value} → go right`));
      nodes[rootId].right = deleteNode(nodes[rootId].right, val);
      return rootId;
    } else {
      // Found the node to delete
      nodes[rootId].state = 'deleted';
      steps.push(snap(nodes, inputRootId, 9, `Found ${val} — deleting...`));

      if (nodes[rootId].left === null && nodes[rootId].right === null) {
        // Case 1: leaf
        steps.push(snap(nodes, inputRootId, 10, `Leaf node — remove directly`));
        delete nodes[rootId];
        return null;
      } else if (nodes[rootId].left === null) {
        // Case 2a: only right child
        steps.push(snap(nodes, inputRootId, 12, `One child (right) — replace with right subtree`));
        const replacement = nodes[rootId].right!;
        delete nodes[rootId];
        return replacement;
      } else if (nodes[rootId].right === null) {
        // Case 2b: only left child
        steps.push(snap(nodes, inputRootId, 13, `One child (left) — replace with left subtree`));
        const replacement = nodes[rootId].left!;
        delete nodes[rootId];
        return replacement;
      } else {
        // Case 3: two children — find in-order successor
        const successorId = findMin(nodes, nodes[rootId].right!);
        nodes[successorId].state = 'swapping';
        steps.push(snap(nodes, inputRootId, 15, `Two children — in-order successor is ${nodes[successorId].value}`));
        nodes[rootId].value = nodes[successorId].value;
        nodes[rootId].state = 'default';
        nodes[rootId].right = deleteNode(nodes[rootId].right, nodes[successorId].value);
        return rootId;
      }
    }
  }

  const newRootId = deleteNode(inputRootId, value);
  setAllStates(nodes, 'default');
  steps.push(snap(nodes, newRootId, 17, `Delete complete`));
  return { steps, newNodes: nodes, newRootId };
}

// ════════════════════════════════════════════════════════
//  AVL Tree
// ════════════════════════════════════════════════════════
function updateHeight(nodes: Record<number, TreeNodeData>, id: number | null): void {
  if (id === null) return;
  nodes[id].height = 1 + Math.max(getHeight(nodes, nodes[id].left), getHeight(nodes, nodes[id].right));
}

function rotateRight(
  nodes: Record<number, TreeNodeData>,
  y: number,
  steps: TreeStep[],
  rootId: number | null,
): number {
  const x = nodes[y].left!;
  const T2 = nodes[x].right;

  nodes[x].state = 'rotating';
  nodes[y].state = 'rotating';
  steps.push(snap(nodes, rootId, 20, `Right rotate at node ${nodes[y].value} (pivot: ${nodes[x].value})`));

  nodes[x].right = y;
  nodes[y].left = T2;
  if (T2 !== null) nodes[T2].parent = y;
  nodes[x].parent = nodes[y].parent;
  nodes[y].parent = x;

  updateHeight(nodes, y);
  updateHeight(nodes, x);
  nodes[x].state = 'default';
  nodes[y].state = 'default';
  return x;
}

function rotateLeft(
  nodes: Record<number, TreeNodeData>,
  x: number,
  steps: TreeStep[],
  rootId: number | null,
): number {
  const y = nodes[x].right!;
  const T2 = nodes[y].left;

  nodes[x].state = 'rotating';
  nodes[y].state = 'rotating';
  steps.push(snap(nodes, rootId, 22, `Left rotate at node ${nodes[x].value} (pivot: ${nodes[y].value})`));

  nodes[y].left = x;
  nodes[x].right = T2;
  if (T2 !== null) nodes[T2].parent = x;
  nodes[y].parent = nodes[x].parent;
  nodes[x].parent = y;

  updateHeight(nodes, x);
  updateHeight(nodes, y);
  nodes[x].state = 'default';
  nodes[y].state = 'default';
  return y;
}

export function avlInsert(
  inputNodes: Record<number, TreeNodeData>,
  inputRootId: number | null,
  value: number,
): { steps: TreeStep[]; newNodes: Record<number, TreeNodeData>; newRootId: number | null } {
  const steps: TreeStep[] = [];
  const nodes = cloneNodes(inputNodes);
  setAllStates(nodes, 'default');

  steps.push(snap(nodes, inputRootId, 0, `AVL insert: ${value}`));

  function insert(id: number | null, parent: number | null): number {
    if (id === null) {
      const newId = allocId();
      nodes[newId] = { id: newId, value, left: null, right: null, height: 1, state: 'new', parent };
      steps.push(snap(nodes, inputRootId ?? newId, 2, `Inserted ${value} as new node`));
      return newId;
    }

    nodes[id].state = 'comparing';
    steps.push(snap(nodes, inputRootId ?? id, 4, `Compare ${value} with ${nodes[id].value}`));

    if (value < nodes[id].value) {
      nodes[id].state = 'path';
      nodes[id].left = insert(nodes[id].left, id);
    } else if (value > nodes[id].value) {
      nodes[id].state = 'path';
      nodes[id].right = insert(nodes[id].right, id);
    } else {
      nodes[id].state = 'found';
      steps.push(snap(nodes, inputRootId ?? id, 8, `${value} already exists`));
      return id;
    }

    updateHeight(nodes, id);
    const balance = getBalance(nodes, id);

    // LL
    if (balance > 1 && nodes[nodes[id].left!].left !== null && value < nodes[nodes[id].left!].value) {
      steps.push(snap(nodes, inputRootId ?? id, 13, `Balance=${balance}: LL case — right rotate`));
      return rotateRight(nodes, id, steps, inputRootId ?? id);
    }
    // RR
    if (balance < -1 && nodes[nodes[id].right!].right !== null && value > nodes[nodes[id].right!].value) {
      steps.push(snap(nodes, inputRootId ?? id, 16, `Balance=${balance}: RR case — left rotate`));
      return rotateLeft(nodes, id, steps, inputRootId ?? id);
    }
    // LR
    if (balance > 1 && nodes[nodes[id].left!].right !== null && value > nodes[nodes[id].left!].value) {
      steps.push(snap(nodes, inputRootId ?? id, 14, `Balance=${balance}: LR case — left rotate then right rotate`));
      nodes[id].left = rotateLeft(nodes, nodes[id].left!, steps, inputRootId ?? id);
      return rotateRight(nodes, id, steps, inputRootId ?? id);
    }
    // RL
    if (balance < -1 && nodes[nodes[id].right!].left !== null && value < nodes[nodes[id].right!].value) {
      steps.push(snap(nodes, inputRootId ?? id, 17, `Balance=${balance}: RL case — right rotate then left rotate`));
      nodes[id].right = rotateRight(nodes, nodes[id].right!, steps, inputRootId ?? id);
      return rotateLeft(nodes, id, steps, inputRootId ?? id);
    }

    return id;
  }

  const newRootId = insert(inputRootId, null);
  setAllStates(nodes, 'default');
  steps.push(snap(nodes, newRootId, 26, `AVL insert complete, tree balanced`));
  return { steps, newNodes: nodes, newRootId };
}

export function avlSearch(
  inputNodes: Record<number, TreeNodeData>,
  rootId: number | null,
  value: number,
): TreeStep[] {
  return bstSearch(inputNodes, rootId, value); // Same as BST search
}

// ════════════════════════════════════════════════════════
//  MAX HEAP (array-based, convert to tree for display)
// ════════════════════════════════════════════════════════
export function heapArrayToTree(
  heapArr: number[],
): { nodes: Record<number, TreeNodeData>; rootId: number | null } {
  if (heapArr.length === 0) return { nodes: {}, rootId: null };
  const nodes: Record<number, TreeNodeData> = {};

  for (let i = 0; i < heapArr.length; i++) {
    const leftIdx = 2 * i + 1;
    const rightIdx = 2 * i + 2;
    nodes[i + 1] = {
      id: i + 1,
      value: heapArr[i],
      left: leftIdx < heapArr.length ? leftIdx + 1 : null,
      right: rightIdx < heapArr.length ? rightIdx + 1 : null,
      height: 1,
      state: 'default',
      parent: i === 0 ? null : Math.floor((i - 1) / 2) + 1,
    };
  }
  return { nodes, rootId: 1 };
}

export function heapInsert(
  heapArr: number[],
  value: number,
): { steps: { heap: number[]; highlightIdx: number[]; description: string; activeLine: number }[]; newHeap: number[] } {
  const steps: { heap: number[]; highlightIdx: number[]; description: string; activeLine: number }[] = [];
  const heap = [...heapArr];

  heap.push(value);
  steps.push({ heap: [...heap], highlightIdx: [heap.length - 1], description: `Inserted ${value} at end (index ${heap.length - 1})`, activeLine: 2 });

  let i = heap.length - 1;
  while (i > 0) {
    const parent = Math.floor((i - 1) / 2);
    steps.push({ heap: [...heap], highlightIdx: [i, parent], description: `Compare A[${i}]=${heap[i]} with parent A[${parent}]=${heap[parent]}`, activeLine: 5 });
    if (heap[i] > heap[parent]) {
      [heap[i], heap[parent]] = [heap[parent], heap[i]];
      steps.push({ heap: [...heap], highlightIdx: [i, parent], description: `${heap[parent]} < ${heap[i]} — swap (bubble up)`, activeLine: 7 });
      i = parent;
    } else {
      steps.push({ heap: [...heap], highlightIdx: [i], description: `Heap property satisfied`, activeLine: 9 });
      break;
    }
  }

  steps.push({ heap: [...heap], highlightIdx: [], description: `Heap insert complete`, activeLine: 11 });
  return { steps, newHeap: heap };
}

export function heapExtractMax(
  heapArr: number[],
): { steps: { heap: number[]; highlightIdx: number[]; description: string; activeLine: number }[]; newHeap: number[]; extracted: number | null } {
  if (heapArr.length === 0) return { steps: [], newHeap: [], extracted: null };

  const steps: { heap: number[]; highlightIdx: number[]; description: string; activeLine: number }[] = [];
  const heap = [...heapArr];
  const extracted = heap[0];

  steps.push({ heap: [...heap], highlightIdx: [0], description: `Extract max: ${extracted}`, activeLine: 1 });

  heap[0] = heap[heap.length - 1];
  heap.pop();
  steps.push({ heap: [...heap], highlightIdx: [0], description: `Move last element to root, remove last`, activeLine: 3 });

  // Heapify down
  let i = 0;
  while (true) {
    let largest = i;
    const l = 2 * i + 1, r = 2 * i + 2;
    steps.push({ heap: [...heap], highlightIdx: [i, l, r].filter(x => x < heap.length), description: `Heapify down at index ${i}`, activeLine: 6 });

    if (l < heap.length && heap[l] > heap[largest]) largest = l;
    if (r < heap.length && heap[r] > heap[largest]) largest = r;

    if (largest !== i) {
      steps.push({ heap: [...heap], highlightIdx: [i, largest], description: `Swap ${heap[i]} ↔ ${heap[largest]}`, activeLine: 11 });
      [heap[i], heap[largest]] = [heap[largest], heap[i]];
      i = largest;
    } else {
      steps.push({ heap: [...heap], highlightIdx: [i], description: `Heap property satisfied`, activeLine: 13 });
      break;
    }
  }

  steps.push({ heap: [...heap], highlightIdx: [], description: `Extract complete, returned ${extracted}`, activeLine: 15 });
  return { steps, newHeap: heap, extracted };
}
