import { useCallback, useEffect, useRef, useState } from 'react';
import type { GraphNodeData, GraphEdgeData, GraphStep } from '../types';
import { getDefaultGraph, getDAGGraph } from '../algorithms/graphAlgorithms';

export type GraphAlgoType =
  | 'bfs'
  | 'dfs'
  | 'dijkstra'
  | 'prims-mst'
  | 'kruskals-mst'
  | 'floyd-warshall'
  | 'topological-sort';

export function useGraphVisualizer(
  algoType: GraphAlgoType,
  stepGenerator: (
    nodes: Record<string, GraphNodeData>,
    edges: GraphEdgeData[],
    startId?: string,
  ) => GraphStep[],
) {
  const isDAG = algoType === 'topological-sort';
  const initialGraph = isDAG ? getDAGGraph() : getDefaultGraph(algoType === 'dijkstra' || algoType === 'floyd-warshall');

  const [nodes] = useState<Record<string, GraphNodeData>>(initialGraph.nodes);
  const [edges] = useState<GraphEdgeData[]>(initialGraph.edges);
  const [startNodeId, setStartNodeId] = useState('A');

  const [steps, setSteps] = useState<GraphStep[]>([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [currentStep, setCurrentStep] = useState<GraphStep | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [speed, setSpeed] = useState(1);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buildSteps = useCallback(
    (n: Record<string, GraphNodeData>, e: GraphEdgeData[], startId: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsPlaying(false);
      const generatedSteps = stepGenerator(n, e, startId);
      setSteps(generatedSteps);
      setStepIdx(0);
      setIsDone(false);
      if (generatedSteps.length > 0) {
        setCurrentStep(generatedSteps[0]);
        setIsPlaying(true); // Auto-play animation!
      }
    },
    [stepGenerator],
  );

  useEffect(() => {
    buildSteps(nodes, edges, startNodeId);
  }, [buildSteps, nodes, edges, startNodeId]);

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

  const reset = useCallback(() => {
    buildSteps(nodes, edges, startNodeId);
  }, [nodes, edges, startNodeId, buildSteps]);

  const changeStartNode = useCallback((newStart: string) => {
    setStartNodeId(newStart);
    buildSteps(nodes, edges, newStart);
  }, [nodes, edges, buildSteps]);

  return {
    displayNodes: currentStep?.nodes ?? nodes,
    displayEdges: currentStep?.edges ?? edges,
    queueOrStack: currentStep?.queueOrStack,
    visitedList: currentStep?.visitedList,
    distances: currentStep?.distances,
    activeLine: currentStep?.activeLine ?? -1,
    description: currentStep?.description ?? 'Interactive Graph Visualizer Ready',
    startNodeId,
    isPlaying,
    isDone,
    speed,
    setSpeed,
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    step: stepForward,
    reset,
    changeStartNode,
    nodeIds: Object.keys(nodes),
  };
}
