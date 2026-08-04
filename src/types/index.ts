// ── Shared TypeScript types for ALGO FLOW ──

export type Difficulty = 'Easy' | 'Medium' | 'Advanced';

export type CategoryId =
  | 'sorting'
  | 'searching'
  | 'trees'
  | 'graphs'
  | 'dp'
  | 'structures';

export interface Complexity {
  time: string;
  timeWorst?: string;
  timeBest?: string;
  space: string;
}

export interface AlgorithmMeta {
  id: string;
  name: string;
  category: CategoryId;
  difficulty: Difficulty;
  complexity: Complexity;
  description: string;
  path: string;
  sparkline: number[];
  accentColor?: string;
  pseudocode?: string[];
}

export interface CategoryMeta {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
  path: string;
  accentColor: string;
  accentVar: string;
  count: number;
  iconSymbol: string;
}

// ── Sorting ──────────────────────────────────────────────
export type BarState = 'default' | 'comparing' | 'swapping' | 'pivot' | 'sorted';

export interface SortBar {
  value: number;
  state: BarState;
}

export interface SortStep {
  bars: SortBar[];
  comparisons: number;
  swaps: number;
  activeLine: number;
  description?: string;
}

// ── Searching ────────────────────────────────────────────
export type SearchBarState =
  | 'default'
  | 'comparing'
  | 'found'
  | 'eliminated'
  | 'in-range'
  | 'jump-block'
  | 'low'
  | 'high'
  | 'mid'
  | 'pos';

export interface SearchBar {
  value: number;
  state: SearchBarState;
}

export interface SearchPointers {
  low?: number;
  high?: number;
  mid?: number;
  current?: number;
  jumpPos?: number;
  pos?: number;
  blockStart?: number;
  blockEnd?: number;
}

export interface SearchStep {
  bars: SearchBar[];
  pointers: SearchPointers;
  comparisons: number;
  /** -1 = searching, ≥ 0 = found at index, -2 = not found */
  foundIndex: number;
  activeLine: number;
  description: string;
}

// ── Trees (Binary) ───────────────────────────────────────
export type TreeNodeState =
  | 'default'
  | 'comparing'
  | 'found'
  | 'inserting'
  | 'rotating'
  | 'deleted'
  | 'path'
  | 'new'
  | 'swapping'
  | 'not-found';

export interface TreeNodeData {
  id: number;
  value: number;
  left: number | null;
  right: number | null;
  height: number;
  state: TreeNodeState;
  parent: number | null;
}

export interface TreeStep {
  nodes: Record<number, TreeNodeData>;
  rootId: number | null;
  activeLine: number;
  description: string;
}

// ── Trie ─────────────────────────────────────────────────
export interface TrieNodeData {
  id: number;
  char: string;
  children: Record<string, number>;
  isEndOfWord: boolean;
  state: TreeNodeState;
  parent: number | null;
  depth: number;
}

export interface TrieStep {
  nodes: Record<number, TrieNodeData>;
  rootId: number;
  activeLine: number;
  description: string;
}

// ── Graphs ───────────────────────────────────────────────
export type GraphNodeState =
  | 'default'
  | 'visiting'
  | 'visited'
  | 'queued'
  | 'current'
  | 'target'
  | 'mst'
  | 'shortest-path';

export type GraphEdgeState =
  | 'default'
  | 'visiting'
  | 'visited'
  | 'mst'
  | 'shortest-path'
  | 'rejected';

export interface GraphNodeData {
  id: string;
  label: string;
  x: number;
  y: number;
  state: GraphNodeState;
  distance?: number;
  parent?: string | null;
}

export interface GraphEdgeData {
  from: string;
  to: string;
  weight?: number;
  state: GraphEdgeState;
  directed?: boolean;
}

export interface GraphStep {
  nodes: Record<string, GraphNodeData>;
  edges: GraphEdgeData[];
  queueOrStack?: string[];
  visitedList?: string[];
  distances?: Record<string, number | string>;
  activeLine: number;
  description: string;
}

// ── Dynamic Programming ──────────────────────────────────
export type DPCellState =
  | 'default'
  | 'computing'
  | 'dependency'
  | 'filled'
  | 'optimal';

export interface DPCellData {
  value: number | string | null;
  state: DPCellState;
  subtext?: string;
}

export interface DPStep {
  table: DPCellData[][];
  rowLabels: string[];
  colLabels: string[];
  activeCell?: { r: number; c: number };
  activeLine: number;
  description: string;
}

// ── Structures ───────────────────────────────────────────
export interface HashEntry {
  key: string;
  value: string | number;
  state?: 'default' | 'active' | 'found' | 'deleted';
}

export interface UFElement {
  id: number;
  parent: number;
  rank: number;
  state?: 'default' | 'active' | 'union' | 'root';
}

export interface StructureStep {
  stack?: { value: number | string; state: 'default' | 'active' | 'push' | 'pop' }[];
  queue?: { value: number | string; state: 'default' | 'active' | 'enqueue' | 'dequeue' }[];
  linkedList?: { value: number | string; id: string; state: 'default' | 'active' | 'inserted' | 'deleted' | 'found' }[];
  hashTable?: HashEntry[][];
  unionFind?: UFElement[];
  activeLine: number;
  description: string;
}
