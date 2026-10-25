// Number formatting helpers (same rules as the original game).

// 12345 -> "12,345"
export function commas(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Dollar figure with as many trailing zero groups as needed.
export function bigbucks(n) {
  let extra = '';
  while (n > 1.0e15) {
    n /= 1000;
    extra = ',000' + extra;
  }
  return commas(Math.floor(n)) + extra;
}

// 1234 -> "1234.00", 12345 -> "12.35 K", then M, B, T and scientific notation.
export function fmt(n) {
  if (!Number.isFinite(n)) return '∞';
  if (n < 1.0e4) return n.toFixed(2);
  if (n < 1.0e6) return (n / 1e3).toFixed(2) + ' K';
  if (n < 1.0e9) return (n / 1e6).toFixed(2) + ' M';
  if (n < 1.0e12) return (n / 1e9).toFixed(2) + ' B';
  if (n < 1.0e15) return (n / 1e12).toFixed(2) + ' T';
  return n.toExponential(3);
}

export const money = (n) => '$' + fmt(n);

// Compact integer count: 950 -> "950", 12,345 -> "12.3K"
export function count(n) {
  if (n < 1e4) return commas(Math.floor(n));
  if (n < 1e6) return (n / 1e3).toFixed(1) + 'K';
  if (n < 1e9) return (n / 1e6).toFixed(2) + 'M';
  return (n / 1e9).toFixed(2) + 'B';
}

// 3725 -> "1h 02m 05s"
export function duration(totalSeconds) {
  let s = Math.max(0, Math.round(totalSeconds));
  if (!Number.isFinite(s)) return '∞';
  const d = Math.floor(s / 86400); s -= d * 86400;
  const h = Math.floor(s / 3600); s -= h * 3600;
  const m = Math.floor(s / 60); s -= m * 60;
  const pad = (v) => String(v).padStart(2, '0');
  if (d > 0) return `${commas(d)}d ${pad(h)}h ${pad(m)}m`;
  if (h > 0) return `${h}h ${pad(m)}m ${pad(s)}s`;
  if (m > 0) return `${m}m ${pad(s)}s`;
  return `${s}s`;
}

export const pct = (v) => (v * 100).toFixed(2) + '%';
