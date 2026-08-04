import { useMemo } from 'react';
import type { TreeNodeData, TreeNodeState } from '../../types';

interface TreeCanvasProps {
  nodes: Record<number, TreeNodeData>;
  rootId: number | null;
  width?: number;
  height?: number;
}

const NODE_R = 22;
const Y_SPACING = 72;

const NODE_FILL: Record<TreeNodeState, string> = {
  default:    'rgba(26,27,36,0.95)',
  comparing:  'rgba(242,184,75,0.2)',
  found:      'rgba(79,209,165,0.25)',
  inserting:  'rgba(110,107,244,0.25)',
  rotating:   'rgba(255,140,60,0.25)',
  deleted:    'rgba(239,100,97,0.2)',
  path:       'rgba(194,193,255,0.1)',
  new:        'rgba(110,107,244,0.3)',
  swapping:   'rgba(239,100,97,0.25)',
  'not-found': 'rgba(239,100,97,0.2)',
};

const NODE_STROKE: Record<TreeNodeState, string> = {
  default:    'rgba(255,255,255,0.15)',
  comparing:  'var(--amber-glow)',
  found:      'var(--neon-mint)',
  inserting:  'var(--electric-violet)',
  rotating:   '#ff8c3c',
  deleted:    'var(--crimson-spark)',
  path:       'rgba(194,193,255,0.5)',
  new:        'var(--electric-violet)',
  swapping:   'var(--crimson-spark)',
  'not-found': 'var(--crimson-spark)',
};

const NODE_TEXT: Record<TreeNodeState, string> = {
  default:    'var(--on-surface)',
  comparing:  'var(--amber-glow)',
  found:      'var(--neon-mint)',
  inserting:  'var(--primary)',
  rotating:   '#ff8c3c',
  deleted:    'var(--crimson-spark)',
  path:       'var(--on-surface-variant)',
  new:        'var(--primary)',
  swapping:   'var(--crimson-spark)',
  'not-found': 'var(--crimson-spark)',
};

interface NodeLayout {
  id: number;
  x: number;
  y: number;
}

function computeLayout(
  nodes: Record<number, TreeNodeData>,
  rootId: number | null,
): { layout: Record<number, NodeLayout>; width: number; height: number } {
  if (rootId === null) return { layout: {}, width: 400, height: 120 };

  // In-order traversal assigns x indices
  let counter = 0;
  const xIndex: Record<number, number> = {};
  const yDepth: Record<number, number> = {};

  function inOrder(id: number | null, depth: number) {
    if (id === null || !nodes[id]) return;
    inOrder(nodes[id].left, depth + 1);
    xIndex[id] = counter++;
    yDepth[id] = depth;
    inOrder(nodes[id].right, depth + 1);
  }
  inOrder(rootId, 0);

  const total = counter;
  const maxDepth = Math.max(0, ...Object.values(yDepth));
  const xSpacing = Math.max(56, Math.min(90, 700 / Math.max(1, total)));
  const canvasW = Math.max(400, total * xSpacing + 60);
  const canvasH = Math.max(120, (maxDepth + 1) * Y_SPACING + 60);

  const layout: Record<number, NodeLayout> = {};
  for (const id of Object.keys(nodes).map(Number)) {
    if (xIndex[id] === undefined) continue;
    layout[id] = {
      id,
      x: 30 + xIndex[id] * xSpacing + xSpacing / 2,
      y: 36 + yDepth[id] * Y_SPACING,
    };
  }

  return { layout, width: canvasW, height: canvasH };
}

export default function TreeCanvas({ nodes, rootId }: TreeCanvasProps) {
  const { layout, width, height } = useMemo(() => computeLayout(nodes, rootId), [nodes, rootId]);

  if (rootId === null || Object.keys(nodes).length === 0) {
    return (
      <div style={{
        height: 220,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(11,12,16,0.7)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--ink-800)',
        color: 'var(--on-surface-variant)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-data-xs)',
        flexDirection: 'column',
        gap: '0.5rem',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '2rem', opacity: 0.3 }}>account_tree</span>
        <span>Empty tree — insert a value to begin</span>
      </div>
    );
  }

  return (
    <div
      style={{
        overflowX: 'auto',
        overflowY: 'auto',
        background: 'rgba(11,12,16,0.7)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--ink-800)',
        maxHeight: 360,
        width: '100%',
        maxWidth: '100%',
      }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        style={{ display: 'block', maxWidth: 'none' }}
      >
        {/* Edges */}
        {Object.values(nodes).map((node) => {
          const from = layout[node.id];
          if (!from) return null;
          return (
            <g key={`edges-${node.id}`}>
              {node.left !== null && layout[node.left] && (
                <line
                  key={`e-${node.id}-l`}
                  x1={from.x} y1={from.y}
                  x2={layout[node.left].x} y2={layout[node.left].y}
                  stroke={NODE_STROKE[nodes[node.left]?.state ?? 'default']}
                  strokeWidth={1.5}
                  strokeOpacity={0.6}
                />
              )}
              {node.right !== null && layout[node.right] && (
                <line
                  key={`e-${node.id}-r`}
                  x1={from.x} y1={from.y}
                  x2={layout[node.right].x} y2={layout[node.right].y}
                  stroke={NODE_STROKE[nodes[node.right]?.state ?? 'default']}
                  strokeWidth={1.5}
                  strokeOpacity={0.6}
                />
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {Object.values(nodes).map((node) => {
          const pos = layout[node.id];
          if (!pos) return null;
          const state = node.state;
          const isSpecial = state !== 'default' && state !== 'path';

          return (
            <g key={node.id} transform={`translate(${pos.x},${pos.y})`}>
              {/* Glow ring for active nodes */}
              {isSpecial && (
                <circle
                  r={NODE_R + 5}
                  fill="none"
                  stroke={NODE_STROKE[state]}
                  strokeWidth={1}
                  strokeOpacity={0.35}
                />
              )}
              {/* Main circle */}
              <circle
                r={NODE_R}
                fill={NODE_FILL[state]}
                stroke={NODE_STROKE[state]}
                strokeWidth={isSpecial ? 2 : 1.2}
              />
              {/* Value text */}
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fill={NODE_TEXT[state]}
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: node.value > 99 ? 10 : 13,
                  fontWeight: 600,
                }}
              >
                {node.value}
              </text>
              {/* Height badge for AVL */}
              {node.height > 1 && (
                <text
                  x={NODE_R - 2}
                  y={-(NODE_R - 2)}
                  textAnchor="middle"
                  fill="var(--on-surface-variant)"
                  style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8 }}
                >
                  h{node.height}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
