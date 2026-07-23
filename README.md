# Trade journal dashboard

Next.js 14 (App Router) + TypeScript + Tailwind rebuild of the trade journal
dashboard, with typed mock data standing in for a real backend.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Structure

```
app/
  layout.tsx        Root layout, loads Inter + JetBrains Mono
  page.tsx           Composes the dashboard from the components below
  globals.css        Tailwind + the .num utility (tabular-numeral mono style)
components/
  Sidebar.tsx         Nav + account list + streak card
  PageHeader.tsx       Title, date range, "New trade" button
  StatBar.tsx           Headline KPI row (P&L, win rate, expectancy, etc.)
  TradeDetails.tsx     The 5-section trade entry panel
  RightPanel.tsx        Account summary ring + daily P&L calendar
  WeeklyAnalytics.tsx   Equity curve, stats, distribution, session/day/setup charts
  DailyReviewBar.tsx    Bottom "daily review" strip
lib/
  types.ts            All domain types (Trade, Account, PerformanceStats, ...)
  mock-data.ts         Mock data matching the original screenshot
  format.ts            $ / P&L formatting helpers
```

## Wiring up real data

Everything currently reads from `lib/mock-data.ts`. To connect a backend:

1. Replace the mock exports with fetch calls (e.g. in a server component,
   or via `fetch()`/your ORM in `app/page.tsx`) that return data shaped like
   the interfaces in `lib/types.ts`.
2. Component props are already typed against those interfaces, so most
   components only need their data source swapped, not their internals.
3. `TradeDetails.tsx` currently renders read-only fields for the active
   trade — wire `onChange` handlers to `useState`/a form library (e.g.
   `react-hook-form`) when you want it to actually save new trades.

## Design notes

- Dark, near-black surface system (`canvas` / `surface` / `surface-raised`)
  instead of pure black, so cards have depth without relying on shadows.
- One accent color (violet, `#7C6CF2`) used sparingly for primary actions,
  progress, and the consistency ring.
- Every number that represents money, a percentage, or a count uses the
  `.num` utility class — JetBrains Mono with tabular numerals — so figures
  align in columns and the dashboard reads like a trading terminal rather
  than generic dashboard chrome.
