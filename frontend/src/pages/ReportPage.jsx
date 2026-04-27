// ReportPage.jsx
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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

function computeReportStats(rows = [], target, sensitive) {
  let selected = 0;
  let rejected = 0;
  const groups = {};

  rows.forEach((row) => {
    const group = String(row?.[sensitive] ?? "Unknown").trim() || "Unknown";
    const isSelected = isPositiveDecision(row?.[target]);

    if (!groups[group]) {
      groups[group] = {
        total: 0,
        selected: 0,
        rejected: 0,
      };
    }

    groups[group].total += 1;

    if (isSelected) {
      selected += 1;
      groups[group].selected += 1;
    } else {
      rejected += 1;
      groups[group].rejected += 1;
    }
  });

  const total = rows.length;
  const selectionRate = total > 0 ? (selected / total) * 100 : 0;
  const rejectionRate = total > 0 ? (rejected / total) * 100 : 0;

  const groupEntries = Object.entries(groups)
    .map(([group, data]) => ({
      group,
      total: data.total,
      selected: data.selected,
      rejected: data.rejected,
      selectionRate: data.total > 0 ? (data.selected / data.total) * 100 : 0,
    }))
    .sort((a, b) => b.selectionRate - a.selectionRate);

  const rates = groupEntries.map((entry) => entry.selectionRate);
  const highestRate = rates.length ? Math.max(...rates) : 0;
  const lowestRate = rates.length ? Math.min(...rates) : 0;
  const disparityGap = rates.length > 1 ? highestRate - lowestRate : 0;

  const fourFifthsFailed = groupEntries.some((entry) => {
    if (highestRate === 0 || entry.selectionRate === highestRate) return false;
    return entry.selectionRate / highestRate < 0.8;
  });

  const riskLevel =
    disparityGap >= 30 ? "high" : disparityGap >= 15 ? "moderate" : "low";

  return {
    total,
    selected,
    rejected,
    selectionRate,
    rejectionRate,
    groupEntries,
    highestRate,
    lowestRate,
    disparityGap,
    fourFifthsFailed,
    riskLevel,
  };
}

function getRiskMeta(riskLevel) {
  if (riskLevel === "high") {
    return {
      label: "High Risk",
      badgeClass: "badge-danger",
      panelClass: "border-rose-100 bg-rose-50",
      textClass: "text-rose-700",
      summary:
        "The audit found a large disparity between group selection rates. This requires investigation before deployment or decision-making use.",
    };
  }

  if (riskLevel === "moderate") {
    return {
      label: "Moderate Risk",
      badgeClass: "badge-warning",
      panelClass: "border-amber-100 bg-amber-50",
      textClass: "text-amber-700",
      summary:
        "The audit found a meaningful disparity between group selection rates. Review the data, features, and decision process before production use.",
    };
  }

  return {
    label: "Low Risk",
    badgeClass: "badge-success",
    panelClass: "border-emerald-100 bg-emerald-50",
    textClass: "text-emerald-700",
    summary:
      "The audit did not find a large disparity under the current simplified selection-rate analysis. Continue monitoring with more complete fairness tests.",
  };
}

function BackIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

function PrintIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9V2h12v7" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <path d="M6 14h12v8H6z" />
    </svg>
  );
}

function ReportIcon({ className = "h-5 w-5" }) {
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h6" />
    </svg>
  );
}

function EmptyReportState({ onBack }) {
  return (
    <div className="app-shell">
      <div className="top-stripe" />

      <main className="page-container flex min-h-[calc(100vh-4px)] items-center justify-center py-10">
        <div className="card card-glow max-w-xl p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50 text-rose-600">
            <ReportIcon />
          </div>

          <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.055em] text-slate-950">
            Report data missing
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            This report needs dashboard audit data. Go back to the upload flow and generate a dashboard first.
          </p>

          <button type="button" onClick={onBack} className="btn btn-primary btn-lg mt-6">
            Back to upload
          </button>
        </div>
      </main>
    </div>
  );
}

function SummaryTile({ label, value, helper, tone = "slate" }) {
  const toneClass = {
    slate: "text-slate-950",
    success: "text-emerald-700",
    danger: "text-rose-700",
    warning: "text-amber-700",
    primary: "text-indigo-700",
  }[tone];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className={`mt-3 font-mono text-3xl font-extrabold tracking-[-0.065em] ${toneClass}`}>
        {value}
      </p>

      {helper && (
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
          {helper}
        </p>
      )}
    </div>
  );
}

function ConfigRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-bold text-slate-500">{label}</span>
      <span className="font-mono text-sm font-extrabold text-slate-950">{value || "Not available"}</span>
    </div>
  );
}

export default function ReportPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    target,
    sensitive,
    rows = [],
    columns = [],
    datasetId = null,
    metadata = null,
    source = "local-csv",
  } = location.state || {};

  const hasRequiredState = Boolean(target && sensitive && Array.isArray(rows) && rows.length);

  const stats = useMemo(
    () => computeReportStats(rows, target, sensitive),
    [rows, target, sensitive]
  );

  if (!hasRequiredState) {
    return <EmptyReportState onBack={() => navigate("/")} />;
  }

  const risk = getRiskMeta(stats.riskLevel);

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const backToDashboard = () => {
    navigate("/dashboard", {
      state: {
        target,
        sensitive,
        rows,
        columns,
        datasetId,
        metadata,
        source,
      },
    });
  };

  return (
    <div className="app-shell">
      <div className="top-stripe" />

      <main className="page-container py-8 lg:py-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={backToDashboard}
            className="btn btn-secondary w-fit"
          >
            <BackIcon />
            Back to dashboard
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <span className="badge badge-primary">Internal audit document</span>
            <button
              type="button"
              onClick={() => window.print()}
              className="btn btn-primary"
            >
              <PrintIcon />
              Print / save PDF
            </button>
          </div>
        </div>

        <article className="card card-glow overflow-hidden bg-white">
          <div className="top-stripe" />

          <header className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-7 md:p-10">
            <div className="decorative-blob -right-12 -top-12 h-48 w-48 bg-indigo-300" />
            <div className="decorative-blob bottom-0 left-1/3 h-36 w-36 bg-emerald-300" />

            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-emerald-500 text-white shadow-xl shadow-indigo-500/25">
                    <ReportIcon className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="text-sm font-extrabold tracking-[-0.03em] text-slate-950">
                      BreakBias
                    </p>
                    <p className="mt-1 text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                      Fairness Audit Report
                    </p>
                  </div>
                </div>

                <h1 className="mt-8 max-w-3xl text-4xl font-extrabold leading-[0.98] tracking-[-0.065em] text-slate-950 md:text-5xl">
                  Algorithmic fairness audit.
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                  Automated assessment of selection outcomes across demographic groups using the configured
                  target and sensitive attribute.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[310px] lg:grid-cols-1">
                <div className={`rounded-2xl border p-5 shadow-sm ${risk.panelClass}`}>
                  <p className={`text-xs font-extrabold uppercase tracking-wider ${risk.textClass}`}>
                    Audit risk
                  </p>

                  <p className={`mt-2 text-2xl font-extrabold tracking-[-0.05em] ${risk.textClass}`}>
                    {risk.label}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {risk.summary}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Report generated
                  </p>

                  <p className="mt-2 font-mono text-sm font-extrabold text-slate-950">
                    {today}
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-500">
                    Source: {datasetId ? "Backend dataset" : "Local CSV session"}
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className="space-y-10 p-7 md:p-10">
            <section>
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="section-eyebrow">01 · Executive summary</p>
                  <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.05em] text-slate-950">
                    Key audit outcome
                  </h2>
                </div>

                <span className={risk.badgeClass}>{risk.label}</span>
              </div>

              <div className={`rounded-3xl border p-6 ${risk.panelClass}`}>
                <p className="text-base font-semibold leading-8 text-slate-700">
                  The audit analyzed{" "}
                  <span className="font-mono font-extrabold text-slate-950">
                    {stats.total.toLocaleString()}
                  </span>{" "}
                  records using{" "}
                  <span className="font-mono font-extrabold text-indigo-700">{target}</span>{" "}
                  as the decision outcome and{" "}
                  <span className="font-mono font-extrabold text-violet-700">{sensitive}</span>{" "}
                  as the sensitive attribute. The global selection rate is{" "}
                  <span className="font-mono font-extrabold text-slate-950">
                    {stats.selectionRate.toFixed(1)}%
                  </span>
                  , with a measured group disparity gap of{" "}
                  <span className={`font-mono font-extrabold ${risk.textClass}`}>
                    {stats.disparityGap.toFixed(1)}%
                  </span>
                  .
                </p>
              </div>
            </section>

            <section>
              <p className="section-eyebrow">02 · Dataset summary</p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryTile
                  label="Total records"
                  value={stats.total.toLocaleString()}
                  helper="Rows included in audit"
                />

                <SummaryTile
                  label="Selected"
                  value={stats.selected.toLocaleString()}
                  helper={`${stats.selectionRate.toFixed(1)}% positive rate`}
                  tone="success"
                />

                <SummaryTile
                  label="Rejected"
                  value={stats.rejected.toLocaleString()}
                  helper={`${stats.rejectionRate.toFixed(1)}% negative rate`}
                  tone="danger"
                />

                <SummaryTile
                  label="Disparity gap"
                  value={`${stats.disparityGap.toFixed(1)}%`}
                  helper={`${stats.lowestRate.toFixed(1)}% lowest · ${stats.highestRate.toFixed(1)}% highest`}
                  tone={stats.riskLevel === "high" ? "danger" : stats.riskLevel === "moderate" ? "warning" : "success"}
                />
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <p className="section-eyebrow">03 · Audit configuration</p>

                <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <ConfigRow label="Decision column" value={target} />
                  <ConfigRow label="Sensitive attribute" value={sensitive} />
                  <ConfigRow label="Detected columns" value={columns?.length ? columns.length : "Not provided"} />
                  <ConfigRow label="Dataset source" value={datasetId ? `Backend: ${datasetId}` : "Local CSV"} />
                </div>
              </div>

              <div>
                <p className="section-eyebrow">04 · Group findings</p>

                <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white">
                  <div className="grid grid-cols-[1fr_90px_90px_90px] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    <span>Group</span>
                    <span className="text-right">Selected</span>
                    <span className="text-right">Total</span>
                    <span className="text-right">Rate</span>
                  </div>

                  {stats.groupEntries.map((entry) => (
                    <div
                      key={entry.group}
                      className="grid grid-cols-[1fr_90px_90px_90px] gap-3 border-b border-slate-100 px-4 py-4 last:border-b-0"
                    >
                      <span className="truncate font-mono text-sm font-extrabold text-slate-950">
                        {entry.group}
                      </span>

                      <span className="text-right font-mono text-sm font-bold text-emerald-700">
                        {entry.selected.toLocaleString()}
                      </span>

                      <span className="text-right font-mono text-sm font-bold text-slate-600">
                        {entry.total.toLocaleString()}
                      </span>

                      <span className="text-right font-mono text-sm font-extrabold text-indigo-700">
                        {entry.selectionRate.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <p className="section-eyebrow">05 · Rule check</p>

              <div
                className={`mt-5 rounded-3xl border p-6 ${
                  stats.fourFifthsFailed
                    ? "border-rose-100 bg-rose-50"
                    : "border-emerald-100 bg-emerald-50"
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                      stats.fourFifthsFailed
                        ? "bg-rose-100 text-rose-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    <ReportIcon />
                  </div>

                  <div>
                    <h3
                      className={`text-xl font-extrabold tracking-[-0.045em] ${
                        stats.fourFifthsFailed ? "text-rose-700" : "text-emerald-700"
                      }`}
                    >
                      EEOC 4/5ths rule: {stats.fourFifthsFailed ? "Failed" : "Passed"}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {stats.fourFifthsFailed
                        ? "At least one group has a selection rate below 80% of the highest group selection rate. This simplified check indicates potential adverse impact and should be reviewed carefully."
                        : "All groups have a selection rate of at least 80% of the highest group selection rate under this simplified check."}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <p className="section-eyebrow">06 · Recommended next steps</p>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-base font-extrabold tracking-[-0.035em] text-slate-950">
                    Validate data quality
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Check missing values, encoding issues, sample size imbalance, and whether the target column represents a real decision.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-base font-extrabold tracking-[-0.035em] text-slate-950">
                    Investigate group gaps
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Review whether the observed disparity is caused by data collection, policy, model features, or historical bias.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-base font-extrabold tracking-[-0.035em] text-slate-950">
                    Run mitigation
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Compare pre-processing, in-processing, or post-processing mitigation strategies before real-world deployment.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <footer className="border-t border-slate-200 bg-slate-50 px-7 py-6 text-center md:px-10">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">
              Strictly confidential · For internal auditing purposes only
            </p>
          </footer>
        </article>
      </main>
    </div>
  );
}
