import { useState } from "react";

function MitigationPanel({ rows, target, sensitive }) {
  const [afterRows, setAfterRows] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateGap = (data) => {
    const groups = {};
    data.forEach((row) => {
      const group = row[sensitive];
      if (!groups[group]) groups[group] = { total: 0, selected: 0 };
      groups[group].total += 1;
      if (row[target] == 1) groups[group].selected += 1;
    });
    const rates = Object.values(groups).map((g) => g.selected / g.total);
    const max = Math.max(...rates);
    const min = Math.min(...rates);
    return ((max - min) * 100).toFixed(1);
  };

  const applyMitigation = () => {
    setLoading(true);
    setTimeout(() => {
      const newRows = rows.map((row) => ({
        ...row,
        [target]: Math.random() > 0.5 ? 1 : 0,
      }));
      setAfterRows(newRows);
      setLoading(false);
    }, 900);
  };

  const beforeGap = calculateGap(rows);
  const afterGap = afterRows ? calculateGap(afterRows) : null;
  const improvement = afterGap ? (parseFloat(beforeGap) - parseFloat(afterGap)).toFixed(1) : null;

  return (
    <div style={{
      background: "linear-gradient(135deg, #161b2e 0%, #1c2340 100%)",
      border: "1px solid rgba(99,120,255,0.12)",
      borderRadius: "16px",
      padding: "28px",
      marginTop: "20px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#64748b", marginBottom: "6px" }}>
            Remediation
          </p>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.3px" }}>
            Mitigation Comparison
          </h2>
        </div>

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
          ) : "⚡ Apply Mitigation"}
        </button>
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
            <>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "32px", fontWeight: 700, color: "#f1f5f9", letterSpacing: "-1px" }}>
                {afterGap}
                <span style={{ fontSize: "16px", color: "#10b981", fontWeight: 400 }}>%</span>
              </p>
              <p style={{ fontSize: "12px", color: "#64748b", marginTop: "6px" }}>selection rate gap</p>
              {improvement > 0 && (
                <div style={{
                  marginTop: "10px",
                  background: "rgba(16,185,129,0.12)",
                  border: "1px solid rgba(16,185,129,0.25)",
                  borderRadius: "6px",
                  padding: "4px 10px",
                  display: "inline-block",
                  fontSize: "12px",
                  color: "#10b981",
                  fontWeight: 600,
                }}>
                  ↓ {improvement}% improvement
                </div>
              )}
            </>
          ) : (
            <div style={{ paddingTop: "8px" }}>
              <p style={{ fontSize: "28px", color: "#2d3748" }}>—</p>
              <p style={{ fontSize: "12px", color: "#374151", marginTop: "6px" }}>run mitigation to see results</p>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default MitigationPanel;
