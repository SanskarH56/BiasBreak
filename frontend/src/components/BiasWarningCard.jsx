function BiasWarningCard({ rows, target, sensitive }) {
  const groups = {};

  rows.forEach((row) => {
    const group = row[sensitive];
    const decision = row[target];

    if (!groups[group]) {
      groups[group] = {
        total: 0,
        selected: 0,
      };
    }

    groups[group].total += 1;

    if (decision == 1) {
      groups[group].selected += 1;
    }
  });

  const rates = Object.entries(groups).map(([group, data]) => ({
    group,
    rate: data.selected / data.total,
  }));

  const maxRate = Math.max(...rates.map((item) => item.rate));
  const minRate = Math.min(...rates.map((item) => item.rate));
  const gap = Number(((maxRate - minRate) * 100).toFixed(1));

  let status = "Low Risk";
  let message = "Selection rates are fairly balanced across groups.";

  if (gap >= 30) {
    status = "High Risk";
    message = "Large selection-rate gap detected between groups.";
  } else if (gap >= 15) {
    status = "Moderate Risk";
    message = "Noticeable selection-rate difference detected.";
  }

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-lg font-semibold mb-2">Bias Risk Warning</h2>

      <p className="text-2xl font-bold mb-2">{status}</p>

      <p className="text-gray-700 mb-2">{message}</p>

      <p className="text-sm text-gray-500">
        Selection rate gap: {gap}%
      </p>
    </div>
  );
}

export default BiasWarningCard;