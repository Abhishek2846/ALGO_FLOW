import type { GraphNodeData, GraphEdgeData, GraphNodeState, GraphEdgeState } from '../../types';

interface GraphCanvasProps {
  nodes: Record<string, GraphNodeData>;
  edges: GraphEdgeData[];
  queueOrStack?: string[];
  visitedList?: string[];
  distances?: Record<string, number | string>;
  description: string;
}

const NODE_R = 22;

const NODE_FILL: Record<GraphNodeState, string> = {
  default:       'rgba(26,27,36,0.95)',
  visiting:      'rgba(242,184,75,0.25)',
  visited:       'rgba(79,209,165,0.25)',
  queued:        'rgba(110,107,244,0.25)',
  current:       'rgba(242,184,75,0.3)',
  target:        'rgba(239,100,97,0.3)',
  mst:           'rgba(79,209,165,0.3)',
  'shortest-path': 'rgba(110,107,244,0.35)',
};

const NODE_STROKE: Record<GraphNodeState, string> = {
  default:       'rgba(255,255,255,0.15)',
  visiting:      'var(--amber-glow)',
  visited:       'var(--neon-mint)',
  queued:        'var(--electric-violet)',
  current:       'var(--amber-glow)',
  target:        'var(--crimson-spark)',
  mst:           'var(--neon-mint)',
  'shortest-path': 'var(--electric-violet)',
};

const EDGE_COLOR: Record<GraphEdgeState, string> = {
  default:       'rgba(255,255,255,0.18)',
  visiting:      'var(--amber-glow)',
  visited:       'rgba(194,193,255,0.4)',
  mst:           'var(--neon-mint)',
  'shortest-path': 'var(--electric-violet)',
  rejected:      'rgba(239,100,97,0.3)',
};

export default function GraphCanvas({
  nodes,
  edges,
  queueOrStack,
  visitedList,
  distances,
  description,
}: GraphCanvasProps) {
  const width = 600;
  const height = 240;

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
        {description || 'Interactive Graph Visualization'}
      </div>

      {/* SVG Canvas */}
      <div style={{
        overflowX: 'auto',
        background: 'rgba(11,12,16,0.7)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--ink-800)',
      }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          style={{ display: 'block', minWidth: '100%' }}
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="26"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--electric-violet)" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map((e, idx) => {
            const from = nodes[e.from];
            const to = nodes[e.to];
            if (!from || !to) return null;

            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            const color = EDGE_COLOR[e.state];
            const isHighlight = e.state !== 'default';

            return (
              <g key={`edge-${idx}`}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={color}
                  strokeWidth={isHighlight ? 2.5 : 1.5}
                  strokeDasharray={e.state === 'rejected' ? '4,4' : undefined}
                  markerEnd={e.directed ? 'url(#arrow)' : undefined}
                  style={{ transition: 'stroke 0.2s ease, stroke-width 0.2s ease' }}
                />
                {/* Weight badge */}
                {e.weight !== undefined && (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x="-11"
                      y="-9"
                      width="22"
                      height="16"
                      rx="3"
                      fill="var(--surface-container-lowest)"
                      stroke={color}
                      strokeWidth="1"
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="var(--on-surface-variant)"
                      style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 600 }}
                    >
                      {e.weight}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {Object.values(nodes).map((n) => {
            const state = n.state;
            const isSpecial = state !== 'default';

            return (
              <g key={n.id} transform={`translate(${n.x},${n.y})`}>
                {/* Glow ring */}
                {isSpecial && (
                  <circle
                    r={NODE_R + 5}
                    fill="none"
                    stroke={NODE_STROKE[state]}
                    strokeWidth={1}
                    strokeOpacity={0.4}
                  />
                )}
                {/* Main Node Circle */}
                <circle
                  r={NODE_R}
                  fill={NODE_FILL[state]}
                  stroke={NODE_STROKE[state]}
                  strokeWidth={isSpecial ? 2.2 : 1.2}
                />
                {/* Label */}
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isSpecial ? NODE_STROKE[state] : 'var(--on-surface)'}
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Auxiliary State (Queue/Stack/Visited/Distances) */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {queueOrStack && (
          <div className="glass-panel" style={{ padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>Front:</span>
            {queueOrStack.length === 0 ? (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--outline)' }}>[ empty ]</span>
            ) : (
              <div style={{ display: 'flex', gap: 4 }}>
                {queueOrStack.map((item, i) => (
                  <span key={i} style={{ padding: '1px 6px', background: 'rgba(110,107,244,0.15)', border: '1px solid var(--electric-violet)', borderRadius: 3, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--primary)' }}>
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {visitedList && visitedList.length > 0 && (
          <div className="glass-panel" style={{ padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>Visited:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--neon-mint)' }}>
              {visitedList.join(' ➔ ')}
            </span>
          </div>
        )}

        {distances && (
          <div className="glass-panel" style={{ padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>Distances:</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {Object.entries(distances).map(([id, d]) => (
                <span key={id} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: d === '∞' ? 'var(--outline)' : 'var(--amber-glow)' }}>
                  {id}:{d}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
