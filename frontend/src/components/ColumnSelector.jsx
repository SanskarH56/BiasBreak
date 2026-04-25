import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ColumnSelector({ columns }) {
  const [target, setTarget] = useState("");
  const [sensitive, setSensitive] = useState("");

  const navigate = useNavigate();

  const handleContinue = () => {
    if (!target || !sensitive) {
      alert("Please select both columns");
      return;
    }

    navigate("/dashboard", {
      state: {
        target,
        sensitive,
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
        onChange={(e) => setTarget(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="">Select target</option>
        {columns.map((col) => (
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
        {columns.map((col) => (
          <option key={col} value={col}>
            {col}
          </option>
        ))}
      </select>

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