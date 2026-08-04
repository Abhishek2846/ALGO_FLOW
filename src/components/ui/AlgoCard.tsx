import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { AlgorithmMeta } from '../../types';
import DifficultyBadge from './DifficultyBadge';
import SparklineBar from './SparklineBar';

interface AlgoCardProps {
  algo: AlgorithmMeta;
  index: number;
}

export default function AlgoCard({ algo, index }: AlgoCardProps) {
  const ACCENT = algo.accentColor || '#ef6461';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <Link to={algo.path} style={{ textDecoration: 'none' }}>
        <div
          className="glass-panel"
          style={{
            borderRadius: '0.75rem',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            cursor: 'pointer',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            background: 'rgba(15, 23, 42, 0.5)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.borderColor = `${ACCENT}66`;
            e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.5), 0 0 20px ${ACCENT}22`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
          }}
        >
          {/* Card Header */}
          <div
            style={{
              padding: '1.25rem 1.25rem 0.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '0.5rem',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#f8fafc',
                lineHeight: 1.3,
                margin: 0,
              }}
            >
              {algo.name}
            </h3>
            <DifficultyBadge difficulty={algo.difficulty} />
          </div>

          {/* Card Body */}
          <div style={{ padding: '0.5rem 1.25rem 1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                color: '#94a3b8',
                marginBottom: '0.75rem',
                flex: 1,
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {algo.description}
            </p>

            {/* Sparkline */}
            <div style={{ marginBottom: '0.75rem' }}>
              <SparklineBar heights={algo.sparkline} accentColor={ACCENT} />
            </div>

            {/* Complexity chips */}
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: '#f2b84b',
                  background: 'rgba(242, 184, 75, 0.08)',
                  border: '1px solid rgba(242, 184, 75, 0.2)',
                  borderRadius: '0.4rem',
                  padding: '2px 8px',
                }}
              >
                Time: {algo.complexity.time}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: '#38bdf8',
                  background: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: '0.4rem',
                  padding: '2px 8px',
                }}
              >
                Space: {algo.complexity.space}
              </span>
            </div>

            {/* Action button */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                padding: '0.55rem',
                background: `${ACCENT}15`,
                border: `1px solid ${ACCENT}44`,
                borderRadius: '0.4rem',
                color: ACCENT,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                transition: 'all 0.2s ease',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>play_arrow</span>
              Launch Simulation
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
