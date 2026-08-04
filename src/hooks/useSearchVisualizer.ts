import { useCallback, useEffect, useRef, useState } from 'react';
import type { SearchBar, SearchStep } from '../types';

export function generateSearchArray(size: number, sorted = false): number[] {
  const vals = Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);
  return sorted ? vals.sort((a, b) => a - b) : vals;
}

export function useSearchVisualizer(
  generateSteps: (arr: number[], target: number) => SearchStep[],
  requiresSorted = false,
) {
  const [arraySize, setArraySize] = useState(16);
  const [array, setArray] = useState<number[]>(() => generateSearchArray(16, requiresSorted));
  const [target, setTarget] = useState(42);
  const [steps, setSteps] = useState<SearchStep[]>([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [currentStep, setCurrentStep] = useState<SearchStep | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Build steps from array + target
  const buildSteps = useCallback((arr: number[], tgt: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
    const s = generateSteps(arr, tgt);
    setSteps(s);
    setStepIdx(-1);
    setIsDone(false);
    setCurrentStep(s[0] ?? null);
  }, [generateSteps]);

  // New random array
  const reset = useCallback(() => {
    const arr = generateSearchArray(arraySize, requiresSorted);
    setArray(arr);
    buildSteps(arr, target);
  }, [arraySize, target, requiresSorted, buildSteps]);

  // Custom array
  const setCustomArray = useCallback((values: number[]) => {
    const arr = requiresSorted ? [...values].sort((a, b) => a - b) : values;
    setArray(arr);
    buildSteps(arr, target);
  }, [requiresSorted, target, buildSteps]);

  // Change target
  const changeTarget = useCallback((t: number) => {
    setTarget(t);
    buildSteps(array, t);
  }, [array, buildSteps]);

  // Step forward
  const stepForward = useCallback(() => {
    if (isDone) return;
    const nextIdx = stepIdx + 1;
    if (nextIdx >= steps.length) { setIsDone(true); return; }
    setCurrentStep(steps[nextIdx]);
    setStepIdx(nextIdx);
    if (nextIdx === steps.length - 1) setIsDone(true);
  }, [stepIdx, steps, isDone]);

  // Auto play
  useEffect(() => {
    if (!isPlaying || isDone) return;
    const delay = Math.max(30, 500 / speed);
    timerRef.current = setTimeout(() => {
      setStepIdx((prev) => {
        const next = prev + 1;
        if (next >= steps.length) { setIsPlaying(false); setIsDone(true); return prev; }
        setCurrentStep(steps[next]);
        return next;
      });
    }, delay);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isPlaying, isDone, stepIdx, steps, speed]);

  // Rebuild on size change
  useEffect(() => {
    reset();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arraySize]);

  // Initial build
  useEffect(() => {
    buildSteps(array, target);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayBars: SearchBar[] = currentStep
    ? currentStep.bars
    : array.map((v) => ({ value: v, state: 'default' as const }));

  return {
    displayBars,
    currentStep,
    array,
    target,
    isPlaying,
    isDone,
    speed,
    arraySize,
    setSpeed,
    setArraySize,
    changeTarget,
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    step: stepForward,
    reset,
    setCustomArray,
  };
}
