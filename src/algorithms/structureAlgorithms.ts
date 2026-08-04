import type { StructureStep, HashEntry, UFElement } from '../types';

type StackItemState = 'default' | 'active' | 'push' | 'pop';
type QueueItemState = 'default' | 'active' | 'enqueue' | 'dequeue';
type LLItemState = 'default' | 'active' | 'inserted' | 'deleted' | 'found';

// ════════════════════════════════════════════════════════
// 1. STACK (LIFO)
// ════════════════════════════════════════════════════════
export function stackPushSteps(current: number[], val: number): StructureStep[] {
  const steps: StructureStep[] = [];
  const items: { value: number; state: StackItemState }[] = current.map((v) => ({ value: v, state: 'default' }));

  steps.push({
    stack: items.map((i) => ({ ...i })),
    activeLine: 1,
    description: `Stack push: Preparing to push ${val} onto top of stack`,
  });

  items.push({ value: val, state: 'push' });
  steps.push({
    stack: items.map((i) => ({ ...i })),
    activeLine: 2,
    description: `Pushed ${val} onto top of stack (Top index = ${items.length - 1})`,
  });

  items[items.length - 1].state = 'default';
  steps.push({
    stack: items.map((i) => ({ ...i })),
    activeLine: 3,
    description: `✓ Stack push operation complete. Total size = ${items.length}`,
  });

  return steps;
}

export function stackPopSteps(current: number[]): StructureStep[] {
  const steps: StructureStep[] = [];
  if (current.length === 0) {
    return [{ stack: [], activeLine: 5, description: '✗ Stack Underflow! Cannot pop from empty stack' }];
  }

  const items: { value: number; state: StackItemState }[] = current.map((v) => ({ value: v, state: 'default' }));
  const topVal = items[items.length - 1].value;

  items[items.length - 1].state = 'pop';
  steps.push({
    stack: items.map((i) => ({ ...i })),
    activeLine: 6,
    description: `Stack pop: Highlighting top element (${topVal})`,
  });

  items.pop();
  steps.push({
    stack: items.map((i) => ({ ...i })),
    activeLine: 8,
    description: `✓ Popped element ${topVal} from top of stack. Remaining size = ${items.length}`,
  });

  return steps;
}

// ════════════════════════════════════════════════════════
// 2. QUEUE (FIFO)
// ════════════════════════════════════════════════════════
export function queueEnqueueSteps(current: number[], val: number): StructureStep[] {
  const steps: StructureStep[] = [];
  const items: { value: number; state: QueueItemState }[] = current.map((v) => ({ value: v, state: 'default' }));

  steps.push({
    queue: items.map((i) => ({ ...i })),
    activeLine: 1,
    description: `Queue enqueue: Enqueuing element ${val} at rear`,
  });

  items.push({ value: val, state: 'enqueue' });
  steps.push({
    queue: items.map((i) => ({ ...i })),
    activeLine: 2,
    description: `Enqueued ${val} at rear (Rear index = ${items.length - 1})`,
  });

  items[items.length - 1].state = 'default';
  steps.push({
    queue: items.map((i) => ({ ...i })),
    activeLine: 2,
    description: `✓ Queue enqueue complete. Total length = ${items.length}`,
  });

  return steps;
}

export function queueDequeueSteps(current: number[]): StructureStep[] {
  const steps: StructureStep[] = [];
  if (current.length === 0) {
    return [{ queue: [], activeLine: 5, description: '✗ Queue Underflow! Cannot dequeue from empty queue' }];
  }

  const items: { value: number; state: QueueItemState }[] = current.map((v) => ({ value: v, state: 'default' }));
  const frontVal = items[0].value;

  items[0].state = 'dequeue';
  steps.push({
    queue: items.map((i) => ({ ...i })),
    activeLine: 6,
    description: `Queue dequeue: Highlighting front element (${frontVal})`,
  });

  items.shift();
  steps.push({
    queue: items.map((i) => ({ ...i })),
    activeLine: 8,
    description: `✓ Dequeued element ${frontVal} from front of queue. Remaining length = ${items.length}`,
  });

  return steps;
}

// ════════════════════════════════════════════════════════
// 3. SINGLY LINKED LIST
// ════════════════════════════════════════════════════════
export interface LLNode {
  id: string;
  value: number;
}

export function llInsertHeadSteps(current: LLNode[], val: number): StructureStep[] {
  const steps: StructureStep[] = [];
  const newId = `node-${Date.now()}`;
  const nodes: { value: number; id: string; state: LLItemState }[] = current.map((n) => ({ value: n.value, id: n.id, state: 'default' }));

  steps.push({
    linkedList: nodes.map((n) => ({ ...n })),
    activeLine: 1,
    description: `Create new Node(${val})`,
  });

  nodes.unshift({ value: val, id: newId, state: 'inserted' });
  steps.push({
    linkedList: nodes.map((n) => ({ ...n })),
    activeLine: 2,
    description: `Point newNode.next ➔ Head, update Head to Node(${val})`,
  });

  nodes[0].state = 'default';
  steps.push({
    linkedList: nodes.map((n) => ({ ...n })),
    activeLine: 3,
    description: `✓ Node(${val}) successfully inserted at Head of Linked List`,
  });

  return steps;
}

export function llInsertTailSteps(current: LLNode[], val: number): StructureStep[] {
  const steps: StructureStep[] = [];
  const newId = `node-${Date.now()}`;
  const nodes: { value: number; id: string; state: LLItemState }[] = current.map((n) => ({ value: n.value, id: n.id, state: 'default' }));

  steps.push({
    linkedList: nodes.map((n) => ({ ...n })),
    activeLine: 1,
    description: `Traverse to tail of Linked List...`,
  });

  for (let i = 0; i < nodes.length; i++) {
    nodes[i].state = 'active';
    steps.push({
      linkedList: nodes.map((n) => ({ ...n })),
      activeLine: 2,
      description: `Traversing node [${nodes[i].value}]`,
    });
    nodes[i].state = 'default';
  }

  nodes.push({ value: val, id: newId, state: 'inserted' });
  steps.push({
    linkedList: nodes.map((n) => ({ ...n })),
    activeLine: 3,
    description: `Appended Node(${val}) at Tail (next ➔ null)`,
  });

  nodes[nodes.length - 1].state = 'default';
  steps.push({
    linkedList: nodes.map((n) => ({ ...n })),
    activeLine: 4,
    description: `✓ Node(${val}) inserted at Tail`,
  });

  return steps;
}

export function llSearchSteps(current: LLNode[], target: number): StructureStep[] {
  const steps: StructureStep[] = [];
  const nodes: { value: number; id: string; state: LLItemState }[] = current.map((n) => ({ value: n.value, id: n.id, state: 'default' }));

  steps.push({
    linkedList: nodes.map((n) => ({ ...n })),
    activeLine: 1,
    description: `Linked List search for target = ${target}`,
  });

  let found = false;
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].state = 'active';
    steps.push({
      linkedList: nodes.map((n) => ({ ...n })),
      activeLine: 2,
      description: `Compare Node(${nodes[i].value}) with target ${target}`,
    });

    if (nodes[i].value === target) {
      nodes[i].state = 'found';
      steps.push({
        linkedList: nodes.map((n) => ({ ...n })),
        activeLine: 3,
        description: `✓ Found target ${target} at node index ${i}!`,
      });
      found = true;
      break;
    }
    nodes[i].state = 'default';
  }

  if (!found) {
    steps.push({
      linkedList: nodes.map((n) => ({ ...n })),
      activeLine: 5,
      description: `✗ Target ${target} not found in Linked List`,
    });
  }

  return steps;
}

export function llDeleteValSteps(current: LLNode[], val: number): StructureStep[] {
  const steps: StructureStep[] = [];
  const nodes: { value: number; id: string; state: LLItemState }[] = current.map((n) => ({ value: n.value, id: n.id, state: 'default' }));

  steps.push({
    linkedList: nodes.map((n) => ({ ...n })),
    activeLine: 1,
    description: `Searching for Node(${val}) to delete...`,
  });

  const idx = nodes.findIndex((n) => n.value === val);
  if (idx >= 0) {
    nodes[idx].state = 'deleted';
    steps.push({
      linkedList: nodes.map((n) => ({ ...n })),
      activeLine: 3,
      description: `Unlinking Node(${val}) at index ${idx}...`,
    });
    nodes.splice(idx, 1);
    steps.push({
      linkedList: nodes.map((n) => ({ ...n })),
      activeLine: 4,
      description: `✓ Node(${val}) deleted. Remaining list size = ${nodes.length}`,
    });
  } else {
    steps.push({
      linkedList: nodes.map((n) => ({ ...n })),
      activeLine: 5,
      description: `✗ Cannot delete: Node(${val}) not found`,
    });
  }

  return steps;
}

// ════════════════════════════════════════════════════════
// 4. HASH TABLE (Separate Chaining)
// ════════════════════════════════════════════════════════
export function hashTablePutSteps(
  buckets: HashEntry[][],
  key: string,
  val: number | string,
): StructureStep[] {
  const steps: StructureStep[] = [];
  const numBuckets = buckets.length;
  const hash = Math.abs(key.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % numBuckets;

  const cloneB: HashEntry[][] = buckets.map((b) => b.map((e) => ({ ...e, state: 'default' })));

  steps.push({
    hashTable: cloneB,
    activeLine: 1,
    description: `Compute hash code: hash("${key}") % ${numBuckets} = Bucket [${hash}]`,
  });

  const bucket = cloneB[hash];
  const existingIdx = bucket.findIndex((e) => e.key === key);

  if (existingIdx >= 0) {
    bucket[existingIdx].state = 'active';
    steps.push({
      hashTable: cloneB,
      activeLine: 3,
      description: `Key "${key}" exists in Bucket [${hash}]. Updating value to ${val}`,
    });
    bucket[existingIdx].value = val;
    bucket[existingIdx].state = 'found';
  } else {
    bucket.push({ key, value: val, state: 'found' });
    steps.push({
      hashTable: cloneB,
      activeLine: 5,
      description: `Appended entry {"${key}": ${val}} to chain at Bucket [${hash}]`,
    });
  }

  steps.push({
    hashTable: cloneB.map((b) => b.map((e) => ({ ...e, state: 'default' }))),
    activeLine: 6,
    description: `✓ Hash Table put("${key}", ${val}) operation complete`,
  });

  return steps;
}

export function hashTableGetSteps(
  buckets: HashEntry[][],
  key: string,
): StructureStep[] {
  const steps: StructureStep[] = [];
  const numBuckets = buckets.length;
  const hash = Math.abs(key.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % numBuckets;

  const cloneB: HashEntry[][] = buckets.map((b) => b.map((e) => ({ ...e, state: 'default' })));

  steps.push({
    hashTable: cloneB,
    activeLine: 1,
    description: `Compute hash: hash("${key}") % ${numBuckets} = Bucket [${hash}]`,
  });

  const bucket = cloneB[hash];
  const existingIdx = bucket.findIndex((e) => e.key === key);

  if (existingIdx >= 0) {
    bucket[existingIdx].state = 'found';
    steps.push({
      hashTable: cloneB,
      activeLine: 3,
      description: `✓ Found Key "${key}" in Bucket [${hash}] with Value = ${bucket[existingIdx].value}`,
    });
  } else {
    steps.push({
      hashTable: cloneB,
      activeLine: 5,
      description: `✗ Key "${key}" not found in Bucket [${hash}]`,
    });
  }

  return steps;
}

// ════════════════════════════════════════════════════════
// 5. DISJOINT SET (UNION-FIND)
// ════════════════════════════════════════════════════════
export function ufUnionSteps(
  elements: UFElement[],
  x: number,
  y: number,
): StructureStep[] {
  const steps: StructureStep[] = [];
  const el: UFElement[] = elements.map((e) => ({ ...e, state: 'default' }));

  steps.push({
    unionFind: el.map((e) => ({ ...e })),
    activeLine: 1,
    description: `Union(${x}, ${y}): Finding roots of ${x} and ${y}...`,
  });

  function findRoot(id: number): number {
    let curr = id;
    while (el[curr].parent !== curr) {
      el[curr].state = 'active';
      curr = el[curr].parent;
    }
    el[curr].state = 'root';
    return curr;
  }

  const rootX = findRoot(x);
  const rootY = findRoot(y);

  steps.push({
    unionFind: el.map((e) => ({ ...e })),
    activeLine: 3,
    description: `Root of ${x} is ${rootX}, Root of ${y} is ${rootY}`,
  });

  if (rootX !== rootY) {
    if (el[rootX].rank < el[rootY].rank) {
      el[rootX].parent = rootY;
      el[rootX].state = 'union';
    } else if (el[rootX].rank > el[rootY].rank) {
      el[rootY].parent = rootX;
      el[rootY].state = 'union';
    } else {
      el[rootY].parent = rootX;
      el[rootX].rank += 1;
      el[rootY].state = 'union';
    }
    steps.push({
      unionFind: el.map((e) => ({ ...e })),
      activeLine: 6,
      description: `✓ Merged sets: Parent of ${rootY} updated to ${rootX}`,
    });
  } else {
    steps.push({
      unionFind: el.map((e) => ({ ...e })),
      activeLine: 8,
      description: `Elements ${x} and ${y} are already in the same set (Root = ${rootX})`,
    });
  }

  return steps;
}

export function ufFindSteps(
  elements: UFElement[],
  x: number,
): StructureStep[] {
  const steps: StructureStep[] = [];
  const el: UFElement[] = elements.map((e) => ({ ...e, state: 'default' }));

  steps.push({
    unionFind: el.map((e) => ({ ...e })),
    activeLine: 1,
    description: `Find(${x}): Path traversing up to root...`,
  });

  let curr = x;
  while (el[curr].parent !== curr) {
    el[curr].state = 'active';
    steps.push({
      unionFind: el.map((e) => ({ ...e })),
      activeLine: 2,
      description: `Traversing node ${curr} ➔ parent ${el[curr].parent}`,
    });
    curr = el[curr].parent;
  }

  el[curr].state = 'root';
  steps.push({
    unionFind: el.map((e) => ({ ...e })),
    activeLine: 3,
    description: `✓ Root representative for element ${x} is ${curr}!`,
  });

  return steps;
}
