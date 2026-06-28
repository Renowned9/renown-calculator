// Core math utilities for all calculator modes

export const DEG_TO_RAD = Math.PI / 180;
export const RAD_TO_DEG = 180 / Math.PI;

// ── Trigonometry ──────────────────────────────────────────────────────────────
export function trig(fn, value, isDeg) {
  const v = isDeg ? value * DEG_TO_RAD : value;
  switch (fn) {
    case 'sin':  return Math.sin(v);
    case 'cos':  return Math.cos(v);
    case 'tan':  return Math.tan(v);
    case 'asin': return isDeg ? Math.asin(value) * RAD_TO_DEG : Math.asin(value);
    case 'acos': return isDeg ? Math.acos(value) * RAD_TO_DEG : Math.acos(value);
    case 'atan': return isDeg ? Math.atan(value) * RAD_TO_DEG : Math.atan(value);
    default: throw new Error('Unknown trig fn');
  }
}

// ── Hyperbolic ────────────────────────────────────────────────────────────────
export function hyperbolic(fn, value) {
  switch (fn) {
    case 'sinh':  return Math.sinh(value);
    case 'cosh':  return Math.cosh(value);
    case 'tanh':  return Math.tanh(value);
    case 'asinh': return Math.asinh(value);
    case 'acosh': return Math.acosh(value);
    case 'atanh': return Math.atanh(value);
    default: throw new Error('Unknown hyperbolic fn');
  }
}

// ── Basic helpers ─────────────────────────────────────────────────────────────
export function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) throw new Error('Invalid input for factorial');
  if (n > 170) throw new Error('Overflow');
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

export function permutation(n, r) {
  if (r > n) throw new Error('r cannot be greater than n');
  return factorial(n) / factorial(n - r);
}

export function combination(n, r) {
  if (r > n) throw new Error('r cannot be greater than n');
  return factorial(n) / (factorial(r) * factorial(n - r));
}

export function gcd(a, b) {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

export function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

export function isPrime(n) {
  n = Math.round(n);
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

// ── Statistics ────────────────────────────────────────────────────────────────
export function stats(numbers) {
  if (!numbers.length) throw new Error('Empty dataset');
  const n = numbers.length;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mean = numbers.reduce((s, x) => s + x, 0) / n;

  const variance = numbers.reduce((s, x) => s + (x - mean) ** 2, 0) / n;
  const sampleVariance = n > 1
    ? numbers.reduce((s, x) => s + (x - mean) ** 2, 0) / (n - 1)
    : 0;

  const mid = Math.floor(n / 2);
  const median = n % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];

  const freq = {};
  numbers.forEach(x => { freq[x] = (freq[x] || 0) + 1; });
  const maxFreq = Math.max(...Object.values(freq));
  const modes = Object.keys(freq)
    .filter(k => freq[k] === maxFreq)
    .map(Number);

  return {
    count: n,
    sum: numbers.reduce((s, x) => s + x, 0),
    mean,
    median,
    mode: modes,
    min: sorted[0],
    max: sorted[n - 1],
    range: sorted[n - 1] - sorted[0],
    variance,
    sampleVariance,
    stdDev: Math.sqrt(variance),
    sampleStdDev: Math.sqrt(sampleVariance),
    q1: sorted[Math.floor(n / 4)],
    q3: sorted[Math.floor((3 * n) / 4)],
  };
}

// ── Matrix helpers ────────────────────────────────────────────────────────────
export function matAdd(A, B) {
  return A.map((row, i) => row.map((v, j) => v + B[i][j]));
}

export function matSub(A, B) {
  return A.map((row, i) => row.map((v, j) => v - B[i][j]));
}

export function matMul(A, B) {
  const rows = A.length, cols = B[0].length, inner = B.length;
  return Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (_, j) =>
      Array.from({ length: inner }, (__, k) => A[i][k] * B[k][j])
        .reduce((s, v) => s + v, 0)
    )
  );
}

export function matScalar(A, s) {
  return A.map(row => row.map(v => v * s));
}

export function matTranspose(A) {
  return A[0].map((_, j) => A.map(row => row[j]));
}

export function matDet(A) {
  const n = A.length;
  if (n === 1) return A[0][0];
  if (n === 2) return A[0][0] * A[1][1] - A[0][1] * A[1][0];
  let det = 0;
  for (let j = 0; j < n; j++) {
    det += (j % 2 === 0 ? 1 : -1) * A[0][j] * matDet(minor(A, 0, j));
  }
  return det;
}

function minor(A, row, col) {
  return A.filter((_, i) => i !== row).map(r => r.filter((_, j) => j !== col));
}

export function matInverse(A) {
  const n = A.length;
  const det = matDet(A);
  if (Math.abs(det) < 1e-10) throw new Error('Matrix is singular');
  if (n === 1) return [[1 / A[0][0]]];

  const cofactors = A.map((row, i) =>
    row.map((_, j) => (((i + j) % 2 === 0) ? 1 : -1) * matDet(minor(A, i, j)))
  );
  const adj = matTranspose(cofactors);
  return matScalar(adj, 1 / det);
}

export function matTrace(A) {
  return A.reduce((s, row, i) => s + row[i], 0);
}

export function fmtNum(n) {
  if (!isFinite(n)) return String(n);
  if (Math.abs(n) < 1e-10 && n !== 0) return '0';
  const s = parseFloat(n.toPrecision(10));
  return String(s);
}

export function fmtMatrix(M) {
  return M.map(row => row.map(fmtNum));
}
