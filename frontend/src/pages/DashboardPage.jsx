import { useLocation, useNavigate } from "react-router-dom";
import MetricCard from "../components/MetricCard";
import FairnessChart from "../components/FairnessChart";
import BiasWarningCard from "../components/BiasWarningCard";
import MitigationPanel from "../components/MitigationPanel";

function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { target, sensitive, rows } = location.state || {};

  let total = 0;
  let selected = 0;
  let rejected = 0;

  if (rows && target) {
    total = rows.length;

    rows.forEach((row) => {
      if (row[target] == 1) {
        selected++;
      } else {
        rejected++;
      }
    });
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-xl font-semibold mb-4">
        Dashboard
      </h1>

      <p className="mb-2">Target: {target}</p>
      <p className="mb-4">Sensitive: {sensitive}</p>

      <div className="grid grid-cols-3 gap-4">
        <MetricCard title="Total Candidates" value={total} />
        <MetricCard title="Selected" value={selected} />
        <MetricCard title="Rejected" value={rejected} />
      </div>

      <FairnessChart rows={rows} target={target} sensitive={sensitive} />
      <BiasWarningCard rows={rows} target={target} sensitive={sensitive} />
      <MitigationPanel rows={rows} target={target} sensitive={sensitive} />

      <button
  onClick={() =>
    navigate("/report", {
      state: { target, sensitive, rows },
    })
  }
  className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
>
  View Report
</button>
    </div>
  );
}

export default DashboardPage;