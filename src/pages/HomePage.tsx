import { Suspense, lazy, useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CATEGORIES, ALGORITHMS } from '../data/algorithms';
import type { AlgorithmMeta, CategoryId } from '../types';
import Footer from '../components/layout/Footer';

const HeroParticleGraph = lazy(() => import('../components/three/HeroParticleGraph'));

// ── Live Animated Sorting Bars for Hero Preview ──
const INITIAL_DEMO_BARS = [65, 20, 85, 40, 55, 90, 30, 75, 45, 60, 15, 80, 35, 70, 25, 50];

function LiveInteractiveBars() {
  const [bars, setBars] = useState(INITIAL_DEMO_BARS);
  const [activeIdx, setActiveIdx] = useState(0);
  const [comparisons, setComparisons] = useState(142);
  const [swaps, setSwaps] = useState(88);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIdx(prev => {
        const next = (prev + 1) % INITIAL_DEMO_BARS.length;
        setBars(b => {
          const arr = [...b];
          if (next + 1 < arr.length && arr[next] > arr[next + 1]) {
            [arr[next], arr[next + 1]] = [arr[next + 1], arr[next]];
            setSwaps(s => s + 1);
          }
          setComparisons(c => c + 1);
          return arr;
        });
        return next;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleReset = () => {
    setBars([...INITIAL_DEMO_BARS].sort(() => Math.random() - 0.5));
    setActiveIdx(0);
    setComparisons(0);
    setSwaps(0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Visualizer Canvas Simulation */}
      <div
        style={{
          height: 180,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 3,
          padding: '1rem 1.25rem',
          background: 'rgba(9, 10, 15, 0.75)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid lines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '100% 24px',
            pointerEvents: 'none',
          }}
        />

        {bars.map((h, i) => {
          const isComparing = i === activeIdx || i === activeIdx + 1;
          const isSorted = i < activeIdx;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${h}%`,
                borderRadius: '3px 3px 0 0',
                transition: 'height 0.38s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s ease',
                background: isComparing
                  ? '#ef6461'
                  : isSorted
                  ? 'linear-gradient(to top, #4fd1a5, #38d9a9)'
                  : 'linear-gradient(to top, #6e6bf4, #a78bfa)',
                boxShadow: isComparing
                  ? '0 0 12px rgba(239, 100, 97, 0.8)'
                  : isSorted
                  ? '0 0 8px rgba(79, 209, 165, 0.4)'
                  : 'none',
                position: 'relative',
              }}
            />
          );
        })}
      </div>

      {/* Control bar + Live Stats */}
      <div
        style={{
          padding: '0.85rem 1.25rem',
          borderTop: '1px solid var(--ink-800)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(18, 19, 26, 0.85)',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Comparisons
            </div>
            <div style={{ fontFamily: 'var(--font-headline)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)' }}>
              {comparisons}
            </div>
          </div>
          <div style={{ width: 1, height: 24, background: 'var(--outline-variant)' }} />
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Swaps
            </div>
            <div style={{ fontFamily: 'var(--font-headline)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--neon-mint)' }}>
              {swaps}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
          <button
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? 'Resume' : 'Pause'}
            style={{
              padding: '5px 10px',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'var(--on-surface)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              transition: 'all 0.2s',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
              {isPaused ? 'play_arrow' : 'pause'}
            </span>
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={handleReset}
            title="Shuffle"
            style={{
              padding: '5px 10px',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'var(--on-surface)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              transition: 'all 0.2s',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>shuffle</span>
            Shuffle
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Animated Intersection Counter ──
function StatCounter({ to, duration = 1400 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let count = 0;
        const step = to / (duration / 16);
        const timer = setInterval(() => {
          count += step;
          if (count >= to) {
            setVal(to);
            clearInterval(timer);
          } else {
            setVal(Math.floor(count));
          }
        }, 16);
      }
    });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to, duration]);

  return <span ref={ref}>{val}</span>;
}

const CAT_THEMES: Record<CategoryId, { accent: string; glow: string; border: string }> = {
  sorting:    { accent: '#6e6bf4', glow: 'rgba(110,107,244,0.3)', border: 'rgba(110,107,244,0.25)' },
  searching:  { accent: '#4fd1a5', glow: 'rgba(79,209,165,0.28)', border: 'rgba(79,209,165,0.25)' },
  trees:      { accent: '#f2b84b', glow: 'rgba(242,184,75,0.28)', border: 'rgba(242,184,75,0.25)' },
  graphs:     { accent: '#c2c1ff', glow: 'rgba(194,193,255,0.28)', border: 'rgba(194,193,255,0.25)' },
  dp:         { accent: '#c084fc', glow: 'rgba(192,132,252,0.28)', border: 'rgba(192,132,252,0.25)' },
  structures: { accent: '#38bdf8', glow: 'rgba(56,189,248,0.28)', border: 'rgba(56,189,248,0.25)' },
};

const FEATURED_ALGORITHMS: AlgorithmMeta[] = ALGORITHMS.filter(a =>
  ['bubble-sort', 'merge-sort', 'quick-sort', 'binary-search', 'bst', 'dijkstra', 'bfs', 'coin-change', 'stack', 'union-find'].includes(a.id)
);

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');

  // Filtered list for instant algorithm search
  const filteredAlgorithms = useMemo(() => {
    return ALGORITHMS.filter(algo => {
      const matchesSearch =
        algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        algo.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        algo.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || algo.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ═════════════════════════════════════════════════════════
          1. HERO COMMAND CENTER
      ═════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: 'relative',
          minHeight: '84vh',
          display: 'flex',
          alignItems: 'center',
          padding: '2.5rem var(--gutter)',
          overflow: 'hidden',
        }}
      >
        {/* Three.js Particle Graph in Background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.45 }}>
          <Suspense fallback={null}>
            <HeroParticleGraph />
          </Suspense>
        </div>

        {/* Ambient gradients */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
            background: 'linear-gradient(125deg, rgba(11, 12, 16, 0.94) 35%, rgba(11, 12, 16, 0.3) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '8%',
            top: '25%',
            width: 450,
            height: 450,
            borderRadius: '50%',
            zIndex: 1,
            pointerEvents: 'none',
            background: 'radial-gradient(circle, rgba(110,107,244,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Hero Main Content */}
        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 1320, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '3rem', alignItems: 'center' }}>

            {/* Left Column: Heading & Quick Launch */}
            <motion.div
              initial={{ opacity: 0, x: -35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}
            >
              {/* Telemetry Status Chip */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '5px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(79, 209, 165, 0.35)',
                  background: 'rgba(79, 209, 165, 0.08)',
                  width: 'fit-content',
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: 'var(--neon-mint)',
                    boxShadow: '0 0 10px var(--neon-mint)',
                    animation: 'dashboard-pulse 2s ease-in-out infinite',
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--neon-mint)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    fontWeight: 600,
                  }}
                >
                  ENGINEERING WORKSPACE · READY
                </span>
              </div>

              {/* Headline */}
              <h1
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: 'clamp(2.4rem, 4.8vw, 3.8rem)',
                  fontWeight: 800,
                  lineHeight: 1.06,
                  color: 'var(--on-surface)',
                  letterSpacing: '-0.03em',
                  margin: 0,
                }}
              >
                Watch algorithms <br />
                <span
                  style={{
                    background: 'linear-gradient(135deg, #a78bfa 0%, #6e6bf4 50%, #4fd1a5 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 28px rgba(110, 107, 244, 0.45))',
                  }}
                >
                  think and execute.
                </span>
              </h1>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-body-lg)',
                  color: 'var(--on-surface-variant)',
                  lineHeight: 1.68,
                  maxWidth: 520,
                  margin: 0,
                }}
              >
                A high-precision visualizer for <strong style={{ color: '#fff' }}>34 data structures & algorithms</strong>.
                Dissect step-by-step logic with multi-language code (Python, C++, Java, JS), real-time audio synthesis, and Big-O analytics.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', paddingTop: '0.4rem' }}>
                <Link
                  to="/sorting"
                  style={{
                    padding: '0.85rem 2rem',
                    background: 'linear-gradient(135deg, #6e6bf4 0%, #5855e8 100%)',
                    color: '#fff',
                    borderRadius: 'var(--radius-full)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    boxShadow: '0 0 28px rgba(110, 107, 244, 0.55)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    transition: 'all 0.22s ease',
                  }}
                  onMouseEnter={e => {
                    const a = e.currentTarget as HTMLAnchorElement;
                    a.style.transform = 'translateY(-2px) scale(1.02)';
                    a.style.boxShadow = '0 0 42px rgba(110, 107, 244, 0.8)';
                  }}
                  onMouseLeave={e => {
                    const a = e.currentTarget as HTMLAnchorElement;
                    a.style.transform = 'translateY(0) scale(1)';
                    a.style.boxShadow = '0 0 28px rgba(110, 107, 244, 0.55)';
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>rocket_launch</span>
                  Explore Visualizers
                </Link>

                <Link
                  to="/compare"
                  style={{
                    padding: '0.85rem 1.9rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    color: 'var(--on-surface)',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    transition: 'all 0.22s ease',
                    backdropFilter: 'blur(10px)',
                  }}
                  onMouseEnter={e => {
                    const a = e.currentTarget as HTMLAnchorElement;
                    a.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    a.style.background = 'rgba(255, 255, 255, 0.08)';
                    a.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    const a = e.currentTarget as HTMLAnchorElement;
                    a.style.borderColor = 'rgba(255, 255, 255, 0.14)';
                    a.style.background = 'rgba(255, 255, 255, 0.04)';
                    a.style.transform = 'translateY(0)';
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', color: '#c084fc' }}>compare_arrows</span>
                  Race Mode
                </Link>
              </div>

              {/* Mini Quick-Metrics Strip */}
              <div
                style={{
                  display: 'flex',
                  gap: '2rem',
                  paddingTop: '0.6rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  marginTop: '0.5rem',
                }}
              >
                {[
                  { label: 'Algorithms', val: '34' },
                  { label: 'Categories', val: '6' },
                  { label: 'Code Switcher', val: '4 Langs' },
                  { label: 'Audio Engine', val: 'Pentatonic' },
                ].map(({ label, val }) => (
                  <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontFamily: 'var(--font-headline)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--on-surface)' }}>
                      {val}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Column: Live Terminal Visualizer Panel */}
            <motion.div
              initial={{ opacity: 0, x: 35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            >
              <div
                className="glass-panel"
                style={{
                  borderRadius: '1.25rem',
                  overflow: 'hidden',
                  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(110, 107, 244, 0.2)',
                  background: 'rgba(15, 17, 24, 0.75)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                {/* Terminal Header */}
                <div
                  style={{
                    padding: '0.75rem 1.25rem',
                    borderBottom: '1px solid var(--ink-800)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(18, 19, 26, 0.85)',
                  }}
                >
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {['#ef6461', '#f2b84b', '#4fd1a5'].map((color, i) => (
                      <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                    ))}
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--on-surface-variant)', marginLeft: '0.6rem' }}>
                      sorting_sandbox.live
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'var(--neon-mint)',
                        boxShadow: '0 0 8px var(--neon-mint)',
                        animation: 'dashboard-pulse 1.8s ease-in-out infinite',
                      }}
                    />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--neon-mint)', fontWeight: 600 }}>
                      LIVE ENGINE
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.65rem',
                        color: 'var(--amber-glow)',
                        background: 'rgba(242, 184, 75, 0.12)',
                        border: '1px solid rgba(242, 184, 75, 0.25)',
                        borderRadius: '4px',
                        padding: '1px 7px',
                        marginLeft: '0.2rem',
                      }}
                    >
                      O(n²)
                    </span>
                  </div>
                </div>

                {/* Animated Bars Component */}
                <LiveInteractiveBars />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════
          2. BENTO STATS TELEMETRY ROW
      ═════════════════════════════════════════════════════════ */}
      <section style={{ padding: '0 var(--gutter) 3.5rem' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1.1rem' }}>
            {[
              { icon: 'functions',       label: 'Algorithms Total',   val: 34,  color: '#6e6bf4', suffix: '' },
              { icon: 'category',        label: 'Core Categories',    val: 6,   color: '#4fd1a5', suffix: '' },
              { icon: 'code',            label: 'Languages Ready',    val: 4,   color: '#f2b84b', suffix: '' },
              { icon: 'compare_arrows',  label: 'Race Algorithms',    val: 100, color: '#c084fc', suffix: '+' },
              { icon: 'graphic_eq',      label: 'Audio Synthesizer',  val: 100, color: '#ef6461', suffix: '%' },
            ].map(({ icon, label, val, color, suffix }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
                className="glass-panel"
                style={{
                  padding: '1.25rem 1.4rem',
                  borderRadius: '1rem',
                  border: `1px solid ${color}22`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.25s ease',
                  background: `linear-gradient(135deg, ${color}08 0%, rgba(15, 23, 42, 0.45) 100%)`,
                }}
                whileHover={{ y: -4, boxShadow: `0 10px 30px ${color}30` }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${color}70, transparent)` }} />
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '0.7rem',
                    background: `${color}16`,
                    border: `1px solid ${color}32`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: `0 0 16px ${color}20`,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', color }}>{icon}</span>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-headline)', fontSize: '1.5rem', fontWeight: 800, color, lineHeight: 1 }}>
                    <StatCounter to={val} />{suffix}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px' }}>
                    {label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════
          3. QUICK SEARCH & TOP PICKS
      ═════════════════════════════════════════════════════════ */}
      <section style={{ padding: '0 var(--gutter) 4rem' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>

          {/* Section Header with Search Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', color: 'var(--neon-mint)' }}>bolt</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--neon-mint)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>
                  QUICK LAUNCH & DISCOVERY
                </span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.65rem', fontWeight: 800, color: 'var(--on-surface)', margin: 0 }}>
                Featured Algorithms
              </h2>
            </div>

            {/* Live Search Input */}
            <div style={{ position: 'relative', minWidth: 280 }}>
              <input
                type="text"
                placeholder="Search any algorithm (e.g. Dijkstra, Quick Sort)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem 0.65rem 2.4rem',
                  background: 'rgba(18, 19, 26, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 'var(--radius-full)',
                  color: '#fff',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.84rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
              />
              <span
                className="material-symbols-outlined"
                style={{
                  position: 'absolute',
                  left: '0.8rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1.1rem',
                  color: 'var(--on-surface-variant)',
                  pointerEvents: 'none',
                }}
              >
                search
              </span>
            </div>
          </div>

          {/* Quick Filter Category Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <button
              onClick={() => setSelectedCategory('all')}
              style={{
                padding: '5px 14px',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                border: selectedCategory === 'all' ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.08)',
                background: selectedCategory === 'all' ? 'rgba(110,107,244,0.2)' : 'rgba(255,255,255,0.03)',
                color: selectedCategory === 'all' ? '#fff' : 'var(--on-surface-variant)',
                cursor: 'pointer',
                transition: 'all 0.18s',
              }}
            >
              All ({ALGORITHMS.length})
            </button>

            {CATEGORIES.map(cat => {
              const active = selectedCategory === cat.id;
              const color = CAT_THEMES[cat.id]?.accent || '#6e6bf4';
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '5px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    border: active ? `1px solid ${color}` : '1px solid rgba(255,255,255,0.08)',
                    background: active ? `${color}25` : 'rgba(255,255,255,0.03)',
                    color: active ? '#fff' : 'var(--on-surface-variant)',
                    cursor: 'pointer',
                    transition: 'all 0.18s',
                  }}
                >
                  {cat.name} ({cat.count})
                </button>
              );
            })}
          </div>

          {/* Algorithm Grid (Filtered or Featured) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.9rem' }}>
            <AnimatePresence>
              {(searchQuery || selectedCategory !== 'all' ? filteredAlgorithms : FEATURED_ALGORITHMS).map((algo, i) => {
                const color = CAT_THEMES[algo.category]?.accent || '#6e6bf4';
                return (
                  <motion.div
                    key={algo.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                  >
                    <Link
                      to={algo.path}
                      style={{ textDecoration: 'none', display: 'block' }}
                    >
                      <div
                        className="glass-panel"
                        style={{
                          padding: '1rem 1.15rem',
                          borderRadius: '0.85rem',
                          border: `1px solid rgba(255, 255, 255, 0.08)`,
                          background: 'rgba(18, 19, 26, 0.6)',
                          transition: 'all 0.22s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLDivElement;
                          el.style.borderColor = `${color}60`;
                          el.style.background = `linear-gradient(135deg, ${color}14 0%, rgba(18, 19, 26, 0.8) 100%)`;
                          el.style.transform = 'translateY(-2px)';
                          el.style.boxShadow = `0 6px 20px ${color}20`;
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLDivElement;
                          el.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                          el.style.background = 'rgba(18, 19, 26, 0.6)';
                          el.style.transform = 'translateY(0)';
                          el.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: '0.5rem',
                              background: `${color}18`,
                              border: `1px solid ${color}35`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '1rem', color }}>
                              {algo.category === 'sorting' ? 'swap_vert' : algo.category === 'searching' ? 'manage_search' : algo.category === 'trees' ? 'account_tree' : algo.category === 'graphs' ? 'hub' : algo.category === 'dp' ? 'layers' : 'stacked_bar_chart'}
                            </span>
                          </div>
                          <div>
                            <div style={{ fontFamily: 'var(--font-headline)', fontSize: '0.88rem', fontWeight: 700, color: 'var(--on-surface)' }}>
                              {algo.name}
                            </div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--on-surface-variant)' }}>
                              {algo.complexity.time}
                            </div>
                          </div>
                        </div>

                        <span className="material-symbols-outlined" style={{ fontSize: '0.95rem', color: 'var(--on-surface-variant)' }}>
                          arrow_forward
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════
          4. ALL CATEGORY BLUEPRINTS (BENTO CARDS)
      ═════════════════════════════════════════════════════════ */}
      <section
        style={{
          padding: '4.5rem var(--gutter)',
          background: 'linear-gradient(180deg, rgba(13, 14, 18, 0.6) 0%, rgba(9, 10, 14, 0.9) 100%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>category</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>
                  ALGORITHM CATEGORIES
                </span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 'var(--text-headline-md)', color: 'var(--on-surface)', fontWeight: 800, margin: 0 }}>
                Blueprint Categories
              </h2>
            </div>

            <Link
              to="/compare"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1.25rem',
                background: 'rgba(110, 107, 244, 0.1)',
                border: '1px solid rgba(110, 107, 244, 0.3)',
                color: 'var(--primary)',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = 'rgba(110, 107, 244, 0.2)')}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = 'rgba(110, 107, 244, 0.1)')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>compare_arrows</span>
              Compare Across Categories
            </Link>
          </motion.div>

          {/* 6 Category Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.4rem' }}>
            {CATEGORIES.map((cat, i) => {
              const theme = CAT_THEMES[cat.id] ?? { accent: '#6e6bf4', glow: 'rgba(110,107,244,0.25)', border: 'rgba(110,107,244,0.2)' };
              const categoryAlgos = ALGORITHMS.filter(a => a.category === cat.id);

              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  whileHover={{ y: -6 }}
                >
                  <Link to={cat.path} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                    <div
                      className="glass-panel"
                      style={{
                        padding: '1.85rem',
                        borderRadius: '1.1rem',
                        border: `1px solid ${theme.border}`,
                        background: `linear-gradient(135deg, ${theme.accent}0a 0%, rgba(15, 23, 42, 0.55) 100%)`,
                        position: 'relative',
                        overflow: 'hidden',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.28s ease',
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.borderColor = `${theme.accent}55`;
                        el.style.boxShadow = `0 14px 44px ${theme.glow}, 0 0 0 1px ${theme.accent}25`;
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.borderColor = theme.border;
                        el.style.boxShadow = 'none';
                      }}
                    >
                      {/* Watermark Icon */}
                      <div
                        style={{
                          position: 'absolute',
                          right: -10,
                          top: -10,
                          fontSize: 120,
                          color: `${theme.accent}08`,
                          pointerEvents: 'none',
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }}>
                          {cat.iconSymbol}
                        </span>
                      </div>

                      {/* Top Accent Line */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 2,
                          background: `linear-gradient(90deg, transparent, ${theme.accent}70, transparent)`,
                        }}
                      />

                      {/* Icon & Count Badge */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                        <div
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: '0.75rem',
                            background: `${theme.accent}18`,
                            border: `1px solid ${theme.accent}38`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 0 18px ${theme.accent}30`,
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', color: theme.accent }}>
                            {cat.iconSymbol}
                          </span>
                        </div>

                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.68rem',
                            color: theme.accent,
                            background: `${theme.accent}14`,
                            border: `1px solid ${theme.accent}28`,
                            borderRadius: 'var(--radius-full)',
                            padding: '3px 10px',
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                          }}
                        >
                          {cat.count} ALGORITHMS
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--on-surface)', margin: '0 0 0.5rem' }}>
                        {cat.name}
                      </h3>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.86rem', color: 'var(--on-surface-variant)', lineHeight: 1.55, margin: '0 0 1.25rem', flex: 1 }}>
                        {cat.description}
                      </p>

                      {/* Algorithm Badges Preview */}
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.35rem' }}>
                        {categoryAlgos.slice(0, 4).map(algo => (
                          <span
                            key={algo.id}
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.64rem',
                              color: 'var(--on-surface-variant)',
                              background: 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              borderRadius: '4px',
                              padding: '2px 8px',
                            }}
                          >
                            {algo.name}
                          </span>
                        ))}
                        {cat.count > 4 && (
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.64rem',
                              color: theme.accent,
                              background: `${theme.accent}12`,
                              border: `1px solid ${theme.accent}24`,
                              borderRadius: '4px',
                              padding: '2px 8px',
                            }}
                          >
                            +{cat.count - 4} more
                          </span>
                        )}
                      </div>

                      {/* Footer Row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: theme.accent, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          Explore Visualizer <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                        </span>
                        <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end' }}>
                          {[...Array(Math.min(cat.count, 6))].map((_, barIdx) => (
                            <div
                              key={barIdx}
                              style={{
                                width: 3,
                                height: 8 + barIdx * 3,
                                background: barIdx < 3 ? theme.accent : `${theme.accent}40`,
                                borderRadius: '2px',
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════
          5. RACE & COMPARE HEAD-TO-HEAD CTA
      ═════════════════════════════════════════════════════════ */}
      <section style={{ padding: '4.5rem var(--gutter)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="glass-panel"
            style={{
              borderRadius: '1.25rem',
              padding: '3.5rem 3rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(110, 107, 244, 0.2)',
              background: 'linear-gradient(135deg, rgba(110, 107, 244, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%)',
            }}
          >
            {/* Ambient Lighting */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(110, 107, 244, 0.1) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background: 'linear-gradient(90deg, rgba(110, 107, 244, 0.6), rgba(79, 209, 165, 0.35), transparent)',
              }}
            />

            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '4px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(192, 132, 252, 0.35)',
                  background: 'rgba(192, 132, 252, 0.08)',
                  marginBottom: '1rem',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '0.9rem', color: '#c084fc' }}>compare_arrows</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700 }}>
                  SIDE-BY-SIDE RACE ARENA
                </span>
              </div>

              <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.65rem, 3.2vw, 2.3rem)', fontWeight: 800, color: 'var(--on-surface)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
                Benchmark and race algorithms head-to-head.
              </h2>

              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body-lg)', color: 'var(--on-surface-variant)', maxWidth: 540, lineHeight: 1.65, margin: 0 }}>
                Run any two algorithms concurrently on identical datasets. Watch their comparative execution speed, step counts, swaps, and Big-O efficiency in real-time side-by-side viewports.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
              <Link
                to="/compare"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '1rem 2.25rem',
                  background: 'linear-gradient(135deg, #6e6bf4 0%, #5855e8 100%)',
                  color: '#fff',
                  borderRadius: 'var(--radius-full)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 0 32px rgba(110, 107, 244, 0.55)',
                  transition: 'all 0.22s ease',
                }}
                onMouseEnter={e => {
                  const a = e.currentTarget as HTMLAnchorElement;
                  a.style.transform = 'translateY(-2px) scale(1.02)';
                  a.style.boxShadow = '0 0 48px rgba(110, 107, 244, 0.85)';
                }}
                onMouseLeave={e => {
                  const a = e.currentTarget as HTMLAnchorElement;
                  a.style.transform = 'translateY(0) scale(1)';
                  a.style.boxShadow = '0 0 32px rgba(110, 107, 244, 0.55)';
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1.15rem' }}>compare_arrows</span>
                Launch Race Mode
              </Link>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--on-surface-variant)' }}>
                Compare Bubble vs Merge, BFS vs DFS, and more.
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Component */}
      <Footer />

      <style>{`
        @keyframes dashboard-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
}
