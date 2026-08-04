import { useCallback, useEffect, useRef, useState } from 'react';
import type { TreeNodeData, TreeStep } from '../types';
import {
  resetIdCounter,
  btInsert,
  btSearch,
  bstInsert,
  bstSearch,
  bstDelete,
  avlInsert,
} from '../algorithms/treeAlgorithms';

export type TreeType = 'binary-tree' | 'bst' | 'avl' | 'avl-tree';

const SAMPLE_VALUES = [50, 30, 70, 20, 40, 60, 80];

export function useTreeVisualizer(treeType: TreeType) {
  // Committed (settled) tree state
  const [committedNodes, setCommittedNodes] = useState<Record<number, TreeNodeData>>({});
  const [committedRootId, setCommittedRootId] = useState<number | null>(null);

  // Display state (animated)
  const [displayNodes, setDisplayNodes] = useState<Record<number, TreeNodeData>>({});
  const [displayRootId, setDisplayRootId] = useState<number | null>(null);

  // Animation state
  const [steps, setSteps] = useState<TreeStep[]>([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDone, setIsDone] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [activeLine, setActiveLine] = useState(-1);
  const [description, setDescription] = useState('Interactive tree visualizer ready');
  const [nodeCount, setNodeCount] = useState(0);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingFinalRef = useRef<{ nodes: Record<number, TreeNodeData>; rootId: number | null } | null>(null);

  const applyStep = useCallback((step: TreeStep) => {
    setDisplayNodes(step.nodes);
    setDisplayRootId(step.rootId);
    setActiveLine(step.activeLine);
    setDescription(step.description);
  }, []);

  // Helper to build initial sample tree
  const buildSampleTree = useCallback(() => {
    resetIdCounter(1);
    let curNodes: Record<number, TreeNodeData> = {};
    let curRoot: number | null = null;

    for (const val of SAMPLE_VALUES) {
      if (treeType === 'binary-tree') {
        const res = btInsert(curNodes, curRoot, val);
        curNodes = res.newNodes;
        curRoot = res.newRootId;
      } else if (treeType === 'bst') {
        const res = bstInsert(curNodes, curRoot, val);
        curNodes = res.newNodes;
        curRoot = res.newRootId;
      } else if (treeType === 'avl' || treeType === 'avl-tree') {
        const res = avlInsert(curNodes, curRoot, val);
        curNodes = res.newNodes;
        curRoot = res.newRootId;
      }
    }

    setCommittedNodes(curNodes);
    setCommittedRootId(curRoot);
    setDisplayNodes(curNodes);
    setDisplayRootId(curRoot);
    setNodeCount(Object.keys(curNodes).length);
    setSteps([]);
    setStepIdx(-1);
    setIsDone(true);
    setIsPlaying(false);
    setDescription(`Sample ${treeType.toUpperCase()} initialized with ${SAMPLE_VALUES.length} nodes`);
  }, [treeType]);

  // Build sample tree on mount
  useEffect(() => {
    buildSampleTree();
  }, [buildSampleTree]);

  const stepForward = useCallback(() => {
    if (isDone) return;
    const next = stepIdx + 1;
    if (next >= steps.length) {
      setIsDone(true);
      setIsPlaying(false);
      if (pendingFinalRef.current) {
        setCommittedNodes(pendingFinalRef.current.nodes);
        setCommittedRootId(pendingFinalRef.current.rootId);
        setNodeCount(Object.keys(pendingFinalRef.current.nodes).length);
        pendingFinalRef.current = null;
      }
      return;
    }
    applyStep(steps[next]);
    setStepIdx(next);
    if (next === steps.length - 1) {
      setIsDone(true);
      setIsPlaying(false);
      if (pendingFinalRef.current) {
        setCommittedNodes(pendingFinalRef.current.nodes);
        setCommittedRootId(pendingFinalRef.current.rootId);
        setNodeCount(Object.keys(pendingFinalRef.current.nodes).length);
        pendingFinalRef.current = null;
      }
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
          if (pendingFinalRef.current) {
            setCommittedNodes(pendingFinalRef.current.nodes);
            setCommittedRootId(pendingFinalRef.current.rootId);
            setNodeCount(Object.keys(pendingFinalRef.current.nodes).length);
            pendingFinalRef.current = null;
          }
          return prev;
        }
        applyStep(steps[next]);
        return next;
      });
    }, delay);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isPlaying, isDone, stepIdx, steps, speed, applyStep]);

  const runSteps = useCallback((
    newSteps: TreeStep[],
    finalNodes: Record<number, TreeNodeData>,
    finalRootId: number | null,
  ) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSteps(newSteps);
    setStepIdx(0);
    setIsDone(false);
    pendingFinalRef.current = { nodes: finalNodes, rootId: finalRootId };
    if (newSteps.length > 0) {
      applyStep(newSteps[0]);
      setIsPlaying(true);
    } else {
      setIsDone(true);
      setIsPlaying(false);
    }
  }, [applyStep]);

  const insert = useCallback((value: number) => {
    if (treeType === 'binary-tree') {
      const result = btInsert(committedNodes, committedRootId, value);
      runSteps(result.steps, result.newNodes, result.newRootId);
    } else if (treeType === 'bst') {
      const result = bstInsert(committedNodes, committedRootId, value);
      runSteps(result.steps, result.newNodes, result.newRootId);
    } else if (treeType === 'avl' || treeType === 'avl-tree') {
      const result = avlInsert(committedNodes, committedRootId, value);
      runSteps(result.steps, result.newNodes, result.newRootId);
    }
  }, [committedNodes, committedRootId, treeType, runSteps]);

  const search = useCallback((value: number) => {
    if (treeType === 'binary-tree') {
      const s = btSearch(committedNodes, committedRootId, value);
      runSteps(s, committedNodes, committedRootId);
    } else {
      const s = bstSearch(committedNodes, committedRootId, value);
      runSteps(s, committedNodes, committedRootId);
    }
  }, [committedNodes, committedRootId, treeType, runSteps]);

  const deleteNode = useCallback((value: number) => {
    if (treeType === 'bst' || treeType === 'avl' || treeType === 'avl-tree') {
      const result = bstDelete(committedNodes, committedRootId, value);
      runSteps(result.steps, result.newNodes, result.newRootId);
    }
  }, [committedNodes, committedRootId, treeType, runSteps]);

  const clear = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
    setIsDone(true);
    setCommittedNodes({});
    setCommittedRootId(null);
    setDisplayNodes({});
    setDisplayRootId(null);
    setSteps([]);
    setStepIdx(-1);
    setNodeCount(0);
    setDescription('Tree cleared — insert values or generate sample');
    pendingFinalRef.current = null;
    resetIdCounter(1);
  }, []);

  return {
    displayNodes,
    displayRootId,
    isPlaying,
    isDone,
    activeLine,
    description,
    speed,
    nodeCount,
    setSpeed,
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    step: stepForward,
    insert,
    search,
    deleteNode,
    clear,
    resetSample: buildSampleTree,
  };
}
