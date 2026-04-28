import { useLocation, useNavigate } from "react-router-dom";
import MetricCard from "../components/MetricCard";
import FairnessChart from "../components/FairnessChart";
import BiasWarningCard from "../components/BiasWarningCard";
import MitigationPanel from "../components/MitigationPanel";
import { motion } from "framer-motion";

function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { target, sensitive, rows, analysis_id, metrics, file, columns } = location.state || {};
  
  let total = metrics?.model_summary?.total_instances || 0;
  let selected = 0;
  let rejected = 0;

  if (rows && target) {
    if (total === 0) total = rows.length;
    rows.forEach((row) => {
      if (row[target] == 1) selected++;
      else rejected++;
    });
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #0b0e1a 0%, #0e1220 50%, #0b0e1a 100%)", padding: "0" }}>
      {/* Top Nav */}
      <nav style={{
        borderBottom: "1px solid rgba(99,120,255,0.1)",
        background: "rgba(11,14,26,0.8)",
        backdropFilter: "blur(12px)",
        padding: "0 32px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: 28, height: 28,
            background: "linear-gradient(135deg, #6477ff, #818cf8)",
            borderRadius: "7px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px",
            boxShadow: "0 0 16px rgba(100,119,255,0.4)",
          }}>⚖</div>
          <span style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "15px", letterSpacing: "-0.3px" }}>
            BreakBias
          </span>
          <span style={{
            background: "rgba(100,119,255,0.15)",
            border: "1px solid rgba(100,119,255,0.3)",
            color: "#818cf8",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.1em",
            padding: "2px 8px",
            borderRadius: "99px",
          }}>AUDIT</span>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <div style={{
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: "99px",
            padding: "4px 12px",
            fontSize: "12px",
            color: "#10b981",
            fontWeight: 500,
          }}>
            ● Live Analysis
          </div>
        </div>
      </nav>

      <motion.div
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "36px 32px" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Top Bar with Back Button */}
        <div style={{ marginBottom: "24px", display: "flex", justifyContent: "flex-start" }}>
          <button
            onClick={() => navigate("/columns", { state: { rows, file, columns } })}
            style={{
              background: "transparent",
              color: "#818cf8",
              border: "1px solid rgba(100,119,255,0.25)",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => { e.target.style.background = "rgba(100,119,255,0.1)"; e.target.style.borderColor = "rgba(100,119,255,0.4)"; }}
            onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.borderColor = "rgba(100,119,255,0.25)"; }}
          >
            ← Reconfigure Columns
          </button>
        </div>

        {/* Page header */}
        <div style={{ marginBottom: "32px" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6477ff", marginBottom: "8px" }}>
            Fairness Dashboard
          </p>
          <h1 style={{ fontSize: "30px", fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.8px", marginBottom: "12px" }}>
            Hiring Bias Analysis
          </h1>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <div style={{
              background: "rgba(100,119,255,0.08)",
              border: "1px solid rgba(100,119,255,0.18)",
              borderRadius: "8px",
              padding: "6px 14px",
              fontSize: "13px",
              color: "#94a3b8",
              display: "flex", alignItems: "center", gap: "6px",
            }}>
              <span style={{ color: "#818cf8", fontWeight: 600 }}>Target</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", color: "#c7d2fe" }}>{target}</span>
            </div>
            <div style={{
              background: "rgba(100,119,255,0.08)",
              border: "1px solid rgba(100,119,255,0.18)",
              borderRadius: "8px",
              padding: "6px 14px",
              fontSize: "13px",
              color: "#94a3b8",
              display: "flex", alignItems: "center", gap: "6px",
            }}>
              <span style={{ color: "#818cf8", fontWeight: 600 }}>Sensitive</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", color: "#c7d2fe" }}>{sensitive}</span>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "28px" }}>
          <MetricCard title="Total Candidates" value={total} color="accent" />
          <MetricCard title="Selected" value={selected} color="emerald" />
          <MetricCard title="Rejected" value={rejected} color="rose" />
        </div>

        <FairnessChart 
          rows={rows} 
          target={target} 
          sensitive={sensitive} 
          groupMetrics={metrics?.group_metrics}
        />
        <BiasWarningCard 
          rows={rows} 
          target={target} 
          sensitive={sensitive} 
          baselineGap={metrics?.disparity_summaries?.find(d => d.metric_name === "Selection Rate Gap")?.value}
        />
        <MitigationPanel 
          rows={rows} 
          target={target} 
          sensitive={sensitive} 
          analysis_id={analysis_id} 
          featuresAnalyzed={metrics?.dataset_summary?.features_analyzed || []} 
          baselineGap={metrics?.disparity_summaries?.find(d => d.metric_name === "Selection Rate Gap")?.value}
        />

        <button
          onClick={() => navigate("/report", { state: { target, sensitive, rows, analysis_id, metrics } })}
          style={{
            marginTop: "28px",
            background: "linear-gradient(135deg, #6477ff 0%, #818cf8 100%)",
            color: "#fff",
            border: "none",
            padding: "13px 28px",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 4px 20px rgba(100,119,255,0.35)",
            transition: "all 0.2s ease",
            letterSpacing: "0.01em",
          }}
          onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 28px rgba(100,119,255,0.5)"; }}
          onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 20px rgba(100,119,255,0.35)"; }}
        >
          View Full Report →
        </button>
      </motion.div>
    </div>
  );
}

export default DashboardPage;
