import { useLocation } from "react-router-dom";
import MetricCard from "../components/MetricCard";
import FairnessChart from "../components/FairnessChart";

function DashboardPage() {
  const location = useLocation();
  const { target, sensitive } = location.state || {};

  // 🔴 Mock data
  const metrics = {
    total: 100,
    selected: 60,
    rejected: 40,
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      {/* Title */}
      <h1 className="text-xl font-semibold mb-4">
        Dashboard
      </h1>

      {/* Info */}
      <p className="mb-2">Target: {target}</p>
      <p className="mb-4">Sensitive: {sensitive}</p>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard title="Total Candidates" value={metrics.total} />
        <MetricCard title="Selected" value={metrics.selected} />
        <MetricCard title="Rejected" value={metrics.rejected} />
      </div>

      {/* 👇 THIS is where chart goes */}
      <FairnessChart />

    </div>
  );
}

export default DashboardPage;