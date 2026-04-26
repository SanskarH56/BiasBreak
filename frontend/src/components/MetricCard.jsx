function MetricCard({ title, value, icon, color = "accent" }) {
  const colorMap = {
    accent: {
      glow: "rgba(100,119,255,0.12)",
      border: "rgba(100,119,255,0.25)",
      text: "#818cf8",
      dot: "#6477ff",
    },
    emerald: {
      glow: "rgba(16,185,129,0.1)",
      border: "rgba(16,185,129,0.2)",
      text: "#10b981",
      dot: "#10b981",
    },
    rose: {
      glow: "rgba(244,63,94,0.1)",
      border: "rgba(244,63,94,0.2)",
      text: "#f43f5e",
      dot: "#f43f5e",
    },
  };

  const c = colorMap[color] || colorMap.accent;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #161b2e 0%, #1c2340 100%)",
        border: `1px solid ${c.border}`,
        borderRadius: "16px",
        padding: "24px 28px",
        boxShadow: `0 0 0 1px rgba(255,255,255,0.03), 0 8px 32px rgba(0,0,0,0.4), 0 0 60px ${c.glow}`,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = `0 0 0 1px rgba(255,255,255,0.05), 0 16px 40px rgba(0,0,0,0.5), 0 0 80px ${c.glow}`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = `0 0 0 1px rgba(255,255,255,0.03), 0 8px 32px rgba(0,0,0,0.4), 0 0 60px ${c.glow}`;
      }}
    >
      {/* Subtle top line accent */}
      <div style={{
        position: "absolute", top: 0, left: "20%", right: "20%", height: "1px",
        background: `linear-gradient(90deg, transparent, ${c.dot}, transparent)`,
        opacity: 0.8,
      }} />

      <p style={{
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: c.text,
        marginBottom: "12px",
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: "50%",
          background: c.dot, display: "inline-block",
          boxShadow: `0 0 6px ${c.dot}`,
        }} />
        {title}
      </p>

      <p style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "40px",
        fontWeight: 700,
        color: "#f1f5f9",
        lineHeight: 1,
        letterSpacing: "-1px",
      }}>
        {value.toLocaleString()}
      </p>
    </div>
  );
}

export default MetricCard;
