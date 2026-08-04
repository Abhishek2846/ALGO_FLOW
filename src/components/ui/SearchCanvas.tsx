import type { SearchBar, SearchBarState, SearchPointers } from '../../types';

interface SearchCanvasProps {
  bars: SearchBar[];
  pointers: SearchPointers;
  foundIndex: number;
  comparisons: number;
  description: string;
}

const STATE_COLOR: Record<SearchBarState, string> = {
  default:    'var(--ink-700)',
  comparing:  'var(--amber-glow)',
  found:      'var(--neon-mint)',
  eliminated: 'rgba(255,255,255,0.08)',
  'in-range': 'rgba(110,107,244,0.35)',
  'jump-block': 'rgba(110,107,244,0.5)',
  low:        '#4ca3ff',
  high:       'var(--crimson-spark)',
  mid:        'var(--amber-glow)',
  pos:        'var(--electric-violet)',
};

const STATE_TEXT: Record<SearchBarState, string> = {
  default:    'var(--on-surface-variant)',
  comparing:  '#1a1a1a',
  found:      '#0a0a0a',
  eliminated: 'rgba(255,255,255,0.2)',
  'in-range': 'var(--primary)',
  'jump-block': '#fff',
  low:        '#fff',
  high:       '#fff',
  mid:        '#1a1a1a',
  pos:        '#fff',
};

const POINTER_LABELS: Partial<Record<keyof SearchPointers, { label: string; color: string }>> = {
  low:       { label: 'lo', color: '#4ca3ff' },
  high:      { label: 'hi', color: 'var(--crimson-spark)' },
  mid:       { label: 'mid', color: 'var(--amber-glow)' },
  pos:       { label: 'pos', color: 'var(--electric-violet)' },
  current:   { label: '→', color: 'var(--amber-glow)' },
  jumpPos:   { label: 'jump', color: 'var(--electric-violet)' },
  blockStart:{ label: '[', color: 'var(--neon-mint)' },
  blockEnd:  { label: ']', color: 'var(--neon-mint)' },
};

export default function SearchCanvas({ bars, pointers, foundIndex, comparisons, description }: SearchCanvasProps) {
  const n = bars.length;
  // Font size scales down as array grows — never disappears
  const valueFontSize = Math.max(7, Math.min(13, Math.floor(180 / n)));
  const showIndices = n <= 28;

  // Build per-index pointer labels
  const pointerAbove: Record<number, { label: string; color: string }[]> = {};
  for (const [key, idxVal] of Object.entries(pointers)) {
    if (idxVal === undefined || idxVal === null) continue;
    const idx = idxVal as number;
    const pMeta = POINTER_LABELS[key as keyof SearchPointers];
    if (!pMeta) continue;
    if (!pointerAbove[idx]) pointerAbove[idx] = [];
    pointerAbove[idx].push(pMeta);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {/* Description banner */}
      <div style={{
        padding: '0.5rem 1rem',
        background: 'rgba(110,107,244,0.08)',
        border: '1px solid var(--outline-variant)',
        borderRadius: 'var(--radius-sm)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-data-xs)',
        color: foundIndex >= 0 ? 'var(--neon-mint)' : foundIndex === -2 ? 'var(--crimson-spark)' : 'var(--on-surface-variant)',
        minHeight: 32,
      }}>
        {description || 'Press Play or Step to start visualization'}
      </div>

      {/* Pointer labels row (above bars) */}
      <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 28 }}>
        {bars.map((_, i) => {
          const labels = pointerAbove[i];
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
              {labels?.map((l, li) => (
                <span key={li} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: l.color, lineHeight: 1.1, whiteSpace: 'nowrap' }}>
                  {l.label}
                </span>
              ))}
            </div>
          );
        })}
      </div>

      {/* Bars row */}
      <div
        id="search-canvas"
        style={{
          display: 'flex',
          gap: 2,
          background: 'rgba(11,12,16,0.7)',
          padding: '0.75rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--ink-800)',
        }}
      >
        {bars.map((bar, i) => {
          const bg = STATE_COLOR[bar.state];
          const textClr = STATE_TEXT[bar.state];
          const isActive = bar.state !== 'default' && bar.state !== 'eliminated';
          return (
            <div
              key={i}
              style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              {/* Value box */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  background: bg,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: isActive ? `1.5px solid ${bg}` : '1.5px solid rgba(255,255,255,0.06)',
                  boxShadow: isActive ? `0 0 8px ${bg}50` : 'none',
                  transition: 'background 0.2s ease, box-shadow 0.2s ease',
                  overflow: 'hidden',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: valueFontSize,
                  fontWeight: 600,
                  color: textClr,
                  lineHeight: 1,
                  transition: 'color 0.2s ease',
                  userSelect: 'none',
                }}>
                  {bar.value}
                </span>
              </div>
              {/* Index label */}
              {showIndices && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>
                  {i}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '0.4rem 0' }}>
        <div className="stat-chip">
          <span className="stat-chip__label">Comparisons</span>
          <span className="stat-chip__value" style={{ color: 'var(--primary)' }}>{comparisons}</span>
        </div>
        <div style={{ width: 1, height: 24, background: 'var(--outline-variant)' }} />
        <div className="stat-chip">
          <span className="stat-chip__label">Result</span>
          <span className="stat-chip__value" style={{ color: foundIndex >= 0 ? 'var(--neon-mint)' : foundIndex === -2 ? 'var(--crimson-spark)' : 'var(--on-surface-variant)' }}>
            {foundIndex >= 0 ? `Found @ [${foundIndex}]` : foundIndex === -2 ? 'Not Found' : '—'}
          </span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {Object.entries(STATE_COLOR)
            .filter(([k]) => ['comparing', 'found', 'eliminated', 'in-range', 'mid'].includes(k))
            .map(([state, color]) => (
              <div key={state} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: color, border: '1px solid rgba(255,255,255,0.1)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--on-surface-variant)' }}>
                  {state === 'in-range' ? 'active range' : state}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
