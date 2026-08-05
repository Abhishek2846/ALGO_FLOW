import { useState } from 'react';
import { motion } from 'framer-motion';
import { getByCategory, CATEGORIES } from '../data/algorithms';
import AlgoCard from '../components/ui/AlgoCard';
import Footer from '../components/layout/Footer';
import type { Difficulty, CategoryId, AlgorithmMeta } from '../types';

interface CategoryIndexPageProps {
  categoryId: CategoryId;
}

export default function CategoryIndexPage({ categoryId }: CategoryIndexPageProps) {
  const algos: AlgorithmMeta[] = getByCategory(categoryId);
  const meta = CATEGORIES.find((c) => c.id === categoryId)!;
  const [filter, setFilter] = useState<Difficulty | 'All'>('All');

  const filtered = filter === 'All' ? algos : algos.filter((a) => a.difficulty === filter);
  const difficulties: (Difficulty | 'All')[] = ['All', 'Easy', 'Medium', 'Advanced'];
  const ACCENT = meta.accentColor || '#ef6461';

  const diffColor: Record<string, string> = {
    All: ACCENT,
    Easy: '#4fd1a5',
    Medium: '#f2b84b',
    Advanced: '#ef6461',
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} style={{ background: 'rgba(8,9,14,1)', minHeight: '100vh', color: '#e2e8f0', fontFamily: 'var(--font-body)' }}>
      {/* Top Accent Line */}
      <div style={{ height: '3px', width: '100%', background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`, boxShadow: `0 0 15px ${ACCENT}` }} />

      <div style={{ padding: '2rem var(--gutter)', maxWidth: 1400, margin: '0 auto' }}>


        {/* Hero Header */}
        <div style={{ 
          marginBottom: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between', 
          background: `radial-gradient(ellipse at top left, ${ACCENT}26, transparent 70%)`, 
          padding: 'clamp(1.2rem, 3vw, 2.5rem) clamp(1rem, 2.5vw, 2rem)', borderRadius: '1rem', border: `1px solid ${ACCENT}33`, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' 
        }}>
          <div style={{ flex: '1 1 280px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', background: `${ACCENT}1a`, padding: '0.25rem 0.75rem', borderRadius: '1rem', border: `1px solid ${ACCENT}4d` }}>
                Category Index
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <motion.div 
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 0.9, 1] }} 
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }} 
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8' }}>{algos.length} Algorithms Available</span>
              </div>
            </div>
            <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.8rem, 4.5vw, 3.5rem)', fontWeight: 800, margin: '0 0 0.75rem 0', background: `linear-gradient(135deg, #ffffff, ${ACCENT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
              {meta.name}
            </h1>
            <p style={{ fontSize: 'clamp(0.92rem, 2vw, 1.05rem)', color: '#94a3b8', lineHeight: 1.6, margin: 0, maxWidth: '800px' }}>
              {meta.description}
            </p>
          </div>
        </div>

        {/* Difficulty Filter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {difficulties.map((d) => {
              const active = filter === d;
              const clr = diffColor[d];
              return (
                <button
                  key={d}
                  id={`filter-${d.toLowerCase()}`}
                  onClick={() => setFilter(d)}
                  style={{
                    padding: '0.4rem 0.95rem',
                    background: active ? `${clr}26` : 'rgba(18, 19, 26, 0.8)',
                    border: `1px solid ${active ? clr : 'rgba(255, 255, 255, 0.08)'}`,
                    borderRadius: '2rem',
                    color: active ? clr : '#94a3b8',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: active ? `0 0 12px ${clr}44` : 'none',
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                >
                  {d}
                </button>
              );
            })}
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#64748b' }}>
            Showing {filtered.length} of {algos.length}
          </span>
        </div>

        {/* Algorithm grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '1.25rem', marginBottom: '4rem' }}>
          {filtered.map((algo: AlgorithmMeta, i: number) => (
            <AlgoCard key={algo.id} algo={algo} index={i} />
          ))}
        </div>
      </div>
      <Footer />
    </motion.div>
  );
}
