import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function ReportPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { target, sensitive, rows, analysis_id, metrics } = location.state || {};

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!analysis_id) { setLoading(false); return; }
    const fetchReport = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/report/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ analysis_id, include_mitigation: true })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Failed to generate report");
        setReportData(data.report);
      } catch (err) {
        console.error(err);
        alert("Error fetching report: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [analysis_id]);

  const total = rows?.length || 0;
  const selected = rows?.filter((row) => row[target] == 1).length || 0;
  const rejected = total - selected;
  const selectionRate = total ? ((selected / total) * 100).toFixed(1) : 0;

  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const renderText = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      let isHeader = false;
      let displayLine = line;
      if (line.startsWith('### ')) {
        isHeader = true;
        displayLine = line.substring(4);
      } else if (line.startsWith('#### ')) {
        isHeader = true;
        displayLine = line.substring(5);
      }

      if (displayLine.trim() === '') {
        return <div key={i} style={{ height: "8px" }} />;
      }
      
      const parts = displayLine.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} style={{ color: "#f8fafc" }}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (isHeader) {
        return <h3 key={i} style={{ color: "#f1f5f9", marginTop: "20px", marginBottom: "8px", fontSize: "16px", fontWeight: 700 }}>{formattedParts}</h3>;
      }
      return <div key={i} style={{ marginBottom: "6px" }}>{formattedParts}</div>;
    });
  };

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

            {loading ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <p style={{ color: "#6477ff", fontWeight: 600 }}>Generating AI Report...</p>
              </div>
            ) : reportData ? (
              <>
                {/* Section: Executive Summary */}
                <div>
                  <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6477ff", marginBottom: "16px" }}>
                    03 — Executive Summary
                  </p>
                  <div style={{
                    background: "rgba(99,120,255,0.05)",
                    border: "1px solid rgba(99,120,255,0.12)",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "24px"
                  }}>
                    <div style={{ color: "#94a3b8", fontSize: "14px", lineHeight: 1.7 }}>
                      {renderText(reportData.executive_summary)}
                    </div>
                  </div>
                </div>

                {/* Section: Detailed Findings */}
                <div>
                  <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6477ff", marginBottom: "16px" }}>
                    04 — Detailed Findings
                  </p>
                  <div style={{
                    background: "rgba(99,120,255,0.02)",
                    border: "1px solid rgba(99,120,255,0.08)",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "24px"
                  }}>
                    <div style={{ color: "#94a3b8", fontSize: "14px", lineHeight: 1.7 }}>
                      {renderText(reportData.detailed_findings)}
                    </div>
                  </div>
                </div>

                {/* Section: Recommendations */}
                <div>
                  <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6477ff", marginBottom: "16px" }}>
                    05 — Recommendations
                  </p>
                  <ul style={{ color: "#94a3b8", fontSize: "14px", lineHeight: 1.7, paddingLeft: "20px" }}>
                    {reportData.recommendations.map((rec, i) => (
                      <li key={i} style={{ marginBottom: "8px" }}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <p style={{ color: "#f43f5e" }}>Failed to load report data.</p>
            )}
          </div>

          {/* Footer */}
          <div className="no-print" style={{
            borderTop: "1px solid rgba(99,120,255,0.1)",
            padding: "20px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}>
            <span style={{ fontSize: "12px", color: "#374151" }}>BreakBias Audit Engine · Confidential</span>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => window.print()}
                style={{
                  background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                  color: "#fff",
                  border: "none",
                  padding: "9px 18px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: "0 4px 16px rgba(16,185,129,0.25)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 6px 20px rgba(16,185,129,0.35)"; }}
                onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 16px rgba(16,185,129,0.25)"; }}
              >
                📥 Download PDF
              </button>

              <button
                onClick={() => navigate("/dashboard", { state: { target, sensitive, rows, analysis_id, metrics } })}
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

      <style>
        {`
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none !important; }
            /* Remove problematic page-break rule that corrupted PDFs */
          }
        `}
      </style>
    </div>
  );
}

export default ReportPage;
