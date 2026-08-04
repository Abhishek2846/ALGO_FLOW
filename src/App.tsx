import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import TopNav from './components/layout/TopNav';
import SideNav from './components/layout/SideNav';

// Scroll to top automatically on route navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Pages
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ComparePage from './pages/ComparePage';
import NotFoundPage from './pages/NotFoundPage';

// Sorting
import SortingIndexPage from './pages/sorting/SortingIndexPage';
import BubbleSortPage from './pages/sorting/BubbleSortPage';
import SelectionSortPage from './pages/sorting/SelectionSortPage';
import InsertionSortPage from './pages/sorting/InsertionSortPage';
import MergeSortPage from './pages/sorting/MergeSortPage';
import QuickSortPage from './pages/sorting/QuickSortPage';
import HeapSortPage from './pages/sorting/HeapSortPage';
import CountingSortPage from './pages/sorting/CountingSortPage';
import RadixSortPage from './pages/sorting/RadixSortPage';

// Searching
import SearchingIndexPage from './pages/searching/SearchingIndexPage';
import LinearSearchPage from './pages/searching/LinearSearchPage';
import BinarySearchPage from './pages/searching/BinarySearchPage';
import JumpSearchPage from './pages/searching/JumpSearchPage';
import InterpolationSearchPage from './pages/searching/InterpolationSearchPage';

// Trees
import TreesIndexPage from './pages/trees/TreesIndexPage';
import BinaryTreePage from './pages/trees/BinaryTreePage';
import BSTPage from './pages/trees/BSTPage';
import AVLTreePage from './pages/trees/AVLTreePage';
import HeapPage from './pages/trees/HeapPage';
import TriePage from './pages/trees/TriePage';

// Graphs
import GraphsIndexPage from './pages/graphs/GraphsIndexPage';
import BFSPage from './pages/graphs/BFSPage';
import DFSPage from './pages/graphs/DFSPage';
import DijkstraPage from './pages/graphs/DijkstraPage';
import PrimsMSTPage from './pages/graphs/PrimsMSTPage';
import KruskalsMSTPage from './pages/graphs/KruskalsMSTPage';
import FloydWarshallPage from './pages/graphs/FloydWarshallPage';
import TopologicalSortPage from './pages/graphs/TopologicalSortPage';

// DP
import DPIndexPage from './pages/dp/DPIndexPage';
import FibonacciPage from './pages/dp/FibonacciPage';
import KnapsackPage from './pages/dp/KnapsackPage';
import LCSPage from './pages/dp/LCSPage';
import MatrixChainPage from './pages/dp/MatrixChainPage';
import CoinChangePage from './pages/dp/CoinChangePage';

// Structures
import StructuresIndexPage from './pages/structures/StructuresIndexPage';
import StackPage from './pages/structures/StackPage';
import QueuePage from './pages/structures/QueuePage';
import LinkedListPage from './pages/structures/LinkedListPage';
import HashTablePage from './pages/structures/HashTablePage';
import UnionFindPage from './pages/structures/UnionFindPage';

// Material Symbols (loaded via CDN in index.html)
declare global { interface Window { __MUI?: unknown } }

function Layout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <TopNav onMenuClick={() => setMobileNavOpen(true)} />

      {/* Desktop sidebar — fixed, full height */}
      <div className="d-none d-md-block">
        <SideNav />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileNavOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)',
          }}
          onClick={() => setMobileNavOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ width: 'var(--sidebar-width)', height: '100%', paddingTop: 'var(--topnav-height)' }}>
            <SideNav mobile onClose={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      {/* ── Main content area ── */}
      <main className="main-content">
        {children}
      </main>
    </>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Landing page — no sidebar/topnav */}
        <Route path="/" element={<LandingPage />} />

        {/* All app routes wrapped in Layout */}
        <Route path="/*" element={
          <Layout>
            <AnimatePresence mode="wait">
              <Routes>
                {/* Dashboard */}
                <Route path="/dashboard" element={<HomePage />} />
                <Route path="/compare" element={<ComparePage />} />

            {/* Sorting */}
            <Route path="/sorting" element={<SortingIndexPage />} />
            <Route path="/sorting/bubble-sort"    element={<BubbleSortPage />} />
            <Route path="/sorting/selection-sort" element={<SelectionSortPage />} />
            <Route path="/sorting/insertion-sort" element={<InsertionSortPage />} />
            <Route path="/sorting/merge-sort"     element={<MergeSortPage />} />
            <Route path="/sorting/quick-sort"     element={<QuickSortPage />} />
            <Route path="/sorting/heap-sort"      element={<HeapSortPage />} />
            <Route path="/sorting/counting-sort"  element={<CountingSortPage />} />
            <Route path="/sorting/radix-sort"     element={<RadixSortPage />} />

            {/* Searching */}
            <Route path="/searching" element={<SearchingIndexPage />} />
            <Route path="/searching/linear-search"          element={<LinearSearchPage />} />
            <Route path="/searching/binary-search"          element={<BinarySearchPage />} />
            <Route path="/searching/jump-search"            element={<JumpSearchPage />} />
            <Route path="/searching/interpolation-search"   element={<InterpolationSearchPage />} />

            {/* Trees */}
            <Route path="/trees" element={<TreesIndexPage />} />
            <Route path="/trees/binary-tree" element={<BinaryTreePage />} />
            <Route path="/trees/bst"         element={<BSTPage />} />
            <Route path="/trees/avl-tree"    element={<AVLTreePage />} />
            <Route path="/trees/heap"        element={<HeapPage />} />
            <Route path="/trees/trie"        element={<TriePage />} />

            {/* Graphs */}
            <Route path="/graphs" element={<GraphsIndexPage />} />
            <Route path="/graphs/bfs"               element={<BFSPage />} />
            <Route path="/graphs/dfs"               element={<DFSPage />} />
            <Route path="/graphs/dijkstra"          element={<DijkstraPage />} />
            <Route path="/graphs/prims-mst"         element={<PrimsMSTPage />} />
            <Route path="/graphs/kruskals-mst"      element={<KruskalsMSTPage />} />
            <Route path="/graphs/floyd-warshall"    element={<FloydWarshallPage />} />
            <Route path="/graphs/topological-sort"  element={<TopologicalSortPage />} />

            {/* DP */}
            <Route path="/dp" element={<DPIndexPage />} />
            <Route path="/dp/fibonacci"                    element={<FibonacciPage />} />
            <Route path="/dp/knapsack"                     element={<KnapsackPage />} />
            <Route path="/dp/lcs"                          element={<LCSPage />} />
            <Route path="/dp/matrix-chain-multiplication"  element={<MatrixChainPage />} />
            <Route path="/dp/coin-change"                  element={<CoinChangePage />} />

            {/* Structures */}
            <Route path="/structures" element={<StructuresIndexPage />} />
            <Route path="/structures/stack"        element={<StackPage />} />
            <Route path="/structures/queue"        element={<QueuePage />} />
            <Route path="/structures/linked-list"  element={<LinkedListPage />} />
            <Route path="/structures/hash-table"   element={<HashTablePage />} />
            <Route path="/structures/union-find"   element={<UnionFindPage />} />

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </AnimatePresence>
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}
