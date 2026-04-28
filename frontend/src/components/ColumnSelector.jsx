import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ColumnSelector({ columns, rows, file }) {
  const [target, setTarget] = useState("");
  const [sensitive, setSensitive] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const targetKeywords = ["hired", "rejected", "selected", "approved", "accepted"];
  const targetOptions = columns.filter((col) =>
    targetKeywords.some((keyword) => col.toLowerCase().includes(keyword))
  );
  const sensitiveOptions = columns.filter((col) => col !== target);

  const handleContinue = async () => {
    if (!target || !sensitive) { alert("Please select both columns"); return; }
    if (!file) { alert("File missing. Please go back and re-upload."); return; }
    
    setLoading(true);
    try {
      const features = columns.filter(c => c !== target && c !== sensitive).join(",");
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("target_column", target);
      formData.append("sensitive_column", sensitive);
      formData.append("feature_columns", features);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/analyze/`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Analysis failed");

      // Pass the API metrics and analysis_id to the dashboard
      navigate("/dashboard", { state: { target, sensitive, rows, analysis_id: data.analysis_id, metrics: data, file, columns } });
    } catch (err) {
      console.error(err);
      alert("Error during analysis: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const SelectBox = ({ label, value, onChange, options, placeholder, hint }) => (
    <div style={{ marginBottom: "20px" }}>
      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#64748b", marginBottom: "8px" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={onChange}
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "rgba(99,120,255,0.06)",
            border: `1px solid ${value ? "rgba(100,119,255,0.35)" : "rgba(99,120,255,0.18)"}`,
            borderRadius: "10px",
            color: value ? "#f1f5f9" : "#475569",
            fontSize: "14px",
            fontFamily: "'DM Sans', sans-serif",
            cursor: "pointer",
            appearance: "none",
            outline: "none",
            transition: "all 0.2s ease",
          }}
        >
          <option value="">{placeholder}</option>
          {options.map((col) => (
            <option key={col} value={col} style={{ background: "#1c2340", color: "#f1f5f9" }}>{col}</option>
          ))}
        </select>
        <div style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#475569", pointerEvents: "none" }}>▾</div>
      </div>
      {hint && <p style={{ fontSize: "11px", color: "#374151", marginTop: "6px" }}>{hint}</p>}
    </div>
  );

  return (
    <div style={{
      background: "linear-gradient(135deg, #161b2e 0%, #1c2340 100%)",
      border: "1px solid rgba(99,120,255,0.15)",
      borderRadius: "20px",
      padding: "32px",
      maxWidth: "480px",
      boxShadow: "0 0 0 1px rgba(255,255,255,0.02), 0 24px 64px rgba(0,0,0,0.5)",
    }}>
      <SelectBox
        label="Target Column"
        value={target}
        onChange={(e) => { setTarget(e.target.value); if (sensitive === e.target.value) setSensitive(""); }}
        options={targetOptions}
        placeholder="Select decision column…"
        hint="The final hiring decision outcome (hired/rejected)"
      />

      <SelectBox
        label="Sensitive Attribute"
        value={sensitive}
        onChange={(e) => setSensitive(e.target.value)}
        options={sensitiveOptions}
        placeholder="Select sensitive column…"
        hint="The demographic group to audit fairness across"
      />

      <button
        onClick={handleContinue}
        disabled={loading}
        style={{
          width: "100%",
          background: loading ? "rgba(99,120,255,0.1)" : "linear-gradient(135deg, #6477ff 0%, #818cf8 100%)",
          color: loading ? "#475569" : "#fff",
          border: loading ? "1px solid rgba(99,120,255,0.15)" : "none",
          padding: "13px",
          borderRadius: "10px",
          fontSize: "14px",
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: loading ? "none" : "0 4px 20px rgba(100,119,255,0.35)",
          transition: "all 0.2s ease",
          letterSpacing: "0.02em",
          marginTop: "8px",
        }}
        onMouseEnter={e => { if(!loading) { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 28px rgba(100,119,255,0.5)"; } }}
        onMouseLeave={e => { if(!loading) { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 20px rgba(100,119,255,0.35)"; } }}
      >
        {loading ? "Analyzing..." : "Run Fairness Analysis →"}
      </button>
    </div>
  );
}

export default ColumnSelector;
