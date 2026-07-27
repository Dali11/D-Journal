export function formatUsd(value: number, opts: { sign?: boolean } = {}): string {
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const sign = value < 0 ? "-" : opts.sign ? "+" : "";
  return `${sign}$${formatted}`;
}

export function formatUsdCompact(value: number): string {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  if (abs >= 1000) {
    return `${sign}$${(abs / 1000).toFixed(abs % 1000 === 0 ? 0 : 1)}K`;
  }
  return `${sign}$${abs.toFixed(0)}`;
}

export function pnlColor(value: number): string {
  if (value > 0) return "text-profit";
  if (value < 0) return "text-loss";
  return "text-ink-secondary";
}

// The consistency rule compares your single best day's profit against total
// profit, so it can spike into absurd numbers (e.g. 5000%+) when total
// profit is still small. Cap the *display* at a sane ceiling while leaving
// the underlying number intact for the pass/fail check.
export function formatConsistencyPct(pct: number, totalProfit: number): string {
  if (totalProfit <= 0) return "—";
  if (pct > 999) return "999%+";
  return `${Math.round(pct)}%`;
} 