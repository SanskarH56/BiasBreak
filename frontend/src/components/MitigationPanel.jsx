import { useState } from "react";

function MitigationPanel({ rows, target, sensitive }) {
  const [afterRows, setAfterRows] = useState(null);

  const calculateGap = (data) => {
    const groups = {};

    data.forEach((row) => {
      const group = row[sensitive];

      if (!groups[group]) {
        groups[group] = { total: 0, selected: 0 };
      }

      groups[group].total += 1;

      if (row[target] == 1) {
        groups[group].selected += 1;
      }
    });

    const rates = Object.values(groups).map(
      (g) => g.selected / g.total
    );

    const max = Math.max(...rates);
    const min = Math.min(...rates);

    return ((max - min) * 100).toFixed(1);
  };

  const applyMitigation = () => {
    // 🔴 simulate mitigation (balance outcomes)
    const newRows = rows.map((row) => ({
      ...row,
      [target]: Math.random() > 0.5 ? 1 : 0,
    }));

    setAfterRows(newRows);
  };

  const beforeGap = calculateGap(rows);
  const afterGap = afterRows ? calculateGap(afterRows) : null;

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-lg font-semibold mb-4">
        Mitigation Comparison
      </h2>

      <button
        onClick={applyMitigation}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        Apply Mitigation
      </button>

      <div className="grid grid-cols-2 gap-4">
        
        {/* Before */}
        <div className="p-4 border rounded">
          <h3 className="font-medium mb-2">Before</h3>
          <p className="text-xl">{beforeGap}% gap</p>
        </div>

        {/* After */}
        <div className="p-4 border rounded">
          <h3 className="font-medium mb-2">After</h3>
          <p className="text-xl">
            {afterGap ? `${afterGap}% gap` : "-"}
          </p>
        </div>

      </div>
    </div>
  );
}

export default MitigationPanel;