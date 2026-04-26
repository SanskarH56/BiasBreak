import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell,
} from "recharts";

const COLORS = ["#6477ff", "#10b981", "#f59e0b", "#f43f5e", "#a78bfa", "#22d3ee"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#1c2340",
        border: "1px solid rgba(100,119,255,0.25)",
        borderRadius: "10px",
        padding: "12px 16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}>
        <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "4px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</p>
        <p style={{ color: "#f1f5f9", fontSize: "20px", fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>
          {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

function FairnessChart({ rows, target, sensitive }) {
  const groups = {};

  rows.forEach((row) => {
    const group = row[sensitive];
    const decision = row[target];
    if (!groups[group]) groups[group] = { group, total: 0, selected: 0 };
    groups[group].total += 1;
    if (decision == 1) groups[group].selected += 1;
  });

  const chartData = Object.values(groups).map((item) => ({
    group: item.group,
    selectionRate: Number(((item.selected / item.total) * 100).toFixed(1)),
  }));

  return (
    <div style={{
      background: "linear-gradient(135deg, #161b2e 0%, #1c2340 100%)",
      border: "1px solid rgba(99,120,255,0.12)",
      borderRadius: "16px",
      padding: "28px",
      marginTop: "20px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    }}>
      <div style={{ marginBottom: "24px" }}>
        <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6477ff", marginBottom: "6px" }}>
          Comparative Analysis
        </p>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.3px" }}>
          Selection Rate by <span style={{ color: "#818cf8" }}>{sensitive}</span>
        </h2>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} barCategoryGap="35%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,120,255,0.08)" vertical={false} />
          <XAxis
            dataKey="group"
            tick={{ fill: "#94a3b8", fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            unit="%"
            tick={{ fill: "#64748b", fontSize: 11, fontFamily: "'Space Mono', monospace" }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(100,119,255,0.05)" }} />
          <Bar dataKey="selectionRate" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default FairnessChart;
