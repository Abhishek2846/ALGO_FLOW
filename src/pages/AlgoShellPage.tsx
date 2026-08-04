import { motion } from 'framer-motion';
import DifficultyBadge from '../components/ui/DifficultyBadge';
import type { AlgorithmMeta } from '../types';
import Footer from '../components/layout/Footer';

interface AlgoShellPageProps {
  meta: AlgorithmMeta;
}

export default function AlgoShellPage({ meta }: AlgoShellPageProps) {

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{ padding: '2rem var(--gutter)', maxWidth: 1280, margin: '0 auto', flex: 1 }}
      >

        {/* Header */}
        <div style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ width: 40, height: 2, background: 'var(--electric-violet)', boxShadow: 'var(--glow-violet)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label-mono)', color: 'var(--neon-mint)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                {meta.category}
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 700, color: 'var(--on-surface)', margin: 0 }}>
              {meta.name}
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body-lg)', color: 'var(--on-surface-variant)', marginTop: '0.5rem', maxWidth: 600, lineHeight: 1.6 }}>
              {meta.description}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <DifficultyBadge difficulty={meta.difficulty} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-data-xs)', color: 'var(--amber-glow)', background: 'rgba(242,184,75,0.08)', border: '1px solid rgba(242,184,75,0.2)', borderRadius: 'var(--radius-sm)', padding: '3px 8px' }}>
              Time: {meta.complexity.time}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-data-xs)', color: 'var(--primary)', background: 'rgba(194,193,255,0.08)', border: '1px solid rgba(194,193,255,0.2)', borderRadius: 'var(--radius-sm)', padding: '3px 8px' }}>
              Space: {meta.complexity.space}
            </span>
          </div>
        </div>

        {/* Visualizer placeholder */}
        <div
          className="glass-panel"
          style={{
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            marginBottom: '1.5rem',
          }}
        >
          {/* Panel header */}
          <div style={{ padding: '0.6rem 1rem', borderBottom: '1px solid var(--ink-800)', display: 'flex', gap: 6, background: 'rgba(18,19,26,0.6)' }}>
            {['var(--crimson-spark)', 'var(--amber-glow)', 'var(--neon-mint)'].map((c, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
            ))}
          </div>

          {/* Coming soon canvas */}
          <div style={{
            height: 300,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(11,12,16,0.8)',
            gap: '1rem',
          }}>
            <div style={{ position: 'relative', width: 64, height: 64 }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '2px solid var(--electric-violet)',
                animation: 'spin 3s linear infinite',
                borderTopColor: 'transparent',
              }} />
              <div style={{
                position: 'absolute',
                inset: 8,
                borderRadius: '50%',
                border: '2px solid var(--neon-mint)',
                animation: 'spin 2s linear infinite reverse',
                borderBottomColor: 'transparent',
              }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label-mono)', color: 'var(--electric-violet)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.25rem' }}>
                Visualizer Ready Shell
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body-md)', color: 'var(--on-surface-variant)' }}>
                Interactive animation module for {meta.name}
              </p>
            </div>
          </div>
        </div>

        {/* Pseudocode + complexity grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Pseudocode */}
          {meta.pseudocode && (
            <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--ink-800)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(18,19,26,0.6)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: 'var(--electric-violet)' }}>code</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label-mono)', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pseudocode</span>
              </div>
              <div className="code-block" style={{ borderRadius: 0, border: 'none', maxHeight: 320, overflowY: 'auto' }}>
                {(meta.pseudocode || []).map((line: string, i: number) => (
                  <span key={i} className="pseudo-line">{line || '\u00A0'}</span>
                ))}
              </div>
            </div>
          )}

          {/* Complexity table */}
          <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label-mono)', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
              Complexity Analysis
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Case', 'Time', 'Space'].map((h) => (
                    <th key={h} style={{ padding: '0.4rem 0.75rem', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-data-xs)', color: 'var(--on-surface-variant)', textTransform: 'uppercase', borderBottom: '1px solid var(--outline-variant)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { case: 'Best', time: meta.complexity.timeBest || meta.complexity.time },
                  { case: 'Average', time: meta.complexity.time },
                  { case: 'Worst', time: meta.complexity.timeWorst || meta.complexity.time },
                ].map(({ case: c, time }) => (
                  <tr key={c}>
                    <td style={{ padding: '0.4rem 0.75rem', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-data-xs)', color: 'var(--on-surface-variant)' }}>{c}</td>
                    <td style={{ padding: '0.4rem 0.75rem', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-data-xs)', color: 'var(--amber-glow)' }}>{time}</td>
                    <td style={{ padding: '0.4rem 0.75rem', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-data-xs)', color: 'var(--primary)' }}>{meta.complexity.space}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
      <Footer />

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
