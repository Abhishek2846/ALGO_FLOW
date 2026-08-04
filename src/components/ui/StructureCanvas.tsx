import type { HashEntry, UFElement } from '../../types';

interface StructureCanvasProps {
  type: 'stack' | 'queue' | 'linked-list' | 'hash-table' | 'union-find';
  stack?: { value: number | string; state: 'default' | 'active' | 'push' | 'pop' }[];
  queue?: { value: number | string; state: 'default' | 'active' | 'enqueue' | 'dequeue' }[];
  linkedList?: { value: number | string; id: string; state: 'default' | 'active' | 'inserted' | 'deleted' | 'found' }[];
  hashTable?: HashEntry[][];
  unionFind?: UFElement[];
  description: string;
}

const STATE_BG: Record<string, string> = {
  default:   'var(--surface-container)',
  active:    'rgba(242,184,75,0.25)',
  push:      'rgba(110,107,244,0.3)',
  pop:       'rgba(239,100,97,0.3)',
  enqueue:   'rgba(110,107,244,0.3)',
  dequeue:   'rgba(239,100,97,0.3)',
  inserted:  'rgba(79,209,165,0.3)',
  deleted:   'rgba(239,100,97,0.3)',
  found:     'rgba(79,209,165,0.35)',
  root:      'rgba(110,107,244,0.35)',
  union:     'rgba(79,209,165,0.25)',
};

const STATE_BORDER: Record<string, string> = {
  default:   'var(--outline-variant)',
  active:    'var(--amber-glow)',
  push:      'var(--electric-violet)',
  pop:       'var(--crimson-spark)',
  enqueue:   'var(--electric-violet)',
  dequeue:   'var(--crimson-spark)',
  inserted:  'var(--neon-mint)',
  deleted:   'var(--crimson-spark)',
  found:     'var(--neon-mint)',
  root:      'var(--electric-violet)',
  union:     'var(--neon-mint)',
};

export default function StructureCanvas({
  type,
  stack,
  queue,
  linkedList,
  hashTable,
  unionFind,
  description,
}: StructureCanvasProps) {
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
        {description || 'Data Structure Visualization'}
      </div>

      {/* Canvas Box */}
      <div style={{
        background: 'rgba(11,12,16,0.7)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--ink-800)',
        padding: '1.5rem',
        minHeight: 220,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowX: 'auto',
      }}>
        {/* 1. STACK */}
        {type === 'stack' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 280 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--electric-violet)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              ▲ TOP (Index {stack && stack.length > 0 ? stack.length - 1 : '—'})
            </div>
            <div style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column-reverse',
              gap: 6,
              padding: '0.75rem',
              background: 'var(--surface-container-lowest)',
              border: '2px solid var(--outline-variant)',
              borderTop: 'none',
              borderRadius: '0 0 var(--radius-md) var(--radius-md)',
              minHeight: 160,
            }}>
              {stack && stack.length > 0 ? (
                stack.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.5rem',
                      background: STATE_BG[item.state] || STATE_BG.default,
                      border: `1.5px solid ${STATE_BORDER[item.state] || STATE_BORDER.default}`,
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                      fontWeight: 700,
                      color: item.state !== 'default' ? STATE_BORDER[item.state] : 'var(--on-surface)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span>{item.value}</span>
                    <span style={{ fontSize: 9, opacity: 0.5 }}>[{idx}]</span>
                  </div>
                ))
              ) : (
                <div style={{ margin: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--outline)' }}>
                  [ Stack Empty ]
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. QUEUE */}
        {type === 'queue' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 500, marginBottom: 6, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--neon-mint)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <span>◄ FRONT (Dequeue)</span>
              <span>REAR (Enqueue) ►</span>
            </div>
            <div style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              padding: '1rem',
              background: 'var(--surface-container-lowest)',
              border: '2px solid var(--outline-variant)',
              borderRadius: 'var(--radius-md)',
              minHeight: 80,
              minWidth: 320,
              overflowX: 'auto',
            }}>
              {queue && queue.length > 0 ? (
                queue.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: 52,
                      height: 52,
                      background: STATE_BG[item.state] || STATE_BG.default,
                      border: `1.5px solid ${STATE_BORDER[item.state] || STATE_BORDER.default}`,
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                      fontWeight: 700,
                      color: item.state !== 'default' ? STATE_BORDER[item.state] : 'var(--on-surface)',
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                    }}
                  >
                    <span>{item.value}</span>
                    <span style={{ fontSize: 8, opacity: 0.5 }}>{idx}</span>
                  </div>
                ))
              ) : (
                <div style={{ margin: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--outline)' }}>
                  [ Queue Empty ]
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. LINKED LIST */}
        {type === 'linked-list' && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', overflowX: 'auto', padding: '0.5rem 0' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--electric-violet)', fontWeight: 700 }}>HEAD ➔</span>
            {linkedList && linkedList.length > 0 ? (
              linkedList.map((node, idx) => (
                <div key={node.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    display: 'flex',
                    background: STATE_BG[node.state] || STATE_BG.default,
                    border: `1.5px solid ${STATE_BORDER[node.state] || STATE_BORDER.default}`,
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                  }}>
                    <div style={{ padding: '0.5rem 0.75rem', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--on-surface)' }}>
                      {node.value}
                    </div>
                    <div style={{ padding: '0.5rem 0.4rem', background: 'rgba(255,255,255,0.05)', borderLeft: '1px solid var(--outline-variant)', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--neon-mint)' }}>
                      next
                    </div>
                  </div>
                  {idx < linkedList.length - 1 ? (
                    <span style={{ color: 'var(--electric-violet)', fontFamily: 'var(--font-mono)', fontSize: 14 }}>➔</span>
                  ) : (
                    <span style={{ color: 'var(--outline)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>➔ NULL</span>
                  )}
                </div>
              ))
            ) : (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--outline)' }}>NULL</span>
            )}
          </div>
        )}

        {/* 4. HASH TABLE */}
        {type === 'hash-table' && hashTable && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
            {hashTable.map((bucket, bIdx) => (
              <div key={bIdx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 70, padding: '0.3rem 0.5rem', background: 'var(--surface-container-lowest)',
                  border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--amber-glow)', fontWeight: 600,
                  textAlign: 'center',
                }}>
                  [{bIdx}]
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  {bucket.length === 0 ? (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--outline)' }}>∅ empty</span>
                  ) : (
                    bucket.map((entry, eIdx) => (
                      <div key={eIdx} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{
                          padding: '0.35rem 0.65rem',
                          background: STATE_BG[entry.state || 'default'],
                          border: `1.5px solid ${STATE_BORDER[entry.state || 'default']}`,
                          borderRadius: 'var(--radius-sm)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: 11,
                          fontWeight: 600,
                          color: 'var(--on-surface)',
                        }}>
                          "{entry.key}": <span style={{ color: 'var(--neon-mint)' }}>{entry.value}</span>
                        </div>
                        {eIdx < bucket.length - 1 && <span style={{ color: 'var(--outline)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>➔</span>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. UNION-FIND */}
        {type === 'union-find' && unionFind && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {unionFind.map((el) => (
              <div
                key={el.id}
                style={{
                  padding: '0.6rem 0.85rem',
                  background: STATE_BG[el.state || 'default'],
                  border: `1.5px solid ${STATE_BORDER[el.state || 'default']}`,
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  minWidth: 64,
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>
                  Element {el.id}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--on-surface-variant)' }}>
                  Parent: <strong style={{ color: 'var(--amber-glow)' }}>{el.parent}</strong>
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--outline)' }}>
                  Rank: {el.rank}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
