import type { SearchBar, SearchStep, SearchPointers } from '../types';

// ── Helpers ──────────────────────────────────────────────
function cloneBars(bars: SearchBar[]): SearchBar[] {
  return bars.map((b) => ({ ...b }));
}

function snap(
  bars: SearchBar[],
  pointers: SearchPointers,
  comparisons: number,
  foundIndex: number,
  activeLine: number,
  description: string,
): SearchStep {
  return { bars: cloneBars(bars), pointers: { ...pointers }, comparisons, foundIndex, activeLine, description };
}

// ════════════════════════════════════════════════════════
//  LINEAR SEARCH
// ════════════════════════════════════════════════════════
export function generateLinearSearchSteps(arr: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];
  const bars: SearchBar[] = arr.map((v) => ({ value: v, state: 'default' }));
  let comp = 0;

  steps.push(snap(bars, {}, comp, -1, 0, `Linear search for target = ${target}`));

  for (let i = 0; i < bars.length; i++) {
    bars[i].state = 'comparing';
    comp++;
    steps.push(snap(bars, { current: i }, comp, -1, 4, `Checking index ${i}: A[${i}] = ${bars[i].value}`));

    if (bars[i].value === target) {
      bars[i].state = 'found';
      steps.push(snap(bars, { current: i }, comp, i, 5, `✓ Found ${target} at index ${i}!`));
      return steps;
    } else {
      bars[i].state = 'eliminated';
      steps.push(snap(bars, { current: i }, comp, -1, 2, `${bars[i].value} ≠ ${target}, move right`));
    }
  }

  steps.push(snap(bars, {}, comp, -2, 8, `✗ ${target} not found in the array`));
  return steps;
}

// ════════════════════════════════════════════════════════
//  BINARY SEARCH  (requires sorted array)
// ════════════════════════════════════════════════════════
export function generateBinarySearchSteps(arr: number[], target: number): SearchStep[] {
  const sorted = [...arr].sort((a, b) => a - b);
  const steps: SearchStep[] = [];
  const bars: SearchBar[] = sorted.map((v) => ({ value: v, state: 'default' }));
  let comp = 0;

  steps.push(snap(bars, {}, comp, -1, 0, `Binary search for target = ${target} (array auto-sorted)`));

  let lo = 0, hi = bars.length - 1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);

    bars.forEach((b, i) => {
      if (i < lo || i > hi) b.state = 'eliminated';
      else if (i === lo) b.state = 'low';
      else if (i === hi) b.state = 'high';
      else if (i === mid) b.state = 'mid';
      else b.state = 'in-range';
    });
    bars[mid].state = 'comparing';
    comp++;
    steps.push(snap(bars, { low: lo, high: hi, mid }, comp, -1, 4, `lo=${lo} hi=${hi} mid=${mid}: A[${mid}]=${bars[mid].value}`));

    if (bars[mid].value === target) {
      bars[mid].state = 'found';
      steps.push(snap(bars, { low: lo, high: hi, mid }, comp, mid, 5, `✓ Found ${target} at index ${mid}!`));
      return steps;
    } else if (bars[mid].value < target) {
      steps.push(snap(bars, { low: lo, high: hi, mid }, comp, -1, 8, `${bars[mid].value} < ${target} → search right half`));
      lo = mid + 1;
    } else {
      steps.push(snap(bars, { low: lo, high: hi, mid }, comp, -1, 10, `${bars[mid].value} > ${target} → search left half`));
      hi = mid - 1;
    }
  }

  bars.forEach((b) => { if (b.state !== 'eliminated') b.state = 'eliminated'; });
  steps.push(snap(bars, {}, comp, -2, 13, `✗ ${target} not found`));
  return steps;
}

// ════════════════════════════════════════════════════════
//  JUMP SEARCH  (requires sorted array)
// ════════════════════════════════════════════════════════
export function generateJumpSearchSteps(arr: number[], target: number): SearchStep[] {
  const sorted = [...arr].sort((a, b) => a - b);
  const steps: SearchStep[] = [];
  const bars: SearchBar[] = sorted.map((v) => ({ value: v, state: 'default' }));
  let comp = 0;
  const n = bars.length;
  const step = Math.floor(Math.sqrt(n));

  steps.push(snap(bars, {}, comp, -1, 0, `Jump search for ${target}, block size = √${n} ≈ ${step}`));

  let prev = 0;
  let curr = step;

  // Jump phase
  while (curr < n && bars[Math.min(curr, n) - 1].value < target) {
    for (let i = prev; i < Math.min(curr, n); i++) bars[i].state = 'eliminated';
    bars[Math.min(curr, n) - 1].state = 'comparing';
    comp++;
    steps.push(snap(bars, { jumpPos: Math.min(curr, n) - 1, blockStart: prev }, comp, -1, 4,
      `Jump to index ${Math.min(curr, n) - 1}: A[${Math.min(curr, n) - 1}]=${bars[Math.min(curr, n) - 1].value} < ${target}`));
    prev = curr;
    curr += step;
  }

  // Linear scan phase
  const end = Math.min(curr, n);
  for (let i = prev; i < end; i++) {
    if (bars[i].state !== 'eliminated') bars[i].state = 'jump-block';
  }
  steps.push(snap(bars, { blockStart: prev, blockEnd: end - 1 }, comp, -1, 9, `Linear scan block [${prev}..${end - 1}]`));

  for (let i = prev; i < end; i++) {
    bars[i].state = 'comparing';
    comp++;
    steps.push(snap(bars, { current: i, blockStart: prev, blockEnd: end - 1 }, comp, -1, 10,
      `Checking A[${i}] = ${bars[i].value}`));

    if (bars[i].value === target) {
      bars[i].state = 'found';
      steps.push(snap(bars, { current: i }, comp, i, 11, `✓ Found ${target} at index ${i}!`));
      return steps;
    } else if (bars[i].value > target) {
      bars[i].state = 'eliminated';
      steps.push(snap(bars, {}, comp, -2, 12, `${bars[i].value} > ${target}, element not in array`));
      return steps;
    }
    bars[i].state = 'eliminated';
  }

  steps.push(snap(bars, {}, comp, -2, 13, `✗ ${target} not found`));
  return steps;
}

// ════════════════════════════════════════════════════════
//  INTERPOLATION SEARCH  (requires sorted array)
// ════════════════════════════════════════════════════════
export function generateInterpolationSearchSteps(arr: number[], target: number): SearchStep[] {
  const sorted = [...arr].sort((a, b) => a - b);
  const steps: SearchStep[] = [];
  const bars: SearchBar[] = sorted.map((v) => ({ value: v, state: 'default' }));
  let comp = 0;

  steps.push(snap(bars, {}, comp, -1, 0, `Interpolation search for ${target} (array auto-sorted)`));

  let lo = 0, hi = bars.length - 1;

  while (lo <= hi && target >= bars[lo].value && target <= bars[hi].value) {
    if (lo === hi) {
      bars[lo].state = 'comparing';
      comp++;
      steps.push(snap(bars, { pos: lo, low: lo, high: hi }, comp, -1, 5, `Only one element left: A[${lo}]=${bars[lo].value}`));
      if (bars[lo].value === target) {
        bars[lo].state = 'found';
        steps.push(snap(bars, { pos: lo }, comp, lo, 10, `✓ Found ${target} at index ${lo}!`));
      } else {
        bars[lo].state = 'eliminated';
        steps.push(snap(bars, {}, comp, -2, 15, `✗ ${target} not found`));
      }
      return steps;
    }

    const pos = lo + Math.floor(
      ((target - bars[lo].value) * (hi - lo)) / (bars[hi].value - bars[lo].value)
    );
    const clampedPos = Math.max(lo, Math.min(hi, pos));

    bars.forEach((b, i) => {
      if (i < lo || i > hi) b.state = 'eliminated';
      else if (i === clampedPos) b.state = 'pos';
      else b.state = 'in-range';
    });
    comp++;
    steps.push(snap(bars, { low: lo, high: hi, pos: clampedPos }, comp, -1, 5,
      `pos = ${lo} + (${target}-${bars[lo].value})×(${hi}-${lo})/(${bars[hi].value}-${bars[lo].value}) = ${clampedPos}`));

    bars[clampedPos].state = 'comparing';
    steps.push(snap(bars, { low: lo, high: hi, pos: clampedPos }, comp, -1, 10,
      `Comparing A[${clampedPos}] = ${bars[clampedPos].value} with ${target}`));

    if (bars[clampedPos].value === target) {
      bars[clampedPos].state = 'found';
      steps.push(snap(bars, { pos: clampedPos }, comp, clampedPos, 10, `✓ Found ${target} at index ${clampedPos}!`));
      return steps;
    } else if (bars[clampedPos].value < target) {
      bars[clampedPos].state = 'eliminated';
      steps.push(snap(bars, { low: lo, high: hi, pos: clampedPos }, comp, -1, 12, `${bars[clampedPos].value} < ${target} → go right`));
      lo = clampedPos + 1;
    } else {
      bars[clampedPos].state = 'eliminated';
      steps.push(snap(bars, { low: lo, high: hi, pos: clampedPos }, comp, -1, 14, `${bars[clampedPos].value} > ${target} → go left`));
      hi = clampedPos - 1;
    }
  }

  bars.forEach((b) => { if (b.state !== 'found') b.state = 'eliminated'; });
  steps.push(snap(bars, {}, comp, -2, 15, `✗ ${target} not found`));
  return steps;
}
