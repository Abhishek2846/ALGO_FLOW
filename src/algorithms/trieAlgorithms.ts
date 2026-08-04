import type { TrieNodeData, TrieStep } from '../types';

let _trieId = 1000;
export function resetTrieIdCounter(v = 1000) { _trieId = v; }
function allocTrieId() { return _trieId++; }

function cloneTrie(nodes: Record<number, TrieNodeData>): Record<number, TrieNodeData> {
  const out: Record<number, TrieNodeData> = {};
  for (const [k, v] of Object.entries(nodes)) {
    out[Number(k)] = { ...v, children: { ...v.children } };
  }
  return out;
}

function snap(nodes: Record<number, TrieNodeData>, rootId: number, line: number, desc: string): TrieStep {
  return { nodes: cloneTrie(nodes), rootId, activeLine: line, description: desc };
}

export function createInitialTrie(): { nodes: Record<number, TrieNodeData>; rootId: number } {
  const rootId = allocTrieId();
  const nodes: Record<number, TrieNodeData> = {
    [rootId]: { id: rootId, char: '', children: {}, isEndOfWord: false, state: 'default', parent: null, depth: 0 },
  };
  return { nodes, rootId };
}

export function trieInsert(
  inputNodes: Record<number, TrieNodeData>,
  rootId: number,
  word: string,
): { steps: TrieStep[]; newNodes: Record<number, TrieNodeData> } {
  const steps: TrieStep[] = [];
  const nodes = cloneTrie(inputNodes);
  const w = word.toLowerCase().replace(/[^a-z]/g, '');

  if (w.length === 0) return { steps, newNodes: nodes };

  steps.push(snap(nodes, rootId, 0, `Trie insert: "${word}"`));

  let cur = rootId;
  for (let i = 0; i < w.length; i++) {
    const ch = w[i];
    nodes[cur].state = 'comparing';
    steps.push(snap(nodes, rootId, 3, `Processing char '${ch}' at depth ${i}`));

    if (!(ch in nodes[cur].children)) {
      const newId = allocTrieId();
      nodes[newId] = { id: newId, char: ch, children: {}, isEndOfWord: false, state: 'new', parent: cur, depth: i + 1 };
      nodes[cur].children[ch] = newId;
      steps.push(snap(nodes, rootId, 5, `Created new node '${ch}'`));
    } else {
      nodes[nodes[cur].children[ch]].state = 'path';
      steps.push(snap(nodes, rootId, 7, `Node '${ch}' already exists — follow`));
    }

    nodes[cur].state = 'path';
    cur = nodes[cur].children[ch];
  }

  nodes[cur].isEndOfWord = true;
  nodes[cur].state = 'found';
  steps.push(snap(nodes, rootId, 9, `Mark "${word}" as complete word`));

  // Reset states
  for (const n of Object.values(nodes)) {
    if (n.state !== 'default') n.state = n.isEndOfWord ? 'found' : 'default';
  }
  steps.push(snap(nodes, rootId, 10, `Insert complete`));
  return { steps, newNodes: nodes };
}

export function trieSearch(
  inputNodes: Record<number, TrieNodeData>,
  rootId: number,
  word: string,
): TrieStep[] {
  const steps: TrieStep[] = [];
  const nodes = cloneTrie(inputNodes);
  const w = word.toLowerCase().replace(/[^a-z]/g, '');

  // Reset states
  for (const n of Object.values(nodes)) n.state = n.isEndOfWord ? 'found' : 'default';
  steps.push(snap(nodes, rootId, 0, `Trie search: "${word}"`));

  let cur = rootId;
  for (let i = 0; i < w.length; i++) {
    const ch = w[i];
    nodes[cur].state = 'comparing';
    steps.push(snap(nodes, rootId, 3, `Looking for '${ch}' among children`));

    if (!(ch in nodes[cur].children)) {
      nodes[cur].state = 'not-found';
      steps.push(snap(nodes, rootId, 5, `✗ '${ch}' not found — "${word}" not in Trie`));
      return steps;
    }

    nodes[cur].state = 'path';
    cur = nodes[cur].children[ch];
    nodes[cur].state = 'comparing';
    steps.push(snap(nodes, rootId, 7, `Found '${ch}' — advance`));
  }

  if (nodes[cur].isEndOfWord) {
    nodes[cur].state = 'found';
    steps.push(snap(nodes, rootId, 9, `✓ "${word}" found in Trie!`));
  } else {
    nodes[cur].state = 'not-found';
    steps.push(snap(nodes, rootId, 11, `"${word}" is a prefix but not a complete word`));
  }

  return steps;
}
