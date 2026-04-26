import { useLocation } from "react-router-dom";
import ColumnSelector from "../components/ColumnSelector";

function ColumnSelectionPage() {
  const location = useLocation();

  const columns = location.state?.columns || [];
  const rows = location.state?.rows || [];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-xl font-semibold mb-4">
        Select Columns
      </h1>

      <ColumnSelector columns={columns} rows={rows} />
    </div>
  );
}

export default ColumnSelectionPage;