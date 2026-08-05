import { motion } from 'framer-motion';
import DPCanvas from '../../components/ui/DPCanvas';
import DifficultyBadge from '../../components/ui/DifficultyBadge';
import CodeEditorPanel from '../../components/ui/CodeEditorPanel';
import Footer from '../../components/layout/Footer';
import { useDPVisualizer } from '../../hooks/useDPVisualizer';
export type DPAlgoType = 'fibonacci' | 'knapsack' | 'lcs' | 'matrix-chain' | 'coin-change';
import type { AlgorithmMeta, DPStep } from '../../types';

interface DPPageTemplateProps {
  meta: AlgorithmMeta;
  algoType?: DPAlgoType;
  stepGenerator: () => DPStep[];
}

const ACCENT = '#c084fc';

const PSEUDOCODES: Record<string, string[]> = {
  fibonacci: [
    'function fibonacci(n):',
    '  dp[0] ← 0, dp[1] ← 1',
    '  for i from 2 to n:',
    '    dp[i] ← dp[i-1] + dp[i-2]',
    '  return dp[n]',
  ],
  knapsack: [
    'function knapsack(capacity, weights, values, n):',
    '  initialize dp[n+1][capacity+1] with 0',
    '  for i from 1 to n:',
    '    for w from 0 to capacity:',
    '      if weights[i-1] <= w:',
    '        dp[i][w] ← max(values[i-1] + dp[i-1][w-weights[i-1]], dp[i-1][w])',
    '      else:',
    '        dp[i][w] ← dp[i-1][w]',
    '  return dp[n][capacity]',
  ],
  lcs: [
    'function LCS(X, Y):',
    '  m ← length(X), n ← length(Y)',
    '  initialize dp[m+1][n+1] with 0',
    '  for i from 1 to m:',
    '    for j from 1 to n:',
    '      if X[i-1] == Y[j-1]:',
    '        dp[i][j] ← dp[i-1][j-1] + 1',
    '      else:',
    '        dp[i][j] ← max(dp[i-1][j], dp[i][j-1])',
    '  return dp[m][n]',
  ],
  'matrix-chain': [
    'function MatrixChainOrder(p):',
    '  n ← length(p) - 1',
    '  initialize m[n+1][n+1] with 0',
    '  for len from 2 to n:',
    '    for i from 1 to n - len + 1:',
    '      j ← i + len - 1',
    '      m[i][j] ← ∞',
    '      for k from i to j-1:',
    '        q ← m[i][k] + m[k+1][j] + p[i-1]*p[k]*p[j]',
    '        if q < m[i][j]: m[i][j] ← q',
    '  return m[1][n]',
  ],
  'coin-change': [
    'function coinChange(coins, amount):',
    '  initialize dp[amount+1] with ∞, dp[0] ← 0',
    '  for i from 1 to amount:',
    '    for coin in coins:',
    '      if coin <= i:',
    '        dp[i] ← min(dp[i], 1 + dp[i - coin])',
    '  return dp[amount] > amount ? -1 : dp[amount]',
  ],
};

function ControlBtn({ id, icon, label, onClick, disabled, accent }: {
  id: string; icon: string; label: string; onClick: () => void; disabled: boolean; accent?: boolean;
}) {
  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      title={label}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '40px', height: '40px',
        background: accent ? 'rgba(192, 132, 252, 0.2)' : 'rgba(18, 19, 26, 0.8)',
        border: `1px solid ${accent ? ACCENT : 'rgba(255, 255, 255, 0.1)'}`,
        borderRadius: '50%',
        color: accent ? ACCENT : '#a0a0b0',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'all 0.2s ease',
        boxShadow: accent && !disabled ? `0 0 15px ${ACCENT}66` : 'none',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(1.1)';
          if (!accent) e.currentTarget.style.color = '#fff';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(1)';
          if (!accent) e.currentTarget.style.color = '#a0a0b0';
        }
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>{icon}</span>
    </button>
  );
}

export default function DPPageTemplate({ meta, algoType, stepGenerator }: DPPageTemplateProps) {
  const effectiveAlgoType = (algoType || meta.id) as DPAlgoType;
  const {
    table,
    rowLabels,
    colLabels,
    activeCell,
    activeLine,
    description,
    isPlaying,
    isDone,
    speed,
    setSpeed,
    play,
    pause,
    step,
    reset,
  } = useDPVisualizer(stepGenerator);

  const pseudocode = PSEUDOCODES[effectiveAlgoType] ?? meta.pseudocode ?? [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} style={{ background: 'rgba(8,9,14,1)', minHeight: '100vh', color: '#e2e8f0', fontFamily: 'var(--font-body)' }}>
      {/* Top Accent Line */}
      <div style={{ height: '3px', width: '100%', background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`, boxShadow: `0 0 15px ${ACCENT}` }} />

      <div style={{ padding: '2rem var(--gutter)', maxWidth: 1400, margin: '0 auto' }}>


        {/* Hero Header */}
        <div style={{ 
          marginBottom: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between', 
          background: `radial-gradient(ellipse at top left, ${ACCENT}26, transparent 70%)`, 
          padding: 'clamp(1rem, 2.5vw, 2rem)', borderRadius: '1rem', border: `1px solid ${ACCENT}33`, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' 
        }}>
          <div style={{ flex: '1 1 280px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', background: `${ACCENT}1a`, padding: '0.25rem 0.75rem', borderRadius: '1rem', border: `1px solid ${ACCENT}4d` }}>
                Dynamic Programming
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <motion.div 
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 0.9, 1] }} 
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }} 
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8' }}>
                  {isDone ? 'DP Table Completed' : isPlaying ? 'Computing State...' : 'Visualizer Ready'}
                </span>
              </div>
            </div>
            <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', fontWeight: 800, margin: '0 0 0.75rem 0', background: `linear-gradient(135deg, #ffffff, ${ACCENT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
              {meta.name}
            </h1>
            <p style={{ fontSize: 'clamp(0.92rem, 2vw, 1.05rem)', color: '#94a3b8', lineHeight: 1.6, margin: 0, maxWidth: '800px' }}>
              {meta.description}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: '1 1 180px', minWidth: 'min(100%, 200px)' }}>
            <DifficultyBadge difficulty={meta.difficulty} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0.5rem', padding: '0.65rem 0.9rem' }}>
              <span style={{ color: '#64748b' }}>Time</span>
              <span style={{ color: '#f2b84b', fontWeight: 600 }}>{meta.complexity.time}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0.5rem', padding: '0.65rem 0.9rem' }}>
              <span style={{ color: '#64748b' }}>Space</span>
              <span style={{ color: '#38bdf8', fontWeight: 600 }}>{meta.complexity.space}</span>
            </div>
          </div>
        </div>

        {/* Content grid */}
        <div className="algo-content-grid">
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Terminal Canvas Window */}
            <div className="glass-panel" style={{ borderRadius: '0.75rem', overflow: 'hidden', border: `1px solid ${ACCENT}33`, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
              {/* Terminal Chrome */}
              <div style={{ padding: '0.75rem 1rem', background: '#0f111a', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef6461', opacity: 0.8 }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f2b84b', opacity: 0.8 }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#4fd1a5', opacity: 0.8 }} />
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: ACCENT }}>grid_view</span>
                  {meta.id}.viz
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: ACCENT, background: `${ACCENT}1a`, padding: '0.2rem 0.6rem', borderRadius: '1rem' }}>
                  Tabulation Matrix
                </div>
              </div>

              <div style={{ padding: '1.5rem', background: 'radial-gradient(circle at center, rgba(15,17,26,1) 0%, rgba(8,9,14,1) 100%)', position: 'relative' }}>
                {isPlaying && (
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: '100%' }} 
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    style={{ position: 'absolute', top: 0, left: 0, height: '2px', background: ACCENT, opacity: 0.5 }}
                  />
                )}

                <DPCanvas 
                  table={table}
                  rowLabels={rowLabels}
                  colLabels={colLabels}
                  activeCell={activeCell}
                  description={description}
                />
              </div>

              {/* Controls Toolbar */}
              <div style={{ padding: '1rem', background: '#0f111a', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {isPlaying ? (
                    <ControlBtn id="ctrl-pause" icon="pause" label="Pause" onClick={pause} disabled={isDone} accent />
                  ) : (
                    <ControlBtn id="ctrl-play" icon="play_arrow" label="Play" onClick={play} disabled={isDone} accent={!isDone} />
                  )}
                  <ControlBtn id="ctrl-step" icon="skip_next" label="Step" onClick={step} disabled={isPlaying || isDone} />
                  <ControlBtn id="ctrl-reset" icon="replay" label="Reset" onClick={reset} disabled={false} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.02)', padding: '0.4rem 1rem', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', color: '#94a3b8' }}>speed</span>
                  <input
                    type="range"
                    min={0.25} max={4} step={0.25}
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    style={{ width: '80px', accentColor: ACCENT }}
                  />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: ACCENT, minWidth: '32px', textAlign: 'right', fontWeight: 600 }}>{speed}x</span>
                </div>
              </div>

            </div>

          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Code Editor */}
            <CodeEditorPanel
              algoId={algoType || meta.id}
              defaultPseudocode={pseudocode}
              activeLine={activeLine}
              accentColor={ACCENT}
            />

            {/* Complexity Analysis */}
            <div className="glass-panel" style={{ borderRadius: '0.75rem', padding: '1.5rem', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.1rem', color: '#f8fafc', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ color: ACCENT, fontSize: '1.2rem' }}>analytics</span>
                Performance
              </h3>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}>
                  <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Time (Average)</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#f2b84b', fontSize: '0.9rem' }}>{meta.complexity.timeBest || meta.complexity.time}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}>
                  <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Time (Worst)</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#f2b84b', fontSize: '0.9rem' }}>{meta.complexity.timeWorst || meta.complexity.time}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}>
                  <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Space</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8', fontSize: '0.9rem' }}>{meta.complexity.space}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
      <Footer />
    </motion.div>
  );
}
