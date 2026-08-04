import type { SortBar, SortStep } from '../types';

// ── Helper: clone bars ──────────────────────────────────
function clone(bars: SortBar[]): SortBar[] {
  return bars.map((b) => ({ ...b }));
}

function snapshot(
  bars: SortBar[],
  comparisons: number,
  swaps: number,
  activeLine: number,
): SortStep {
  return { bars: clone(bars), comparisons, swaps, activeLine };
}

// ═══════════════════════════════════════════════
//  BUBBLE SORT
// ═══════════════════════════════════════════════
export function generateBubbleSortSteps(input: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const bars: SortBar[] = input.map((v) => ({ value: v, state: 'default' }));
  let comp = 0, sw = 0;
  const n = bars.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      bars[j].state = 'comparing';
      bars[j + 1].state = 'comparing';
      comp++;
      steps.push(snapshot(bars, comp, sw, 4));

      if (bars[j].value > bars[j + 1].value) {
        bars[j].state = 'swapping';
        bars[j + 1].state = 'swapping';
        steps.push(snapshot(bars, comp, sw, 5));
        [bars[j], bars[j + 1]] = [bars[j + 1], bars[j]];
        sw++;
        steps.push(snapshot(bars, comp, sw, 6));
      }
      bars[j].state = 'default';
      bars[j + 1].state = 'default';
    }
    bars[n - 1 - i].state = 'sorted';
    steps.push(snapshot(bars, comp, sw, 10));
  }
  bars[0].state = 'sorted';
  steps.push(snapshot(bars, comp, sw, 12));
  return steps;
}

// ═══════════════════════════════════════════════
//  SELECTION SORT
// ═══════════════════════════════════════════════
export function generateSelectionSortSteps(input: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const bars: SortBar[] = input.map((v) => ({ value: v, state: 'default' }));
  let comp = 0, sw = 0;
  const n = bars.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    bars[i].state = 'pivot';
    steps.push(snapshot(bars, comp, sw, 3));

    for (let j = i + 1; j < n; j++) {
      bars[j].state = 'comparing';
      comp++;
      steps.push(snapshot(bars, comp, sw, 4));
      if (bars[j].value < bars[minIdx].value) {
        if (minIdx !== i) bars[minIdx].state = 'default';
        minIdx = j;
        bars[j].state = 'pivot';
        steps.push(snapshot(bars, comp, sw, 6));
      } else {
        bars[j].state = 'default';
      }
    }
    if (minIdx !== i) {
      bars[i].state = 'swapping';
      bars[minIdx].state = 'swapping';
      steps.push(snapshot(bars, comp, sw, 9));
      [bars[i], bars[minIdx]] = [bars[minIdx], bars[i]];
      sw++;
    }
    bars[i].state = 'sorted';
    if (minIdx !== i) bars[minIdx].state = 'default';
    steps.push(snapshot(bars, comp, sw, 10));
  }
  bars[n - 1].state = 'sorted';
  steps.push(snapshot(bars, comp, sw, 11));
  return steps;
}

// ═══════════════════════════════════════════════
//  INSERTION SORT
// ═══════════════════════════════════════════════
export function generateInsertionSortSteps(input: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const bars: SortBar[] = input.map((v) => ({ value: v, state: 'default' }));
  let comp = 0, sw = 0;
  const n = bars.length;

  bars[0].state = 'sorted';
  steps.push(snapshot(bars, comp, sw, 0));

  for (let i = 1; i < n; i++) {
    bars[i].state = 'pivot';
    const key = bars[i].value;
    let j = i - 1;
    steps.push(snapshot(bars, comp, sw, 2));

    while (j >= 0 && bars[j].value > key) {
      bars[j].state = 'comparing';
      comp++;
      steps.push(snapshot(bars, comp, sw, 4));
      bars[j + 1].value = bars[j].value;
      bars[j].state = 'swapping';
      bars[j + 1].state = 'swapping';
      sw++;
      steps.push(snapshot(bars, comp, sw, 5));
      bars[j].state = 'sorted';
      bars[j + 1].state = 'default';
      j--;
    }
    bars[j + 1].value = key;
    bars[j + 1].state = 'sorted';
    steps.push(snapshot(bars, comp, sw, 7));
  }
  bars.forEach((b) => (b.state = 'sorted'));
  steps.push(snapshot(bars, comp, sw, 9));
  return steps;
}

// ═══════════════════════════════════════════════
//  MERGE SORT
// ═══════════════════════════════════════════════
export function generateMergeSortSteps(input: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const bars: SortBar[] = input.map((v) => ({ value: v, state: 'default' }));
  let comp = 0, sw = 0;

  function merge(lo: number, mid: number, hi: number) {
    const left = bars.slice(lo, mid + 1).map((b) => b.value);
    const right = bars.slice(mid + 1, hi + 1).map((b) => b.value);
    let i = 0, j = 0, k = lo;

    while (i < left.length && j < right.length) {
      bars[lo + i].state = 'comparing';
      bars[mid + 1 + j].state = 'comparing';
      comp++;
      steps.push(snapshot(bars, comp, sw, 13));
      bars[lo + i].state = 'default';
      bars[mid + 1 + j].state = 'default';
      if (left[i] <= right[j]) {
        bars[k].value = left[i++];
      } else {
        bars[k].value = right[j++];
        sw++;
      }
      bars[k].state = 'swapping';
      steps.push(snapshot(bars, comp, sw, 14));
      bars[k].state = 'default';
      k++;
    }
    while (i < left.length) { bars[k++].value = left[i++]; }
    while (j < right.length) { bars[k++].value = right[j++]; }
    for (let x = lo; x <= hi; x++) bars[x].state = 'default';
    steps.push(snapshot(bars, comp, sw, 5));
  }

  function mergeSort(lo: number, hi: number) {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    mergeSort(lo, mid);
    mergeSort(mid + 1, hi);
    merge(lo, mid, hi);
  }

  mergeSort(0, bars.length - 1);
  bars.forEach((b) => (b.state = 'sorted'));
  steps.push(snapshot(bars, comp, sw, 5));
  return steps;
}

// ═══════════════════════════════════════════════
//  QUICK SORT
// ═══════════════════════════════════════════════
export function generateQuickSortSteps(input: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const bars: SortBar[] = input.map((v) => ({ value: v, state: 'default' }));
  let comp = 0, sw = 0;

  function partition(lo: number, hi: number): number {
    const pivot = bars[hi].value;
    bars[hi].state = 'pivot';
    steps.push(snapshot(bars, comp, sw, 10));
    let i = lo - 1;

    for (let j = lo; j < hi; j++) {
      bars[j].state = 'comparing';
      comp++;
      steps.push(snapshot(bars, comp, sw, 12));
      if (bars[j].value <= pivot) {
        i++;
        bars[i].state = 'swapping';
        bars[j].state = 'swapping';
        [bars[i], bars[j]] = [bars[j], bars[i]];
        sw++;
        steps.push(snapshot(bars, comp, sw, 14));
        bars[i].state = 'default';
      }
      bars[j].state = 'default';
    }
    bars[i + 1].state = 'swapping';
    bars[hi].state = 'swapping';
    [bars[i + 1], bars[hi]] = [bars[hi], bars[i + 1]];
    sw++;
    steps.push(snapshot(bars, comp, sw, 17));
    bars[i + 1].state = 'sorted';
    bars[hi].state = 'default';
    return i + 1;
  }

  function quickSort(lo: number, hi: number) {
    if (lo >= hi) {
      if (lo === hi) bars[lo].state = 'sorted';
      return;
    }
    const p = partition(lo, hi);
    quickSort(lo, p - 1);
    quickSort(p + 1, hi);
  }

  quickSort(0, bars.length - 1);
  bars.forEach((b) => (b.state = 'sorted'));
  steps.push(snapshot(bars, comp, sw, 18));
  return steps;
}

// ═══════════════════════════════════════════════
//  HEAP SORT
// ═══════════════════════════════════════════════
export function generateHeapSortSteps(input: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const bars: SortBar[] = input.map((v) => ({ value: v, state: 'default' }));
  let comp = 0, sw = 0;
  const n = bars.length;

  function heapify(size: number, i: number) {
    let largest = i;
    const l = 2 * i + 1, r = 2 * i + 2;
    bars[i].state = 'pivot';
    if (l < size) { comp++; if (bars[l].value > bars[largest].value) largest = l; }
    if (r < size) { comp++; if (bars[r].value > bars[largest].value) largest = r; }
    steps.push(snapshot(bars, comp, sw, 11));
    bars[i].state = 'default';
    if (largest !== i) {
      bars[i].state = 'swapping'; bars[largest].state = 'swapping';
      [bars[i], bars[largest]] = [bars[largest], bars[i]];
      sw++;
      steps.push(snapshot(bars, comp, sw, 14));
      bars[i].state = 'default'; bars[largest].state = 'default';
      heapify(size, largest);
    }
  }

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
  steps.push(snapshot(bars, comp, sw, 1));

  // Extract
  for (let i = n - 1; i > 0; i--) {
    bars[0].state = 'swapping'; bars[i].state = 'swapping';
    [bars[0], bars[i]] = [bars[i], bars[0]];
    sw++;
    steps.push(snapshot(bars, comp, sw, 3));
    bars[i].state = 'sorted';
    bars[0].state = 'default';
    heapify(i, 0);
  }
  bars[0].state = 'sorted';
  steps.push(snapshot(bars, comp, sw, 5));
  return steps;
}

// ═══════════════════════════════════════════════
//  COUNTING SORT
// ═══════════════════════════════════════════════
export function generateCountingSortSteps(input: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const bars: SortBar[] = input.map((v) => ({ value: v, state: 'default' }));
  let comp = 0, sw = 0;

  const max = Math.max(...bars.map((b) => b.value));
  const count = new Array(max + 1).fill(0);

  // Count
  bars.forEach((b, i) => {
    bars[i].state = 'comparing';
    count[b.value]++;
    comp++;
    steps.push(snapshot(bars, comp, sw, 3));
    bars[i].state = 'default';
  });

  // Cumulative
  for (let i = 1; i <= max; i++) count[i] += count[i - 1];
  steps.push(snapshot(bars, comp, sw, 6));

  // Build output
  const output: number[] = new Array(bars.length);
  for (let j = bars.length - 1; j >= 0; j--) {
    output[count[bars[j].value] - 1] = bars[j].value;
    count[bars[j].value]--;
  }

  // Animate output placement
  output.forEach((val, i) => {
    bars[i].value = val;
    bars[i].state = 'swapping';
    sw++;
    steps.push(snapshot(bars, comp, sw, 11));
    bars[i].state = 'sorted';
  });

  steps.push(snapshot(bars, comp, sw, 13));
  return steps;
}

// ═══════════════════════════════════════════════
//  RADIX SORT
// ═══════════════════════════════════════════════
export function generateRadixSortSteps(input: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const bars: SortBar[] = input.map((v) => ({ value: v, state: 'default' }));
  let comp = 0, sw = 0;

  const max = Math.max(...bars.map((b) => b.value));

  function countByDigit(exp: number) {
    const n = bars.length;
    const output: number[] = new Array(n);
    const count = new Array(10).fill(0);

    bars.forEach((b) => {
      const digit = Math.floor(b.value / exp) % 10;
      count[digit]++;
      comp++;
    });
    steps.push(snapshot(bars, comp, sw, 9));

    for (let i = 1; i < 10; i++) count[i] += count[i - 1];

    for (let j = n - 1; j >= 0; j--) {
      const digit = Math.floor(bars[j].value / exp) % 10;
      output[count[digit] - 1] = bars[j].value;
      count[digit]--;
      sw++;
    }

    output.forEach((val, i) => {
      bars[i].value = val;
      bars[i].state = 'swapping';
    });
    steps.push(snapshot(bars, comp, sw, 12));
    bars.forEach((b) => (b.state = 'default'));
  }

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countByDigit(exp);
  }

  bars.forEach((b) => (b.state = 'sorted'));
  steps.push(snapshot(bars, comp, sw, 5));
  return steps;
}
