import { useLocation } from "react-router-dom";
import ColumnSelector from "../components/ColumnSelector";

function ColumnSelectionPage() {
  const location = useLocation();
  const columns = location.state?.columns || [];
  const rows = location.state?.rows || [];
  const file = location.state?.file;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0b0e1a 0%, #0e1220 60%, #0b0e1a 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: "20%", right: "15%",
        width: "300px", height: "300px",
        background: "radial-gradient(circle, rgba(100,119,255,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: "480px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: 44, height: 44,
            background: "linear-gradient(135deg, #6477ff, #818cf8)",
            borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px", margin: "0 auto 14px",
            boxShadow: "0 0 24px rgba(100,119,255,0.35)",
          }}>⚖</div>

          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6477ff", marginBottom: "8px" }}>
            Step 2 of 3
          </p>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.7px", marginBottom: "8px" }}>
            Map Your Columns
          </h1>
          <p style={{ color: "#64748b", fontSize: "14px" }}>
            {columns.length} columns detected · {rows.length.toLocaleString()} rows
          </p>
        </div>

        <ColumnSelector columns={columns} rows={rows} file={file} />
      </div>
    </div>
  );
}

export default ColumnSelectionPage;
