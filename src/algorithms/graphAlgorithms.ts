import type { GraphNodeData, GraphEdgeData, GraphStep } from '../types';

// ── Default Preset Graph (Undirected / Directed) ────────
export function getDefaultGraph(directed = false): { nodes: Record<string, GraphNodeData>; edges: GraphEdgeData[] } {
  const nodes: Record<string, GraphNodeData> = {
    A: { id: 'A', label: 'A', x: 80,  y: 70,  state: 'default' },
    B: { id: 'B', label: 'B', x: 220, y: 40,  state: 'default' },
    C: { id: 'C', label: 'C', x: 220, y: 160, state: 'default' },
    D: { id: 'D', label: 'D', x: 360, y: 40,  state: 'default' },
    E: { id: 'E', label: 'E', x: 360, y: 160, state: 'default' },
    F: { id: 'F', label: 'F', x: 500, y: 100, state: 'default' },
  };

  const edges: GraphEdgeData[] = [
    { from: 'A', to: 'B', weight: 4, state: 'default', directed },
    { from: 'A', to: 'C', weight: 2, state: 'default', directed },
    { from: 'B', to: 'C', weight: 1, state: 'default', directed },
    { from: 'B', to: 'D', weight: 5, state: 'default', directed },
    { from: 'C', to: 'D', weight: 8, state: 'default', directed },
    { from: 'C', to: 'E', weight: 10, state: 'default', directed },
    { from: 'D', to: 'E', weight: 2, state: 'default', directed },
    { from: 'D', to: 'F', weight: 6, state: 'default', directed },
    { from: 'E', to: 'F', weight: 3, state: 'default', directed },
  ];

  return { nodes, edges };
}

export function getDAGGraph(): { nodes: Record<string, GraphNodeData>; edges: GraphEdgeData[] } {
  const nodes: Record<string, GraphNodeData> = {
    A: { id: 'A', label: 'A', x: 80,  y: 100, state: 'default' },
    B: { id: 'B', label: 'B', x: 220, y: 50,  state: 'default' },
    C: { id: 'C', label: 'C', x: 220, y: 150, state: 'default' },
    D: { id: 'D', label: 'D', x: 360, y: 50,  state: 'default' },
    E: { id: 'E', label: 'E', x: 360, y: 150, state: 'default' },
    F: { id: 'F', label: 'F', x: 500, y: 100, state: 'default' },
  };

  const edges: GraphEdgeData[] = [
    { from: 'A', to: 'B', weight: 3, state: 'default', directed: true },
    { from: 'A', to: 'C', weight: 2, state: 'default', directed: true },
    { from: 'B', to: 'D', weight: 4, state: 'default', directed: true },
    { from: 'C', to: 'D', weight: 1, state: 'default', directed: true },
    { from: 'C', to: 'E', weight: 5, state: 'default', directed: true },
    { from: 'D', to: 'F', weight: 2, state: 'default', directed: true },
    { from: 'E', to: 'F', weight: 1, state: 'default', directed: true },
  ];

  return { nodes, edges };
}

// ── Helpers ──────────────────────────────────────────────
function cloneNodes(nodes: Record<string, GraphNodeData>): Record<string, GraphNodeData> {
  const out: Record<string, GraphNodeData> = {};
  for (const [k, v] of Object.entries(nodes)) out[k] = { ...v };
  return out;
}

function cloneEdges(edges: GraphEdgeData[]): GraphEdgeData[] {
  return edges.map((e) => ({ ...e }));
}

function snap(
  nodes: Record<string, GraphNodeData>,
  edges: GraphEdgeData[],
  activeLine: number,
  description: string,
  queueOrStack?: string[],
  visitedList?: string[],
  distances?: Record<string, number | string>,
): GraphStep {
  return {
    nodes: cloneNodes(nodes),
    edges: cloneEdges(edges),
    activeLine,
    description,
    queueOrStack: queueOrStack ? [...queueOrStack] : undefined,
    visitedList: visitedList ? [...visitedList] : undefined,
    distances: distances ? { ...distances } : undefined,
  };
}

function getNeighbors(id: string, edges: GraphEdgeData[]): { neighbor: string; edgeIdx: number }[] {
  const res: { neighbor: string; edgeIdx: number }[] = [];
  edges.forEach((e, idx) => {
    if (e.from === id) res.push({ neighbor: e.to, edgeIdx: idx });
    else if (!e.directed && e.to === id) res.push({ neighbor: e.from, edgeIdx: idx });
  });
  return res;
}

// ════════════════════════════════════════════════════════
// 1. BFS (Breadth-First Search)
// ════════════════════════════════════════════════════════
export function generateBFSSteps(
  inputNodes: Record<string, GraphNodeData>,
  inputEdges: GraphEdgeData[],
  startId = 'A',
): GraphStep[] {
  const steps: GraphStep[] = [];
  const nodes = cloneNodes(inputNodes);
  const edges = cloneEdges(inputEdges);
  const visited: string[] = [];
  const queue: string[] = [startId];

  nodes[startId].state = 'queued';
  steps.push(snap(nodes, edges, 2, `Initialize BFS: Enqueue start node ${startId}`, queue, visited));

  while (queue.length > 0) {
    const curr = queue.shift()!;
    nodes[curr].state = 'visiting';
    visited.push(curr);
    steps.push(snap(nodes, edges, 4, `Dequeue and visit node ${curr}`, queue, visited));

    const neighbors = getNeighbors(curr, edges);
    for (const { neighbor, edgeIdx } of neighbors) {
      if (!visited.includes(neighbor) && !queue.includes(neighbor)) {
        edges[edgeIdx].state = 'visiting';
        nodes[neighbor].state = 'queued';
        queue.push(neighbor);
        steps.push(snap(nodes, edges, 9, `Explore edge (${curr} ➔ ${neighbor}), enqueue ${neighbor}`, queue, visited));
        edges[edgeIdx].state = 'visited';
      }
    }

    nodes[curr].state = 'visited';
    steps.push(snap(nodes, edges, 5, `Finished visiting node ${curr}`, queue, visited));
  }

  steps.push(snap(nodes, edges, 10, `BFS traversal complete! Visited order: ${visited.join(' ➔ ')}`, [], visited));
  return steps;
}

// ════════════════════════════════════════════════════════
// 2. DFS (Depth-First Search)
// ════════════════════════════════════════════════════════
export function generateDFSSteps(
  inputNodes: Record<string, GraphNodeData>,
  inputEdges: GraphEdgeData[],
  startId = 'A',
): GraphStep[] {
  const steps: GraphStep[] = [];
  const nodes = cloneNodes(inputNodes);
  const edges = cloneEdges(inputEdges);
  const visited: string[] = [];
  const stack: string[] = [startId];

  nodes[startId].state = 'queued';
  steps.push(snap(nodes, edges, 1, `Initialize DFS: Push start node ${startId} onto stack`, stack, visited));

  while (stack.length > 0) {
    const curr = stack.pop()!;
    if (visited.includes(curr)) continue;

    nodes[curr].state = 'visiting';
    visited.push(curr);
    steps.push(snap(nodes, edges, 3, `Pop node ${curr} from stack and visit`, stack, visited));

    const neighbors = getNeighbors(curr, edges);
    for (const { neighbor, edgeIdx } of neighbors) {
      if (!visited.includes(neighbor)) {
        edges[edgeIdx].state = 'visiting';
        if (!stack.includes(neighbor)) {
          nodes[neighbor].state = 'queued';
          stack.push(neighbor);
        }
        steps.push(snap(nodes, edges, 8, `Explore edge (${curr} ➔ ${neighbor}), push ${neighbor} onto stack`, stack, visited));
        edges[edgeIdx].state = 'visited';
      }
    }

    nodes[curr].state = 'visited';
    steps.push(snap(nodes, edges, 5, `Mark ${curr} as visited`, stack, visited));
  }

  steps.push(snap(nodes, edges, 9, `DFS traversal complete! Visited order: ${visited.join(' ➔ ')}`, [], visited));
  return steps;
}

// ════════════════════════════════════════════════════════
// 3. DIJKSTRA'S SHORTEST PATH
// ════════════════════════════════════════════════════════
export function generateDijkstraSteps(
  inputNodes: Record<string, GraphNodeData>,
  inputEdges: GraphEdgeData[],
  startId = 'A',
): GraphStep[] {
  const steps: GraphStep[] = [];
  const nodes = cloneNodes(inputNodes);
  const edges = cloneEdges(inputEdges);
  const dist: Record<string, number> = {};
  const unvisited = new Set<string>();

  Object.keys(nodes).forEach((id) => {
    dist[id] = id === startId ? 0 : Infinity;
    unvisited.add(id);
  });

  const distDisplay = () => {
    const res: Record<string, string> = {};
    Object.keys(nodes).forEach((id) => (res[id] = dist[id] === Infinity ? '∞' : String(dist[id])));
    return res;
  };

  steps.push(snap(nodes, edges, 1, `Initialize Dijkstra: dist[${startId}] = 0, all others = ∞`, Array.from(unvisited), [], distDisplay()));

  while (unvisited.size > 0) {
    let u: string | null = null;
    let minDist = Infinity;
    unvisited.forEach((id) => {
      if (dist[id] < minDist) {
        minDist = dist[id];
        u = id;
      }
    });

    if (u === null || minDist === Infinity) break;
    unvisited.delete(u);
    nodes[u].state = 'visiting';
    steps.push(snap(nodes, edges, 3, `Pick unvisited node with smallest distance: ${u} (dist = ${dist[u]})`, Array.from(unvisited), [], distDisplay()));

    const neighbors = getNeighbors(u, edges);
    for (const { neighbor, edgeIdx } of neighbors) {
      if (unvisited.has(neighbor)) {
        const weight = edges[edgeIdx].weight ?? 1;
        const alt = dist[u] + weight;
        edges[edgeIdx].state = 'visiting';
        steps.push(snap(nodes, edges, 6, `Check neighbor ${neighbor}: dist[${u}](${dist[u]}) + weight(${weight}) = ${alt}`, Array.from(unvisited), [], distDisplay()));

        if (alt < dist[neighbor]) {
          dist[neighbor] = alt;
          nodes[neighbor].parent = u;
          edges[edgeIdx].state = 'shortest-path';
          steps.push(snap(nodes, edges, 7, `✓ Updated dist[${neighbor}] = ${alt} (parent: ${u})`, Array.from(unvisited), [], distDisplay()));
        } else {
          edges[edgeIdx].state = 'default';
        }
      }
    }

    nodes[u].state = 'visited';
    steps.push(snap(nodes, edges, 4, `Completed relaxation for node ${u}`, Array.from(unvisited), [], distDisplay()));
  }

  edges.forEach((e) => {
    if (nodes[e.to]?.parent === e.from || (!e.directed && nodes[e.from]?.parent === e.to)) {
      e.state = 'shortest-path';
    }
  });

  steps.push(snap(nodes, edges, 9, `Dijkstra shortest path algorithm complete!`, [], [], distDisplay()));
  return steps;
}

// ════════════════════════════════════════════════════════
// 4. PRIM'S MST
// ════════════════════════════════════════════════════════
export function generatePrimsMSTSteps(
  inputNodes: Record<string, GraphNodeData>,
  inputEdges: GraphEdgeData[],
  startId = 'A',
): GraphStep[] {
  const steps: GraphStep[] = [];
  const nodes = cloneNodes(inputNodes);
  const edges = cloneEdges(inputEdges);
  const mstNodes = new Set<string>([startId]);

  nodes[startId].state = 'mst';
  steps.push(snap(nodes, edges, 0, `Initialize Prim's MST: Add root node ${startId} to MST`));

  const totalNodes = Object.keys(nodes).length;

  while (mstNodes.size < totalNodes) {
    let minEdgeIdx = -1;
    let minWeight = Infinity;
    let candidateTo = '';

    edges.forEach((e, idx) => {
      const inFrom = mstNodes.has(e.from);
      const inTo = mstNodes.has(e.to);

      if ((inFrom && !inTo) || (inTo && !inFrom)) {
        const w = e.weight ?? 1;
        if (w < minWeight) {
          minWeight = w;
          minEdgeIdx = idx;
          candidateTo = inFrom ? e.to : e.from;
        }
      }
    });

    if (minEdgeIdx === -1) break;

    const chosenEdge = edges[minEdgeIdx];
    chosenEdge.state = 'visiting';
    steps.push(snap(nodes, edges, 4, `Lightest edge crossing cut: (${chosenEdge.from}-${chosenEdge.to}) with weight ${minWeight}`));

    chosenEdge.state = 'mst';
    mstNodes.add(candidateTo);
    nodes[candidateTo].state = 'mst';
    steps.push(snap(nodes, edges, 7, `Add node ${candidateTo} and edge (${chosenEdge.from}-${chosenEdge.to}) to MST`));
  }

  steps.push(snap(nodes, edges, 10, `Prim's Minimum Spanning Tree complete with ${mstNodes.size} nodes!`));
  return steps;
}

// ════════════════════════════════════════════════════════
// 5. KRUSKAL'S MST
// ════════════════════════════════════════════════════════
export function generateKruskalsMSTSteps(
  inputNodes: Record<string, GraphNodeData>,
  inputEdges: GraphEdgeData[],
): GraphStep[] {
  const steps: GraphStep[] = [];
  const nodes = cloneNodes(inputNodes);
  const edges = cloneEdges(inputEdges);

  // Sort edges by weight
  const sortedEdgeIndices = edges
    .map((e, idx) => ({ idx, weight: e.weight ?? 1 }))
    .sort((a, b) => a.weight - b.weight);

  // Disjoint Set (Union-Find)
  const parent: Record<string, string> = {};
  Object.keys(nodes).forEach((id) => (parent[id] = id));

  function find(i: string): string {
    if (parent[i] === i) return i;
    return (parent[i] = find(parent[i]));
  }

  function union(i: string, j: string): boolean {
    const rootI = find(i);
    const rootJ = find(j);
    if (rootI !== rootJ) {
      parent[rootI] = rootJ;
      return true;
    }
    return false;
  }

  steps.push(snap(nodes, edges, 0, `Kruskal's MST: Sorted ${edges.length} edges by weight`));

  for (const { idx } of sortedEdgeIndices) {
    const e = edges[idx];
    e.state = 'visiting';
    steps.push(snap(nodes, edges, 4, `Consider edge (${e.from}-${e.to}) weight = ${e.weight}`));

    if (union(e.from, e.to)) {
      e.state = 'mst';
      nodes[e.from].state = 'mst';
      nodes[e.to].state = 'mst';
      steps.push(snap(nodes, edges, 6, `✓ No cycle formed — Add edge (${e.from}-${e.to}) to MST`));
    } else {
      e.state = 'rejected';
      steps.push(snap(nodes, edges, 8, `✗ Cycle detected — Reject edge (${e.from}-${e.to})`));
    }
  }

  steps.push(snap(nodes, edges, 11, `Kruskal's Minimum Spanning Tree algorithm complete!`));
  return steps;
}

// ════════════════════════════════════════════════════════
// 6. FLOYD-WARSHALL (All-Pairs Shortest Path)
// ════════════════════════════════════════════════════════
export function generateFloydWarshallSteps(
  inputNodes: Record<string, GraphNodeData>,
  inputEdges: GraphEdgeData[],
): GraphStep[] {
  const steps: GraphStep[] = [];
  const nodes = cloneNodes(inputNodes);
  const edges = cloneEdges(inputEdges);
  const nodeKeys = Object.keys(nodes);
  const n = nodeKeys.length;

  const dist: Record<string, Record<string, number>> = {};
  nodeKeys.forEach((u) => {
    dist[u] = {};
    nodeKeys.forEach((v) => {
      dist[u][v] = u === v ? 0 : Infinity;
    });
  });

  edges.forEach((e) => {
    const w = e.weight ?? 1;
    dist[e.from][e.to] = w;
    if (!e.directed) dist[e.to][e.from] = w;
  });

  steps.push(snap(nodes, edges, 0, `Initialize Floyd-Warshall distance matrix for ${n} vertices`));

  for (let k = 0; k < n; k++) {
    const kId = nodeKeys[k];
    nodes[kId].state = 'current';
    steps.push(snap(nodes, edges, 3, `Using vertex ${kId} as intermediate pivot node`));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const u = nodeKeys[i];
        const v = nodeKeys[j];
        if (dist[u][kId] !== Infinity && dist[kId][v] !== Infinity) {
          if (dist[u][kId] + dist[kId][v] < dist[u][v]) {
            dist[u][v] = dist[u][kId] + dist[kId][v];
          }
        }
      }
    }
    nodes[kId].state = 'visited';
  }

  steps.push(snap(nodes, edges, 8, `Floyd-Warshall all-pairs shortest paths computed successfully!`));
  return steps;
}

// ════════════════════════════════════════════════════════
// 7. TOPOLOGICAL SORT
// ════════════════════════════════════════════════════════
export function generateTopologicalSortSteps(
  inputNodes: Record<string, GraphNodeData>,
  inputEdges: GraphEdgeData[],
): GraphStep[] {
  const steps: GraphStep[] = [];
  const nodes = cloneNodes(inputNodes);
  const edges = cloneEdges(inputEdges);
  const inDegree: Record<string, number> = {};
  const topoOrder: string[] = [];

  Object.keys(nodes).forEach((id) => (inDegree[id] = 0));
  edges.forEach((e) => {
    inDegree[e.to] = (inDegree[e.to] || 0) + 1;
  });

  const queue: string[] = [];
  Object.keys(nodes).forEach((id) => {
    if (inDegree[id] === 0) {
      queue.push(id);
      nodes[id].state = 'queued';
    }
  });

  steps.push(snap(nodes, edges, 0, `Topological Sort (Kahn's Algorithm): Initialized in-degrees. Zero in-degree queue: [${queue.join(', ')}]`, queue, topoOrder));

  while (queue.length > 0) {
    const curr = queue.shift()!;
    nodes[curr].state = 'visiting';
    topoOrder.push(curr);
    steps.push(snap(nodes, edges, 3, `Process node ${curr} (in-degree = 0), append to topological order`, queue, topoOrder));

    const neighbors = getNeighbors(curr, edges);
    for (const { neighbor, edgeIdx } of neighbors) {
      edges[edgeIdx].state = 'visiting';
      inDegree[neighbor]--;
      steps.push(snap(nodes, edges, 6, `Decrement in-degree of ${neighbor} to ${inDegree[neighbor]}`, queue, topoOrder));
      edges[edgeIdx].state = 'visited';

      if (inDegree[neighbor] === 0) {
        nodes[neighbor].state = 'queued';
        queue.push(neighbor);
        steps.push(snap(nodes, edges, 8, `Node ${neighbor} now has 0 in-degree — Enqueue`, queue, topoOrder));
      }
    }

    nodes[curr].state = 'visited';
  }

  steps.push(snap(nodes, edges, 11, `Topological Sort complete! Order: ${topoOrder.join(' ➔ ')}`, [], topoOrder));
  return steps;
}
