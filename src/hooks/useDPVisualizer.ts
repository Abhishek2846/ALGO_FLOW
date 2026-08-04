import { useCallback, useEffect, useRef, useState } from 'react';
import type { DPStep } from '../types';

export function useDPVisualizer(stepGenerator: () => DPStep[]) {
  const [steps, setSteps] = useState<DPStep[]>([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [currentStep, setCurrentStep] = useState<DPStep | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [speed, setSpeed] = useState(1);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buildSteps = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
    const generatedSteps = stepGenerator();
    setSteps(generatedSteps);
    setStepIdx(0);
    setIsDone(false);
    if (generatedSteps.length > 0) {
      setCurrentStep(generatedSteps[0]);
      setIsPlaying(true); // Auto-play!
    }
  }, [stepGenerator]);

  useEffect(() => {
    buildSteps();
  }, [buildSteps]);

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

  return {
    table: currentStep?.table ?? [],
    rowLabels: currentStep?.rowLabels ?? [],
    colLabels: currentStep?.colLabels ?? [],
    activeCell: currentStep?.activeCell,
    activeLine: currentStep?.activeLine ?? -1,
    description: currentStep?.description ?? 'Interactive DP Visualizer Ready',
    isPlaying,
    isDone,
    speed,
    setSpeed,
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    step: stepForward,
    reset: buildSteps,
  };
}
