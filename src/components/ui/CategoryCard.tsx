import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { CategoryMeta } from '../../types';

interface CategoryCardProps {
  category: CategoryMeta;
  index: number;
}

export default function CategoryCard({ category, index }: CategoryCardProps) {
  const accent = category.accentColor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -6 }}
    >
      <Link to={category.path} style={{ textDecoration: 'none' }}>
        <div
          className="glass-panel"
          style={{
            padding: '2rem',
            borderRadius: '0.75rem',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            background: 'rgba(15, 23, 42, 0.5)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            transition: 'all 0.25s ease',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.borderColor = `${accent}66`;
            el.style.boxShadow = `0 12px 40px rgba(0,0,0,0.5), 0 0 20px ${accent}22`;
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.borderColor = 'rgba(255, 255, 255, 0.07)';
            el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
          }}
        >
          {/* Background watermark icon */}
          <div
            style={{
              position: 'absolute',
              right: -10,
              top: -10,
              fontSize: 130,
              color: `${accent}0c`,
              pointerEvents: 'none',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }}>
              {category.iconSymbol}
            </span>
          </div>

          {/* Icon chip */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '0.5rem',
              background: `${accent}1a`,
              border: `1px solid ${accent}44`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: accent,
              marginBottom: '1.25rem',
              boxShadow: `0 0 12px ${accent}33`,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '1.4rem' }}>{category.iconSymbol}</span>
          </div>

          {/* Text */}
          <h3
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#f8fafc',
              marginBottom: '0.5rem',
            }}
          >
            {category.name}
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              color: '#94a3b8',
              lineHeight: 1.5,
              marginBottom: '1.5rem',
              flex: 1,
            }}
          >
            {category.description}
          </p>

          {/* Footer row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: accent,
                background: `${accent}18`,
                border: `1px solid ${accent}33`,
                borderRadius: '0.4rem',
                padding: '3px 10px',
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}
            >
              {category.count} ALGORITHMS
            </span>
            <span
              className="material-symbols-outlined"
              style={{ color: accent, fontSize: '1.1rem' }}
            >
              arrow_forward
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
