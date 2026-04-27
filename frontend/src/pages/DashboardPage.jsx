// DashboardPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import MetricCard from "../components/MetricCard";
import FairnessChart from "../components/FairnessChart";
import BiasWarningCard from "../components/BiasWarningCard";
import MitigationPanel from "../components/MitigationPanel";
import { analyzeDataset } from "../api/mockBackend";

const STEPS = [
  { number: "01", title: "Upload", description: "Dataset added", done: true },
  { number: "02", title: "Map", description: "Columns selected", done: true },
  { number: "03", title: "Audit", description: "Review metrics", active: true },
  { number: "04", title: "Report", description: "Generate output" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

function ShieldLogo() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-emerald-500 text-white shadow-lg shadow-indigo-500/25">
      <svg
        viewBox="0 0 24 24"
        className="h-4.5 w-4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    </div>
  );
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ReportIcon({ className = "h-4 w-4" }) {
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

function ArrowRightIcon() {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m22 4-10 10.01-3-3" />
    </svg>
  );
}

function XCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}

function LoadingScreen() {
  return (
    <div className="app-shell">
      <div className="top-stripe" />

      <main className="page-container flex min-h-[calc(100vh-4px)] items-center justify-center py-10">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="card card-glow max-w-xl p-8 text-center"
        >
          <div className="relative mx-auto h-20 w-20">
            <div className="absolute inset-0 rounded-full bg-indigo-500/15 blur-2xl" />

            <svg className="absolute inset-0 h-20 w-20 animate-spin" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="28" stroke="#dbe3f0" strokeWidth="5" />
              <path
                d="M32 4a28 28 0 0 1 28 28"
                stroke="#4f46e5"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
              <ShieldLogo />
            </div>
          </div>

          <h1 className="mt-7 text-3xl font-extrabold tracking-[-0.055em] text-slate-950">
            Auditing your dataset
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            Calculating group selection rates, disparity signals, and report-ready fairness insights.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="badge badge-primary">Parsing rows</span>
            <span className="badge badge-info">Computing rates</span>
            <span className="badge badge-success">Finding gaps</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function EmptyState({ onBack }) {
  return (
    <div className="app-shell">
      <div className="top-stripe" />

      <main className="page-container flex min-h-[calc(100vh-4px)] items-center justify-center py-10">
        <div className="card card-glow max-w-xl p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50 text-rose-600">
            <XCircleIcon />
          </div>

          <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.055em] text-slate-950">
            Dashboard data missing
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            This dashboard needs a target column, sensitive attribute, and uploaded rows. Please return to the upload flow.
          </p>

          <button type="button" onClick={onBack} className="btn btn-primary btn-lg mt-6">
            Back to upload
          </button>
        </div>
      </main>
    </div>
  );
}

function ErrorState({ onBack, message }) {
  return (
    <div className="app-shell">
      <div className="top-stripe" />

      <main className="page-container flex min-h-[calc(100vh-4px)] items-center justify-center py-10">
        <div className="card card-glow max-w-xl p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50 text-rose-600">
            <XCircleIcon />
          </div>

          <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.055em] text-slate-950">
            Audit failed
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            {message || "Something went wrong while analyzing your dataset."}
          </p>

          <button type="button" onClick={onBack} className="btn btn-primary btn-lg mt-6">
            Back to column mapping
          </button>
        </div>
      </main>
    </div>
  );
}

function ConfigPill({ label, value, tone = "indigo" }) {
  const toneClass = tone === "violet" ? "text-violet-700" : "text-indigo-700";

  return (
    <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-sm">
      <span className="border-r border-slate-200 bg-slate-50 px-3 py-2 text-[0.68rem] font-extrabold uppercase tracking-wider text-slate-400">
        {label}
      </span>

      <span className={`max-w-[180px] truncate px-3 py-2 font-mono text-xs font-extrabold ${toneClass}`}>
        {value}
      </span>
    </div>
  );
}

function ReportBanner({ onGenerateReport }) {
  return (
    <motion.div variants={fadeUp}>
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 p-6 shadow-2xl shadow-indigo-500/25 lg:p-8">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute bottom-[-90px] right-32 h-52 w-52 rounded-full bg-white/10" />
        <div className="absolute left-10 top-10 h-28 w-28 rounded-full bg-emerald-300/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white/85">
              <ReportIcon />
              Final step
            </div>

            <h2 className="mt-5 text-3xl font-extrabold tracking-[-0.06em] text-white">
              Turn this audit into a report.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75">
              Generate a polished fairness report with configuration details, group breakdowns,
              warnings, mitigation notes, and an executive-ready summary.
            </p>
          </div>

          <button
            type="button"
            onClick={onGenerateReport}
            className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-2xl bg-white px-6 font-extrabold text-indigo-700 shadow-xl shadow-black/15 transition hover:-translate-y-0.5 hover:shadow-2xl"
          >
            <ReportIcon />
            Generate report
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    target,
    sensitive,
    rows,
    columns,
    datasetId = null,
    metadata = null,
    source = "local-csv",
  } = location.state || {};

  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(Boolean(rows && target && sensitive));
  const [error, setError] = useState("");

  const hasRequiredState = Boolean(target && sensitive && Array.isArray(rows) && rows.length);

  useEffect(() => {
    let ignore = false;

    async function runAudit() {
      if (!hasRequiredState) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        /*
          Backend-ready note:
          Right now this uses analyzeDataset(rows, target, sensitive).
          Later replace this with something like:

          const res = datasetId
            ? await analyzeDatasetById(datasetId, { target, sensitive })
            : await uploadAndAnalyzeDataset({ rows, target, sensitive });

          Keep the response shape similar:
          { total, selected, rejected, processedRows, groupMetrics, warnings }
        */

        const result = await analyzeDataset(rows, target, sensitive);

        if (!ignore) {
          setApiData(result);
        }
      } catch {
        if (!ignore) {
          setError("The audit engine could not analyze this dataset. Check your selected columns and try again.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    runAudit();

    return () => {
      ignore = true;
    };
  }, [hasRequiredState, rows, target, sensitive, datasetId]);

  const metrics = useMemo(() => {
    if (!apiData) return null;

    const total = Number(apiData.total || 0);
    const selected = Number(apiData.selected || 0);
    const rejected = Number(apiData.rejected || 0);
    const selectionRate = total > 0 ? (selected / total) * 100 : 0;
    const rejectionRate = total > 0 ? (rejected / total) * 100 : 0;

    return {
      total,
      selected,
      rejected,
      selectionRate,
      rejectionRate,
      selectionRateLabel: selectionRate.toFixed(1),
      rejectionRateLabel: rejectionRate.toFixed(1),
    };
  }, [apiData]);

  if (!hasRequiredState) {
    return <EmptyState onBack={() => navigate("/")} />;
  }

  if (loading || !apiData || !metrics) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onBack={() =>
          navigate("/columns", {
            state: {
              columns: columns || Object.keys(rows?.[0] || {}),
              rows,
              datasetId,
              metadata,
            },
          })
        }
      />
    );
  }

  const processedRows = apiData.processedRows || rows;

  const reportState = {
    target,
    sensitive,
    rows: processedRows,
    columns: columns || Object.keys(rows?.[0] || {}),
    datasetId,
    metadata,
    source,
    auditSummary: {
      total: metrics.total,
      selected: metrics.selected,
      rejected: metrics.rejected,
      selectionRate: metrics.selectionRate,
      rejectionRate: metrics.rejectionRate,
    },
  };

  const backToColumns = () => {
    navigate("/columns", {
      state: {
        columns: columns || Object.keys(rows?.[0] || {}),
        rows,
        datasetId,
        metadata,
        source,
      },
    });
  };

  const generateReport = () => {
    navigate("/report", {
      state: reportState,
    });
  };

  return (
    <div className="app-shell">
      <div className="top-stripe" />

      <nav className="app-nav">
        <div className="page-container flex items-center justify-between gap-5">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={backToColumns}
              className="icon-btn"
              title="Back to column mapping"
              aria-label="Back to column mapping"
            >
              <BackIcon />
            </button>

            <div className="flex items-center gap-3">
              <ShieldLogo />

              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold leading-none tracking-[-0.03em] text-slate-950">
                  BreakBias
                </p>
                <p className="mt-1 hidden text-[0.66rem] font-extrabold uppercase tracking-[0.13em] text-slate-400 sm:block">
                  Fairness Dashboard
                </p>
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            {STEPS.map((step, index) => (
              <div key={step.number} className="flex items-center gap-3">
                <div className={`flex items-center gap-2 ${step.active || step.done ? "opacity-100" : "opacity-45"}`}>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-[0.68rem] font-extrabold ${
                      step.done
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                        : step.active
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                        : "border border-slate-200 bg-white text-slate-400"
                    }`}
                  >
                    {step.done ? "✓" : step.number}
                  </div>

                  <div>
                    <p className="text-xs font-extrabold leading-none text-slate-950">{step.title}</p>
                    <p className="mt-1 text-[0.68rem] font-semibold text-slate-400">{step.description}</p>
                  </div>
                </div>

                {index < STEPS.length - 1 && (
                  <div className={`h-px w-8 ${step.done ? "bg-emerald-200" : "bg-slate-200"}`} />
                )}
              </div>
            ))}
          </div>

          <button type="button" onClick={generateReport} className="btn btn-primary">
            <ReportIcon />
            <span className="hidden sm:inline">Generate report</span>
          </button>
        </div>
      </nav>

      <main className="page-container py-8 lg:py-10">
        <motion.section
          variants={stagger}
          initial="hidden"
          animate="show"
          className="hero-panel mb-7"
        >
          <div className="relative z-10 grid gap-7 p-6 lg:grid-cols-[1fr_0.88fr] lg:p-8">
            <motion.div variants={fadeUp}>
              <div className="section-eyebrow">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-glow" />
                Audit complete
              </div>

              <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[0.98] tracking-[-0.065em] text-slate-950 md:text-5xl">
                Fairness dashboard for your dataset.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                Reviewing{" "}
                <span className="font-mono font-extrabold text-slate-950">
                  {metrics.total.toLocaleString()}
                </span>{" "}
                records to measure how{" "}
                <span className="font-mono font-extrabold text-indigo-700">{target}</span>{" "}
                outcomes differ across{" "}
                <span className="font-mono font-extrabold text-violet-700">{sensitive}</span>.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <ConfigPill label="Target" value={target} tone="indigo" />
                <ConfigPill label="Sensitive" value={sensitive} tone="violet" />
                <ConfigPill label="Source" value={datasetId ? "Backend dataset" : "Local CSV"} tone="indigo" />
              </div>
            </motion.div>

            <motion.div variants={fadeRight} className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="metric-card">
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Audit status
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <CheckCircleIcon />
                  </span>
                  <div>
                    <p className="text-xl font-extrabold tracking-[-0.04em] text-slate-950">
                      Complete
                    </p>
                    <p className="text-sm font-semibold text-slate-500">Ready for report</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2 lg:col-span-1">
                <div className="metric-card">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Selection rate
                  </p>
                  <p className="mt-3 font-mono text-3xl font-extrabold tracking-[-0.06em] text-slate-950">
                    {metrics.selectionRateLabel}%
                  </p>
                  <div className="mt-3 progress-track">
                    <div className="progress-fill" style={{ width: `${metrics.selectionRate}%` }} />
                  </div>
                </div>

                <div className="metric-card">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Rejection rate
                  </p>
                  <p className="mt-3 font-mono text-3xl font-extrabold tracking-[-0.06em] text-slate-950">
                    {metrics.rejectionRateLabel}%
                  </p>
                  <div className="mt-3 progress-track">
                    <div className="h-full rounded-full bg-rose-500" style={{ width: `${metrics.rejectionRate}%` }} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          variants={stagger}
          initial="hidden"
          animate="show"
          className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <motion.div variants={fadeUp}>
            <MetricCard
              title="Total Records"
              value={metrics.total.toLocaleString()}
              sub="Audited in this session"
              trend="Validated"
              trendDir="neutral"
              type="neutral"
              delay={0.05}
              icon={<DatabaseIcon />}
            />
          </motion.div>

          <motion.div variants={fadeUp}>
            <MetricCard
              title="Selected"
              value={metrics.selected.toLocaleString()}
              sub={`${metrics.selectionRateLabel}% selection rate`}
              trend="Positive outcomes"
              trendDir="up"
              type="success"
              delay={0.1}
              icon={<CheckCircleIcon />}
            />
          </motion.div>

          <motion.div variants={fadeUp}>
            <MetricCard
              title="Rejected"
              value={metrics.rejected.toLocaleString()}
              sub={`${metrics.rejectionRateLabel}% rejection rate`}
              trend="Negative outcomes"
              trendDir="down"
              type="danger"
              delay={0.15}
              icon={<XCircleIcon />}
            />
          </motion.div>

          <motion.div variants={fadeUp}>
            <MetricCard
              title="Report Status"
              value="Ready"
              sub="Audit results prepared"
              trend="Generate anytime"
              trendDir="up"
              type="primary"
              delay={0.2}
              icon={<ReportIcon className="h-5 w-5" />}
            />
          </motion.div>
        </motion.section>

        <div className="grid items-start gap-7 xl:grid-cols-[1fr_390px]">
          <motion.section variants={fadeUp} initial="hidden" animate="show" className="min-w-0">
            <FairnessChart rows={processedRows} target={target} sensitive={sensitive} />
          </motion.section>

          <motion.aside variants={stagger} initial="hidden" animate="show" className="space-y-5">
            <motion.div variants={fadeRight}>
              <BiasWarningCard rows={processedRows} target={target} sensitive={sensitive} />
            </motion.div>

            <motion.div variants={fadeRight}>
              <MitigationPanel rows={processedRows} target={target} sensitive={sensitive} />
            </motion.div>
          </motion.aside>
        </div>

        <div className="mt-7">
          <ReportBanner onGenerateReport={generateReport} />
        </div>
      </main>
    </div>
  );
}
