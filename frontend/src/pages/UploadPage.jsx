import UploadCard from "../components/UploadCard";

function UploadPage() {
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
      {/* Ambient glow blobs */}
      <div style={{
        position: "absolute", top: "15%", left: "10%",
        width: "400px", height: "400px",
        background: "radial-gradient(circle, rgba(100,119,255,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "10%", right: "5%",
        width: "350px", height: "350px",
        background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Logo */}
      <div style={{ marginBottom: "48px", textAlign: "center" }}>
        <div style={{
          width: 52, height: 52,
          background: "linear-gradient(135deg, #6477ff, #818cf8)",
          borderRadius: "14px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "24px",
          margin: "0 auto 16px",
          boxShadow: "0 0 32px rgba(100,119,255,0.4)",
        }}>⚖</div>

        <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-1.2px", marginBottom: "10px", lineHeight: 1.1 }}>
          Break<span style={{ color: "#818cf8" }}>Bias</span>
        </h1>

        <p style={{ fontSize: "15px", color: "#64748b", maxWidth: "320px", margin: "0 auto", lineHeight: 1.6 }}>
          Upload your hiring dataset to detect and analyze fairness gaps across demographic groups.
        </p>
      </div>

      {/* Upload box */}
      <div style={{
        width: "100%",
        maxWidth: "480px",
        background: "linear-gradient(135deg, #161b2e 0%, #1c2340 100%)",
        border: "1px solid rgba(99,120,255,0.15)",
        borderRadius: "20px",
        padding: "32px",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.02), 0 24px 64px rgba(0,0,0,0.5), 0 0 80px rgba(100,119,255,0.07)",
      }}>
        <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6477ff", marginBottom: "6px" }}>
          Step 1 of 3
        </p>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.4px", marginBottom: "24px" }}>
          Upload Dataset
        </h2>

        <UploadCard />

        <div style={{
          marginTop: "24px",
          paddingTop: "20px",
          borderTop: "1px solid rgba(99,120,255,0.1)",
          display: "flex",
          gap: "20px",
          justifyContent: "center",
        }}>
          {["CSV format", "Auto-detection", "Privacy-safe"].map((feat) => (
            <div key={feat} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "11px", color: "#475569", fontWeight: 500 }}>{feat}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UploadPage;
