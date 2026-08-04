import type { DPCellData, DPCellState } from '../../types';

interface DPCanvasProps {
  table: DPCellData[][];
  rowLabels: string[];
  colLabels: string[];
  activeCell?: { r: number; c: number };
  description: string;
}

const CELL_BG: Record<DPCellState, string> = {
  default:    'rgba(26,27,36,0.6)',
  computing:  'rgba(242,184,75,0.25)',
  dependency: 'rgba(110,107,244,0.25)',
  filled:     'rgba(79,209,165,0.12)',
  optimal:    'rgba(79,209,165,0.3)',
};

const CELL_BORDER: Record<DPCellState, string> = {
  default:    'rgba(255,255,255,0.06)',
  computing:  'var(--amber-glow)',
  dependency: 'var(--electric-violet)',
  filled:     'rgba(79,209,165,0.4)',
  optimal:    'var(--neon-mint)',
};

const CELL_TEXT: Record<DPCellState, string> = {
  default:    'var(--on-surface-variant)',
  computing:  'var(--amber-glow)',
  dependency: 'var(--primary)',
  filled:     'var(--neon-mint)',
  optimal:    '#fff',
};

export default function DPCanvas({
  table,
  rowLabels,
  colLabels,
  activeCell,
  description,
}: DPCanvasProps) {
  if (table.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Description banner */}
      <div style={{
        padding: '0.5rem 1rem',
        background: 'rgba(110,107,244,0.08)',
        border: '1px solid var(--outline-variant)',
        borderRadius: 'var(--radius-sm)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-data-xs)',
        color: 'var(--on-surface-variant)',
        minHeight: 34,
        display: 'flex',
        alignItems: 'center',
      }}>
        {description || 'Dynamic Programming Table Visualization'}
      </div>

      {/* Grid container */}
      <div style={{
        overflowX: 'auto',
        background: 'rgba(11,12,16,0.7)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--ink-800)',
        padding: '1rem',
      }}>
        <table style={{ borderCollapse: 'separate', borderSpacing: 4, width: '100%' }}>
          <thead>
            <tr>
              <th style={{ padding: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--on-surface-variant)', minWidth: 60 }} />
              {colLabels.map((col, cIdx) => (
                <th
                  key={cIdx}
                  style={{
                    padding: '0.4rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: activeCell?.c === cIdx ? 'var(--amber-glow)' : 'var(--on-surface-variant)',
                    textAlign: 'center',
                    minWidth: 44,
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((row, rIdx) => (
              <tr key={rIdx}>
                {/* Row label */}
                <td
                  style={{
                    padding: '0.4rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: activeCell?.r === rIdx ? 'var(--amber-glow)' : 'var(--on-surface-variant)',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {rowLabels[rIdx] || `[${rIdx}]`}
                </td>

                {/* Cells */}
                {row.map((cell, cIdx) => {
                  const state = cell.state;
                  const isActive = activeCell?.r === rIdx && activeCell?.c === cIdx;
                  const bg = CELL_BG[state];
                  const border = CELL_BORDER[state];
                  const textClr = CELL_TEXT[state];

                  return (
                    <td
                      key={cIdx}
                      style={{
                        background: bg,
                        border: `1.5px solid ${isActive ? 'var(--amber-glow)' : border}`,
                        borderRadius: 4,
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        padding: '0.5rem 0.25rem',
                        boxShadow: isActive ? '0 0 10px rgba(242,184,75,0.4)' : state === 'optimal' ? '0 0 8px rgba(79,209,165,0.3)' : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 13,
                          fontWeight: 700,
                          color: textClr,
                        }}>
                          {cell.value === null ? '—' : String(cell.value)}
                        </span>
                        {cell.subtext && (
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--outline)' }}>
                            {cell.subtext}
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {[
          { color: 'var(--amber-glow)', label: 'Computing Cell' },
          { color: 'var(--electric-violet)', label: 'Dependency Cell' },
          { color: 'var(--neon-mint)', label: 'Filled / Optimal Solution' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--on-surface-variant)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
