import type { DPCellData, DPStep } from '../types';

// ── Helpers ──────────────────────────────────────────────
function cloneTable(table: DPCellData[][]): DPCellData[][] {
  return table.map((row) => row.map((cell) => ({ ...cell })));
}

function snap(
  table: DPCellData[][],
  rowLabels: string[],
  colLabels: string[],
  activeLine: number,
  description: string,
  activeCell?: { r: number; c: number },
): DPStep {
  return {
    table: cloneTable(table),
    rowLabels: [...rowLabels],
    colLabels: [...colLabels],
    activeLine,
    description,
    activeCell,
  };
}

function createEmptyTable(rows: number, cols: number): DPCellData[][] {
  const table: DPCellData[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: DPCellData[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({ value: null, state: 'default' });
    }
    table.push(row);
  }
  return table;
}

// ════════════════════════════════════════════════════════
// 1. FIBONACCI (Tabulation)
// ════════════════════════════════════════════════════════
export function generateFibonacciSteps(n = 8): DPStep[] {
  const steps: DPStep[] = [];
  const rows = 1;
  const cols = n + 1;
  const table = createEmptyTable(rows, cols);
  const rowLabels = ['dp[i]'];
  const colLabels = Array.from({ length: cols }, (_, i) => `n=${i}`);

  steps.push(snap(table, rowLabels, colLabels, 0, `Initialize DP table for Fib(0..${n})`));

  table[0][0] = { value: 0, state: 'filled', subtext: 'Base 0' };
  steps.push(snap(table, rowLabels, colLabels, 1, `Base Case: dp[0] = 0`, { r: 0, c: 0 }));

  if (n >= 1) {
    table[0][1] = { value: 1, state: 'filled', subtext: 'Base 1' };
    steps.push(snap(table, rowLabels, colLabels, 1, `Base Case: dp[1] = 1`, { r: 0, c: 1 }));
  }

  for (let i = 2; i <= n; i++) {
    table[0][i] = { value: '?', state: 'computing' };
    table[0][i - 1].state = 'dependency';
    table[0][i - 2].state = 'dependency';
    const val1 = table[0][i - 1].value as number;
    const val2 = table[0][i - 2].value as number;
    const sum = val1 + val2;

    steps.push(snap(table, rowLabels, colLabels, 3, `Compute dp[${i}] = dp[${i - 1}] (${val1}) + dp[${i - 2}] (${val2}) = ${sum}`, { r: 0, c: i }));

    table[0][i] = { value: sum, state: 'filled' };
    table[0][i - 1].state = 'filled';
    table[0][i - 2].state = 'filled';
    steps.push(snap(table, rowLabels, colLabels, 3, `Stored dp[${i}] = ${sum}`, { r: 0, c: i }));
  }

  table[0][n].state = 'optimal';
  steps.push(snap(table, rowLabels, colLabels, 4, `✓ Fib(${n}) = ${table[0][n].value}!`, { r: 0, c: n }));
  return steps;
}

// ════════════════════════════════════════════════════════
// 2. 0/1 KNAPSACK PROBLEM
// ════════════════════════════════════════════════════════
export function generateKnapsackSteps(
  weights = [2, 3, 4, 5],
  values = [3, 4, 5, 6],
  capacity = 5,
): DPStep[] {
  const steps: DPStep[] = [];
  const n = weights.length;
  const rows = n + 1;
  const cols = capacity + 1;

  const table = createEmptyTable(rows, cols);
  const rowLabels = ['Ø (0)', ...weights.map((w, i) => `w=${w}, v=${values[i]}`)];
  const colLabels = Array.from({ length: cols }, (_, i) => `W=${i}`);

  steps.push(snap(table, rowLabels, colLabels, 0, `Initialize 0/1 Knapsack DP Table (${n} items, Capacity = ${capacity})`));

  // Initialize base rows/cols with 0
  for (let r = 0; r < rows; r++) table[r][0] = { value: 0, state: 'filled' };
  for (let c = 0; c < cols; c++) table[0][c] = { value: 0, state: 'filled' };

  steps.push(snap(table, rowLabels, colLabels, 1, `Base Cases: 0 items or 0 capacity yields value = 0`));

  for (let i = 1; i <= n; i++) {
    const w = weights[i - 1];
    const v = values[i - 1];

    for (let cap = 1; cap <= capacity; cap++) {
      table[i][cap] = { value: '?', state: 'computing' };

      if (w > cap) {
        table[i - 1][cap].state = 'dependency';
        const val = table[i - 1][cap].value as number;
        steps.push(snap(table, rowLabels, colLabels, 4, `Item ${i} (w=${w}) > capacity ${cap}: Cannot include. Copy dp[${i - 1}][${cap}] = ${val}`, { r: i, c: cap }));
        table[i][cap] = { value: val, state: 'filled' };
        table[i - 1][cap].state = 'filled';
      } else {
        const dontTake = table[i - 1][cap].value as number;
        const take = (table[i - 1][cap - w].value as number) + v;
        table[i - 1][cap].state = 'dependency';
        table[i - 1][cap - w].state = 'dependency';

        const best = Math.max(dontTake, take);
        steps.push(snap(table, rowLabels, colLabels, 6, `Item ${i}: max(exclude: ${dontTake}, include: ${v}+${table[i - 1][cap - w].value} = ${take}) = ${best}`, { r: i, c: cap }));
        table[i][cap] = { value: best, state: 'filled' };
        table[i - 1][cap].state = 'filled';
        table[i - 1][cap - w].state = 'filled';
      }
    }
  }

  // Backtrack optimal items
  let r = n, c = capacity;
  while (r > 0 && c > 0) {
    table[r][c].state = 'optimal';
    if (table[r][c].value !== table[r - 1][c].value) {
      c -= weights[r - 1];
    }
    r--;
  }
  table[0][0].state = 'optimal';

  steps.push(snap(table, rowLabels, colLabels, 9, `✓ Maximum value for capacity ${capacity} is ${table[n][capacity].value}!`, { r: n, c: capacity }));
  return steps;
}

// ════════════════════════════════════════════════════════
// 3. LONGEST COMMON SUBSEQUENCE (LCS)
// ════════════════════════════════════════════════════════
export function generateLCSSteps(s1 = 'STONE', s2 = 'LONGEST'): DPStep[] {
  const steps: DPStep[] = [];
  const m = s1.length;
  const n = s2.length;
  const rows = m + 1;
  const cols = n + 1;

  const table = createEmptyTable(rows, cols);
  const rowLabels = ['Ø', ...s1.split('')];
  const colLabels = ['Ø', ...s2.split('')];

  steps.push(snap(table, rowLabels, colLabels, 0, `LCS Table for "${s1}" vs "${s2}"`));

  for (let r = 0; r < rows; r++) table[r][0] = { value: 0, state: 'filled' };
  for (let c = 0; c < cols; c++) table[0][c] = { value: 0, state: 'filled' };

  steps.push(snap(table, rowLabels, colLabels, 1, `Base Cases: LCS with empty string = 0`));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const char1 = s1[i - 1];
      const char2 = s2[j - 1];
      table[i][j] = { value: '?', state: 'computing' };

      if (char1 === char2) {
        table[i - 1][j - 1].state = 'dependency';
        const prev = table[i - 1][j - 1].value as number;
        const val = prev + 1;
        steps.push(snap(table, rowLabels, colLabels, 4, `Match '${char1}' == '${char2}': 1 + dp[${i - 1}][${j - 1}] (${prev}) = ${val}`, { r: i, c: j }));
        table[i][j] = { value: val, state: 'filled' };
        table[i - 1][j - 1].state = 'filled';
      } else {
        table[i - 1][j].state = 'dependency';
        table[i][j - 1].state = 'dependency';
        const top = table[i - 1][j].value as number;
        const left = table[i][j - 1].value as number;
        const val = Math.max(top, left);
        steps.push(snap(table, rowLabels, colLabels, 6, `Mismatch '${char1}' ≠ '${char2}': max(top:${top}, left:${left}) = ${val}`, { r: i, c: j }));
        table[i][j] = { value: val, state: 'filled' };
        table[i - 1][j].state = 'filled';
        table[i][j - 1].state = 'filled';
      }
    }
  }

  // Backtrack LCS
  let i = m, j = n;
  while (i > 0 && j > 0) {
    table[i][j].state = 'optimal';
    if (s1[i - 1] === s2[j - 1]) {
      i--; j--;
    } else if ((table[i - 1][j].value as number) >= (table[i][j - 1].value as number)) {
      i--;
    } else {
      j--;
    }
  }

  steps.push(snap(table, rowLabels, colLabels, 8, `✓ Longest Common Subsequence length = ${table[m][n].value}!`, { r: m, c: n }));
  return steps;
}

// ════════════════════════════════════════════════════════
// 4. MATRIX CHAIN MULTIPLICATION
// ════════════════════════════════════════════════════════
export function generateMatrixChainSteps(dims = [10, 30, 5, 60]): DPStep[] {
  const steps: DPStep[] = [];
  const n = dims.length - 1; // 3 matrices
  const rows = n;
  const cols = n;
  const table = createEmptyTable(rows, cols);
  const rowLabels = Array.from({ length: n }, (_, i) => `M${i + 1}`);
  const colLabels = Array.from({ length: n }, (_, i) => `M${i + 1}`);

  steps.push(snap(table, rowLabels, colLabels, 0, `Matrix Chain Multiplication for ${n} matrices with dimensions [${dims.join(', ')}]`));

  // Base case: M[i][i] = 0
  for (let i = 0; i < n; i++) {
    table[i][i] = { value: 0, state: 'filled' };
  }
  steps.push(snap(table, rowLabels, colLabels, 2, `Diagonal Base Cases: 0 scalar multiplications to multiply a matrix with itself`));

  // L is chain length
  for (let L = 2; L <= n; L++) {
    for (let i = 0; i < n - L + 1; i++) {
      const j = i + L - 1;
      table[i][j] = { value: Infinity, state: 'computing' };

      for (let k = i; k < j; k++) {
        table[i][k].state = 'dependency';
        table[k + 1][j].state = 'dependency';
        const cost =
          (table[i][k].value as number) +
          (table[k + 1][j].value as number) +
          dims[i] * dims[k + 1] * dims[j + 1];

        steps.push(snap(table, rowLabels, colLabels, 5, `Split at k=${k + 1}: cost = ${table[i][k].value} + ${table[k + 1][j].value} + (${dims[i]}×${dims[k + 1]}×${dims[j + 1]}) = ${cost}`, { r: i, c: j }));

        if (cost < (table[i][j].value as number)) {
          table[i][j].value = cost;
        }
        table[i][k].state = 'filled';
        table[k + 1][j].state = 'filled';
      }
      table[i][j].state = 'filled';
    }
  }

  table[0][n - 1].state = 'optimal';
  steps.push(snap(table, rowLabels, colLabels, 8, `✓ Minimum scalar multiplications to multiply matrices = ${table[0][n - 1].value}!`, { r: 0, c: n - 1 }));
  return steps;
}

// ════════════════════════════════════════════════════════
// 5. COIN CHANGE PROBLEM
// ════════════════════════════════════════════════════════
export function generateCoinChangeSteps(coins = [1, 3, 4], amount = 6): DPStep[] {
  const steps: DPStep[] = [];
  const rows = 1;
  const cols = amount + 1;
  const table = createEmptyTable(rows, cols);
  const rowLabels = [`Coins:[${coins.join(',')}]`];
  const colLabels = Array.from({ length: cols }, (_, i) => `$${i}`);

  steps.push(snap(table, rowLabels, colLabels, 0, `Coin Change: Minimum coins to make amount $${amount} using coins [${coins.join(', ')}]`));

  table[0][0] = { value: 0, state: 'filled', subtext: 'Base $0' };
  steps.push(snap(table, rowLabels, colLabels, 1, `Base Case: dp[0] = 0 coins for $0`, { r: 0, c: 0 }));

  for (let a = 1; a <= amount; a++) {
    table[0][a] = { value: Infinity, state: 'computing' };
    steps.push(snap(table, rowLabels, colLabels, 3, `Compute min coins for amount $${a}...`, { r: 0, c: a }));

    let minCoins = Infinity;
    for (const c of coins) {
      if (a - c >= 0 && table[0][a - c].value !== null && table[0][a - c].value !== Infinity) {
        table[0][a - c].state = 'dependency';
        const sub = (table[0][a - c].value as number) + 1;
        if (sub < minCoins) minCoins = sub;
        steps.push(snap(table, rowLabels, colLabels, 5, `Try coin $${c}: 1 + dp[${a - c}] (${table[0][a - c].value}) = ${sub}`, { r: 0, c: a }));
        table[0][a - c].state = 'filled';
      }
    }

    table[0][a] = { value: minCoins === Infinity ? '∞' : minCoins, state: 'filled' };
    steps.push(snap(table, rowLabels, colLabels, 7, `Stored min coins for $${a} = ${table[0][a].value}`, { r: 0, c: a }));
  }

  table[0][amount].state = 'optimal';
  steps.push(snap(table, rowLabels, colLabels, 9, `✓ Minimum coins required for amount $${amount} = ${table[0][amount].value}!`, { r: 0, c: amount }));
  return steps;
}
