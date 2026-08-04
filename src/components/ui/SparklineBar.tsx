interface SparklineBarProps {
  heights: number[];     // values 0–100
  accentColor?: string;
}

const BAR_COLORS = {
  default: 'var(--ink-700)',
  active: 'var(--electric-violet)',
  sorted: 'var(--neon-mint)',
  pivot: 'var(--crimson-spark)',
};

export default function SparklineBar({ heights, accentColor }: SparklineBarProps) {
  return (
    <div
      style={{
        height: 56,
        display: 'flex',
        alignItems: 'flex-end',
        gap: 2,
        background: 'rgba(13, 14, 18, 0.6)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--outline-variant)',
        padding: '6px 8px',
        overflow: 'hidden',
      }}
    >
      {heights.map((h, i) => {
        let color = BAR_COLORS.default;
        if (i === Math.floor(heights.length / 2)) color = accentColor || BAR_COLORS.active;
        if (h > 80) color = 'var(--neon-mint)';
        return (
          <div
            key={i}
            className="viz-bar"
            style={{
              flex: 1,
              height: `${h}%`,
              background: color,
              borderRadius: '2px 2px 0 0',
              minHeight: 3,
              transition: 'height 0.3s ease',
            }}
          />
        );
      })}
    </div>
  );
}
