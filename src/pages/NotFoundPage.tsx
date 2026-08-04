import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <main className="page-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', padding: '4rem 2rem' }}
      >
        <div style={{
          fontFamily: 'var(--font-headline)',
          fontSize: 'clamp(6rem, 15vw, 12rem)',
          fontWeight: 800,
          color: 'var(--electric-violet)',
          lineHeight: 1,
          textShadow: '0 0 60px rgba(110,107,244,0.4)',
          letterSpacing: '-0.05em',
        }}>
          404
        </div>
        <h1 style={{
          fontFamily: 'var(--font-headline)',
          fontSize: 'var(--text-headline-md)',
          color: 'var(--on-surface)',
          margin: '1rem 0 0.75rem',
        }}>
          Algorithm Not Found
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--on-surface-variant)',
          maxWidth: 400,
          margin: '0 auto 2rem',
          lineHeight: 1.6,
        }}>
          Looks like this route doesn't exist in our algorithm library. Let's get you back to the visualizer.
        </p>
        <Link
          to="/"
          style={{
            padding: '0.75rem 2rem',
            background: 'var(--electric-violet)',
            color: '#fff',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-label-mono)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            boxShadow: 'var(--glow-violet)',
          }}
        >
          Return Home
        </Link>
      </motion.div>
    </main>
  );
}
