import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function FairnessChart({ rows, target, sensitive }) {
  const groups = {};

  rows.forEach((row) => {
    const group = row[sensitive];
    const decision = row[target];

    if (!groups[group]) {
      groups[group] = {
        group,
        total: 0,
        selected: 0,
      };
    }

    groups[group].total += 1;

    if (decision == 1) {
      groups[group].selected += 1;
    }
  });

  const chartData = Object.values(groups).map((item) => ({
    group: item.group,
    selectionRate: Number(((item.selected / item.total) * 100).toFixed(1)),
  }));

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-lg font-semibold mb-4">
        Selection Rate by {sensitive}
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="group" />
          <YAxis unit="%" />
          <Tooltip />
          <Bar dataKey="selectionRate" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default FairnessChart;