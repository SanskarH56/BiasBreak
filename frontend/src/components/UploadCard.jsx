import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";

function UploadCard() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const navigate = useNavigate();

  const handleFile = (f) => {
    if (f && f.name.endsWith(".csv")) setFile(f);
    else alert("Please upload a .csv file");
  };

  const handleUpload = () => {
    if (!file) return;
    setLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rows = results.data;
          if (!rows.length) { alert("Empty or invalid CSV"); setLoading(false); return; }
          const columns = Object.keys(rows[0]);
          navigate("/columns", { state: { columns, rows, file } });
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
    <div style={{
      maxWidth: "480px",
      margin: "0 auto",
    }}>
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
        style={{
          border: `2px dashed ${dragging ? "rgba(100,119,255,0.6)" : file ? "rgba(16,185,129,0.4)" : "rgba(99,120,255,0.2)"}`,
          borderRadius: "16px",
          padding: "48px 32px",
          textAlign: "center",
          cursor: "pointer",
          background: dragging
            ? "rgba(100,119,255,0.05)"
            : file
            ? "rgba(16,185,129,0.04)"
            : "rgba(99,120,255,0.03)",
          transition: "all 0.2s ease",
          marginBottom: "16px",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          onChange={(e) => handleFile(e.target.files[0])}
          style={{ display: "none" }}
        />

        <div style={{
          width: 56, height: 56,
          borderRadius: "14px",
          background: file ? "rgba(16,185,129,0.12)" : "rgba(100,119,255,0.1)",
          border: `1px solid ${file ? "rgba(16,185,129,0.25)" : "rgba(100,119,255,0.2)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "24px",
          margin: "0 auto 16px",
          boxShadow: file ? "0 0 20px rgba(16,185,129,0.15)" : "0 0 20px rgba(100,119,255,0.1)",
        }}>
          {file ? "✓" : "↑"}
        </div>

        {file ? (
          <>
            <p style={{ color: "#10b981", fontWeight: 600, marginBottom: "4px", fontSize: "15px" }}>
              {file.name}
            </p>
            <p style={{ color: "#64748b", fontSize: "13px" }}>
              {(file.size / 1024).toFixed(1)} KB · Click to change
            </p>
          </>
        ) : (
          <>
            <p style={{ color: "#e2e8f0", fontWeight: 600, marginBottom: "6px", fontSize: "15px" }}>
              Drop your CSV here
            </p>
            <p style={{ color: "#64748b", fontSize: "13px" }}>
              or click to browse files
            </p>
          </>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        style={{
          width: "100%",
          background: loading || !file
            ? "rgba(99,120,255,0.1)"
            : "linear-gradient(135deg, #6477ff 0%, #818cf8 100%)",
          color: loading || !file ? "#475569" : "#fff",
          border: loading || !file ? "1px solid rgba(99,120,255,0.15)" : "none",
          padding: "14px",
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: 600,
          cursor: loading || !file ? "not-allowed" : "pointer",
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: loading || !file ? "none" : "0 4px 20px rgba(100,119,255,0.35)",
          transition: "all 0.2s ease",
          letterSpacing: "0.02em",
        }}
        onMouseEnter={e => { if (!loading && file) { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 28px rgba(100,119,255,0.5)"; }}}
        onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = (!loading && file) ? "0 4px 20px rgba(100,119,255,0.35)" : "none"; }}
      >
        {loading ? "Parsing dataset..." : "Analyze for Bias →"}
      </button>
    </div>
  );
}

export default UploadCard;
