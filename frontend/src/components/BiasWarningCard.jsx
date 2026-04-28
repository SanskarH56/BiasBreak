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
  };

  if (gap >= 30) {
    status = "High Risk";
    message = "Large selection-rate gap detected between groups.";
    theme = {
      bg: "rgba(244,63,94,0.07)",
      border: "rgba(244,63,94,0.2)",
      glow: "rgba(244,63,94,0.12)",
      label: "#f43f5e",
      badge: { bg: "rgba(244,63,94,0.15)", border: "rgba(244,63,94,0.3)", color: "#f43f5e" },
      icon: "⚠",
      barColor: "#f43f5e",
      barBg: "rgba(244,63,94,0.1)",
    };
  } else if (gap >= 15) {
    status = "Moderate Risk";
    message = "Noticeable selection-rate difference detected.";
    theme = {
      bg: "rgba(245,158,11,0.07)",
      border: "rgba(245,158,11,0.2)",
      glow: "rgba(245,158,11,0.1)",
      label: "#f59e0b",
      badge: { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)", color: "#f59e0b" },
      icon: "◈",
      barColor: "#f59e0b",
      barBg: "rgba(245,158,11,0.1)",
    };
  }

  const barWidth = Math.min(gap, 100);

  return (
    <div style={{
      background: `linear-gradient(135deg, #161b2e 0%, #1c2340 100%)`,
      border: `1px solid ${theme.border}`,
      borderRadius: "16px",
      padding: "28px",
      marginTop: "20px",
      boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 60px ${theme.glow}`,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Glow pulse */}
      <div style={{
        position: "absolute", top: "-40px", right: "-40px",
        width: "120px", height: "120px",
        background: theme.glow,
        borderRadius: "50%",
        filter: "blur(30px)",
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#64748b", marginBottom: "6px" }}>
            Bias Assessment
          </p>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.3px" }}>
            Bias Risk Warning
          </h2>
        </div>

        <div style={{
          background: theme.badge.bg,
          border: `1px solid ${theme.badge.border}`,
          borderRadius: "99px",
          padding: "6px 16px",
          display: "flex",
          alignItems: "center",
          gap: "7px",
          boxShadow: `0 0 20px ${theme.glow}`,
        }}>
          <span style={{ fontSize: "12px" }}>{theme.icon}</span>
          <span style={{ color: theme.badge.color, fontWeight: 700, fontSize: "13px", letterSpacing: "0.02em" }}>
            {status}
          </span>
        </div>
      </div>

      <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "24px", lineHeight: 1.6 }}>{message}</p>

      {/* Gap bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>Selection Rate Gap</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "14px", fontWeight: 700, color: theme.label }}>
            {gap}%
          </span>
        </div>
        <div style={{ height: "8px", background: theme.barBg, borderRadius: "99px", overflow: "hidden" }}>
          <div style={{
            width: `${barWidth}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${theme.barColor}88, ${theme.barColor})`,
            borderRadius: "99px",
            boxShadow: `0 0 10px ${theme.glow}`,
            transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
          <span style={{ fontSize: "11px", color: "#374151" }}>0%</span>
          <span style={{ fontSize: "11px", color: "#374151" }}>100%</span>
        </div>
      </div>
    </div>
  );
}

export default BiasWarningCard;
