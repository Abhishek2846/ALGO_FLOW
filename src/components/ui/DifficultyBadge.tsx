import type { Difficulty } from '../../types';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

const CONFIG: Record<Difficulty, { color: string; bg: string; border: string; glow: string }> = {
  Easy: {
    color: '#4fd1a5',
    bg: 'rgba(79, 209, 165, 0.12)',
    border: 'rgba(79, 209, 165, 0.3)',
    glow: '0 0 8px rgba(79, 209, 165, 0.25)',
  },
  Medium: {
    color: '#f2b84b',
    bg: 'rgba(242, 184, 75, 0.12)',
    border: 'rgba(242, 184, 75, 0.3)',
    glow: '0 0 8px rgba(242, 184, 75, 0.25)',
  },
  Advanced: {
    color: '#ef6461',
    bg: 'rgba(239, 100, 97, 0.12)',
    border: 'rgba(239, 100, 97, 0.3)',
    glow: '0 0 8px rgba(239, 100, 97, 0.25)',
  },
};

export default function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const c = CONFIG[difficulty] || CONFIG.Medium;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3px 10px',
        borderRadius: '0.4rem',
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        boxShadow: c.glow,
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {difficulty}
    </span>
  );
}
