import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/algorithms';
import Footer from '../components/layout/Footer';

const HeroParticleGraph = lazy(() => import('../components/three/HeroParticleGraph'));

// ── Animated counter hook ──
function useCounter(target: number, inView: boolean, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
}

// ── 3D tilt card ──
function TiltCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const springX = useSpring(rotX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotY, { stiffness: 200, damping: 20 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rotX.set(-((e.clientY - cy) / (rect.height / 2)) * 8);
    rotY.set(((e.clientX - cx) / (rect.width / 2)) * 8);
  };
  return (
    <motion.div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={() => { rotX.set(0); rotY.set(0); }}
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 800, ...style }}>
      {children}
    </motion.div>
  );
}

// ── Animated stat counter ──
function StatCounter({ value, label, suffix = '', inView }: { value: number; label: string; suffix?: string; inView: boolean }) {
  const count = useCounter(value, inView);
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
        fontWeight: 800,
        background: 'linear-gradient(135deg, #fff 30%, #6e6bf4 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        lineHeight: 1,
      }}>{count}{suffix}</div>
      <div style={{
        fontFamily: "'Inter', sans-serif", fontSize: '0.8rem',
        color: 'rgba(199,196,215,0.65)', marginTop: '0.5rem',
        letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>{label}</div>
    </div>
  );
}

// ── Scroll progress bar ──
function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 1000, background: 'rgba(255,255,255,0.04)' }}>
      <div style={{ height: '100%', width: `${p}%`, background: 'linear-gradient(90deg, #6e6bf4, #4fd1a5)', transition: 'width 0.05s linear', boxShadow: '0 0 12px rgba(110,107,244,0.7)' }} />
    </div>
  );
}

const FEATURES = [
  { icon: 'play_circle',      title: 'Live Visualizer',      color: '#6e6bf4', desc: 'Step-by-step animated playback at any speed. Pause, rewind, and watch every operation unfold in real time.' },
  { icon: 'code',             title: '4-Language Code',       color: '#4fd1a5', desc: 'Switch between Python, C++, Java, and JavaScript instantly. One-click copy for any implementation.' },
  { icon: 'analytics',        title: 'Complexity Analysis',   color: '#f2b84b', desc: 'Full Big-O breakdown for time and space — best, average, and worst case for every algorithm.' },
  { icon: 'volume_up',        title: 'Audio Feedback',        color: '#ef6461', desc: 'Soothing pentatonic tones mapped to operations. Hear the difference between O(n) and O(n²).' },
  { icon: 'compare_arrows',   title: 'Compare Mode',          color: '#c084fc', desc: 'Run two algorithms side by side on the same data. See exactly why Merge Sort beats Bubble Sort.' },
  { icon: 'auto_awesome',     title: 'Premium Design',        color: '#38bdf8', desc: 'A polished dark-mode engineering workspace that makes learning feel premium and alive.' },
];

const CAT_COLORS: Record<string, { accent: string; bg: string; glow: string }> = {
  sorting:    { accent: '#6e6bf4', bg: 'rgba(110,107,244,0.08)', glow: 'rgba(110,107,244,0.35)' },
  searching:  { accent: '#4fd1a5', bg: 'rgba(79,209,165,0.08)',  glow: 'rgba(79,209,165,0.35)'  },
  trees:      { accent: '#f2b84b', bg: 'rgba(242,184,75,0.08)',  glow: 'rgba(242,184,75,0.35)'  },
  graphs:     { accent: '#c2c1ff', bg: 'rgba(194,193,255,0.08)', glow: 'rgba(194,193,255,0.35)' },
  dp:         { accent: '#c084fc', bg: 'rgba(192,132,252,0.08)', glow: 'rgba(192,132,252,0.35)' },
  structures: { accent: '#38bdf8', bg: 'rgba(56,189,248,0.08)',  glow: 'rgba(56,189,248,0.35)'  },
};

export default function LandingPage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-100px' });

  return (
    <div style={{ background: '#050508', minHeight: '100vh', overflowX: 'hidden' }}>
      <ScrollProgress />

      {/* ── Floating nav pill ── */}
      {/* Fixed shell owns the centering; motion.nav handles only opacity/y so Framer Motion can't override translateX */}
      <div style={{
        position: 'fixed', top: '1rem', left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        zIndex: 999, pointerEvents: 'none',
        padding: '0 0.75rem',
      }}>
        <motion.nav
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            pointerEvents: 'auto',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 'clamp(0.75rem, 2vw, 1.75rem)',
            padding: '0.45rem clamp(0.75rem, 2vw, 1.4rem)',
            background: 'rgba(18,19,26,0.92)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(110,107,244,0.25)', borderRadius: '9999px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            maxWidth: 'calc(100vw - 1.5rem)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #6e6bf4, #4fd1a5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '13px', color: '#fff' }}>hub</span>
            </div>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.86rem', color: '#fff', letterSpacing: '0.04em' }}>ALGO FLOW</span>
          </div>

          <div className="d-none d-md-flex" style={{ gap: '1.25rem' }}>
            {[{ label: 'Features', href: '#features' }, { label: 'Algorithms', href: '#categories' }, { label: 'About', href: '#about' }].map(({ label, href }) => (
              <a key={label} href={href}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', color: 'rgba(199,196,215,0.75)', textDecoration: 'none', letterSpacing: '0.03em', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(199,196,215,0.75)')}>
                {label}
              </a>
            ))}
          </div>

          <Link to="/dashboard"
            style={{ padding: '0.38rem 0.95rem', background: 'linear-gradient(135deg,#6e6bf4,#5855e8)', color: '#fff', borderRadius: '9999px', fontFamily: "'Inter', sans-serif", fontSize: '0.76rem', fontWeight: 600, textDecoration: 'none', boxShadow: '0 0 16px rgba(110,107,244,0.5)', transition: 'box-shadow 0.2s', whiteSpace: 'nowrap', flexShrink: 0 }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 28px rgba(110,107,244,0.8)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 16px rgba(110,107,244,0.5)')}>
            Launch App →
          </Link>
        </motion.nav>
      </div>


      {/* ══════════ HERO ══════════ */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Suspense fallback={null}><HeroParticleGraph /></Suspense>
        </div>
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(110,107,244,0.1) 0%, rgba(5,5,8,0.82) 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', top: '5%', left: '5%', background: 'radial-gradient(circle, rgba(110,107,244,0.07) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 1, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', bottom: '10%', right: '10%', background: 'radial-gradient(circle, rgba(79,209,165,0.05) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 1, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 1.5rem', maxWidth: 880, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.35 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '5px 14px', borderRadius: '9999px', border: '1px solid rgba(79,209,165,0.3)', background: 'rgba(79,209,165,0.06)', marginBottom: '2rem' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4fd1a5', boxShadow: '0 0 8px #4fd1a5', animation: 'lp-pulse 2s ease-in-out infinite' }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', color: '#4fd1a5', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Interactive Learning Platform</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }}
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(3rem, 8.5vw, 6.5rem)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.04em', marginBottom: '1.5rem' }}>
            <span style={{ background: 'linear-gradient(135deg, #fff 0%, #e3e2e8 60%, #6e6bf4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Algorithms,</span>
            <br />
            <span style={{ background: 'linear-gradient(135deg, #4fd1a5 0%, #6e6bf4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Visualized.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.58 }}
            style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', color: 'rgba(199,196,215,0.82)', lineHeight: 1.7, maxWidth: 600, margin: '0 auto 2.5rem' }}>
            A high-fidelity engineering workspace to dissect, visualize, and truly understand{' '}
            <strong style={{ color: '#e3e2e8' }}>34 algorithms</strong> across{' '}
            <strong style={{ color: '#e3e2e8' }}>6 categories</strong> — with multi-language code, complexity analysis, and audio feedback.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.72 }}
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/dashboard"
              style={{ padding: '1rem 2.5rem', background: 'linear-gradient(135deg,#6e6bf4,#5855e8)', color: '#fff', borderRadius: '9999px', fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: 700, textDecoration: 'none', boxShadow: '0 0 32px rgba(110,107,244,0.5)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.25s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 48px rgba(110,107,244,0.75)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 32px rgba(110,107,244,0.5)'; }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>rocket_launch</span>
              Explore Algorithms
            </Link>
            <a href="https://github.com/Abhishek2846" target="_blank" rel="noreferrer"
              style={{ padding: '1rem 2rem', background: 'rgba(255,255,255,0.04)', color: 'rgba(199,196,215,0.88)', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.12)', fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.25s ease', backdropFilter: 'blur(10px)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.25)'; (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(199,196,215,0.88)'; }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg>
              GitHub
            </a>
          </motion.div>

          {/* Stat chips */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.0 }}
            style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '3rem' }}>
            {[{ label: '34 Algorithms', icon: 'functions' }, { label: '6 Categories', icon: 'category' }, { label: '4 Languages', icon: 'code' }, { label: '100% Free', icon: 'favorite' }].map(({ label, icon }) => (
              <div key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '5px 13px', borderRadius: '9999px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '0.82rem', color: '#6e6bf4' }}>{icon}</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.73rem', color: 'rgba(199,196,215,0.65)' }}>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.65rem', color: 'rgba(199,196,215,0.35)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
            <span className="material-symbols-outlined" style={{ color: 'rgba(199,196,215,0.25)', fontSize: '1.4rem' }}>keyboard_arrow_down</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════ ABOUT ══════════ */}
      <section id="about" style={{ padding: '7rem 1.5rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 1, height: '100%', background: 'linear-gradient(to bottom, transparent, rgba(110,107,244,0.15), transparent)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '4px 12px', borderRadius: '9999px', border: '1px solid rgba(110,107,244,0.3)', background: 'rgba(110,107,244,0.06)', marginBottom: '1.25rem' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', color: '#6e6bf4', textTransform: 'uppercase', letterSpacing: '0.15em' }}>About the Platform</span>
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em', color: '#e3e2e8', marginBottom: '1.25rem' }}>
              Learning algorithms<br /><span style={{ color: '#6e6bf4' }}>should feel alive.</span>
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.05rem', color: 'rgba(199,196,215,0.78)', lineHeight: 1.75, marginBottom: '1.25rem' }}>
              ALGO FLOW is an interactive DSA visualizer built for students, engineers, and curious minds who want to <em>see</em> algorithms work — not just memorize them. Every step is animated, every operation is heard, every concept is explained.
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.05rem', color: 'rgba(199,196,215,0.78)', lineHeight: 1.75, marginBottom: '2rem' }}>
              From Bubble Sort to Floyd-Warshall, from Stack to Union-Find — all with real code in 4 languages, interactive playback, and Big-O complexity breakdowns.
            </p>
            <Link to="/dashboard"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.6rem', background: 'rgba(110,107,244,0.1)', border: '1px solid rgba(110,107,244,0.35)', color: '#c2c1ff', borderRadius: '9999px', fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(110,107,244,0.18)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 20px rgba(110,107,244,0.3)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(110,107,244,0.1)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none'; }}>
              Open Dashboard <span className="material-symbols-outlined" style={{ fontSize: '0.95rem' }}>arrow_forward</span>
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7, delay: 0.15 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>
            {[
              { icon: 'play_circle',     label: 'Step-by-step playback',   color: '#6e6bf4' },
              { icon: 'code',            label: 'Python, C++, Java, JS',    color: '#4fd1a5' },
              { icon: 'analytics',       label: 'Big-O complexity',          color: '#f2b84b' },
              { icon: 'volume_up',       label: 'Audio feedback',            color: '#ef6461' },
              { icon: 'compare_arrows',  label: 'Side-by-side compare',     color: '#c084fc' },
              { icon: 'touch_app',       label: 'Custom inputs',             color: '#38bdf8' },
              { icon: 'speed',           label: 'Variable speed',            color: '#4fd1a5' },
              { icon: 'star',            label: '34 algorithms total',       color: '#f2b84b' },
            ].map(({ icon, label, color }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', padding: '0.75rem 0.9rem', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.7rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.05rem', color, flexShrink: 0 }}>{icon}</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', color: 'rgba(199,196,215,0.82)', lineHeight: 1.3 }}>{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════ CATEGORIES ══════════ */}
      <section id="categories" style={{ padding: '7rem 1.5rem', background: 'linear-gradient(180deg, rgba(5,5,8,0) 0%, rgba(13,14,18,0.7) 50%, rgba(5,5,8,0) 100%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '4px 12px', borderRadius: '9999px', border: '1px solid rgba(79,209,165,0.3)', background: 'rgba(79,209,165,0.05)', marginBottom: '1rem' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', color: '#4fd1a5', textTransform: 'uppercase', letterSpacing: '0.15em' }}>34 Algorithms · 6 Categories</span>
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 800, color: '#e3e2e8', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>Explore Every Algorithm</h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.05rem', color: 'rgba(199,196,215,0.6)', maxWidth: 480, margin: '0 auto' }}>Click any category to dive into fully interactive visualizations.</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.2rem' }}>
            {CATEGORIES.map((cat, i) => {
              const c = CAT_COLORS[cat.id] ?? { accent: '#6e6bf4', bg: 'rgba(110,107,244,0.08)', glow: 'rgba(110,107,244,0.35)' };
              return (
                <motion.div key={cat.id} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay: i * 0.08 }}>
                  <TiltCard>
                    <Link to={cat.path} style={{ textDecoration: 'none', display: 'block' }}>
                      <div style={{ padding: '2rem', background: `linear-gradient(135deg, ${c.bg} 0%, rgba(5,5,8,0.55) 100%)`, border: `1px solid ${c.accent}22`, borderRadius: '1rem', cursor: 'pointer', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden' }}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = `${c.accent}55`; el.style.boxShadow = `0 8px 32px ${c.glow}50`; el.style.transform = 'translateY(-4px)'; }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = `${c.accent}22`; el.style.boxShadow = 'none'; el.style.transform = 'translateY(0)'; }}>
                        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: `radial-gradient(circle, ${c.glow}35 0%, transparent 70%)`, filter: 'blur(20px)', pointerEvents: 'none' }} />
                        <div style={{ width: 50, height: 50, borderRadius: '0.7rem', background: `${c.accent}15`, border: `1px solid ${c.accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '1.4rem', color: c.accent }}>{cat.iconSymbol}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.55rem' }}>
                          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.05rem', fontWeight: 700, color: '#e3e2e8', margin: 0 }}>{cat.name}</h3>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', color: c.accent, background: `${c.accent}14`, border: `1px solid ${c.accent}28`, borderRadius: '9999px', padding: '2px 9px' }}>{cat.count} algos</span>
                        </div>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.83rem', color: 'rgba(199,196,215,0.62)', lineHeight: 1.55, margin: '0 0 1.25rem' }}>{cat.description}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', color: c.accent, fontWeight: 600 }}>
                          Explore <span className="material-symbols-outlined" style={{ fontSize: '0.88rem' }}>arrow_forward</span>
                        </div>
                      </div>
                    </Link>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section id="features" style={{ padding: '7rem 1.5rem', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.022, backgroundImage: 'linear-gradient(rgba(110,107,244,1) 1px, transparent 1px), linear-gradient(90deg, rgba(110,107,244,1) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '4px 12px', borderRadius: '9999px', border: '1px solid rgba(192,132,252,0.3)', background: 'rgba(192,132,252,0.05)', marginBottom: '1rem' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Feature Set</span>
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 800, color: '#e3e2e8', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>Built for serious learners</h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.05rem', color: 'rgba(199,196,215,0.6)', maxWidth: 460, margin: '0 auto' }}>Every feature deepens understanding, not just demonstrates it.</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.2rem' }}>
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay: i * 0.07 }}
                style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease' }}
                whileHover={{ y: -5, borderColor: `${f.color}35`, boxShadow: `0 12px 36px ${f.color}1a` }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${f.color}45, transparent)` }} />
                <div style={{ width: 46, height: 46, borderRadius: '0.7rem', background: `${f.color}14`, border: `1px solid ${f.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.3rem', color: f.color }}>{f.icon}</span>
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.98rem', fontWeight: 700, color: '#e3e2e8', marginBottom: '0.55rem' }}>{f.title}</h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', color: 'rgba(199,196,215,0.62)', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ STATS ══════════ */}
      <section style={{ padding: '6rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(110,107,244,0.45), rgba(79,209,165,0.45), transparent)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(79,209,165,0.45), rgba(110,107,244,0.45), transparent)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 100% at 50% 50%, rgba(110,107,244,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div ref={statsRef} style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.6rem, 3.5vw, 2.25rem)', fontWeight: 800, color: '#e3e2e8', letterSpacing: '-0.02em', textAlign: 'center', marginBottom: '3.5rem' }}>
            By the numbers
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '2rem' }}>
            {[
              { value: 34, label: 'Algorithms', suffix: '' },
              { value: 6,  label: 'Categories', suffix: '' },
              { value: 4,  label: 'Languages',  suffix: '' },
              { value: 100,label: 'Free Forever',suffix: '%' },
            ].map(({ value, label, suffix }) => (
              <motion.div key={label} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                <StatCounter value={value} label={label} suffix={suffix} inView={statsInView} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA + FOOTER ══════════ */}
      <section style={{ padding: '7rem 1.5rem 5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, rgba(110,107,244,0.05) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '4px 14px', borderRadius: '9999px', border: '1px solid rgba(79,209,165,0.3)', background: 'rgba(79,209,165,0.05)', marginBottom: '1.5rem' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4fd1a5', boxShadow: '0 0 6px #4fd1a5', animation: 'lp-pulse 2s ease-in-out infinite' }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', color: '#4fd1a5', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Ready to learn?</span>
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#e3e2e8', marginBottom: '1.25rem' }}>
              Master every algorithm.<br />
              <span style={{ background: 'linear-gradient(135deg, #6e6bf4, #4fd1a5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Start for free.</span>
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.05rem', color: 'rgba(199,196,215,0.68)', lineHeight: 1.7, maxWidth: 500, margin: '0 auto 2.5rem' }}>
              No signup. No ads. Just pure, interactive algorithm learning — exactly the way it should be.
            </p>
            <motion.div animate={{ boxShadow: ['0 0 28px rgba(110,107,244,0.28)', '0 0 50px rgba(110,107,244,0.58)', '0 0 28px rgba(110,107,244,0.28)'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} style={{ display: 'inline-block', borderRadius: '9999px' }}>
              <Link to="/dashboard"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem', padding: '1.1rem 2.8rem', background: 'linear-gradient(135deg, #6e6bf4 0%, #5855e8 50%, #4fd1a5 100%)', color: '#fff', borderRadius: '9999px', fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.05rem', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.01em', transition: 'transform 0.25s ease' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.15rem' }}>rocket_launch</span>
                Launch Dashboard
              </Link>
            </motion.div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => (
                <Link key={cat.id} to={cat.path}
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', color: 'rgba(199,196,215,0.42)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#e3e2e8')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(199,196,215,0.42)')}>
                  {cat.name}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      <style>{`
        @keyframes lp-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px #4fd1a5; }
          50%       { opacity: 0.55; box-shadow: 0 0 14px #4fd1a5; }
        }
      `}</style>
    </div>
  );
}
