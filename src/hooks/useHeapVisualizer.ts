import { useCallback, useEffect, useRef, useState } from 'react';
import { heapArrayToTree, heapInsert as hInsert, heapExtractMax as hExtract } from '../algorithms/treeAlgorithms';

type HeapStep = {
  heap: number[];
  highlightIdx: number[];
  description: string;
  activeLine: number;
};

const SAMPLE_HEAP = [90, 75, 80, 50, 60, 45, 70];

export function useHeapVisualizer() {
  const [heap, setHeap] = useState<number[]>(SAMPLE_HEAP);
  const [displayHeap, setDisplayHeap] = useState<number[]>(SAMPLE_HEAP);
  const [displayHighlight, setDisplayHighlight] = useState<number[]>([]);
  const [steps, setSteps] = useState<HeapStep[]>([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDone, setIsDone] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [activeLine, setActiveLine] = useState(-1);
  const [description, setDescription] = useState('Max Heap initialized with 7 elements');
  const [lastExtracted, setLastExtracted] = useState<number | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<number[] | null>(null);

  const applyStep = useCallback((step: HeapStep) => {
    setDisplayHeap(step.heap);
    setDisplayHighlight(step.highlightIdx);
    setActiveLine(step.activeLine);
    setDescription(step.description);
  }, []);

  const resetSample = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setHeap(SAMPLE_HEAP);
    setDisplayHeap(SAMPLE_HEAP);
    setDisplayHighlight([]);
    setSteps([]);
    setStepIdx(-1);
    setIsDone(true);
    setIsPlaying(false);
    setLastExtracted(null);
    setDescription('Max Heap reset to sample dataset');
    pendingRef.current = null;
  }, []);

  const stepForward = useCallback(() => {
    if (isDone) return;
    const next = stepIdx + 1;
    if (next >= steps.length) {
      setIsDone(true);
      setIsPlaying(false);
      if (pendingRef.current) { setHeap(pendingRef.current); pendingRef.current = null; }
      return;
    }
    applyStep(steps[next]);
    setStepIdx(next);
    if (next === steps.length - 1) {
      setIsDone(true);
      setIsPlaying(false);
      if (pendingRef.current) { setHeap(pendingRef.current); pendingRef.current = null; }
    }
  }, [stepIdx, steps, isDone, applyStep]);

  useEffect(() => {
    if (!isPlaying || isDone) return;
    const delay = Math.max(40, 700 / speed);
    timerRef.current = setTimeout(() => {
      setStepIdx((prev) => {
        const next = prev + 1;
        if (next >= steps.length) {
          setIsPlaying(false);
          setIsDone(true);
          if (pendingRef.current) { setHeap(pendingRef.current); pendingRef.current = null; }
          return prev;
        }
        applyStep(steps[next]);
        return next;
      });
    }, delay);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isPlaying, isDone, stepIdx, steps, speed, applyStep]);

  const runSteps = useCallback((newSteps: HeapStep[], finalHeap: number[]) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSteps(newSteps);
    setStepIdx(0);
    setIsDone(false);
    pendingRef.current = finalHeap;
    if (newSteps.length > 0) {
      applyStep(newSteps[0]);
      setIsPlaying(true); // Automatically play animation!
    } else {
      setIsDone(true);
      setIsPlaying(false);
    }
  }, [applyStep]);

  const insert = useCallback((value: number) => {
    const { steps: s, newHeap } = hInsert(heap, value);
    runSteps(s, newHeap);
  }, [heap, runSteps]);

  const extractMax = useCallback(() => {
    if (heap.length === 0) return;
    const { steps: s, newHeap, extracted } = hExtract(heap);
    setLastExtracted(extracted);
    runSteps(s, newHeap);
  }, [heap, runSteps]);

  const clear = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setHeap([]);
    setDisplayHeap([]);
    setDisplayHighlight([]);
    setSteps([]);
    setStepIdx(-1);
    setIsDone(true);
    setIsPlaying(false);
    setLastExtracted(null);
    setDescription('Heap cleared');
    pendingRef.current = null;
  }, []);

  // Compute tree from displayHeap
  const { nodes: treeNodes, rootId: treeRootId } = heapArrayToTree(displayHeap);
  // Apply highlights to tree nodes
  for (const idx of displayHighlight) {
    const nodeId = idx + 1;
    if (treeNodes[nodeId]) treeNodes[nodeId].state = 'comparing';
  }

  return {
    heap: displayHeap,
    highlightIdx: displayHighlight,
    treeNodes,
    treeRootId,
    isPlaying,
    isDone,
    activeLine,
    description,
    speed,
    lastExtracted,
    setSpeed,
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    step: stepForward,
    insert,
    extractMax,
    clear,
    resetSample,
  };
}
