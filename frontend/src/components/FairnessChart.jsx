// FairnessChart.jsx
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PALETTE = [
  { bar: "#4F46E5", light: "#EEF2FF", text: "#3730A3" },
  { bar: "#10B981", light: "#D1FAE5", text: "#047857" },
  { bar: "#F59E0B", light: "#FEF3C7", text: "#B45309" },
  { bar: "#F43F5E", light: "#FFE4E6", text: "#BE123C" },
  { bar: "#7C3AED", light: "#EDE9FE", text: "#5B21B6" },
  { bar: "#3B82F6", light: "#DBEAFE", text: "#1D4ED8" },
  { bar: "#DB2777", light: "#FCE7F3", text: "#9D174D" },
  { bar: "#14B8A6", light: "#CCFBF1", text: "#0F766E" },
];

const RISK_STYLE = {
  low: {
    label: "Low risk",
    badgeClass: "badge-success",
    textClass: "text-emerald-700",
    bgClass: "bg-emerald-50 border-emerald-100",
    barClass: "bg-emerald-500",
  },
  moderate: {
    label: "Moderate risk",
    badgeClass: "badge-warning",
    textClass: "text-amber-700",
    bgClass: "bg-amber-50 border-amber-100",
    barClass: "bg-amber-500",
  },
  severe: {
    label: "High risk",
    badgeClass: "badge-danger",
    textClass: "text-rose-700",
    bgClass: "bg-rose-50 border-rose-100",
    barClass: "bg-rose-500",
  },
};

function FairnessChart({ rows, target, sensitive, groupMetrics }) {
  let chartData = [];

  if (groupMetrics && groupMetrics.length > 0) {
    chartData = groupMetrics.map((item) => ({
      group: item.group_name,
      selectionRate: Number((item.pass_rate * 100).toFixed(1)),
    }));
  } else {
    const groups = {};
    rows.forEach((row) => {
      const group = row[sensitive];
      const decision = row[target];
      if (!groups[group]) groups[group] = { group, total: 0, selected: 0 };
      groups[group].total += 1;
      if (decision == 1) groups[group].selected += 1;
    });

    chartData = Object.values(groups).map((item) => ({
      group: item.group,
      selectionRate: Number(((item.selected / item.total) * 100).toFixed(1)),
    }));
  }
function isPositiveDecision(value) {
  const normalized = String(value ?? "").trim().toLowerCase();

  return (
    value === 1 ||
    value === true ||
    normalized === "1" ||
    normalized === "yes" ||
    normalized === "y" ||
    normalized === "true" ||
    normalized === "selected" ||
    normalized === "select" ||
    normalized === "accepted" ||
    normalized === "accept" ||
    normalized === "approved" ||
    normalized === "approve" ||
    normalized === "hired" ||
    normalized === "hire" ||
    normalized === "pass" ||
    normalized === "passed" ||
    normalized === "positive" ||
    normalized === "success" ||
    normalized === "successful"
  );
}

function ChartTooltip({ active, payload, label, overallRate }) {
  if (!active || !payload?.length) return null;

  const value = Number(payload[0].value || 0);
  const row = payload[0].payload;
  const diff = value - overallRate;
  const isAbove = diff >= 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/15">
      <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>

      <div className="mt-3 flex items-end gap-2">
        <p className="font-mono text-3xl font-extrabold leading-none tracking-[-0.07em] text-slate-950">
          {value.toFixed(1)}%
        </p>
        <p className="pb-1 text-xs font-bold text-slate-400">
          selected
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-extrabold ${
            isAbove
              ? "border-emerald-100 bg-emerald-50 text-emerald-700"
              : "border-rose-100 bg-rose-50 text-rose-700"
          }`}
        >
          {isAbove ? "+" : ""}
          {diff.toFixed(1)}% vs average
        </span>

        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-extrabold text-slate-600">
          n={Number(row.count || 0).toLocaleString()}
        </span>

        <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-extrabold text-slate-600">
          selected={Number(row.selected || 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="card card-glow p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-50 text-slate-500">
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 3v18h18" />
          <path d="M7 16V9" />
          <path d="M12 16V5" />
          <path d="M17 16v-4" />
        </svg>
      </div>

      <h2 className="mt-5 text-2xl font-extrabold tracking-[-0.05em] text-slate-950">
        No chart data available
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        The selected columns did not produce enough group data for a fairness chart.
      </p>
    </div>
  );
}

export default function FairnessChart({ rows = [], target, sensitive }) {
  const analysis = useMemo(() => {
    const groups = {};
    let totalRows = 0;
    let totalSelected = 0;

    rows.forEach((row) => {
      const group = String(row?.[sensitive] ?? "Unknown").trim() || "Unknown";
      const selected = isPositiveDecision(row?.[target]);

      totalRows += 1;

      if (!groups[group]) {
        groups[group] = {
          group,
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

    const overallRate = totalRows > 0 ? (totalSelected / totalRows) * 100 : 0;

    const chartData = Object.values(groups)
      .map((group) => ({
        group: group.group,
        selectionRate:
          group.total > 0
            ? Number(((group.selected / group.total) * 100).toFixed(1))
            : 0,
        selected: group.selected,
        count: group.total,
      }))
      .sort((a, b) => b.selectionRate - a.selectionRate);

    const rates = chartData.map((item) => item.selectionRate);
    const maxRate = rates.length ? Math.max(...rates) : 0;
    const minRate = rates.length ? Math.min(...rates) : 0;
    const maxGap = rates.length > 1 ? maxRate - minRate : 0;

    const riskLevel = maxGap >= 30 ? "severe" : maxGap >= 15 ? "moderate" : "low";
    const riskStyle = RISK_STYLE[riskLevel];

    return {
      chartData,
      overallRate,
      maxGap,
      maxRate,
      minRate,
      riskLevel,
      riskStyle,
      totalRows,
      totalSelected,
    };
  }, [rows, target, sensitive]);

  const {
    chartData,
    overallRate,
    maxGap,
    maxRate,
    minRate,
    riskLevel,
    riskStyle,
    totalRows,
    totalSelected,
  } = analysis;

  if (!chartData.length) {
    return <EmptyChart />;
  }

  const allRatesAreZero = chartData.every((item) => item.selectionRate === 0);

  return (
    <div className="card card-glow flex flex-col overflow-hidden">
      <div className="top-stripe" />

      <div className="card-header">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="section-eyebrow">
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse-glow" />
              Group fairness visualization
            </div>

            <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.055em] text-slate-950">
              Selection rate by group
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Comparing positive outcome rates for{" "}
              <span className="font-mono font-extrabold text-indigo-700">{target}</span>{" "}
              across{" "}
              <span className="font-mono font-extrabold text-violet-700">{sensitive}</span>.
              Larger gaps may indicate fairness risk.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm">
              <p className="text-[0.65rem] font-extrabold uppercase tracking-wider text-slate-400">
                Avg rate
              </p>
              <p className="mt-1 font-mono text-lg font-extrabold tracking-[-0.06em] text-slate-950">
                {overallRate.toFixed(1)}%
              </p>
            </div>

            <div className={`rounded-2xl border p-3 text-center shadow-sm ${riskStyle.bgClass}`}>
              <p className={`text-[0.65rem] font-extrabold uppercase tracking-wider ${riskStyle.textClass}`}>
                Max gap
              </p>
              <p className={`mt-1 font-mono text-lg font-extrabold tracking-[-0.06em] ${riskStyle.textClass}`}>
                {maxGap.toFixed(1)}%
              </p>
            </div>

            <div className={`rounded-2xl border p-3 text-center shadow-sm ${riskStyle.bgClass}`}>
              <p className={`text-[0.65rem] font-extrabold uppercase tracking-wider ${riskStyle.textClass}`}>
                Risk
              </p>
              <p className={`mt-1 text-sm font-extrabold ${riskStyle.textClass}`}>
                {riskStyle.label}
              </p>
            </div>
          </div>
        </div>
      </div>

      {allRatesAreZero && (
        <div className="mx-5 mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <p className="text-sm font-extrabold text-amber-700">
            All selection rates are 0%.
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            This usually means the selected target column values were not recognized as positive outcomes.
            Accepted positive values include yes, y, true, 1, selected, approved, hired, hire, pass, and passed.
          </p>
        </div>
      )}

      <div className="border-b border-slate-100 bg-white px-5 py-4">
        <div className="flex flex-wrap items-center gap-3">
          {chartData.map((item, index) => {
            const palette = PALETTE[index % PALETTE.length];

            return (
              <div
                key={item.group}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5"
              >
                <span
                  className="h-2.5 w-2.5 rounded"
                  style={{ backgroundColor: palette.bar }}
                />
                <span className="font-mono text-xs font-extrabold text-slate-700">
                  {item.group}
                </span>
                <span
                  className="rounded-md px-1.5 py-0.5 font-mono text-[0.65rem] font-extrabold"
                  style={{
                    backgroundColor: palette.light,
                    color: palette.text,
                  }}
                >
                  {item.selectionRate}%
                </span>
              </div>
            );
          })}

          <div className="ml-auto flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
            <span className="h-px w-5 border-t-2 border-dashed border-slate-400" />
            <span className="text-xs font-bold text-slate-500">
              Average {overallRate.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <div className="h-[380px] px-2 pb-4 pt-6 sm:h-[440px] sm:px-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            barCategoryGap="26%"
            margin={{ top: 26, right: 28, left: 4, bottom: 12 }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#e7edf7"
              vertical={false}
            />

            <XAxis
              dataKey="group"
              tick={{
                fill: "#475569",
                fontSize: 12,
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontWeight: 700,
              }}
              axisLine={false}
              tickLine={false}
              dy={10}
              interval={0}
            />

            <YAxis
              unit="%"
              tick={{
                fill: "#94A3B8",
                fontSize: 11,
                fontFamily: "JetBrains Mono, monospace",
                fontWeight: 600,
              }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              width={48}
              tickCount={6}
            />

            <Tooltip
              content={<ChartTooltip overallRate={overallRate} />}
              cursor={{ fill: "rgba(226, 232, 240, 0.42)", radius: 12 }}
            />

            <ReferenceLine
              y={overallRate}
              stroke="#94A3B8"
              strokeDasharray="6 5"
              strokeWidth={1.8}
            />

            <Bar
              dataKey="selectionRate"
              radius={[12, 12, 0, 0]}
              maxBarSize={82}
              minPointSize={allRatesAreZero ? 6 : 3}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={entry.group}
                  fill={PALETTE[index % PALETTE.length].bar}
                  opacity={0.94}
                />
              ))}

              <LabelList
                dataKey="selectionRate"
                position="top"
                formatter={(value) => `${value}%`}
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 11,
                  fontWeight: 800,
                  fill: "#334155",
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card-footer">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Highest group rate
            </p>
            <p className="mt-2 font-mono text-2xl font-extrabold tracking-[-0.06em] text-emerald-700">
              {maxRate.toFixed(1)}%
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Lowest group rate
            </p>
            <p className="mt-2 font-mono text-2xl font-extrabold tracking-[-0.06em] text-rose-700">
              {minRate.toFixed(1)}%
            </p>
          </div>

          <div className={`rounded-2xl border p-4 ${riskStyle.bgClass}`}>
            <p className={`text-xs font-extrabold uppercase tracking-wider ${riskStyle.textClass}`}>
              Interpretation
            </p>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
              {allRatesAreZero
                ? "No positive decisions were detected from the selected target values."
                : riskLevel === "low"
                ? "Group outcomes appear relatively balanced."
                : riskLevel === "moderate"
                ? "Some groups show meaningful outcome differences."
                : "Large group differences require immediate review."}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Chart data check
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-600">
            {totalSelected.toLocaleString()} positive outcomes detected from{" "}
            {totalRows.toLocaleString()} rows.
          </p>
        </div>
      </div>
    </div>
  );
}
