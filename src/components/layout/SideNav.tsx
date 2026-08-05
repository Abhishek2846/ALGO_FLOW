import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ALGORITHMS } from '../../data/algorithms';

interface SideNavProps {
  mobile?: boolean;
  onClose?: () => void;
}

interface SubAlgoItem {
  id: string;
  label: string;
  path: string;
  complexity?: string;
}

interface CategoryNavConfig {
  to: string;
  label: string;
  icon: string;
  count: number;
  color: string;
  glow: string;
  bg: string;
  algos: SubAlgoItem[];
}

const CATEGORIES: CategoryNavConfig[] = [
  {
    to: '/sorting',
    label: 'Sorting',
    icon: 'swap_vert',
    count: 8,
    color: '#4fd1a5',
    glow: 'rgba(79, 209, 165, 0.35)',
    bg: 'rgba(79, 209, 165, 0.1)',
    algos: [
      { id: 'bubble-sort', label: 'Bubble Sort', path: '/sorting/bubble-sort', complexity: 'O(n²)' },
      { id: 'selection-sort', label: 'Selection Sort', path: '/sorting/selection-sort', complexity: 'O(n²)' },
      { id: 'insertion-sort', label: 'Insertion Sort', path: '/sorting/insertion-sort', complexity: 'O(n²)' },
      { id: 'merge-sort', label: 'Merge Sort', path: '/sorting/merge-sort', complexity: 'O(n log n)' },
      { id: 'quick-sort', label: 'Quick Sort', path: '/sorting/quick-sort', complexity: 'O(n log n)' },
      { id: 'heap-sort', label: 'Heap Sort', path: '/sorting/heap-sort', complexity: 'O(n log n)' },
      { id: 'counting-sort', label: 'Counting Sort', path: '/sorting/counting-sort', complexity: 'O(n+k)' },
      { id: 'radix-sort', label: 'Radix Sort', path: '/sorting/radix-sort', complexity: 'O(d·(n+k))' },
    ],
  },
  {
    to: '/searching',
    label: 'Searching',
    icon: 'manage_search',
    count: 4,
    color: '#6e6bf4',
    glow: 'rgba(110, 107, 244, 0.35)',
    bg: 'rgba(110, 107, 244, 0.1)',
    algos: [
      { id: 'linear-search', label: 'Linear Search', path: '/searching/linear-search', complexity: 'O(n)' },
      { id: 'binary-search', label: 'Binary Search', path: '/searching/binary-search', complexity: 'O(log n)' },
      { id: 'jump-search', label: 'Jump Search', path: '/searching/jump-search', complexity: 'O(√n)' },
      { id: 'interpolation-search', label: 'Interpolation', path: '/searching/interpolation-search', complexity: 'O(log log n)' },
    ],
  },
  {
    to: '/trees',
    label: 'Trees',
    icon: 'account_tree',
    count: 5,
    color: '#f2b84b',
    glow: 'rgba(242, 184, 75, 0.35)',
    bg: 'rgba(242, 184, 75, 0.1)',
    algos: [
      { id: 'binary-tree', label: 'Binary Tree', path: '/trees/binary-tree', complexity: 'O(n)' },
      { id: 'bst', label: 'BST Operations', path: '/trees/bst', complexity: 'O(log n)' },
      { id: 'avl-tree', label: 'AVL Self-Balancing', path: '/trees/avl-tree', complexity: 'O(log n)' },
      { id: 'heap', label: 'Binary Heap', path: '/trees/heap', complexity: 'O(log n)' },
      { id: 'trie', label: 'Prefix Trie', path: '/trees/trie', complexity: 'O(L)' },
    ],
  },
  {
    to: '/graphs',
    label: 'Graphs',
    icon: 'hub',
    count: 7,
    color: '#c2c1ff',
    glow: 'rgba(194, 193, 255, 0.35)',
    bg: 'rgba(194, 193, 255, 0.1)',
    algos: [
      { id: 'bfs', label: 'BFS Traversal', path: '/graphs/bfs', complexity: 'O(V+E)' },
      { id: 'dfs', label: 'DFS Traversal', path: '/graphs/dfs', complexity: 'O(V+E)' },
      { id: 'dijkstra', label: "Dijkstra's Shortest Path", path: '/graphs/dijkstra', complexity: 'O((V+E)log V)' },
      { id: 'prims-mst', label: "Prim's MST", path: '/graphs/prims-mst', complexity: 'O(E log V)' },
      { id: 'kruskals-mst', label: "Kruskal's MST", path: '/graphs/kruskals-mst', complexity: 'O(E log E)' },
      { id: 'floyd-warshall', label: 'Floyd-Warshall', path: '/graphs/floyd-warshall', complexity: 'O(V³)' },
      { id: 'topological-sort', label: 'Topological Sort', path: '/graphs/topological-sort', complexity: 'O(V+E)' },
    ],
  },
  {
    to: '/dp',
    label: 'Dynamic Prog.',
    icon: 'layers',
    count: 5,
    color: '#c084fc',
    glow: 'rgba(192, 132, 252, 0.35)',
    bg: 'rgba(192, 132, 252, 0.1)',
    algos: [
      { id: 'fibonacci', label: 'Fibonacci DP', path: '/dp/fibonacci', complexity: 'O(n)' },
      { id: 'knapsack', label: '0/1 Knapsack', path: '/dp/knapsack', complexity: 'O(n·W)' },
      { id: 'lcs', label: 'Longest Common Sub.', path: '/dp/lcs', complexity: 'O(m·n)' },
      { id: 'matrix-chain-multiplication', label: 'Matrix Chain Multi.', path: '/dp/matrix-chain-multiplication', complexity: 'O(n³)' },
      { id: 'coin-change', label: 'Coin Change', path: '/dp/coin-change', complexity: 'O(n·amount)' },
    ],
  },
  {
    to: '/structures',
    label: 'Data Structures',
    icon: 'stacked_bar_chart',
    count: 5,
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.35)',
    bg: 'rgba(56, 189, 248, 0.1)',
    algos: [
      { id: 'stack', label: 'Stack (LIFO)', path: '/structures/stack', complexity: 'O(1)' },
      { id: 'queue', label: 'Queue (FIFO)', path: '/structures/queue', complexity: 'O(1)' },
      { id: 'linked-list', label: 'Singly Linked List', path: '/structures/linked-list', complexity: 'O(n)' },
      { id: 'hash-table', label: 'Hash Table Map', path: '/structures/hash-table', complexity: 'O(1)' },
      { id: 'union-find', label: 'Disjoint Set (UF)', path: '/structures/union-find', complexity: 'O(α(n))' },
    ],
  },
];

export default function SideNav({ mobile = false, onClose }: SideNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [lastPath, setLastPath] = useState<string>('');

  useEffect(() => {
    const activeCat = CATEGORIES.find(cat => location.pathname.startsWith(cat.to));
    // Auto-expand category if user navigated to a different one
    if (activeCat && !lastPath.startsWith(activeCat.to)) {
      setExpandedCat(activeCat.to);
    }
    setLastPath(location.pathname);
  }, [location.pathname]);

  return (
    <motion.aside
      initial={mobile ? { x: -320 } : false}
      animate={{ x: 0 }}
      exit={mobile ? { x: -320 } : undefined}
      transition={{ type: 'spring', stiffness: 340, damping: 32 }}
      style={{
        position: mobile ? 'relative' : 'fixed',
        left: 0,
        top: mobile ? 0 : 'var(--topnav-height)',
        bottom: 0,
        width: mobile ? 'min(300px, 85vw)' : 'var(--sidebar-width)',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(10, 11, 16, 0.98)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.07)',
        zIndex: 'var(--z-sidebar)' as any,
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Mobile Drawer Header with Close Button */}
      {mobile && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1rem 0.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #6e6bf4 0%, #4fd1a5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#fff' }}>hub</span>
            </div>
            <span style={{ fontFamily: 'var(--font-headline)', fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>
              ALGO<span style={{ color: 'var(--primary)' }}>_FLOW</span>
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close navigation menu"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: 'rgba(255, 255, 255, 0.7)',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
          </button>
        </div>
      )}
      
      {/* ── Primary Hub Quick Links ── */}
      <div style={{ padding: '0.75rem 0.65rem 0.4rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {/* Command Dashboard Link */}
        <NavLink
          to="/dashboard"
          onClick={() => onClose?.()}
          style={({ isActive }) => ({
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.6rem 0.75rem',
            borderRadius: '8px',
            background: isActive ? 'rgba(110, 107, 244, 0.16)' : 'rgba(255, 255, 255, 0.02)',
            border: `1px solid ${isActive ? 'rgba(110, 107, 244, 0.4)' : 'rgba(255, 255, 255, 0.05)'}`,
            color: isActive ? '#fff' : 'var(--on-surface-variant)',
            transition: 'all 0.18s ease',
          })}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = 'rgba(110, 107, 244, 0.2)';
            el.style.borderColor = 'rgba(110, 107, 244, 0.45)';
            el.style.color = '#fff';
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLAnchorElement;
            if (!location.pathname.startsWith('/dashboard')) {
              el.style.background = 'rgba(255, 255, 255, 0.02)';
              el.style.borderColor = 'rgba(255, 255, 255, 0.05)';
              el.style.color = 'var(--on-surface-variant)';
            }
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '6px',
              background: 'rgba(110, 107, 244, 0.15)',
              border: '1px solid rgba(110, 107, 244, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--primary)' }}>
              dashboard
            </span>
          </div>
          <span style={{ fontFamily: 'var(--font-headline)', fontSize: '0.86rem', fontWeight: 700 }}>
            Command Hub
          </span>
        </NavLink>

        {/* Head-to-Head Compare Link */}
        <NavLink
          to="/compare"
          onClick={() => onClose?.()}
          style={({ isActive }) => ({
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.6rem 0.75rem',
            borderRadius: '8px',
            background: isActive ? 'rgba(192, 132, 252, 0.16)' : 'rgba(255, 255, 255, 0.02)',
            border: `1px solid ${isActive ? 'rgba(192, 132, 252, 0.4)' : 'rgba(255, 255, 255, 0.05)'}`,
            color: isActive ? '#fff' : 'var(--on-surface-variant)',
            transition: 'all 0.18s ease',
          })}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = 'rgba(192, 132, 252, 0.2)';
            el.style.borderColor = 'rgba(192, 132, 252, 0.45)';
            el.style.color = '#fff';
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLAnchorElement;
            if (!location.pathname.startsWith('/compare')) {
              el.style.background = 'rgba(255, 255, 255, 0.02)';
              el.style.borderColor = 'rgba(255, 255, 255, 0.05)';
              el.style.color = 'var(--on-surface-variant)';
            }
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '6px',
              background: 'rgba(192, 132, 252, 0.15)',
              border: '1px solid rgba(192, 132, 252, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#c084fc' }}>
              compare_arrows
            </span>
          </div>
          <span style={{ fontFamily: 'var(--font-headline)', fontSize: '0.86rem', fontWeight: 700 }}>
            Race Arena
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '8px',
              color: '#c084fc',
              background: 'rgba(192, 132, 252, 0.12)',
              border: '1px solid rgba(192, 132, 252, 0.25)',
              padding: '1px 5px',
              borderRadius: '4px',
              marginLeft: 'auto',
              fontWeight: 700,
            }}
          >
            VS
          </span>
        </NavLink>
      </div>

      {/* ── Section Label ── */}
      <div style={{ padding: '0.9rem 1rem 0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: 'rgba(255, 255, 255, 0.35)',
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            fontWeight: 700,
          }}
        >
          Visualizer Engines
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255, 255, 255, 0.2)' }}>
          6 SUITES
        </span>
      </div>

      {/* ── Category Accordions ── */}
      <nav style={{ flex: 1, padding: '0 0.55rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {CATEGORIES.map(cat => {
          const isActive = location.pathname.startsWith(cat.to);
          const isHovered = hoveredCat === cat.to;
          const isExpanded = expandedCat === cat.to;

          return (
            <div key={cat.to}>
              <NavLink
                to={cat.to}
                onClick={() => {
                  setExpandedCat(prev => prev === cat.to ? null : cat.to);
                  onClose?.();
                }}
                style={{ textDecoration: 'none', display: 'block' }}
                onMouseEnter={() => setHoveredCat(cat.to)}
                onMouseLeave={() => setHoveredCat(null)}
              >
                <motion.div
                  animate={{
                    background: isActive
                      ? `linear-gradient(135deg, ${cat.bg}, rgba(18, 20, 30, 0.4))`
                      : isHovered
                      ? 'rgba(255, 255, 255, 0.04)'
                      : 'transparent',
                    borderColor: isActive ? `${cat.color}45` : 'transparent',
                  }}
                  style={{
                    border: '1px solid',
                    borderRadius: '9px',
                    padding: '0.55rem 0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Active left indicator light */}
                  {isActive && (
                    <motion.div
                      layoutId="activeSidebarIndicator"
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '15%',
                        bottom: '15%',
                        width: 3,
                        borderRadius: 3,
                        background: cat.color,
                        boxShadow: `0 0 12px ${cat.glow}`,
                      }}
                    />
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    {/* Icon container */}
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: '7px',
                        background: isActive || isHovered ? cat.bg : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${isActive ? `${cat.color}55` : 'rgba(255, 255, 255, 0.07)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.18s ease',
                        boxShadow: isActive ? `0 0 10px ${cat.glow}` : 'none',
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: '1rem',
                          color: isActive ? cat.color : isHovered ? cat.color : 'rgba(255, 255, 255, 0.45)',
                          transition: 'color 0.18s',
                        }}
                      >
                        {cat.icon}
                      </span>
                    </div>

                    {/* Label & Count badge */}
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-headline)',
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          color: isActive ? cat.color : isHovered ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                          transition: 'color 0.18s',
                        }}
                      >
                        {cat.label}
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '9px',
                            color: cat.color,
                            background: cat.bg,
                            border: `1px solid ${cat.color}30`,
                            padding: '1px 5px',
                            borderRadius: '4px',
                            fontWeight: 600,
                          }}
                        >
                          {cat.count}
                        </span>

                        <span
                          className="material-symbols-outlined"
                          style={{
                            fontSize: '14px',
                            color: 'rgba(255, 255, 255, 0.3)',
                            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease',
                          }}
                        >
                          chevron_right
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </NavLink>

              {/* Expandable sub-algorithm list */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    style={{ overflow: 'hidden', paddingLeft: '1.25rem', marginTop: '2px' }}
                  >
                    <div
                      style={{
                        padding: '2px 0 4px',
                        borderLeft: `1px solid ${cat.color}25`,
                        marginLeft: '0.75rem',
                        paddingLeft: '0.65rem',
                      }}
                    >
                      {cat.algos.map((item, i) => {
                        const isAlgoActive = location.pathname === item.path;

                        return (
                          <motion.div
                            key={item.id}
                            initial={{ x: -6, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.025 }}
                            onClick={() => {
                              navigate(item.path);
                              onClose?.();
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.35rem 0.6rem',
                              marginBottom: '2px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              background: isAlgoActive ? `${cat.color}18` : 'transparent',
                              border: isAlgoActive ? `1px solid ${cat.color}35` : '1px solid transparent',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={e => {
                              if (!isAlgoActive) {
                                const el = e.currentTarget as HTMLDivElement;
                                el.style.background = 'rgba(255, 255, 255, 0.04)';
                                el.style.transform = 'translateX(2px)';
                              }
                            }}
                            onMouseLeave={e => {
                              if (!isAlgoActive) {
                                const el = e.currentTarget as HTMLDivElement;
                                el.style.background = 'transparent';
                                el.style.transform = 'translateX(0)';
                              }
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div
                                style={{
                                  width: 4,
                                  height: 4,
                                  borderRadius: '50%',
                                  background: isAlgoActive ? cat.color : 'rgba(255, 255, 255, 0.25)',
                                  boxShadow: isAlgoActive ? `0 0 6px ${cat.color}` : 'none',
                                }}
                              />
                              <span
                                style={{
                                  fontFamily: 'var(--font-body)',
                                  fontSize: '11px',
                                  color: isAlgoActive ? '#fff' : 'rgba(255, 255, 255, 0.55)',
                                  fontWeight: isAlgoActive ? 600 : 400,
                                }}
                              >
                                {item.label}
                              </span>
                            </div>

                            {item.complexity && (
                              <span
                                style={{
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: '8px',
                                  color: isAlgoActive ? cat.color : 'rgba(255, 255, 255, 0.25)',
                                }}
                              >
                                {item.complexity}
                              </span>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* ── Bottom Telemetry Action Strip ── */}
      <div
        style={{
          padding: '0.85rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          background: 'rgba(11, 12, 18, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <button
          onClick={() => {
            const randomAlgo = ALGORITHMS[Math.floor(Math.random() * ALGORITHMS.length)];
            navigate(randomAlgo.path);
            onClose?.();
          }}
          style={{
            padding: '0.5rem 0.75rem',
            background: 'rgba(79, 209, 165, 0.08)',
            border: '1px solid rgba(79, 209, 165, 0.25)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            color: 'var(--neon-mint)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 600,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.background = 'rgba(79, 209, 165, 0.18)';
            btn.style.boxShadow = '0 0 14px rgba(79, 209, 165, 0.3)';
            btn.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.background = 'rgba(79, 209, 165, 0.08)';
            btn.style.boxShadow = 'none';
            btn.style.transform = 'translateY(0)';
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>shuffle</span>
          Shuffle Random Algo
        </button>
      </div>
    </motion.aside>
  );
}
