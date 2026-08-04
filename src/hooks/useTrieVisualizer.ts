import { useCallback, useEffect, useRef, useState } from 'react';
import type { TrieNodeData, TrieStep } from '../types';
import { createInitialTrie, resetTrieIdCounter, trieInsert, trieSearch } from '../algorithms/trieAlgorithms';

const SAMPLE_WORDS = ['algo', 'flow', 'trie', 'tree'];

export function useTrieVisualizer() {
  const init = createInitialTrie();
  const [committedNodes, setCommittedNodes] = useState<Record<number, TrieNodeData>>(init.nodes);
  const [committedRootId, setCommittedRootId] = useState<number>(init.rootId);

  const [displayNodes, setDisplayNodes] = useState<Record<number, TrieNodeData>>(init.nodes);
  const [displayRootId, setDisplayRootId] = useState<number>(init.rootId);

  const [steps, setSteps] = useState<TrieStep[]>([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDone, setIsDone] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [activeLine, setActiveLine] = useState(-1);
  const [description, setDescription] = useState('Trie initialized with sample words');
  const [wordCount, setWordCount] = useState(0);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<{ nodes: Record<number, TrieNodeData>; rootId: number; wordCount: number } | null>(null);

  const applyStep = useCallback((step: TrieStep) => {
    setDisplayNodes(step.nodes);
    setDisplayRootId(step.rootId);
    setActiveLine(step.activeLine);
    setDescription(step.description);
  }, []);

  // Pre-populate sample words on mount
  const buildSampleTrie = useCallback(() => {
    resetTrieIdCounter();
    const fresh = createInitialTrie();
    let curNodes = fresh.nodes;
    const rootId = fresh.rootId;

    for (const w of SAMPLE_WORDS) {
      const res = trieInsert(curNodes, rootId, w);
      curNodes = res.newNodes;
    }

    setCommittedNodes(curNodes);
    setCommittedRootId(rootId);
    setDisplayNodes(curNodes);
    setDisplayRootId(rootId);
    setWordCount(SAMPLE_WORDS.length);
    setSteps([]);
    setStepIdx(-1);
    setIsDone(true);
    setIsPlaying(false);
    setDescription(`Trie initialized with ${SAMPLE_WORDS.length} sample words`);
  }, []);

  useEffect(() => {
    buildSampleTrie();
  }, [buildSampleTrie]);

  const stepForward = useCallback(() => {
    if (isDone) return;
    const next = stepIdx + 1;
    if (next >= steps.length) {
      setIsDone(true);
      setIsPlaying(false);
      if (pendingRef.current) {
        setCommittedNodes(pendingRef.current.nodes);
        setCommittedRootId(pendingRef.current.rootId);
        setWordCount(pendingRef.current.wordCount);
        pendingRef.current = null;
      }
      return;
    }
    applyStep(steps[next]);
    setStepIdx(next);
    if (next === steps.length - 1) {
      setIsDone(true);
      setIsPlaying(false);
      if (pendingRef.current) {
        setCommittedNodes(pendingRef.current.nodes);
        setCommittedRootId(pendingRef.current.rootId);
        setWordCount(pendingRef.current.wordCount);
        pendingRef.current = null;
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
          if (pendingRef.current) {
            setCommittedNodes(pendingRef.current.nodes);
            setCommittedRootId(pendingRef.current.rootId);
            setWordCount(pendingRef.current.wordCount);
            pendingRef.current = null;
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
    newSteps: TrieStep[],
    finalNodes: Record<number, TrieNodeData>,
    finalRootId: number,
    newWordCount: number,
  ) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSteps(newSteps);
    setStepIdx(0);
    setIsDone(false);
    pendingRef.current = { nodes: finalNodes, rootId: finalRootId, wordCount: newWordCount };
    if (newSteps.length > 0) {
      applyStep(newSteps[0]);
      setIsPlaying(true); // Automatically play animation!
    } else {
      setIsDone(true);
      setIsPlaying(false);
    }
  }, [applyStep]);

  const insert = useCallback((word: string) => {
    const result = trieInsert(committedNodes, committedRootId, word);
    runSteps(result.steps, result.newNodes, committedRootId, wordCount + 1);
  }, [committedNodes, committedRootId, wordCount, runSteps]);

  const search = useCallback((word: string) => {
    const s = trieSearch(committedNodes, committedRootId, word);
    runSteps(s, committedNodes, committedRootId, wordCount);
  }, [committedNodes, committedRootId, wordCount, runSteps]);

  const clear = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    resetTrieIdCounter();
    const fresh = createInitialTrie();
    setCommittedNodes(fresh.nodes);
    setCommittedRootId(fresh.rootId);
    setDisplayNodes(fresh.nodes);
    setDisplayRootId(fresh.rootId);
    setSteps([]);
    setStepIdx(-1);
    setIsDone(true);
    setIsPlaying(false);
    setWordCount(0);
    setDescription('Trie cleared');
    pendingRef.current = null;
  }, []);

  return {
    displayNodes,
    displayRootId,
    isPlaying,
    isDone,
    activeLine,
    description,
    speed,
    wordCount,
    setSpeed,
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    step: stepForward,
    insert,
    search,
    clear,
    resetSample: buildSampleTrie,
    sampleWords: SAMPLE_WORDS,
  };
}
