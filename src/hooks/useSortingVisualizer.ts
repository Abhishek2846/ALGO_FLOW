import { useCallback, useEffect, useRef, useState } from 'react';
import type { SortBar, SortStep } from '../types';
import { soundFX } from '../utils/soundEffects';

// ── Utility: generate random array ────────────────────────
export function generateArray(size: number): SortBar[] {
  return Array.from({ length: size }, () => ({
    value: Math.floor(Math.random() * 92) + 5,
    state: 'default' as const,
  }));
}

// ── Base hook ─────────────────────────────────────────────
export function useSortingVisualizer(generateSteps: (arr: number[]) => SortStep[]) {
  const [arraySize, setArraySize] = useState(20);
  const [bars, setBars] = useState<SortBar[]>(() => generateArray(20));
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [activeLine, setActiveLine] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Build steps from current bars
  const buildSteps = useCallback((currentBars: SortBar[]) => {
    const vals = currentBars.map((b) => b.value);
    const s = generateSteps(vals);
    setSteps(s);
    setStepIdx(-1);
    setIsDone(false);
    setComparisons(0);
    setSwaps(0);
    setActiveLine(-1);
    // Show initial unsorted state
    setBars(currentBars.map((b) => ({ ...b, state: 'default' })));
  }, [generateSteps]);

  // New random array
  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
    const arr = generateArray(arraySize);
    setBars(arr);
    buildSteps(arr);
  }, [arraySize, buildSteps]);

  // Custom array input
  const setCustomArray = useCallback((values: number[]) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
    const arr = values.map((v) => ({ value: v, state: 'default' as const }));
    setBars(arr);
    buildSteps(arr);
  }, [buildSteps]);

  // Apply a single step
  const applyStep = useCallback((idx: number, stepsArr: SortStep[]) => {
    if (idx < 0 || idx >= stepsArr.length) return false;
    const step = stepsArr[idx];
    setBars([...step.bars]);
    setComparisons(step.comparisons);
    setSwaps(step.swaps);
    setActiveLine(step.activeLine);

    const activeBar = step.bars.find(b => b.state === 'comparing' || b.state === 'swapping');
    if (activeBar) {
      if (activeBar.state === 'swapping') soundFX.playSwap();
      else soundFX.playCompare(activeBar.value);
    }

    if (idx === stepsArr.length - 1) {
      soundFX.playComplete();
    }
    return true;
  }, []);

  // Manual step forward
  const stepForward = useCallback(() => {
    if (isDone) return;
    const nextIdx = stepIdx + 1;
    if (nextIdx >= steps.length) {
      setIsDone(true);
      return;
    }
    applyStep(nextIdx, steps);
    setStepIdx(nextIdx);
    if (nextIdx === steps.length - 1) setIsDone(true);
  }, [stepIdx, steps, isDone, applyStep]);

  // Auto-play loop
  useEffect(() => {
    if (!isPlaying || isDone) return;
    const delay = Math.max(20, 350 / speed);
    timerRef.current = setTimeout(() => {
      setStepIdx((prev) => {
        const nextIdx = prev + 1;
        if (nextIdx >= steps.length) {
          setIsPlaying(false);
          setIsDone(true);
          return prev;
        }
        applyStep(nextIdx, steps);
        return nextIdx;
      });
    }, delay);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isPlaying, isDone, stepIdx, steps, speed, applyStep]);

  // Rebuild steps when size changes
  useEffect(() => {
    reset();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arraySize]);

  // Build initial steps on mount
  useEffect(() => {
    buildSteps(bars);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    bars,
    isPlaying,
    isDone,
    speed,
    arraySize,
    comparisons,
    swaps,
    activeLine,
    setSpeed,
    setArraySize,
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    step: stepForward,
    reset,
    setCustomArray,
  };
}
