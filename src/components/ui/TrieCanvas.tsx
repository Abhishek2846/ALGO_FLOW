import { useMemo } from 'react';
import type { TrieNodeData, TreeNodeState } from '../../types';

interface TrieCanvasProps {
  nodes: Record<number, TrieNodeData>;
  rootId: number;
}

const NODE_R = 20;
const Y_SPACING = 80;

const NODE_FILL: Record<TreeNodeState, string> = {
  default:    'rgba(26,27,36,0.95)',
  comparing:  'rgba(242,184,75,0.2)',
  found:      'rgba(79,209,165,0.25)',
  inserting:  'rgba(110,107,244,0.25)',
  rotating:   'rgba(255,140,60,0.25)',
  deleted:    'rgba(239,100,97,0.2)',
  path:       'rgba(194,193,255,0.1)',
  new:        'rgba(110,107,244,0.35)',
  swapping:   'rgba(239,100,97,0.25)',
  'not-found': 'rgba(239,100,97,0.25)',
};

const NODE_STROKE: Record<TreeNodeState, string> = {
  default:    'rgba(255,255,255,0.15)',
  comparing:  'var(--amber-glow)',
  found:      'var(--neon-mint)',
  inserting:  'var(--electric-violet)',
  rotating:   '#ff8c3c',
  deleted:    'var(--crimson-spark)',
  path:       'rgba(194,193,255,0.4)',
  new:        'var(--electric-violet)',
  swapping:   'var(--crimson-spark)',
  'not-found': 'var(--crimson-spark)',
};



// Compute BFS-based layout for trie (n-ary tree)
function computeTrieLayout(
  nodes: Record<number, TrieNodeData>,
  rootId: number,
): { layout: Record<number, { x: number; y: number }>; canvasW: number; canvasH: number } {
  // Compute subtree leaf count for each node (used for width allocation)
  function leafCount(id: number): number {
    const n = nodes[id];
    if (!n) return 1;
    const kids = Object.values(n.children);
    if (kids.length === 0) return 1;
    return kids.reduce((sum, cid) => sum + leafCount(cid), 0);
  }

  const layout: Record<number, { x: number; y: number }> = {};
  const xSpacing = 50;
  const ySpacing = Y_SPACING;

  function assign(id: number, startX: number, depth: number) {
    const n = nodes[id];
    if (!n) return;
    const totalLeaves = leafCount(id);
    const width = totalLeaves * xSpacing;
    layout[id] = { x: startX + width / 2, y: 36 + depth * ySpacing };

    let cx = startX;
    for (const childId of Object.values(n.children)) {
      const childLeaves = leafCount(childId);
      const childWidth = childLeaves * xSpacing;
      assign(childId, cx, depth + 1);
      cx += childWidth;
    }
  }

  assign(rootId, 0, 0);

  const maxX = Math.max(...Object.values(layout).map((p) => p.x), 200) + 40;
  const maxDepth = Math.max(...Object.values(nodes).map((n) => n.depth), 0);
  const canvasH = Math.max(160, (maxDepth + 1) * ySpacing + 60);

  return { layout, canvasW: maxX, canvasH };
}

export default function TrieCanvas({ nodes, rootId }: TrieCanvasProps) {
  const { layout, canvasW, canvasH } = useMemo(() => computeTrieLayout(nodes, rootId), [nodes, rootId]);

  const root = nodes[rootId];
  const hasChildren = root && Object.keys(root.children).length > 0;

  if (!hasChildren) {
    return (
      <div style={{
        height: 200,
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
        <span className="material-symbols-outlined" style={{ fontSize: '2rem', opacity: 0.3 }}>abc</span>
        <span>Trie is empty — insert a word to begin</span>
      </div>
    );
  }

  return (
    <div style={{
      overflowX: 'auto',
      overflowY: 'auto',
      background: 'rgba(11,12,16,0.7)',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--ink-800)',
      maxHeight: 400,
    }}>
      <svg
        viewBox={`0 0 ${canvasW} ${canvasH}`}
        width={canvasW}
        height={canvasH}
        style={{ display: 'block', minWidth: '100%' }}
      >
        {/* Draw edges from parent to child */}
        {Object.values(nodes).map((node) => {
          if (node.parent === null) return null;
          const from = layout[node.parent];
          const to = layout[node.id];
          if (!from || !to) return null;
          return (
            <line
              key={`e-${node.id}`}
              x1={from.x} y1={from.y}
              x2={to.x} y2={to.y}
              stroke={NODE_STROKE[node.state]}
              strokeWidth={1.5}
              strokeOpacity={0.5}
            />
          );
        })}

        {/* Draw nodes */}
        {Object.values(nodes).map((node) => {
          const pos = layout[node.id];
          if (!pos) return null;
          const state = node.state;
          const isRoot = node.parent === null;
          const isSpecial = state !== 'default' && state !== 'path';

          return (
            <g key={node.id} transform={`translate(${pos.x},${pos.y})`}>
              {/* Glow ring */}
              {isSpecial && (
                <circle r={NODE_R + 5} fill="none" stroke={NODE_STROKE[state]} strokeWidth={1} strokeOpacity={0.35} />
              )}
              {/* Double circle for end-of-word */}
              {node.isEndOfWord && (
                <circle r={NODE_R + 3} fill="none" stroke="var(--neon-mint)" strokeWidth={1.5} strokeOpacity={0.4} />
              )}
              {/* Main circle */}
              <circle
                r={NODE_R}
                fill={NODE_FILL[state]}
                stroke={NODE_STROKE[state]}
                strokeWidth={isSpecial ? 2 : 1.2}
              />
              {/* Character label */}
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
                {isRoot ? '∅' : node.char}
              </text>
              {/* End-of-word star */}
              {node.isEndOfWord && (
                <text
                  x={NODE_R - 4}
                  y={-(NODE_R - 4)}
                  textAnchor="middle"
                  fill="var(--neon-mint)"
                  style={{ fontFamily: 'monospace', fontSize: 10 }}
                >
                  ★
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
