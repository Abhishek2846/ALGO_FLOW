import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { CATEGORIES, ALGORITHMS } from '../../data/algorithms';
import { soundFX } from '../../utils/soundEffects';

interface TopNavProps {
  onMenuClick?: () => void;
}

export default function TopNav({ onMenuClick }: TopNavProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [cmdMode, setCmdMode] = useState(false);
  const [soundOn, setSoundOn] = useState(soundFX.isEnabled());
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  // Live system clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Keyboard shortcut listener (Cmd+K or /)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k') || (e.metaKey && e.key === 'k')) && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
        setSearchOpen(true);
        setCmdMode(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setCmdMode(false);
        setQuery('');
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const q = query.trim().toLowerCase();
  const matchedAlgorithms = q
    ? ALGORITHMS.filter(
        a =>
          a.name.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      ).slice(0, 8)
    : [];
  const matchedCategories = q
    ? CATEGORIES.filter(c => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const hasResults = matchedAlgorithms.length > 0 || matchedCategories.length > 0;

  const handleSelect = (path: string) => {
    setQuery('');
    setSearchOpen(false);
    setCmdMode(false);
    navigate(path);
  };

  const handleRandomAlgorithm = () => {
    const randomAlgo = ALGORITHMS[Math.floor(Math.random() * ALGORITHMS.length)];
    navigate(randomAlgo.path);
  };

  const breadcrumbs = location.pathname
    .split('/')
    .filter(Boolean)
    .map(s => s.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));

  return (
    <>
      {/* Search overlay backdrop */}
      <AnimatePresence>
        {cmdMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setSearchOpen(false);
              setCmdMode(false);
              setQuery('');
            }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(5, 6, 10, 0.75)',
              backdropFilter: 'blur(8px)',
              zIndex: 'calc(var(--z-topnav) - 1)' as any,
            }}
          />
        )}
      </AnimatePresence>

      <motion.nav
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 'var(--z-topnav)',
          height: 'var(--topnav-height)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 clamp(0.5rem, 2vw, 1.25rem)',
          gap: 'clamp(0.4rem, 1.5vw, 1rem)',
          background: 'rgba(10, 11, 16, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Top luminous accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(110, 107, 244, 0.6) 20%, rgba(79, 209, 165, 0.6) 60%, rgba(242, 184, 75, 0.5) 85%, transparent 100%)',
          }}
        />

        {/* Mobile & Tablet menu trigger (< 1024px) */}
        <button
          onClick={onMenuClick}
          className="d-lg-none"
          aria-label="Open Navigation Menu"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--on-surface)',
            cursor: 'pointer',
            padding: '0.4rem',
            width: 36,
            height: 36,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>menu</span>
        </button>

        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexShrink: 0,
          }}
        >
          <motion.div
            whileHover={{ scale: 1.08, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            style={{
              width: 30,
              height: 30,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6e6bf4 0%, #4fd1a5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(110, 107, 244, 0.55)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#fff' }}>
              hub
            </span>
          </motion.div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: '0.98rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: '#fff',
              }}
            >
              ALGO<span style={{ color: 'var(--primary)' }}>_FLOW</span>
            </span>
            <span
              className="d-none d-sm-inline"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                color: 'var(--neon-mint)',
                background: 'rgba(79, 209, 165, 0.1)',
                border: '1px solid rgba(79, 209, 165, 0.25)',
                borderRadius: '4px',
                padding: '1px 5px',
                fontWeight: 700,
                letterSpacing: '0.04em',
              }}
            >
              v2.4
            </span>
          </div>
        </Link>

        {/* Live Breadcrumb / Active Telemetry Path (Desktop) */}
        <div
          className="d-none d-lg-flex"
          style={{
            alignItems: 'center',
            gap: '0.4rem',
            marginLeft: '0.5rem',
            padding: '3px 10px',
            borderRadius: '6px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            maxWidth: '350px',
            overflow: 'hidden',
          }}
        >
          <span style={{ color: 'var(--neon-mint)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>~/</span>
          {breadcrumbs.length === 0 ? (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>
              landing
            </span>
          ) : (
            breadcrumbs.map((crumb, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {i > 0 && <span style={{ color: 'rgba(255, 255, 255, 0.2)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>/</span>}
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: i === breadcrumbs.length - 1 ? 'var(--primary)' : 'rgba(255, 255, 255, 0.45)',
                    whiteSpace: 'nowrap',
                    fontWeight: i === breadcrumbs.length - 1 ? 600 : 400,
                  }}
                >
                  {crumb}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* ── Futuristic Spotlight Command Search ── */}
        <div style={{ position: 'relative', flexShrink: 1, minWidth: 0 }}>
          <motion.div
            animate={cmdMode ? { scale: 1.01 } : { scale: 1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: cmdMode ? 'rgba(110, 107, 244, 0.12)' : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${cmdMode ? 'rgba(110, 107, 244, 0.5)' : 'rgba(255, 255, 255, 0.09)'}`,
              borderRadius: 'var(--radius-full)',
              padding: '0.3rem 0.65rem',
              cursor: 'text',
              width: cmdMode ? 'clamp(200px, 40vw, 420px)' : 'clamp(110px, 18vw, 240px)',
              transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s, background 0.2s',
              boxShadow: cmdMode ? '0 0 20px rgba(110, 107, 244, 0.25)' : 'none',
            }}
            onClick={() => {
              inputRef.current?.focus();
              setCmdMode(true);
              setSearchOpen(true);
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: '1rem',
                color: cmdMode ? 'var(--primary)' : 'rgba(255, 255, 255, 0.35)',
                transition: 'color 0.2s',
                flexShrink: 0,
              }}
            >
              {cmdMode ? 'manage_search' : 'search'}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => {
                setSearchOpen(true);
                setCmdMode(true);
              }}
              onBlur={() =>
                setTimeout(() => {
                  setSearchOpen(false);
                  if (!query) setCmdMode(false);
                }, 180)
              }
              placeholder={cmdMode ? 'Search 34 algorithms, topics...' : 'Search algorithms...'}
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                flex: 1,
                minWidth: 0,
              }}
            />
            {!cmdMode ? (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  color: 'rgba(255, 255, 255, 0.35)',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                ⌘K
              </span>
            ) : query ? (
              <button
                onClick={e => {
                  e.stopPropagation();
                  setQuery('');
                  inputRef.current?.focus();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(255, 255, 255, 0.5)',
                  padding: 0,
                  display: 'flex',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
              </button>
            ) : null}
          </motion.div>

          {/* Results Dropdown Floating Window */}
          <AnimatePresence>
            {searchOpen && hasResults && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  width: 'clamp(320px, 85vw, 440px)',
                  maxHeight: 420,
                  overflowY: 'auto',
                  background: 'rgba(13, 15, 22, 0.96)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(110, 107, 244, 0.35)',
                  borderRadius: '14px',
                  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 20px rgba(110, 107, 244, 0.15)',
                  zIndex: 500,
                  padding: '0.5rem',
                }}
              >
                {matchedCategories.length > 0 && (
                  <div style={{ marginBottom: '0.5rem' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255, 255, 255, 0.35)', textTransform: 'uppercase', letterSpacing: '0.14em', padding: '4px 8px' }}>
                      Categories
                    </div>
                    {matchedCategories.map(c => (
                      <div
                        key={c.id}
                        onMouseDown={() => handleSelect(c.path)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLDivElement;
                          el.style.background = 'rgba(110, 107, 244, 0.15)';
                          el.style.transform = 'translateX(3px)';
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLDivElement;
                          el.style.background = 'transparent';
                          el.style.transform = 'translateX(0)';
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', color: c.accentColor }}>
                          {c.iconSymbol}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: 'var(--font-headline)', fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                            {c.name}
                          </div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.4)' }}>
                            {c.count} Algorithms Visualized
                          </div>
                        </div>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.3)' }}>
                          arrow_forward
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {matchedAlgorithms.length > 0 && (
                  <div>
                    {matchedCategories.length > 0 && (
                      <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.07)', margin: '0.35rem 0' }} />
                    )}
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255, 255, 255, 0.35)', textTransform: 'uppercase', letterSpacing: '0.14em', padding: '4px 8px' }}>
                      Algorithms ({matchedAlgorithms.length})
                    </div>
                    {matchedAlgorithms.map((algo, i) => (
                      <motion.div
                        key={algo.id}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.025 }}
                        onMouseDown={() => handleSelect(algo.path)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLDivElement;
                          el.style.background = 'rgba(79, 209, 165, 0.12)';
                          el.style.transform = 'translateX(3px)';
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLDivElement;
                          el.style.background = 'transparent';
                          el.style.transform = 'translateX(0)';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '1.05rem', color: 'var(--neon-mint)' }}>
                            functions
                          </span>
                          <div>
                            <div style={{ fontFamily: 'var(--font-headline)', fontSize: '0.84rem', fontWeight: 600, color: '#fff' }}>
                              {algo.name}
                            </div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.4)' }}>
                              Time: {algo.complexity.time}
                            </div>
                          </div>
                        </div>

                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.62rem',
                            color: 'var(--amber-glow)',
                            background: 'rgba(242, 184, 75, 0.1)',
                            border: '1px solid rgba(242, 184, 75, 0.25)',
                            padding: '2px 7px',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                          }}
                        >
                          {algo.category}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Quick Tools Strip ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {/* Race Mode / VS Button */}
          <Link
            to="/compare"
            title="Launch Side-by-Side Algorithm Race Arena"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.85rem',
              background: 'linear-gradient(135deg, rgba(110, 107, 244, 0.2) 0%, rgba(88, 85, 232, 0.15) 100%)',
              border: '1px solid rgba(110, 107, 244, 0.45)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textDecoration: 'none',
              boxShadow: '0 0 14px rgba(110, 107, 244, 0.25)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = 'translateY(-1px) scale(1.03)';
              el.style.boxShadow = '0 0 22px rgba(110, 107, 244, 0.6)';
              el.style.background = 'linear-gradient(135deg, rgba(110, 107, 244, 0.35) 0%, rgba(88, 85, 232, 0.25) 100%)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = 'translateY(0) scale(1)';
              el.style.boxShadow = '0 0 14px rgba(110, 107, 244, 0.25)';
              el.style.background = 'linear-gradient(135deg, rgba(110, 107, 244, 0.2) 0%, rgba(88, 85, 232, 0.15) 100%)';
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: '#c084fc' }}>compare_arrows</span>
            <span className="d-none d-sm-inline">VS ARENA</span>
          </Link>

          {/* Random Algo Quick Shuffle */}
          <button
            onClick={handleRandomAlgorithm}
            title="Jump to a Random Algorithm Visualizer"
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--on-surface-variant)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.color = 'var(--neon-mint)';
              btn.style.borderColor = 'rgba(79, 209, 165, 0.4)';
              btn.style.background = 'rgba(79, 209, 165, 0.1)';
              btn.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={e => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.color = 'var(--on-surface-variant)';
              btn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              btn.style.background = 'rgba(255, 255, 255, 0.04)';
              btn.style.transform = 'scale(1)';
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>shuffle</span>
          </button>

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={() => setSoundOn(soundFX.toggle())}
            title={soundOn ? 'Web Audio FX Active (Click to mute)' : 'Web Audio Muted (Click to enable)'}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: soundOn ? 'rgba(79, 209, 165, 0.12)' : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${soundOn ? 'rgba(79, 209, 165, 0.45)' : 'rgba(255, 255, 255, 0.1)'}`,
              color: soundOn ? 'var(--neon-mint)' : 'rgba(255, 255, 255, 0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              boxShadow: soundOn ? '0 0 12px rgba(79, 209, 165, 0.35)' : 'none',
            }}
            onMouseEnter={e => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={e => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.transform = 'scale(1)';
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '1.05rem' }}>
              {soundOn ? 'volume_up' : 'volume_off'}
            </span>
          </button>

          {/* Live Telemetry Clock (Desktop) */}
          <div
            className="d-none d-lg-flex"
            style={{
              flexDirection: 'column',
              alignItems: 'flex-end',
              paddingLeft: '0.4rem',
              borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#fff', letterSpacing: '0.06em', fontWeight: 600 }}>
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255, 255, 255, 0.35)' }}>
              UTC{time.getTimezoneOffset() <= 0 ? '+' : '-'}{Math.abs(time.getTimezoneOffset() / 60)}
            </span>
          </div>
        </div>
      </motion.nav>
    </>
  );
}
