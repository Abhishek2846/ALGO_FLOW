import { useState } from 'react';
import { motion } from 'framer-motion';
import StructureCanvas from '../../components/ui/StructureCanvas';
import DifficultyBadge from '../../components/ui/DifficultyBadge';
import CodeEditorPanel from '../../components/ui/CodeEditorPanel';
import Footer from '../../components/layout/Footer';
import { useStructureVisualizer, type StructureType } from '../../hooks/useStructureVisualizer';
import type { AlgorithmMeta } from '../../types';

interface StructurePageTemplateProps {
  meta: AlgorithmMeta;
  structureType?: StructureType;
  structType?: StructureType;
}

const ACCENT = '#38bdf8';

const PSEUDOCODES: Record<string, string[]> = {
  stack: [
    '// Stack (LIFO)',
    'function push(val):',
    '  stack.append(val)',
    'function pop():',
    '  if stack is empty: return error',
    '  return stack.pop()',
    'function peek():',
    '  return stack.top()',
  ],
  queue: [
    '// Queue (FIFO)',
    'function enqueue(val):',
    '  queue.append(val)',
    'function dequeue():',
    '  if queue is empty: return error',
    '  return queue.pop_front()',
  ],
  'linked-list': [
    '// Linked List',
    'function insertHead(val):',
    '  newNode.next ← head; head ← newNode',
    'function insertTail(val):',
    '  curr.next ← newNode',
    'function delete(val):',
    '  prev.next ← curr.next',
  ],
  'hash-table': [
    '// Hash Table (Chaining)',
    'function set(key, val):',
    '  idx ← hash(key) % capacity',
    '  bucket[idx].insert(key, val)',
    'function get(key):',
    '  idx ← hash(key) % capacity',
    '  return bucket[idx].find(key)',
  ],
  'union-find': [
    '// Union-Find (Disjoint Set)',
    'function find(i):',
    '  if parent[i] == i: return i',
    '  parent[i] ← find(parent[i]) // Path compression',
    '  return parent[i]',
    'function union(i, j):',
    '  rootI ← find(i); rootJ ← find(j)',
    '  if rank[rootI] < rank[rootJ]: parent[rootI] ← rootJ',
    '  else: parent[rootJ] ← rootI',
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
        background: accent ? 'rgba(56, 189, 248, 0.2)' : 'rgba(18, 19, 26, 0.8)',
        border: `1px solid ${accent ? ACCENT : 'rgba(255, 255, 255, 0.1)'}`,
        borderRadius: '50%',
        color: accent ? ACCENT : '#a0a0b0',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'all 0.2s ease',
        boxShadow: accent && !disabled ? `0 0 15px ${ACCENT}66` : 'none',
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

export default function StructurePageTemplate({ meta, structureType, structType }: StructurePageTemplateProps) {
  const type = (structureType || structType || meta.id) as StructureType;

  const {
    stack,
    queue,
    linkedList,
    hashTable,
    unionFind,
    activeLine,
    description,
    isPlaying,
    isDone,
    speed,
    setSpeed,
    play,
    pause,
    step,
    pushStack,
    popStack,
    enqueueQueue,
    dequeueQueue,
    insertHeadLL,
    insertTailLL,
    deleteLL,
    putHash,
    getHash,
    unionUF,
    findUF,
    resetSample,
  } = useStructureVisualizer(type);

  const [inputVal, setInputVal] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [valInput, setValInput] = useState('');
  const [arg1Input, setArg1Input] = useState('');
  const [arg2Input, setArg2Input] = useState('');
  const [opError, setOpError] = useState('');

  const pseudocode = PSEUDOCODES[type] ?? meta.pseudocode ?? [];

  const handlePush = () => {
    const v = parseInt(inputVal, 10);
    if (isNaN(v)) { setOpError('Enter an integer'); return; }
    setOpError(''); pushStack(v); setInputVal('');
  };

  const handleEnqueue = () => {
    const v = parseInt(inputVal, 10);
    if (isNaN(v)) { setOpError('Enter an integer'); return; }
    setOpError(''); enqueueQueue(v); setInputVal('');
  };

  const handleInsertHead = () => {
    const v = parseInt(inputVal, 10);
    if (isNaN(v)) { setOpError('Enter an integer'); return; }
    setOpError(''); insertHeadLL(v); setInputVal('');
  };

  const handleInsertTail = () => {
    const v = parseInt(inputVal, 10);
    if (isNaN(v)) { setOpError('Enter an integer'); return; }
    setOpError(''); insertTailLL(v); setInputVal('');
  };

  const handleDeleteLL = () => {
    const v = parseInt(inputVal, 10);
    if (isNaN(v)) { setOpError('Enter an integer'); return; }
    setOpError(''); deleteLL(v); setInputVal('');
  };

  const handleHashSet = () => {
    if (!keyInput.trim()) { setOpError('Enter a key'); return; }
    setOpError(''); putHash(keyInput.trim(), valInput.trim() || 'val');
    setKeyInput(''); setValInput('');
  };

  const handleHashGet = () => {
    if (!keyInput.trim()) { setOpError('Enter a key'); return; }
    setOpError(''); getHash(keyInput.trim());
  };

  const handleUnion = () => {
    const a = parseInt(arg1Input, 10); const b = parseInt(arg2Input, 10);
    if (isNaN(a) || isNaN(b)) { setOpError('Enter 2 integers (0-4)'); return; }
    setOpError(''); unionUF(a, b);
  };

  const handleFind = () => {
    const a = parseInt(arg1Input, 10);
    if (isNaN(a)) { setOpError('Enter integer (0-4)'); return; }
    setOpError(''); findUF(a);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} style={{ background: 'rgba(8,9,14,1)', minHeight: '100vh', color: '#e2e8f0', fontFamily: 'var(--font-body)' }}>
      {/* Top Accent Line */}
      <div style={{ height: '3px', width: '100%', background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`, boxShadow: `0 0 15px ${ACCENT}` }} />

      <div style={{ padding: '2rem var(--gutter)', maxWidth: 1400, margin: '0 auto' }}>


        {/* Hero Header */}
        <div style={{ 
          marginBottom: '3rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between', 
          background: `radial-gradient(ellipse at top left, ${ACCENT}26, transparent 70%)`, 
          padding: '2rem', borderRadius: '1rem', border: `1px solid ${ACCENT}33`, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' 
        }}>
          <div style={{ flex: '1 1 500px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', background: `${ACCENT}1a`, padding: '0.25rem 0.75rem', borderRadius: '1rem', border: `1px solid ${ACCENT}4d` }}>
                Data Structure
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <motion.div 
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 0.9, 1] }} 
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }} 
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8' }}>
                  {isDone ? 'Operation Completed' : isPlaying ? 'Executing Operation...' : 'Visualizer Ready'}
                </span>
              </div>
            </div>
            <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, margin: '0 0 1rem 0', background: `linear-gradient(135deg, #ffffff, ${ACCENT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
              {meta.name}
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: 1.6, margin: 0, maxWidth: '800px' }}>
              {meta.description}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '200px' }}>
            <DifficultyBadge difficulty={meta.difficulty} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0.5rem', padding: '0.75rem 1rem' }}>
              <span style={{ color: '#64748b' }}>Time</span>
              <span style={{ color: '#f2b84b', fontWeight: 600 }}>{meta.complexity.time}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0.5rem', padding: '0.75rem 1rem' }}>
              <span style={{ color: '#64748b' }}>Space</span>
              <span style={{ color: '#38bdf8', fontWeight: 600 }}>{meta.complexity.space}</span>
            </div>
          </div>
        </div>

        {/* Content grid */}
        <div className="algo-content-grid">
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Terminal Canvas Window */}
            <div className="glass-panel" style={{ borderRadius: '0.75rem', overflow: 'hidden', border: `1px solid ${ACCENT}33`, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
              {/* Terminal Chrome */}
              <div style={{ padding: '0.75rem 1rem', background: '#0f111a', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef6461', opacity: 0.8 }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f2b84b', opacity: 0.8 }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#4fd1a5', opacity: 0.8 }} />
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: ACCENT }}>layers</span>
                  {meta.id}.viz
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: ACCENT, background: `${ACCENT}1a`, padding: '0.2rem 0.6rem', borderRadius: '1rem' }}>
                  {type.toUpperCase()}
                </div>
              </div>
              
              <div style={{ padding: '1.5rem', background: 'radial-gradient(circle at center, rgba(15,17,26,1) 0%, rgba(8,9,14,1) 100%)', position: 'relative' }}>
                {isPlaying && (
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: '100%' }} 
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    style={{ position: 'absolute', top: 0, left: 0, height: '2px', background: ACCENT, opacity: 0.5 }}
                  />
                )}

                <StructureCanvas
                  type={type}
                  stack={stack}
                  queue={queue}
                  linkedList={linkedList}
                  hashTable={hashTable}
                  unionFind={unionFind}
                  description={description}
                />
              </div>

              {/* Controls Toolbar */}
              <div style={{ padding: '1rem', background: '#0f111a', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {isPlaying ? (
                      <ControlBtn id="ctrl-pause" icon="pause" label="Pause" onClick={pause} disabled={isDone} accent />
                    ) : (
                      <ControlBtn id="ctrl-play" icon="play_arrow" label="Play" onClick={play} disabled={isDone} accent={!isDone} />
                    )}
                    <ControlBtn id="ctrl-step" icon="skip_next" label="Step" onClick={step} disabled={isPlaying || isDone} />
                    <ControlBtn id="ctrl-reset" icon="replay" label="Reset Sample" onClick={resetSample} disabled={false} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.02)', padding: '0.4rem 1rem', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', color: '#94a3b8' }}>speed</span>
                    <input
                      type="range"
                      min={0.25} max={4} step={0.25}
                      value={speed}
                      onChange={(e) => setSpeed(parseFloat(e.target.value))}
                      style={{ width: '80px', accentColor: ACCENT }}
                    />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: ACCENT, minWidth: '32px', textAlign: 'right', fontWeight: 600 }}>{speed}x</span>
                  </div>
                </div>

                {/* Operations Bar */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  {type === 'stack' && (
                    <>
                      <input id="ctrl-stack-val" type="number" placeholder="Val" value={inputVal} onChange={(e) => { setInputVal(e.target.value); setOpError(''); }} onKeyDown={(e) => e.key === 'Enter' && handlePush()} style={{ width: 70, padding: '0.35rem 0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.4rem', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }} />
                      <button id="ctrl-push" onClick={handlePush} style={{ padding: '0.35rem 0.75rem', background: `${ACCENT}26`, border: `1px solid ${ACCENT}66`, borderRadius: '0.4rem', color: ACCENT, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', cursor: 'pointer' }}>Push</button>
                      <button id="ctrl-pop" onClick={popStack} style={{ padding: '0.35rem 0.75rem', background: 'rgba(239,100,97,0.15)', border: '1px solid rgba(239,100,97,0.3)', borderRadius: '0.4rem', color: '#ef6461', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', cursor: 'pointer' }}>Pop</button>
                    </>
                  )}

                  {type === 'queue' && (
                    <>
                      <input id="ctrl-queue-val" type="number" placeholder="Val" value={inputVal} onChange={(e) => { setInputVal(e.target.value); setOpError(''); }} onKeyDown={(e) => e.key === 'Enter' && handleEnqueue()} style={{ width: 70, padding: '0.35rem 0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.4rem', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }} />
                      <button id="ctrl-enqueue" onClick={handleEnqueue} style={{ padding: '0.35rem 0.75rem', background: `${ACCENT}26`, border: `1px solid ${ACCENT}66`, borderRadius: '0.4rem', color: ACCENT, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', cursor: 'pointer' }}>Enqueue</button>
                      <button id="ctrl-dequeue" onClick={dequeueQueue} style={{ padding: '0.35rem 0.75rem', background: 'rgba(239,100,97,0.15)', border: '1px solid rgba(239,100,97,0.3)', borderRadius: '0.4rem', color: '#ef6461', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', cursor: 'pointer' }}>Dequeue</button>
                    </>
                  )}

                  {type === 'linked-list' && (
                    <>
                      <input id="ctrl-ll-val" type="number" placeholder="Val" value={inputVal} onChange={(e) => { setInputVal(e.target.value); setOpError(''); }} style={{ width: 70, padding: '0.35rem 0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.4rem', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }} />
                      <button id="ctrl-insert-head" onClick={handleInsertHead} style={{ padding: '0.35rem 0.75rem', background: `${ACCENT}26`, border: `1px solid ${ACCENT}66`, borderRadius: '0.4rem', color: ACCENT, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', cursor: 'pointer' }}>Head</button>
                      <button id="ctrl-insert-tail" onClick={handleInsertTail} style={{ padding: '0.35rem 0.75rem', background: `${ACCENT}26`, border: `1px solid ${ACCENT}66`, borderRadius: '0.4rem', color: ACCENT, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', cursor: 'pointer' }}>Tail</button>
                      <button id="ctrl-delete-node" onClick={handleDeleteLL} style={{ padding: '0.35rem 0.75rem', background: 'rgba(239,100,97,0.15)', border: '1px solid rgba(239,100,97,0.3)', borderRadius: '0.4rem', color: '#ef6461', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', cursor: 'pointer' }}>Delete</button>
                    </>
                  )}

                  {type === 'hash-table' && (
                    <>
                      <input id="ctrl-hash-key" type="text" placeholder="Key" value={keyInput} onChange={(e) => { setKeyInput(e.target.value); setOpError(''); }} style={{ width: 80, padding: '0.35rem 0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.4rem', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }} />
                      <input id="ctrl-hash-val" type="text" placeholder="Val" value={valInput} onChange={(e) => setValInput(e.target.value)} style={{ width: 80, padding: '0.35rem 0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.4rem', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }} />
                      <button id="ctrl-hash-set" onClick={handleHashSet} style={{ padding: '0.35rem 0.75rem', background: `${ACCENT}26`, border: `1px solid ${ACCENT}66`, borderRadius: '0.4rem', color: ACCENT, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', cursor: 'pointer' }}>Set</button>
                      <button id="ctrl-hash-get" onClick={handleHashGet} style={{ padding: '0.35rem 0.75rem', background: 'rgba(242,184,75,0.15)', border: '1px solid rgba(242,184,75,0.3)', borderRadius: '0.4rem', color: '#f2b84b', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', cursor: 'pointer' }}>Get</button>
                    </>
                  )}

                  {type === 'union-find' && (
                    <>
                      <input id="ctrl-uf-arg1" type="number" placeholder="a" value={arg1Input} onChange={(e) => { setArg1Input(e.target.value); setOpError(''); }} style={{ width: 50, padding: '0.35rem 0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.4rem', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }} />
                      <input id="ctrl-uf-arg2" type="number" placeholder="b" value={arg2Input} onChange={(e) => setArg2Input(e.target.value)} style={{ width: 50, padding: '0.35rem 0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.4rem', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }} />
                      <button id="ctrl-union" onClick={handleUnion} style={{ padding: '0.35rem 0.75rem', background: `${ACCENT}26`, border: `1px solid ${ACCENT}66`, borderRadius: '0.4rem', color: ACCENT, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', cursor: 'pointer' }}>Union</button>
                      <button id="ctrl-find" onClick={handleFind} style={{ padding: '0.35rem 0.75rem', background: 'rgba(79,209,165,0.15)', border: '1px solid rgba(79,209,165,0.3)', borderRadius: '0.4rem', color: '#4fd1a5', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', cursor: 'pointer' }}>Find</button>
                    </>
                  )}
                </div>
                {opError && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#ef6461', margin: 0 }}>{opError}</p>}
              </div>

            </div>

          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Code Editor */}
            <CodeEditorPanel
              algoId={type}
              defaultPseudocode={pseudocode}
              activeLine={activeLine}
              accentColor={ACCENT}
            />

            {/* Complexity Analysis */}
            <div className="glass-panel" style={{ borderRadius: '0.75rem', padding: '1.5rem', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.1rem', color: '#f8fafc', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ color: ACCENT, fontSize: '1.2rem' }}>analytics</span>
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
            </div>

          </div>

        </div>
      </div>
      <Footer />
    </motion.div>
  );
}
