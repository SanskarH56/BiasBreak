import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { uploadCSV } from "../api/BreakBiasApi"; // keep for later

function UploadCard() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);

      // 🔴 MOCK DATA (use until backend is ready)
      const data = {
        columns: ["age", "gender", "experience", "hired"]
      };

      // 🟢 When backend is ready, replace above with:
      // const data = await uploadCSV(file);

      navigate("/columns", { state: { columns: data.columns } });

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-4">
        Upload Dataset
      </h2>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Uploading..." : "Upload CSV"}
      </button>

      {file && (
        <p className="mt-3 text-sm text-gray-600">
          Selected: {file.name}
        </p>
      )}
    </div>
  );
}

export default UploadCard;