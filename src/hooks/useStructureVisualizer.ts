import { useCallback, useEffect, useRef, useState } from 'react';
import type { StructureStep, HashEntry, UFElement } from '../types';
import {
  stackPushSteps,
  stackPopSteps,
  queueEnqueueSteps,
  queueDequeueSteps,
  llInsertHeadSteps,
  llInsertTailSteps,
  llSearchSteps,
  llDeleteValSteps,
  hashTablePutSteps,
  hashTableGetSteps,
  ufUnionSteps,
  ufFindSteps,
  type LLNode,
} from '../algorithms/structureAlgorithms';

export type StructureType = 'stack' | 'queue' | 'linked-list' | 'hash-table' | 'union-find';

const DEFAULT_STACK = [15, 42, 88];
const DEFAULT_QUEUE = [10, 25, 60, 99];
const DEFAULT_LL: LLNode[] = [
  { id: '1', value: 12 },
  { id: '2', value: 34 },
  { id: '3', value: 56 },
];
const DEFAULT_HASH: HashEntry[][] = [
  [{ key: 'apple', value: 5 }],
  [{ key: 'banana', value: 8 }],
  [],
  [{ key: 'cherry', value: 12 }],
];
const DEFAULT_UF: UFElement[] = [
  { id: 0, parent: 0, rank: 1 },
  { id: 1, parent: 1, rank: 0 },
  { id: 2, parent: 0, rank: 0 },
  { id: 3, parent: 3, rank: 0 },
  { id: 4, parent: 3, rank: 0 },
];

export function useStructureVisualizer(_structType: StructureType) {
  const [stack, setStack] = useState<number[]>(DEFAULT_STACK);
  const [queue, setQueue] = useState<number[]>(DEFAULT_QUEUE);
  const [linkedList, setLinkedList] = useState<LLNode[]>(DEFAULT_LL);
  const [hashTable, setHashTable] = useState<HashEntry[][]>(DEFAULT_HASH);
  const [unionFind, setUnionFind] = useState<UFElement[]>(DEFAULT_UF);

  const [steps, setSteps] = useState<StructureStep[]>([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [currentStep, setCurrentStep] = useState<StructureStep | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDone, setIsDone] = useState(true);
  const [speed, setSpeed] = useState(1);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSteps = useCallback((newSteps: StructureStep[]) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSteps(newSteps);
    setStepIdx(0);
    setIsDone(false);
    if (newSteps.length > 0) {
      setCurrentStep(newSteps[0]);
      setIsPlaying(true); // Auto-play!
    }
  }, []);

  const stepForward = useCallback(() => {
    if (isDone) return;
    const next = stepIdx + 1;
    if (next >= steps.length) {
      setIsDone(true);
      setIsPlaying(false);
      return;
    }
    setCurrentStep(steps[next]);
    setStepIdx(next);
    if (next === steps.length - 1) {
      setIsDone(true);
      setIsPlaying(false);
    }
  }, [stepIdx, steps, isDone]);

  useEffect(() => {
    if (!isPlaying || isDone) return;
    const delay = Math.max(40, 700 / speed);
    timerRef.current = setTimeout(() => {
      setStepIdx((prev) => {
        const next = prev + 1;
        if (next >= steps.length) {
          setIsPlaying(false);
          setIsDone(true);
          return prev;
        }
        setCurrentStep(steps[next]);
        return next;
      });
    }, delay);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isPlaying, isDone, stepIdx, steps, speed]);

  // Stack operations
  const pushStack = (val: number) => {
    const s = stackPushSteps(stack, val);
    setStack((prev) => [...prev, val]);
    runSteps(s);
  };
  const popStack = () => {
    const s = stackPopSteps(stack);
    setStack((prev) => prev.slice(0, prev.length - 1));
    runSteps(s);
  };

  // Queue operations
  const enqueueQueue = (val: number) => {
    const s = queueEnqueueSteps(queue, val);
    setQueue((prev) => [...prev, val]);
    runSteps(s);
  };
  const dequeueQueue = () => {
    const s = queueDequeueSteps(queue);
    setQueue((prev) => prev.slice(1));
    runSteps(s);
  };

  // Linked List operations
  const insertHeadLL = (val: number) => {
    const s = llInsertHeadSteps(linkedList, val);
    setLinkedList((prev) => [{ id: `node-${Date.now()}`, value: val }, ...prev]);
    runSteps(s);
  };
  const insertTailLL = (val: number) => {
    const s = llInsertTailSteps(linkedList, val);
    setLinkedList((prev) => [...prev, { id: `node-${Date.now()}`, value: val }]);
    runSteps(s);
  };
  const searchLL = (val: number) => {
    const s = llSearchSteps(linkedList, val);
    runSteps(s);
  };
  const deleteLL = (val: number) => {
    const s = llDeleteValSteps(linkedList, val);
    setLinkedList((prev) => prev.filter((n) => n.value !== val));
    runSteps(s);
  };

  // Hash Table operations
  const putHash = (key: string, val: number | string) => {
    const s = hashTablePutSteps(hashTable, key, val);
    runSteps(s);
  };
  const getHash = (key: string) => {
    const s = hashTableGetSteps(hashTable, key);
    runSteps(s);
  };

  // Union Find operations
  const unionUF = (x: number, y: number) => {
    const s = ufUnionSteps(unionFind, x, y);
    runSteps(s);
  };
  const findUF = (x: number) => {
    const s = ufFindSteps(unionFind, x);
    runSteps(s);
  };

  const resetSample = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setStack(DEFAULT_STACK);
    setQueue(DEFAULT_QUEUE);
    setLinkedList(DEFAULT_LL);
    setHashTable(DEFAULT_HASH);
    setUnionFind(DEFAULT_UF);
    setSteps([]);
    setStepIdx(-1);
    setCurrentStep(null);
    setIsDone(true);
    setIsPlaying(false);
  };

  return {
    stack: currentStep?.stack ?? stack.map((v) => ({ value: v, state: 'default' as const })),
    queue: currentStep?.queue ?? queue.map((v) => ({ value: v, state: 'default' as const })),
    linkedList: currentStep?.linkedList ?? linkedList.map((n) => ({ value: n.value, id: n.id, state: 'default' as const })),
    hashTable: currentStep?.hashTable ?? hashTable,
    unionFind: currentStep?.unionFind ?? unionFind,
    activeLine: currentStep?.activeLine ?? -1,
    description: currentStep?.description ?? 'Interactive Structure Visualizer Ready',
    isPlaying,
    isDone,
    speed,
    setSpeed,
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    step: stepForward,
    pushStack,
    popStack,
    enqueueQueue,
    dequeueQueue,
    insertHeadLL,
    insertTailLL,
    searchLL,
    deleteLL,
    putHash,
    getHash,
    unionUF,
    findUF,
    resetSample,
  };
}
