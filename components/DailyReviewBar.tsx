"use client";

import { Star } from "lucide-react";
import { formatUsd } from "@/lib/format";

type DailyReview = {
  bestTradeLabel: string;
  bestTradePnl: number;
  worstMistakeLabel: string;
  worstMistakePnl: number;
  whatToRepeat: string;
  oneThingToImprove: string;
  tomorrowsFocus: string;
};

function Item({ label, value, valueClass = "" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex-1 min-w-[150px] px-5 py-3">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className={`mt-1 text-sm ${valueClass}`}>{value}</p>
    </div>
  );
}

export default function DailyReviewBar({ dailyReview }: { dailyReview: DailyReview | null }) {
  if (!dailyReview) {
    return (
      <div className="mx-6 my-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface px-5 py-4 lg:mx-8">
        <Star size={16} className="text-warn" fill="currentColor" />
        <span className="text-sm font-medium text-warn">Daily review</span>
        <span className="text-sm text-ink-muted">
          No review logged for today yet.
        </span>
      </div>
    );
  }

  return (
    <div className="mx-6 my-6 flex flex-wrap items-stretch divide-x divide-border rounded-xl border border-border bg-surface lg:mx-8">
      <div className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-warn">
        <Star size={16} fill="currentColor" />
        Daily review
      </div>
      <Item
        label="Best trade"
        value={`${dailyReview.bestTradeLabel} ${formatUsd(dailyReview.bestTradePnl, { sign: true })}`}
        valueClass="num text-profit"
      />
      <Item
        label="Worst mistake"
        value={`${dailyReview.worstMistakeLabel} ${formatUsd(dailyReview.worstMistakePnl)}`}
        valueClass="num text-loss"
      />
      <Item label="What to repeat" value={dailyReview.whatToRepeat} />
      <Item label="One thing to improve" value={dailyReview.oneThingToImprove} />
      <Item label="Tomorrow's focus" value={dailyReview.tomorrowsFocus} />
    </div>
  );
}