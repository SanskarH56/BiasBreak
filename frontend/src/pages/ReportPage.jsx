import { useLocation, useNavigate } from "react-router-dom";

function ReportPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { target, sensitive, rows } = location.state || {};

  const total = rows?.length || 0;
  const selected = rows?.filter((row) => row[target] == 1).length || 0;
  const rejected = total - selected;
  const selectionRate = total ? ((selected / total) * 100).toFixed(1) : 0;

  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const StatRow = ({ label, value, mono = false }) => (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 0",
      borderBottom: "1px solid rgba(99,120,255,0.08)",
    }}>
      <span style={{ color: "#64748b", fontSize: "13px" }}>{label}</span>
      <span style={{
        fontFamily: mono ? "'Space Mono', monospace" : "'DM Sans', sans-serif",
        fontWeight: 600,
        color: "#f1f5f9",
        fontSize: mono ? "14px" : "13px",
      }}>{value}</span>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0b0e1a 0%, #0e1220 60%, #0b0e1a 100%)",
      padding: "40px 24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient */}
      <div style={{
        position: "absolute", top: "5%", left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "300px",
        background: "radial-gradient(ellipse, rgba(100,119,255,0.05) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        {/* Badge header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(100,119,255,0.1)",
            border: "1px solid rgba(100,119,255,0.2)",
            borderRadius: "99px",
            padding: "6px 16px",
            marginBottom: "20px",
            fontSize: "12px",
            color: "#818cf8",
            fontWeight: 600,
            letterSpacing: "0.05em",
          }}>
            ⚖ BREAKBIAS · FAIRNESS AUDIT REPORT
          </div>

          <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-1px", marginBottom: "8px" }}>
            Hiring Fairness Audit
          </h1>
          <p style={{ color: "#475569", fontSize: "13px" }}>Generated {today}</p>
        </div>

        {/* Report card */}
        <div style={{
          background: "linear-gradient(135deg, #161b2e 0%, #1c2340 100%)",
          border: "1px solid rgba(99,120,255,0.15)",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.02), 0 32px 80px rgba(0,0,0,0.5), 0 0 100px rgba(100,119,255,0.06)",
        }}>
          {/* Top accent bar */}
          <div style={{ height: "3px", background: "linear-gradient(90deg, #6477ff, #818cf8, #10b981)" }} />

          <div style={{ padding: "32px" }}>
            {/* Section: Configuration */}
            <div style={{ marginBottom: "28px" }}>
              <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6477ff", marginBottom: "16px" }}>
                01 — Configuration
              </p>
              <StatRow label="Decision Column (Target)" value={target} mono />
              <StatRow label="Sensitive Attribute" value={sensitive} mono />
            </div>

            {/* Section: Dataset Summary */}
            <div style={{ marginBottom: "28px" }}>
              <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6477ff", marginBottom: "16px" }}>
                02 — Dataset Summary
              </p>
              <StatRow label="Total Candidates" value={total.toLocaleString()} mono />
              <StatRow label="Selected" value={selected.toLocaleString()} mono />
              <StatRow label="Rejected" value={rejected.toLocaleString()} mono />
              <StatRow label="Overall Selection Rate" value={`${selectionRate}%`} mono />
            </div>

            {/* Section: Summary */}
            <div>
              <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6477ff", marginBottom: "16px" }}>
                03 — Plain-English Summary
              </p>
              <div style={{
                background: "rgba(99,120,255,0.05)",
                border: "1px solid rgba(99,120,255,0.12)",
                borderRadius: "12px",
                padding: "20px",
              }}>
                <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: 1.7 }}>
                  The system compared hiring outcomes across groups in the <span style={{ color: "#c7d2fe", fontFamily: "'Space Mono', monospace", fontSize: "12px" }}>{sensitive}</span> column.
                  A total of <span style={{ color: "#f1f5f9", fontWeight: 600 }}>{total.toLocaleString()} candidates</span> were analyzed,
                  with an overall selection rate of <span style={{ color: "#f1f5f9", fontWeight: 600 }}>{selectionRate}%</span>.
                  Differences in selection rates across groups may indicate potential bias and should be reviewed before using this model in real hiring decisions.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            borderTop: "1px solid rgba(99,120,255,0.1)",
            padding: "20px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}>
            <span style={{ fontSize: "12px", color: "#374151" }}>BreakBias Audit Engine · Confidential</span>
            <button
              onClick={() => navigate("/dashboard", { state: { target, sensitive, rows } })}
              style={{
                background: "transparent",
                color: "#818cf8",
                border: "1px solid rgba(100,119,255,0.25)",
                padding: "9px 18px",
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
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportPage;
