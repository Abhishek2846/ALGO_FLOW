import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Footer from '../components/layout/Footer';
import { ALGORITHMS, getByCategory } from '../data/algorithms';
import {
  generateBubbleSortSteps,
  generateSelectionSortSteps,
  generateInsertionSortSteps,
  generateMergeSortSteps,
  generateQuickSortSteps,
  generateHeapSortSteps,
  generateCountingSortSteps,
  generateRadixSortSteps,
} from '../algorithms/sortingAlgorithms';
import { soundFX } from '../utils/soundEffects';
import type { SortBar, SortStep } from '../types';

const STEP_GENERATORS: Record<string, (arr: number[]) => SortStep[]> = {
  'bubble-sort': generateBubbleSortSteps,
  'selection-sort': generateSelectionSortSteps,
  'insertion-sort': generateInsertionSortSteps,
  'merge-sort': generateMergeSortSteps,
  'quick-sort': generateQuickSortSteps,
  'heap-sort': generateHeapSortSteps,
  'counting-sort': generateCountingSortSteps,
  'radix-sort': generateRadixSortSteps,
};

const SORTING_ALGOS = getByCategory('sorting');

export default function ComparePage() {
  const [algo1Id, setAlgo1Id] = useState('bubble-sort');
  const [algo2Id, setAlgo2Id] = useState('quick-sort');
  const [arraySize, setArraySize] = useState(25);
  const [speed, setSpeed] = useState(1);
  
  // State for Algo 1
  const [bars1, setBars1] = useState<SortBar[]>([]);
  const [steps1, setSteps1] = useState<SortStep[]>([]);
  const [idx1, setIdx1] = useState(-1);
  const [comp1, setComp1] = useState(0);
  const [swap1, setSwap1] = useState(0);
  const [done1, setDone1] = useState(false);

  // State for Algo 2
  const [bars2, setBars2] = useState<SortBar[]>([]);
  const [steps2, setSteps2] = useState<SortStep[]>([]);
  const [idx2, setIdx2] = useState(-1);
  const [comp2, setComp2] = useState(0);
  const [swap2, setSwap2] = useState(0);
  const [done2, setDone2] = useState(false);

  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Generate new shared dataset
  const generateData = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRunning(false);
    
    const arr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 90) + 10);

    const b = arr.map(val => ({ value: val, state: 'default' as const }));
    setBars1(b);
    setBars2(b);

    const gen1 = STEP_GENERATORS[algo1Id] || generateBubbleSortSteps;
    const gen2 = STEP_GENERATORS[algo2Id] || generateQuickSortSteps;

    const s1 = gen1([...arr]);
    const s2 = gen2([...arr]);

    setSteps1(s1);
    setSteps2(s2);

    setIdx1(-1);
    setIdx2(-1);
    setComp1(0);
    setComp2(0);
    setSwap1(0);
    setSwap2(0);
    setDone1(false);
    setDone2(false);
  }, [algo1Id, algo2Id, arraySize]);

  useEffect(() => {
    generateData();
  }, [generateData]);

  // Synchronized playback loop
  useEffect(() => {
    if (!isRunning) return;

    const delay = Math.max(30, 600 / speed);

    timerRef.current = setTimeout(() => {
      let is1Finished = done1;
      let is2Finished = done2;

      // Advance Algo 1
      if (!done1) {
        const next1 = idx1 + 1;
        if (next1 < steps1.length) {
          const step = steps1[next1];
          setBars1(step.bars);
          setComp1(step.comparisons);
          setSwap1(step.swaps);
          setIdx1(next1);
          soundFX.playCompare(step.bars[0]?.value ?? 50);
          if (next1 === steps1.length - 1) {
            setDone1(true);
            is1Finished = true;
          }
        } else {
          setDone1(true);
          is1Finished = true;
        }
      }

      // Advance Algo 2
      if (!done2) {
        const next2 = idx2 + 1;
        if (next2 < steps2.length) {
          const step = steps2[next2];
          setBars2(step.bars);
          setComp2(step.comparisons);
          setSwap2(step.swaps);
          setIdx2(next2);
          if (next2 === steps2.length - 1) {
            setDone2(true);
            is2Finished = true;
          }
        } else {
          setDone2(true);
          is2Finished = true;
        }
      }

      if (is1Finished && is2Finished) {
        setIsRunning(false);
        soundFX.playComplete();
      }
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, done1, done2, idx1, idx2, steps1, steps2, speed]);

  const algo1Meta = ALGORITHMS.find(a => a.id === algo1Id)!;
  const algo2Meta = ALGORITHMS.find(a => a.id === algo2Id)!;

  const winner = done1 && done2 
    ? (comp1 + swap1 < comp2 + swap2 ? 1 : comp2 + swap2 < comp1 + swap1 ? 2 : 0)
    : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} style={{ background: 'rgba(8,9,14,1)', minHeight: '100vh', color: '#e2e8f0' }}>
      {/* Top Accent Gradient Line */}
      <div style={{ height: '3px', width: '100%', background: 'linear-gradient(90deg, #6e6bf4, #4fd1a5, #ef6461)', boxShadow: '0 0 15px rgba(110,107,244,0.5)' }} />

      <div style={{ padding: '2rem var(--gutter)', maxWidth: 1500, margin: '0 auto' }}>


        {/* Header */}
        <div style={{
          marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between',
          background: 'radial-gradient(ellipse at top left, rgba(110,107,244,0.15), transparent 70%)',
          padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(110,107,244,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#4fd1a5', textTransform: 'uppercase', letterSpacing: '0.15em', background: 'rgba(79,209,165,0.1)', padding: '0.2rem 0.6rem', borderRadius: '1rem', border: '1px solid rgba(79,209,165,0.3)' }}>
                HEAD-TO-HEAD RACE
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.8rem, 3vw, 2.75rem)', fontWeight: 800, margin: '0 0 0.5rem 0', background: 'linear-gradient(135deg, #ffffff, #6e6bf4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Algorithm VS Mode Workbench
            </h1>
            <p style={{ color: '#94a3b8', margin: 0, maxWidth: '700px' }}>
              Benchmark two algorithms concurrently on identical randomized datasets. Watch operations, comparisons, and execution steps side-by-side in real time.
            </p>
          </div>

          {/* Race Controls Panel */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', background: 'rgba(15,23,42,0.8)', padding: '1rem 1.5rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#64748b', textTransform: 'uppercase' }}>Array Size</label>
              <input type="range" min={10} max={60} value={arraySize} disabled={isRunning} onChange={(e) => setArraySize(parseInt(e.target.value, 10))} style={{ width: 100, accentColor: '#6e6bf4' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6e6bf4' }}>{arraySize} elements</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#64748b', textTransform: 'uppercase' }}>Speed</label>
              <input type="range" min={0.5} max={4} step={0.5} value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} style={{ width: 90, accentColor: '#4fd1a5' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4fd1a5' }}>{speed}x</span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                onClick={() => setIsRunning(!isRunning)}
                style={{
                  padding: '0.6rem 1.5rem',
                  background: isRunning ? 'rgba(239,100,97,0.2)' : 'linear-gradient(135deg, #6e6bf4, #4fd1a5)',
                  border: isRunning ? '1px solid #ef6461' : 'none',
                  borderRadius: '2rem',
                  color: '#fff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: isRunning ? '0 0 15px rgba(239,100,97,0.4)' : '0 0 20px rgba(110,107,244,0.4)',
                  transition: 'all 0.2s ease',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>{isRunning ? 'pause' : 'play_arrow'}</span>
                {isRunning ? 'PAUSE' : 'START VS RACE'}
              </button>

              <button
                onClick={generateData}
                disabled={isRunning}
                title="New Dataset"
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#94a3b8', cursor: isRunning ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Winner Banner */}
        {winner !== null && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              marginBottom: '2rem', padding: '1rem 2rem', borderRadius: '0.75rem',
              background: winner === 1 ? 'rgba(79,209,165,0.15)' : winner === 2 ? 'rgba(110,107,244,0.15)' : 'rgba(242,184,75,0.15)',
              border: `1px solid ${winner === 1 ? '#4fd1a5' : winner === 2 ? '#6e6bf4' : '#f2b84b'}`,
              textAlign: 'center', fontFamily: 'var(--font-headline)', fontSize: '1.25rem', fontWeight: 800,
              color: winner === 1 ? '#4fd1a5' : winner === 2 ? '#6e6bf4' : '#f2b84b',
              boxShadow: '0 0 25px rgba(0,0,0,0.5)',
            }}
          >
            🏆 RACE WINNER: {winner === 1 ? algo1Meta.name : winner === 2 ? algo2Meta.name : 'TIE'} (Fewer Total Operations)
          </motion.div>
        )}

        {/* Dual Canvas Split View */}
        <div className="compare-content-grid">

          {/* Left: Algo 1 */}
          <div className="glass-panel" style={{ borderRadius: '0.75rem', overflow: 'hidden', border: `1px solid ${done1 ? '#4fd1a5' : 'rgba(110,107,244,0.3)'}`, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
            <div style={{ padding: '0.75rem 1rem', background: '#0f111a', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', color: '#4fd1a5' }}>sort</span>
                <select
                  value={algo1Id}
                  disabled={isRunning}
                  onChange={(e) => setAlgo1Id(e.target.value)}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                >
                  {SORTING_ALGOS.map(a => <option key={a.id} value={a.id} style={{ background: '#0f111a', color: '#fff' }}>{a.name}</option>)}
                </select>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: done1 ? '#4fd1a5' : '#94a3b8' }}>
                {done1 ? 'FINISHED' : isRunning ? 'RUNNING...' : 'READY'}
              </span>
            </div>

            {/* Metrics */}
            <div style={{ padding: '0.75rem 1rem', background: '#13151f', display: 'flex', justifyContent: 'space-around', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
              <div><span style={{ color: '#64748b' }}>Comparisons: </span><span style={{ color: '#4fd1a5', fontWeight: 700 }}>{comp1}</span></div>
              <div><span style={{ color: '#64748b' }}>Swaps: </span><span style={{ color: '#ef6461', fontWeight: 700 }}>{swap1}</span></div>
              <div><span style={{ color: '#64748b' }}>Time: </span><span style={{ color: '#f2b84b' }}>{algo1Meta.complexity.time}</span></div>
            </div>

            {/* Bars */}
            <div style={{ height: 260, padding: '1rem', background: '#08090e', display: 'flex', alignItems: 'flex-end', gap: 2 }}>
              {bars1.map((b, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${b.value}%`,
                    background: b.state === 'comparing'
                      ? '#f2b84b'
                      : b.state === 'swapping'
                      ? '#ef6461'
                      : b.state === 'sorted'
                      ? '#4fd1a5'
                      : '#6e6bf4',
                    borderRadius: '2px 2px 0 0',
                    transition: 'height 0.1s ease',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right: Algo 2 */}
          <div className="glass-panel" style={{ borderRadius: '0.75rem', overflow: 'hidden', border: `1px solid ${done2 ? '#4fd1a5' : 'rgba(110,107,244,0.3)'}`, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
            <div style={{ padding: '0.75rem 1rem', background: '#0f111a', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', color: '#6e6bf4' }}>sort</span>
                <select
                  value={algo2Id}
                  disabled={isRunning}
                  onChange={(e) => setAlgo2Id(e.target.value)}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                >
                  {SORTING_ALGOS.map(a => <option key={a.id} value={a.id} style={{ background: '#0f111a', color: '#fff' }}>{a.name}</option>)}
                </select>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: done2 ? '#4fd1a5' : '#94a3b8' }}>
                {done2 ? 'FINISHED' : isRunning ? 'RUNNING...' : 'READY'}
              </span>
            </div>

            {/* Metrics */}
            <div style={{ padding: '0.75rem 1rem', background: '#13151f', display: 'flex', justifyContent: 'space-around', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
              <div><span style={{ color: '#64748b' }}>Comparisons: </span><span style={{ color: '#4fd1a5', fontWeight: 700 }}>{comp2}</span></div>
              <div><span style={{ color: '#64748b' }}>Swaps: </span><span style={{ color: '#ef6461', fontWeight: 700 }}>{swap2}</span></div>
              <div><span style={{ color: '#64748b' }}>Time: </span><span style={{ color: '#f2b84b' }}>{algo2Meta.complexity.time}</span></div>
            </div>

            {/* Bars */}
            <div style={{ height: 260, padding: '1rem', background: '#08090e', display: 'flex', alignItems: 'flex-end', gap: 2 }}>
              {bars2.map((b, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${b.value}%`,
                    background: b.state === 'comparing'
                      ? '#f2b84b'
                      : b.state === 'swapping'
                      ? '#ef6461'
                      : b.state === 'sorted'
                      ? '#4fd1a5'
                      : '#38bdf8',
                    borderRadius: '2px 2px 0 0',
                    transition: 'height 0.1s ease',
                  }}
                />
              ))}
            </div>
          </div>

        </div>

      </div>
      <Footer />
    </motion.div>
  );
}
