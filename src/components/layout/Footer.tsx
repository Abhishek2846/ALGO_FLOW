import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [activeModal, setActiveModal] = useState<'about' | 'contact' | null>(null);

  return (
    <>
      <footer
        style={{
          width: '100%',
          marginTop: 'auto',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          background: 'rgba(9, 10, 15, 0.85)',
          backdropFilter: 'blur(16px)',
          padding: '1.75rem var(--gutter)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem',
          }}
        >
          {/* Brand & Tagline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <Link
              to="/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #6e6bf4 0%, #4fd1a5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#fff' }}>
                  hub
                </span>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: '#fff',
                  letterSpacing: '-0.02em',
                }}
              >
                ALGO<span style={{ color: 'var(--primary)' }}>_FLOW</span>
              </span>
            </Link>

            <span style={{ color: 'rgba(255, 255, 255, 0.15)', fontSize: '0.9rem' }}>|</span>

            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--on-surface-variant)',
              }}
            >
              © {new Date().getFullYear()} Algo Flow. All rights reserved.
            </span>
          </div>

          {/* Minimal Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveModal('about')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                fontFamily: 'var(--font-body)',
                fontSize: '0.82rem',
                color: 'var(--on-surface-variant)',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#fff')}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--on-surface-variant)')}
            >
              About Us
            </button>

            <button
              onClick={() => setActiveModal('contact')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                fontFamily: 'var(--font-body)',
                fontSize: '0.82rem',
                color: 'var(--on-surface-variant)',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#fff')}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--on-surface-variant)')}
            >
              Contact Us
            </button>

            <a
              href="https://github.com/Abhishek2846"
              target="_blank"
              rel="noreferrer"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.82rem',
                color: 'var(--on-surface-variant)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#fff')}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--on-surface-variant)')}
            >
              GitHub
              <span className="material-symbols-outlined" style={{ fontSize: '12px', opacity: 0.7 }}>
                north_east
              </span>
            </a>

            <Link
              to="/dashboard"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.82rem',
                color: 'var(--on-surface-variant)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#fff')}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--on-surface-variant)')}
            >
              Dashboard
            </Link>
          </div>
        </div>
      </footer>

      {/* ── Minimal Clean Modal for About Us / Contact Us ── */}
      {activeModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setActiveModal(null)}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: 480,
              width: '100%',
              borderRadius: '1.25rem',
              padding: '2rem',
              background: 'rgba(15, 17, 24, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModal(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--on-surface-variant)',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.color = '#fff';
                btn.style.background = 'rgba(255, 255, 255, 0.12)';
              }}
              onMouseLeave={e => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.color = 'var(--on-surface-variant)';
                btn.style.background = 'rgba(255, 255, 255, 0.06)';
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
            </button>

            {activeModal === 'about' ? (
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>info</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>
                    About Algo Flow
                  </span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0 0 1rem' }}>
                  Visualizing Code. Simplifying DSA.
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--on-surface-variant)', lineHeight: 1.6, margin: '0 0 1rem' }}>
                  Algo Flow is an open-source, interactive algorithm visualizer designed to help students, engineers, and educators understand complex data structures and algorithms intuitively.
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--on-surface-variant)', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
                  Featuring multi-language code switchers (Python, C++, Java, JS), real-time step execution, audio synthesizers, and head-to-head race comparisons.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <a
                    href="https://github.com/Abhishek2846"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '0.65rem 1.25rem',
                      background: 'var(--primary)',
                      color: '#fff',
                      borderRadius: 'var(--radius-full)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>code</span>
                    View on GitHub
                  </a>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', color: 'var(--neon-mint)' }}>mail</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--neon-mint)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>
                    Contact & Feedback
                  </span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0 0 1rem' }}>
                  Get in Touch
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--on-surface-variant)', lineHeight: 1.6, margin: '0 0 1.25rem' }}>
                  Have questions, feature requests, or algorithm suggestions? We would love to hear from you!
                </p>
                <div
                  style={{
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--neon-mint)' }}>person</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.86rem', color: '#fff' }}>Abhishek</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--primary)' }}>link</span>
                    <a
                      href="https://github.com/Abhishek2846"
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none' }}
                    >
                      github.com/Abhishek2846
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#fff',
                    borderRadius: 'var(--radius-full)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
