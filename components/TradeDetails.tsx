"use client";

import { Copy } from "lucide-react";
import type { Account, Trade } from "@/lib/types";
import { formatUsd, pnlColor } from "@/lib/format";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-ink-muted">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "num w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-ink-primary outline-none focus:border-accent";

const pillClass =
  "w-full rounded-lg border border-border bg-canvas px-3 py-2 text-left text-sm text-ink-primary";

function SectionCard({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 min-w-[220px]">
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-ink-muted">
        {index}. {title}
      </p>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function formatDateDisplay(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default function TradeDetails({
  trade,
  accounts,
}: {
  trade: Trade | null;
  accounts: Account[];
}) {
  if (!trade) {
    return (
      <section className="rounded-xl border border-border bg-surface p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-ink-secondary">
            Trade details
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <p className="text-sm font-medium text-ink-primary">No trades logged yet</p>
          <p className="text-xs text-ink-muted">
            Log your first trade to see the details here.
          </p>
        </div>
      </section>
    );
  }

  const account = accounts.find((a) => a.id === trade.accountId);

  return (
    <section className="rounded-xl border border-border bg-surface p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-sm font-medium uppercase tracking-wide text-ink-secondary">
          Trade details
        </h2>
        <button className="flex items-center gap-2 text-xs text-ink-muted hover:text-ink-secondary">
          ID: {trade.id}
          <Copy size={13} />
        </button>
      </div>

      <div className="flex flex-wrap gap-8">
        <SectionCard index={1} title="Trade information">
          <Field label="Date">
            <input className={inputClass} defaultValue={formatDateDisplay(trade.date)} readOnly />
          </Field>
          <Field label="Account">
            <div className={pillClass}>{account?.name ?? "Unknown account"}</div>
          </Field>
          <Field label="Instrument">
            <div className="flex items-center gap-2">
              <span className="num text-sm">{trade.instrument}</span>
              {trade.instrumentLabel && (
                <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent">
                  {trade.instrumentLabel}
                </span>
              )}
            </div>
          </Field>
          <Field label="Session">
            <div className={pillClass}>
              {trade.session}
              {trade.sessionTime && (
                <span className="ml-2 text-xs text-ink-muted">{trade.sessionTime}</span>
              )}
            </div>
          </Field>
          <Field label="Entry time">
            <input className={inputClass} defaultValue={trade.entryTime} readOnly />
          </Field>
          <Field label="Exit time">
            <input className={inputClass} defaultValue={trade.exitTime} readOnly />
          </Field>
        </SectionCard>

        <SectionCard index={2} title="Execution">
          <Field label="Direction">
            <div className="flex overflow-hidden rounded-lg border border-border">
              <div
                className={`flex-1 py-2 text-center text-sm font-medium ${trade.direction === "Long"
                    ? "bg-profit/15 text-profit"
                    : "text-ink-muted"
                  }`}
              >
                Long
              </div>
              <div
                className={`flex-1 py-2 text-center text-sm font-medium ${trade.direction === "Short"
                    ? "bg-loss/15 text-loss"
                    : "text-ink-muted"
                  }`}
              >
                Short
              </div>
            </div>
          </Field>
          <Field label="Contracts">
            <input className={inputClass} defaultValue={trade.contracts} readOnly />
          </Field>
          <Field label="Entry price">
            <input className={inputClass} defaultValue={trade.entryPrice} readOnly />
          </Field>
          <Field label="Exit price">
            <input className={inputClass} defaultValue={trade.exitPrice} readOnly />
          </Field>
          <Field label="Risk (USD)">
            <div className={`${pillClass} num`}>
              {formatUsd(trade.riskUsd)}{" "}
              <span className="text-xs text-ink-muted">({trade.riskPts} pts)</span>
            </div>
          </Field>
          <Field label="Reward (USD)">
            <div className={`${pillClass} num`}>
              {formatUsd(trade.rewardUsd)}{" "}
              <span className="text-xs text-ink-muted">({trade.rewardPts} pts)</span>
            </div>
          </Field>
          <Field label="R:R achieved">
            <div className={`${pillClass} num`}>{trade.rrAchieved}R</div>
          </Field>
          <Field label="P&L (USD)">
            <div className={`${pillClass} num font-medium ${pnlColor(trade.pnl)}`}>
              {formatUsd(trade.pnl, { sign: true })}
            </div>
          </Field>
        </SectionCard>

        <SectionCard index={3} title="Setup checklist">
          <Field label="A+ setup?">
            <div className={`${pillClass} text-profit`}>{trade.aPlusSetup}</div>
          </Field>
          <Field label="Trend direction">
            <div className={`${pillClass} text-profit`}>{trade.trendDirection}</div>
          </Field>
          <Field label="HTF bias">
            <div className={`${pillClass} text-profit`}>{trade.htfBias}</div>
          </Field>
          <Field label="Entry confirmation">
            <div className={`${pillClass} text-profit`}>{trade.entryConfirmation}</div>
          </Field>
          <Field label="News nearby?">
            <div className={pillClass}>{trade.newsNearby}</div>
          </Field>
          <Field label="Grade">
            <div className={`${pillClass} font-medium text-accent`}>{trade.grade}</div>
          </Field>
        </SectionCard>

        <SectionCard index={4} title="Psychology">
          <Field label="Confidence before (1–10)">
            <input className={inputClass} defaultValue={trade.confidenceBefore} readOnly />
          </Field>
          <Field label="Emotions before">
            <div className={pillClass}>{trade.emotionsBefore}</div>
          </Field>
          <Field label="Emotions after">
            <div className={pillClass}>{trade.emotionsAfter}</div>
          </Field>
          <Field label="Followed plan?">
            <div className={`${pillClass} text-profit`}>{trade.followedPlan}</div>
          </Field>
          <Field label="Revenge trade?">
            <div className={pillClass}>{trade.revengeTrade}</div>
          </Field>
          <Field label="FOMO?">
            <div className={pillClass}>{trade.fomo}</div>
          </Field>
          <Field label="Notes">
            <textarea
              className={`${inputClass} font-sans`}
              rows={3}
              defaultValue={trade.notes}
              readOnly
            />
          </Field>
        </SectionCard>
      </div>

      {(trade.entryScreenshotUrl || trade.exitScreenshotUrl) && (
        <div className="mt-6 border-t border-border pt-6">
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-ink-muted">
            5. Screenshots
          </p>
          <div className="flex flex-wrap gap-4">
            {trade.entryScreenshotUrl && (
              <a
                href={trade.entryScreenshotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <p className="mb-1.5 text-xs text-ink-muted">Entry</p>
                <img
                  src={trade.entryScreenshotUrl}
                  alt="Entry screenshot"
                  className="h-40 w-auto rounded-lg border border-border object-cover"
                />
              </a>
            )}
            {trade.exitScreenshotUrl && (
              <a
                href={trade.exitScreenshotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <p className="mb-1.5 text-xs text-ink-muted">Exit</p>
                <img
                  src={trade.exitScreenshotUrl}
                  alt="Exit screenshot"
                  className="h-40 w-auto rounded-lg border border-border object-cover"
                />
              </a>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <div className="flex gap-3">
          <button className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover">
            Save trade
          </button>
          <button className="rounded-lg border border-border px-5 py-2.5 text-sm text-ink-secondary hover:border-border-strong">
            Reset
          </button>
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-secondary">
          <input type="checkbox" className="h-4 w-4 rounded border-border accent-accent" />
          Save as template
        </label>
      </div>
    </section>
  );
}