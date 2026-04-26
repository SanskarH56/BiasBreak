import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ColumnSelector({ columns, rows }) {
  const [target, setTarget] = useState("");
  const [sensitive, setSensitive] = useState("");

  const navigate = useNavigate();

  const targetKeywords = ["hired", "rejected", "selected", "approved", "accepted"];

  const targetOptions = columns.filter((col) =>
    targetKeywords.some((keyword) =>
      col.toLowerCase().includes(keyword)
    )
  );

  const sensitiveOptions = columns.filter((col) => col !== target);

  const handleContinue = () => {
    if (!target || !sensitive) {
      alert("Please select both columns");
      return;
    }

    navigate("/dashboard", {
      state: {
        target,
        sensitive,
        rows,
      },
    });
  };

  return (
    <div className="max-w-md bg-white p-6 rounded shadow">
      <label className="block mb-2 font-medium">
        Target Column
      </label>

      <select
        value={target}
        onChange={(e) => {
          setTarget(e.target.value);
          if (sensitive === e.target.value) {
            setSensitive("");
          }
        }}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="">Select target</option>
        {targetOptions.map((col) => (
          <option key={col} value={col}>
            {col}
          </option>
        ))}
      </select>

      <label className="block mb-2 font-medium">
        Sensitive Column
      </label>

      <select
        value={sensitive}
        onChange={(e) => setSensitive(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="">Select sensitive</option>
        {sensitiveOptions.map((col) => (
          <option key={col} value={col}>
            {col}
          </option>
        ))}
      </select>

      <p className="text-xs text-gray-500 mb-4">
        Target = final decision column. Sensitive = column to compare fairness across.
      </p>

      <button
        onClick={handleContinue}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Continue
      </button>
    </div>
  );
}

export default ColumnSelector;