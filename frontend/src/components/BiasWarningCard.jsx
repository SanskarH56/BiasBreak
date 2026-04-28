function BiasWarningCard({ rows, target, sensitive, baselineGap }) {
  let gap = 0;

  if (baselineGap !== undefined && baselineGap !== null) {
    gap = Number((Math.abs(baselineGap) * 100).toFixed(1));
  } else {
    const groups = {};

    rows.forEach((row) => {
      const group = row[sensitive];
      const decision = row[target];
      if (!groups[group]) groups[group] = { total: 0, selected: 0 };
      groups[group].total += 1;
      if (decision == 1) groups[group].selected += 1;
    });

    const rates = Object.entries(groups).map(([group, data]) => ({
      group,
      rate: data.selected / data.total,
    }));

    const maxRate = Math.max(...rates.map((item) => item.rate));
    const minRate = Math.min(...rates.map((item) => item.rate));
    gap = Number(((maxRate - minRate) * 100).toFixed(1));
  }

  let status = "Low Risk";
  let message = "Selection rates are fairly balanced across groups.";
  let theme = {
    bg: "rgba(16,185,129,0.07)",
    border: "rgba(16,185,129,0.2)",
    glow: "rgba(16,185,129,0.1)",
    label: "#10b981",
    badge: { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)", color: "#10b981" },
    icon: "✓",
    barColor: "#10b981",
    barBg: "rgba(16,185,129,0.1)",
// BiasWarningCard.jsx
import { useMemo } from "react";

function isPositiveDecision(value) {
  const normalized = String(value).trim().toLowerCase();

  return (
    value === 1 ||
    value === true ||
    normalized === "1" ||
    normalized === "yes" ||
    normalized === "true" ||
    normalized === "selected" ||
    normalized === "accepted" ||
    normalized === "approved" ||
    normalized === "hired" ||
    normalized === "pass"
  );
}

function computeStats(rows = [], target, sensitive) {
  const groups = {};
  let totalSelected = 0;

  rows.forEach((row) => {
    const group = String(row?.[sensitive] ?? "Unknown").trim() || "Unknown";
    const selected = isPositiveDecision(row?.[target]);

    if (!groups[group]) {
      groups[group] = {
        total: 0,
        selected: 0,
      };
    }

    groups[group].total += 1;

    if (selected) {
      groups[group].selected += 1;
      totalSelected += 1;
    }
  });

  const entries = Object.entries(groups)
    .map(([group, data]) => ({
      group,
      rate: data.total > 0 ? data.selected / data.total : 0,
      total: data.total,
      selected: data.selected,
    }))
    .sort((a, b) => b.rate - a.rate);

  const rates = entries.map((entry) => entry.rate);
  const maxRate = rates.length ? Math.max(...rates) : 0;
  const minRate = rates.length ? Math.min(...rates) : 0;
  const gap = rates.length > 1 ? Number(((maxRate - minRate) * 100).toFixed(1)) : 0;
  const overall = rows.length > 0 ? Number(((totalSelected / rows.length) * 100).toFixed(1)) : 0;

  return {
    entries,
    gap,
    overall,
    maxRate,
    minRate,
  };
}

function WarningIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function InfoIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8h.01" />
      <path d="M11 12h1v4h1" />
    </svg>
  );
}

function ShieldIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function getRisk(gap) {
  if (gap >= 30) {
    return {
      level: "severe",
      label: "High bias risk",
      short: "Critical disparity detected",
      description: "One or more groups show a large difference in positive outcome rate. This should be reviewed before use.",
      panelClass: "bg-rose-50 border-rose-100",
      textClass: "text-rose-700",
      badgeClass: "badge-danger",
      barClass: "bg-rose-500",
      icon: <WarningIcon />,
    };
  }

  if (gap >= 15) {
    return {
      level: "moderate",
      label: "Moderate bias risk",
      short: "Investigate before deployment",
      description: "Some group outcome differences are meaningful enough to deserve review and explanation.",
      panelClass: "bg-amber-50 border-amber-100",
      textClass: "text-amber-700",
      badgeClass: "badge-warning",
      barClass: "bg-amber-500",
      icon: <InfoIcon />,
    };
  }

  return {
    level: "low",
    label: "Low bias risk",
    short: "No major disparity detected",
    description: "Group outcome rates appear relatively balanced under the current simple disparity check.",
    panelClass: "bg-emerald-50 border-emerald-100",
    textClass: "text-emerald-700",
    badgeClass: "badge-success",
    barClass: "bg-emerald-500",
    icon: <ShieldIcon />,
  };
}

function EmptyState() {
  return (
    <div className="card card-glow p-6 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-500">
        <InfoIcon />
      </div>

      <h3 className="mt-4 text-xl font-extrabold tracking-[-0.045em] text-slate-950">
        No warning data
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        There is not enough group data to calculate fairness warnings.
      </p>
    </div>
  );
}

function GroupRow({ entry, overall, maxRate, minRate, risk }) {
  const percentage = Number((entry.rate * 100).toFixed(1));
  const diff = Number((percentage - overall).toFixed(1));
  const isHigh = entry.rate === maxRate;
  const isLow = entry.rate === minRate && maxRate !== minRate;

  const diffClass =
    diff > 0 ? "text-emerald-700" : diff < 0 ? "text-rose-700" : "text-slate-500";

  const barClass = isLow ? "bg-rose-500" : isHigh ? risk.barClass : "bg-indigo-500";

  return (
    <div className="border-b border-slate-100 py-3 last:border-b-0">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {(isHigh || isLow) && (
              <span
                className={`rounded-full border px-2 py-0.5 text-[0.62rem] font-extrabold uppercase tracking-wider ${
                  isHigh
                    ? "border-indigo-100 bg-indigo-50 text-indigo-700"
                    : "border-rose-100 bg-rose-50 text-rose-700"
                }`}
              >
                {isHigh ? "Highest" : "Lowest"}
              </span>
            )}

            <span className="truncate font-mono text-sm font-extrabold text-slate-950">
              {entry.group}
            </span>
          </div>

          <p className="mt-1 text-xs font-semibold text-slate-400">
            {entry.selected.toLocaleString()} selected · n={entry.total.toLocaleString()}
          </p>
        </div>

        <div className="text-right">
          <p className="font-mono text-sm font-extrabold text-slate-950">
            {percentage}%
          </p>

          <p className={`font-mono text-xs font-extrabold ${diffClass}`}>
            {diff > 0 ? "+" : ""}
            {diff.toFixed(1)}
          </p>
        </div>
      </div>

      <div className="progress-track h-2">
        <div
          className="absolute top-0 bottom-0 z-10 w-0.5 rounded-full bg-slate-400"
          style={{ left: `${Math.min(Math.max(overall, 0), 100)}%` }}
        />
        <div
          className={`h-full rounded-full ${barClass}`}
          style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}

export default function BiasWarningCard({ rows = [], target, sensitive }) {
  const { entries, gap, overall, maxRate, minRate } = useMemo(
    () => computeStats(rows, target, sensitive),
    [rows, target, sensitive]
  );

  if (!entries.length) {
    return <EmptyState />;
  }

  const risk = getRisk(gap);

  const fourFifthsFailed = entries.some((entry) => {
    if (entry.rate === maxRate) return false;
    if (maxRate === 0) return false;
    return entry.rate / maxRate < 0.8;
  });

  return (
    <div className="card card-glow overflow-hidden">
      <div className={`border-b p-5 ${risk.panelClass}`}>
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ${risk.textClass}`}>
            {risk.icon}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={risk.badgeClass}>{risk.label}</span>
              <span className="badge badge-info">Disparity {gap}%</span>
            </div>

            <h3 className={`mt-3 text-xl font-extrabold tracking-[-0.045em] ${risk.textClass}`}>
              {risk.short}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {risk.description}
            </p>
          </div>
        </div>
      </div>

      <div className="card-body space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Average rate
            </p>
            <p className="mt-2 font-mono text-2xl font-extrabold tracking-[-0.06em] text-slate-950">
              {overall}%
            </p>
          </div>

          <div className={`rounded-2xl border p-4 ${risk.panelClass}`}>
            <p className={`text-xs font-extrabold uppercase tracking-wider ${risk.textClass}`}>
              Max gap
            </p>
            <p className={`mt-2 font-mono text-2xl font-extrabold tracking-[-0.06em] ${risk.textClass}`}>
              {gap}%
            </p>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Group breakdown
            </p>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[0.68rem] font-extrabold text-slate-500">
              marker = avg {overall}%
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4">
            {entries.map((entry) => (
              <GroupRow
                key={entry.group}
                entry={entry}
                overall={overall}
                maxRate={maxRate}
                minRate={minRate}
                risk={risk}
              />
            ))}
          </div>
        </div>

        <div
          className={`rounded-2xl border p-4 ${
            fourFifthsFailed
              ? "border-rose-100 bg-rose-50"
              : "border-emerald-100 bg-emerald-50"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                fourFifthsFailed
                  ? "bg-rose-100 text-rose-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {fourFifthsFailed ? <WarningIcon className="h-4 w-4" /> : <ShieldIcon className="h-4 w-4" />}
            </div>

            <div>
              <p
                className={`text-sm font-extrabold ${
                  fourFifthsFailed ? "text-rose-700" : "text-emerald-700"
                }`}
              >
                EEOC 4/5ths rule: {fourFifthsFailed ? "Failed" : "Passed"}
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                {fourFifthsFailed
                  ? "At least one group selects at less than 80% of the highest group rate. This may indicate adverse impact and should be investigated."
                  : "All groups select at at least 80% of the highest group rate under this simplified rule check."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
