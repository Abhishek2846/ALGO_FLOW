import { motion } from 'framer-motion';
import VisualizerControls from '../../components/ui/VisualizerControls';
import CodeEditorPanel from '../../components/ui/CodeEditorPanel';
import DifficultyBadge from '../../components/ui/DifficultyBadge';
import Footer from '../../components/layout/Footer';
import { useSortingVisualizer } from '../../hooks/useSortingVisualizer';
import type { AlgorithmMeta, SortStep, BarState } from '../../types';

interface SortingPageProps {
  meta: AlgorithmMeta;
  generateSteps: (arr: number[]) => SortStep[];
}

const ACCENT = '#4fd1a5';

const BAR_COLOR: Record<BarState, string> = {
  default:   'rgba(255,255,255,0.12)',
  comparing: '#f2b84b',
  swapping:  '#ef6461',
  pivot:     '#6e6bf4',
  sorted:    '#4fd1a5',
};

const BAR_GLOW: Record<BarState, string> = {
  default:   'none',
  comparing: '0 0 8px rgba(242,184,75,0.6)',
  swapping:  '0 0 8px rgba(239,100,97,0.6)',
  pivot:     '0 0 8px rgba(110,107,244,0.6)',
  sorted:    '0 0 6px rgba(79,209,165,0.5)',
};

export default function SortingPageTemplate({ meta, generateSteps }: SortingPageProps) {
  const {
    bars, isPlaying, isDone, speed, arraySize, comparisons, swaps, activeLine,
    setSpeed, setArraySize, play, pause, step, reset, setCustomArray,
  } = useSortingVisualizer(generateSteps);

  const maxVal = Math.max(...bars.map((b) => b.value), 1);
  const pseudocode = meta.pseudocode || [];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.4 }} 
      style={{ background: 'rgba(8,9,14,1)', minHeight: '100vh', color: '#e2e8f0', fontFamily: 'var(--font-body)' }}
    >
      {/* Top Accent Line */}
      <div style={{ height: '3px', width: '100%', background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`, boxShadow: `0 0 15px ${ACCENT}` }} />

      <div style={{ padding: '2rem var(--gutter)', maxWidth: 1400, margin: '0 auto' }}>
        

        {/* Hero Header */}
        <div style={{ 
          marginBottom: '3rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between', 
          background: `radial-gradient(ellipse at top left, ${ACCENT}26, transparent 70%)`, 
          padding: '2rem', borderRadius: '1rem', border: `1px solid ${ACCENT}33`, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' 
        }}>
          <div style={{ flex: '1 1 500px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', background: `${ACCENT}1a`, padding: '0.25rem 0.75rem', borderRadius: '1rem', border: `1px solid ${ACCENT}4d` }}>
                Sorting Algorithm
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <motion.div 
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 0.9, 1] }} 
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }} 
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8' }}>
                  {isDone ? 'Array Sorted ✓' : isPlaying ? 'Algorithm Running...' : 'Visualizer Ready'}
                </span>
              </div>
            </div>
            <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, margin: '0 0 1rem 0', background: `linear-gradient(135deg, #ffffff, ${ACCENT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
              {meta.name}
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: 1.6, margin: 0, maxWidth: '800px' }}>
              {meta.description}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '200px' }}>
            <DifficultyBadge difficulty={meta.difficulty} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0.5rem', padding: '0.75rem 1rem' }}>
              <span style={{ color: '#64748b' }}>Time</span>
              <span style={{ color: '#f2b84b', fontWeight: 600 }}>{meta.complexity.time}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0.5rem', padding: '0.75rem 1rem' }}>
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
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: ACCENT }}>sort</span>
                  {meta.id}.viz
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: ACCENT, background: `${ACCENT}1a`, padding: '0.2rem 0.6rem', borderRadius: '1rem' }}>
                  Elements: {bars.length}
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
                
                {/* Bars Canvas */}
                <div
                  id="visualizer-canvas"
                  style={{
                    height: 280,
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: Math.max(1, Math.floor(5 - bars.length / 15)),
                    padding: '1rem 0.5rem 0',
                    position: 'relative',
                  }}
                >
                  {[25, 50, 75].map(p => (
                    <div key={p} style={{ position: 'absolute', left: 0, right: 0, bottom: `${p}%`, height: 1, background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
                  ))}
                  {bars.map((bar, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: `${(bar.value / maxVal) * 100}%`,
                        background: BAR_COLOR[bar.state],
                        borderRadius: '3px 3px 0 0',
                        minWidth: 3,
                        transition: 'height 0.18s cubic-bezier(0.4,0,0.2,1), background-color 0.12s ease',
                        boxShadow: BAR_GLOW[bar.state],
                      }}
                    />
                  ))}
                </div>

                {/* Stats + Legend inside canvas */}
                <div style={{
                  marginTop: '1rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}>
                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Comparisons</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 700, color: '#6e6bf4' }}>{comparisons.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Swaps</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 700, color: '#ef6461' }}>{swaps.toLocaleString()}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {[
                      { color: '#f2b84b', label: 'Compare' },
                      { color: '#ef6461', label: 'Swap' },
                      { color: '#6e6bf4', label: 'Pivot' },
                      { color: '#4fd1a5', label: 'Sorted' },
                    ].map(({ color, label }) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: color, boxShadow: `0 0 6px ${color}88` }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8' }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
              
              {/* Controls Toolbar */}
              <div style={{ padding: '1rem', background: '#0f111a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <VisualizerControls
                  isPlaying={isPlaying}
                  onPlay={play}
                  onPause={pause}
                  onStep={step}
                  onReset={reset}
                  speed={speed}
                  onSpeedChange={setSpeed}
                  arraySize={arraySize}
                  onArraySizeChange={setArraySize}
                  onCustomInput={setCustomArray}
                  isDone={isDone}
                />
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Code Editor */}
            <CodeEditorPanel
              algoId={meta.id}
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
                  <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Time (Best)</span>
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
