import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";

function UploadCard() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleUpload = () => {
    if (!file) return;

    setLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rows = results.data;

          if (!rows.length) {
            alert("Empty or invalid CSV");
            setLoading(false);
            return;
          }

          const columns = Object.keys(rows[0]);

          navigate("/columns", {
            state: {
              columns,
              rows, // 🔥 important
            },
          });

        } catch (err) {
          console.error(err);
          alert("Parsing failed");
        } finally {
          setLoading(false);
        }
      },
    });
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