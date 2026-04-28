// MitigationPanel.jsx
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { runMitigationSimulation } from "../api/mockBackend";

function MitigationPanel({ rows, target, sensitive, analysis_id, featuresAnalyzed = [], baselineGap }) {
  const [method, setMethod] = useState("threshold_tuning");
  const [featureToRemove, setFeatureToRemove] = useState(featuresAnalyzed[0] || sensitive);
  const [afterGap, setAfterGap] = useState(null);
  const [improvement, setImprovement] = useState(null);
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

function calculateStats(data = [], target, sensitive) {
  const groups = {};
  let selectedCount = 0;

  data.forEach((row) => {
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
      selectedCount += 1;
    }
  });

  const entries = Object.entries(groups).map(([group, data]) => ({
    group,
    rate: data.total > 0 ? data.selected / data.total : 0,
    total: data.total,
    selected: data.selected,
  }));

  const rates = entries.map((entry) => entry.rate);
  const gap = rates.length > 1 ? Number(((Math.max(...rates) - Math.min(...rates)) * 100).toFixed(1)) : 0;
  const overall = data.length > 0 ? Number(((selectedCount / data.length) * 100).toFixed(1)) : 0;

  return {
    gap,
    overall,
    entries,
  };
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle opacity={0.25} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path
        opacity={0.85}
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.37 0 0 5.37 0 12h4z"
      />
    </svg>
  );
}

function ToolIcon({ className = "h-5 w-5" }) {
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
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function LightningIcon({ className = "h-4 w-4" }) {
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
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function ResetIcon({ className = "h-4 w-4" }) {
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
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v6h6" />
    </svg>
  );
}

function CheckIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

function GapGauge({ value, max = 100, tone = "warning" }) {
  const size = 94;
  const stroke = 9;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(Math.max(value / max, 0), 1);
  const dashOffset = circumference * (1 - percentage);

  const toneClass = {
    success: "text-emerald-600",
    warning: "text-amber-600",
    danger: "text-rose-600",
    neutral: "text-slate-400",
    primary: "text-indigo-600",
  }[tone];

  return (
    <div className="relative flex h-[94px] w-[94px] shrink-0 items-center justify-center">
      <svg className="-rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e9eff8"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className={toneClass}
          style={{ transition: "stroke-dashoffset 700ms cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
      </svg>

      <div className="absolute text-center">
        <p className={`font-mono text-lg font-extrabold leading-none tracking-[-0.06em] ${toneClass}`}>
          {value}%
        </p>
      </div>
    </div>
  );
}

function getGapTone(gap) {
  if (gap >= 30) return "danger";
  if (gap >= 15) return "warning";
  return "success";
}

export default function MitigationPanel({ rows = [], target, sensitive }) {
  const [afterRows, setAfterRows] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const before = useMemo(() => calculateStats(rows, target, sensitive), [rows, target, sensitive]);

  const after = useMemo(
    () => (afterRows ? calculateStats(afterRows, target, sensitive) : null),
    [afterRows, target, sensitive]
  );

  const improvement = after ? Number((before.gap - after.gap).toFixed(1)) : null;
  const improvementPercent = after && before.gap > 0 ? Math.round((improvement / before.gap) * 100) : 0;

  const applyMitigation = async () => {
    setLoading(true);
    try {
      const payload = {
        analysis_id: analysis_id,
        method: method
      };
      if (method === "feature_removal") {
        if (!featureToRemove) throw new Error("Please select a feature to remove.");
        payload.params = { feature_to_remove: featureToRemove };
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/mitigate/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Mitigation failed");

      const gapSummary = data.comparison.after_mitigation.disparity_summaries.find(d => d.metric_name === "Selection Rate Gap");
      const afterVal = gapSummary ? (gapSummary.value * 100).toFixed(1) : "0.0";
      
      setAfterGap(afterVal);
      setImprovement((parseFloat(beforeGap) - parseFloat(afterVal)).toFixed(1));
    } catch (err) {
      console.error(err);
      alert("Error applying mitigation: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const beforeGap = baselineGap !== undefined && baselineGap !== null 
    ? (baselineGap * 100).toFixed(1) 
    : calculateGap(rows);

  return (
    <div style={{
      background: "linear-gradient(135deg, #161b2e 0%, #1c2340 100%)",
      border: "1px solid rgba(99,120,255,0.12)",
      borderRadius: "16px",
      padding: "28px",
      marginTop: "20px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#64748b", marginBottom: "6px" }}>
            Remediation
          </p>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.3px" }}>
            Mitigation Comparison
          </h2>
  const handleRunFix = async () => {
    setLoading(true);
    setError("");

    try {
      /*
        Backend-ready note:
        This currently calls the mock mitigation simulation.
        Later, replace this with a real API call like:
        const result = await runMitigation({ datasetId, target, sensitive, strategy: "reweighing" });
      */

      const result = await runMitigationSimulation(rows, target, sensitive);
      setAfterRows(result.mitigatedRows);
    } catch (err) {
      console.error(err);
      setError("Simulation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAfterRows(null);
    setError("");
  };

  const beforeTone = getGapTone(before.gap);
  const afterTone = after ? getGapTone(after.gap) : "neutral";

  return (
    <div className="card card-glow overflow-hidden">
      <div className="card-header">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-700">
              <ToolIcon />
            </div>

            <div>
              <div className="section-eyebrow">
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse-glow" />
                Remediation
              </div>

              <h3 className="mt-3 text-xl font-extrabold tracking-[-0.045em] text-slate-950">
                Mitigation simulator
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Estimate how a simple reweighing-style correction could change the disparity gap.
              </p>
            </div>
          </div>

          {afterRows && (
            <button type="button" onClick={handleReset} className="btn btn-secondary shrink-0">
              <ResetIcon />
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="card-body space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Original
            </p>

            <div className="mt-4 flex justify-center">
              <GapGauge value={before.gap} tone={beforeTone} />
            </div>

            <p className="mt-3 text-sm font-bold text-slate-500">
              Current disparity gap
            </p>
          </div>

          <div
            className={`rounded-3xl border p-5 text-center transition ${
              after
                ? "border-emerald-100 bg-emerald-50"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <p
              className={`text-xs font-extrabold uppercase tracking-wider ${
                after ? "text-emerald-700" : "text-slate-400"
              }`}
            >
              Mitigated
            </p>

            <div className="mt-4 flex justify-center">
              <AnimatePresence mode="wait">
                {after ? (
                  <motion.div
                    key="after"
                    initial={{ opacity: 0, scale: 0.86 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.86 }}
                  >
                    <GapGauge value={after.gap} tone={afterTone} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.86 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.86 }}
                  >
                    <div className="relative flex h-[94px] w-[94px] items-center justify-center rounded-full border border-dashed border-slate-300 bg-white text-slate-400">
                      <span className="font-mono text-2xl font-extrabold">—</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className={`mt-3 text-sm font-bold ${after ? "text-emerald-700" : "text-slate-500"}`}>
              {after ? "Projected gap after mitigation" : "Run simulator first"}
            </p>
          </div>
        </div>

        <AnimatePresence>
          {after && improvement !== null && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              className={`rounded-2xl border p-4 ${
                improvement > 0
                  ? "border-emerald-100 bg-emerald-50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    improvement > 0
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <CheckIcon />
                </div>

                <div>
                  <p
                    className={`text-sm font-extrabold ${
                      improvement > 0 ? "text-emerald-700" : "text-slate-600"
                    }`}
                  >
                    {improvement > 0
                      ? `${improvement} percentage-point reduction`
                      : "No measurable improvement"}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {improvement > 0
                      ? `Gap reduced from ${before.gap}% to ${after.gap}%, a projected ${improvementPercent}% improvement.`
                      : "The simulated mitigation did not reduce the measured disparity gap."}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
            <p className="text-sm font-bold text-rose-700">{error}</p>
          </div>
        )}

        {!after && !loading && !error && (
          <div className="callout callout-primary">
            <LightningIcon className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="text-sm font-extrabold">
                Run a simulated fix
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                This does not change your original file. It creates a projected scenario for exploring mitigation impact.
              </p>
            </div>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            disabled={loading}
            style={{
              background: "rgba(100,119,255,0.05)",
              border: "1px solid rgba(100,119,255,0.2)",
              color: "#f8fafc",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              fontFamily: "'DM Sans', sans-serif",
              outline: "none",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            <option value="threshold_tuning" style={{ background: "#1c2340", color: "#f8fafc" }}>Threshold Tuning</option>
            <option value="feature_removal" style={{ background: "#1c2340", color: "#f8fafc" }}>Feature Removal</option>
          </select>

          {method === "feature_removal" && (
            <select
              value={featureToRemove}
              onChange={(e) => setFeatureToRemove(e.target.value)}
              disabled={loading}
              style={{
                background: "rgba(244,63,94,0.05)",
                border: "1px solid rgba(244,63,94,0.2)",
                color: "#f8fafc",
                padding: "10px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                fontFamily: "'DM Sans', sans-serif",
                outline: "none",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {featuresAnalyzed.length > 0 ? (
                featuresAnalyzed.map(f => (
                  <option key={f} value={f} style={{ background: "#1c2340", color: "#f8fafc" }}>Drop: {f}</option>
                ))
              ) : (
                <option value="" style={{ background: "#1c2340", color: "#f8fafc" }}>No features found</option>
              )}
            </select>
          )}

          <button
            onClick={applyMitigation}
            disabled={loading}
            style={{
              background: loading ? "rgba(16,185,129,0.1)" : "linear-gradient(135deg, #059669 0%, #10b981 100%)",
              color: loading ? "#10b981" : "#fff",
              border: loading ? "1px solid rgba(16,185,129,0.3)" : "none",
              padding: "11px 22px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: loading ? "none" : "0 4px 16px rgba(16,185,129,0.3)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "7px",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(16,185,129,0.4)"; }}}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = loading ? "none" : "0 4px 16px rgba(16,185,129,0.3)"; }}
          >
            {loading ? (
              <>
                <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>◌</span>
                Applying...
              </>
            ) : "⚡ Apply"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Before */}
        <div style={{
          background: "rgba(244,63,94,0.06)",
          border: "1px solid rgba(244,63,94,0.18)",
          borderRadius: "12px",
          padding: "20px",
        }}>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f43f5e", marginBottom: "12px" }}>
            Before
          </p>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "32px", fontWeight: 700, color: "#f1f5f9", letterSpacing: "-1px" }}>
            {beforeGap}
            <span style={{ fontSize: "16px", color: "#f43f5e", fontWeight: 400 }}>%</span>
          </p>
          <p style={{ fontSize: "12px", color: "#64748b", marginTop: "6px" }}>selection rate gap</p>
        </div>

        {/* After */}
        <div style={{
          background: afterGap ? "rgba(16,185,129,0.06)" : "rgba(99,120,255,0.05)",
          border: afterGap ? "1px solid rgba(16,185,129,0.18)" : "1px dashed rgba(99,120,255,0.15)",
          borderRadius: "12px",
          padding: "20px",
          transition: "all 0.3s ease",
        }}>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: afterGap ? "#10b981" : "#475569", marginBottom: "12px" }}>
            After
          </p>
          {afterGap ? (
        <button
          type="button"
          onClick={handleRunFix}
          disabled={loading}
          className="btn btn-primary btn-lg w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Spinner />
              Running mitigation...
            </>
          ) : (
            <>
              <LightningIcon />
              {afterRows ? "Re-run simulation" : "Run mitigation simulation"}
            </>
          )}
        </button>
      </div>

      <div className="card-footer flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm font-semibold text-slate-500">
          Strategy
        </span>

        <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 font-mono text-xs font-extrabold text-indigo-700">
          Reweighing simulation
        </span>
      </div>
    </div>
  );
}
