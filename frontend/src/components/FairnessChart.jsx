import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function FairnessChart() {
  // 🔴 Mock data
  const data = [
    { group: "Male", selectionRate: 0.7 },
    { group: "Female", selectionRate: 0.4 },
  ];

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-lg font-semibold mb-4">
        Selection Rate by Group
      </h2>

      <BarChart width={400} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="group" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="selectionRate" />
      </BarChart>
    </div>
  );
}

export default FairnessChart;