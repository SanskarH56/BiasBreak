import { useLocation, useNavigate } from "react-router-dom";

function ReportPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { target, sensitive, rows } = location.state || {};

  const total = rows?.length || 0;
  const selected = rows?.filter((row) => row[target] == 1).length || 0;
  const rejected = total - selected;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">
          Fairness Audit Report
        </h1>

        <p className="text-gray-600 mb-6">
          This report summarizes the hiring fairness analysis based on the uploaded dataset.
        </p>

        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">Decision Column</h2>
            <p>{target}</p>
          </div>

          <div>
            <h2 className="font-semibold">Sensitive Attribute</h2>
            <p>{sensitive}</p>
          </div>

          <div>
            <h2 className="font-semibold">Dataset Summary</h2>
            <p>Total candidates: {total}</p>
            <p>Selected: {selected}</p>
            <p>Rejected: {rejected}</p>
          </div>

          <div>
            <h2 className="font-semibold">Plain-English Summary</h2>
            <p className="text-gray-700">
              The system compared hiring outcomes across groups in the selected sensitive column.
              Differences in selection rates may indicate potential bias and should be reviewed before using this model in real hiring decisions.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/dashboard", { state: { target, sensitive, rows } })}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default ReportPage;