import { motion } from 'framer-motion';
import GraphCanvas from '../../components/ui/GraphCanvas';
import DifficultyBadge from '../../components/ui/DifficultyBadge';
import CodeEditorPanel from '../../components/ui/CodeEditorPanel';
import Footer from '../../components/layout/Footer';
import { useGraphVisualizer, type GraphAlgoType } from '../../hooks/useGraphVisualizer';
import type { AlgorithmMeta, GraphNodeData, GraphEdgeData, GraphStep } from '../../types';

interface GraphPageTemplateProps {
  meta: AlgorithmMeta;
  algoType: GraphAlgoType;
  stepGenerator: (
    nodes: Record<string, GraphNodeData>,
    edges: GraphEdgeData[],
    startId?: string,
  ) => GraphStep[];
}

const PSEUDOCODES: Record<string, string[]> = {
  bfs: [
    'function BFS(graph, startNode):',
    '  create Queue Q, mark startNode as queued',
    '  Q.enqueue(startNode)',
    '  while Q is not empty:',
    '    curr ← Q.dequeue()',
    '    visit(curr)',
    '    for each neighbor of curr:',
    '      if neighbor not visited:',
    '        mark neighbor as queued',
    '        Q.enqueue(neighbor)',
    '  end while',
  ],
  dfs: [
    'function DFS(graph, startNode):',
    '  create Stack S, push startNode',
    '  while S is not empty:',
    '    curr ← S.pop()',
    '    if curr not visited:',
    '      visit(curr)',
    '      for each neighbor of curr:',
    '        if neighbor not visited:',
    '          S.push(neighbor)',
    '  end while',
  ],
  dijkstra: [
    'function Dijkstra(graph, startNode):',
    '  set dist[startNode] ← 0, all others ← ∞',
    '  while unvisited vertices exist:',
    '    u ← vertex with min dist[u]',
    '    mark u as visited',
    '    for each neighbor v of u:',
    '      if dist[u] + weight(u,v) < dist[v]:',
    '        dist[v] ← dist[u] + weight(u,v)',
    '        parent[v] ← u',
    '  end while',
  ],
  'prims-mst': [
    'function PrimMST(graph, root):',
    '  add root to MST set',
    '  while MST does not include all vertices:',
    '    e ← min weight edge crossing MST cut',
    '    add edge e and its new vertex to MST',
    '  end while',
  ],
  'kruskals-mst': [
    'function KruskalMST(graph):',
    '  sort all edges by weight',
    '  for each edge (u, v) in sorted order:',
    '    if find(u) ≠ find(v):',
    '      add edge (u, v) to MST',
    '      union(u, v)',
    '  end for',
  ],
  'floyd-warshall': [
    'function FloydWarshall(graph):',
    '  dist ← adjacency matrix with edge weights',
    '  for k from 1 to V:  // pivot node',
    '    for i from 1 to V:',
    '      for j from 1 to V:',
    '        dist[i][j] ← min(dist[i][j], dist[i][k] + dist[k][j])',
  ],
  'topological-sort': [
    'function TopologicalSort(graph):',
    '  compute in-degree for all vertices',
    '  enqueue all vertices with in-degree = 0',
    '  while Queue is not empty:',
    '    u ← Queue.dequeue()',
    '    append u to TopoOrder',
    '    for each neighbor v of u:',
    '      in-degree[v]--',
    '      if in-degree[v] == 0: Queue.enqueue(v)',
  ],
};

function ControlBtn({ id, icon, label, onClick, disabled, accent }: {
  id: string; icon: string; label: string; onClick: () => void; disabled: boolean; accent?: boolean;
}) {
  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      title={label}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '40px', height: '40px',
        background: accent ? 'rgba(239, 100, 97, 0.2)' : 'rgba(18, 19, 26, 0.8)',
        border: `1px solid ${accent ? '#ef6461' : 'rgba(255, 255, 255, 0.1)'}`,
        borderRadius: '50%',
        color: accent ? '#ef6461' : '#a0a0b0',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'all 0.2s ease',
        boxShadow: accent && !disabled ? '0 0 15px rgba(239, 100, 97, 0.4)' : 'none',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(1.1)';
          if (!accent) e.currentTarget.style.color = '#fff';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(1)';
          if (!accent) e.currentTarget.style.color = '#a0a0b0';
        }
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>{icon}</span>
    </button>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function GraphPageTemplate({ meta, algoType, stepGenerator }: GraphPageTemplateProps) {
  const {
    displayNodes,
    displayEdges,
    queueOrStack,
    visitedList,
    distances,
    activeLine,
    description,
    startNodeId,
    isPlaying,
    isDone,
    speed,
    setSpeed,
    play,
    pause,
    step,
    reset,
    changeStartNode,
    nodeIds,
  } = useGraphVisualizer(algoType, stepGenerator);

  const pseudocode = PSEUDOCODES[algoType] ?? meta.pseudocode ?? [];

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} style={{ background: 'rgba(8,9,14,1)', minHeight: '100vh', color: '#e2e8f0', fontFamily: 'var(--font-body)' }}>
      {/* Top Accent Line */}
      <div style={{ height: '3px', width: '100%', background: 'linear-gradient(90deg, transparent, #ef6461, transparent)', boxShadow: '0 0 15px #ef6461' }} />
      
      <div style={{ padding: '2rem var(--gutter)', maxWidth: 1400, margin: '0 auto' }}>
        

        {/* Hero Header */}
        <motion.div variants={itemVariants} style={{ marginBottom: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between', background: 'radial-gradient(ellipse at top left, rgba(239, 100, 97, 0.15), transparent 70%)', padding: 'clamp(1rem, 2.5vw, 2rem)', borderRadius: '1rem', border: '1px solid rgba(239, 100, 97, 0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <div style={{ flex: '1 1 280px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#ef6461', textTransform: 'uppercase', letterSpacing: '0.15em', background: 'rgba(239, 100, 97, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '1rem', border: '1px solid rgba(239, 100, 97, 0.3)' }}>
                Graph Theory
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <motion.div 
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 0.9, 1] }} 
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef6461', boxShadow: '0 0 8px #ef6461' }} 
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8' }}>Network Active</span>
              </div>
            </div>
            <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', fontWeight: 800, margin: '0 0 0.75rem 0', background: 'linear-gradient(135deg, #ffffff, #ef6461)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
              {meta.name}
            </h1>
            <p style={{ fontSize: 'clamp(0.92rem, 2vw, 1.05rem)', color: '#94a3b8', lineHeight: 1.6, margin: 0, maxWidth: '800px' }}>
              {meta.description}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: '1 1 180px', minWidth: 'min(100%, 200px)' }}>
            <DifficultyBadge difficulty={meta.difficulty} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0.5rem', padding: '0.65rem 0.9rem' }}>
              <span style={{ color: '#64748b' }}>Time</span>
              <span style={{ color: '#f2b84b', fontWeight: 600 }}>{meta.complexity.time}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0.5rem', padding: '0.65rem 0.9rem' }}>
              <span style={{ color: '#64748b' }}>Space</span>
              <span style={{ color: '#38bdf8', fontWeight: 600 }}>{meta.complexity.space}</span>
            </div>
          </div>
        </motion.div>

        {/* Content grid */}
        <div className="algo-content-grid">
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Terminal Canvas Window */}
            <motion.div variants={itemVariants} className="glass-panel" style={{ borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid rgba(239,100,97,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
              {/* Terminal Chrome */}
              <div style={{ padding: '0.75rem 1rem', background: '#0f111a', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef6461', opacity: 0.8 }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f2b84b', opacity: 0.8 }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#4fd1a5', opacity: 0.8 }} />
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: '#ef6461' }}>hub</span>
                  {meta.id}.viz
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#ef6461', background: 'rgba(239,100,97,0.1)', padding: '0.2rem 0.6rem', borderRadius: '1rem' }}>
                  V: {Object.keys(displayNodes).length} | E: {displayEdges.length}
                </div>
              </div>
              
              <div style={{ padding: '1.5rem', background: 'radial-gradient(circle at center, rgba(15,17,26,1) 0%, rgba(8,9,14,1) 100%)', position: 'relative' }}>
                
                {isPlaying && (
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: '100%' }} 
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    style={{ position: 'absolute', top: 0, left: 0, height: '2px', background: '#ef6461', opacity: 0.5 }}
                  />
                )}
                
                <GraphCanvas
                  nodes={displayNodes}
                  edges={displayEdges}
                  queueOrStack={queueOrStack}
                  visitedList={visitedList}
                  distances={distances}
                  description={description}
                />
              </div>
              
              {/* Toolbar */}
              <div style={{ padding: '1rem', background: '#0f111a', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {isPlaying ? (
                    <ControlBtn id="ctrl-pause" icon="pause" label="Pause" onClick={pause} disabled={isDone} accent />
                  ) : (
                    <ControlBtn id="ctrl-play" icon="play_arrow" label="Play" onClick={play} disabled={isDone} accent={!isDone} />
                  )}
                  <ControlBtn id="ctrl-step" icon="skip_next" label="Step" onClick={step} disabled={isPlaying || isDone} />
                  <ControlBtn id="ctrl-reset" icon="replay" label="Reset" onClick={reset} disabled={false} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  {/* Start Node Selector */}
                  {['bfs', 'dfs', 'dijkstra', 'prims-mst'].includes(algoType) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: '#94a3b8' }}>login</span>
                      <select
                        id="ctrl-start-node"
                        value={startNodeId}
                        onChange={(e) => changeStartNode(e.target.value)}
                        style={{
                          padding: '0.4rem 2rem 0.4rem 0.75rem',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '0.5rem',
                          color: '#f8fafc',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.85rem',
                          appearance: 'none',
                          cursor: 'pointer',
                          outline: 'none',
                          boxShadow: '0 0 10px rgba(239,100,97,0.1) inset'
                        }}
                      >
                        {nodeIds.map((id) => (
                          <option key={id} value={id} style={{ background: '#0f111a' }}>Node {id}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Speed Control */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.02)', padding: '0.4rem 1rem', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', color: '#94a3b8' }}>speed</span>
                    <input
                      type="range"
                      min={0.25} max={4} step={0.25}
                      value={speed}
                      onChange={(e) => setSpeed(parseFloat(e.target.value))}
                      style={{ width: '80px', accentColor: '#ef6461' }}
                    />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#ef6461', minWidth: '32px', textAlign: 'right', fontWeight: 600 }}>{speed}x</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Auxiliary State Bars */}
            <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              
              {(visitedList ?? []).length > 0 && (
                <div className="glass-panel" style={{ padding: '1rem', borderRadius: '0.5rem', borderLeft: '3px solid #4fd1a5', background: 'rgba(15,23,42,0.4)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Visited Sequence</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#f8fafc', wordBreak: 'break-all' }}>
                    {(visitedList ?? []).join(' → ')}
                  </div>
                </div>
              )}

              {(queueOrStack ?? []).length > 0 && (
                <div className="glass-panel" style={{ padding: '1rem', borderRadius: '0.5rem', borderLeft: '3px solid #ef6461', background: 'rgba(15,23,42,0.4)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    {algoType === 'dfs' ? 'Stack (Top ← Bottom)' : 'Queue (Front ← Back)'}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#f8fafc', wordBreak: 'break-all', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {(queueOrStack ?? []).map((item, idx) => (
                      <span key={idx} style={{ background: 'rgba(239,100,97,0.15)', border: '1px solid rgba(239,100,97,0.3)', padding: '2px 8px', borderRadius: '4px' }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {distances && Object.keys(distances).length > 0 && (
                <div className="glass-panel" style={{ padding: '1rem', borderRadius: '0.5rem', borderLeft: '3px solid #f2b84b', background: 'rgba(15,23,42,0.4)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Distance Array</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#f8fafc', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '0.5rem' }}>
                    {Object.entries(distances).map(([node, dist]) => (
                      <div key={node} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.25rem', borderRadius: '4px', textAlign: 'center' }}>
                        <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Node {node}</div>
                        <div style={{ color: '#f2b84b', fontWeight: 600 }}>{dist === Infinity ? '∞' : dist}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>

          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Code Editor */}
            <CodeEditorPanel
              algoId={algoType}
              defaultPseudocode={pseudocode}
              activeLine={activeLine}
              accentColor="#ef6461"
            />

            {/* Complexity Analysis */}
            <motion.div variants={itemVariants} className="glass-panel" style={{ borderRadius: '0.75rem', padding: '1.5rem', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.1rem', color: '#f8fafc', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ color: '#ef6461', fontSize: '1.2rem' }}>analytics</span>
                Performance
              </h3>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}>
                  <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Time (Average)</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#f2b84b', fontSize: '0.9rem' }}>{meta.complexity.timeBest || meta.complexity.time}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}>
                  <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Time (Worst)</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#f2b84b', fontSize: '0.9rem' }}>{meta.complexity.timeWorst || meta.complexity.time}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}>
                  <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Space</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8', fontSize: '0.9rem' }}>{meta.complexity.space}</span>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
      <Footer />
    </motion.div>
  );
}
