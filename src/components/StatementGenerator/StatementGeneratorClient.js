"use client";

import { useState, useMemo } from "react";

export default function StatementGeneratorClient({ lang }) {
  const [file, setFile] = useState(null);
  const [sheet, setSheet] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const selected = useMemo(() => {
    if (selectedIndex == null) return null;
    return results[selectedIndex] || null;
  }, [selectedIndex, results]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Please select an Excel file");
      return;
    }
    setLoading(true);
    try {
      const base64 = await readFileAsBase64(file);
      const res = await fetch(`/api/generate-statements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ excel_base64: base64, sheet }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Generation failed");
        setLoading(false);
        return;
      }
      const files = (data.files || []).map((f) => {
        const blob = base64ToPdfBlob(f.pdf_base64);
        const url = URL.createObjectURL(blob);
        return { name: f.name, url };
      });
      setResults(files);
      setSelectedIndex(files.length ? 0 : null);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  function base64ToPdfBlob(b64) {
    const byteChars = atob(b64);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: "application/pdf" });
  }

  function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        const b64 = String(result).split(",")[1] || "";
        resolve(b64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return (
    <div style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 12 }}>Statement Generator</h1>
      <form onSubmit={onSubmit} style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <input type="file" accept=".xlsx" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <input
          type="text"
          placeholder="Sheet name (optional)"
          value={sheet}
          onChange={(e) => setSheet(e.target.value)}
          style={{ padding: "8px 10px", border: "1px solid #ddd", borderRadius: 6 }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 16px",
            borderRadius: 6,
            border: "none",
            background: "#000",
            color: "#fff",
            cursor: loading ? "default" : "pointer",
          }}
        >
          {loading ? "Processing..." : "Generate"}
        </button>
      </form>
      {error ? <div style={{ color: "red", marginTop: 8 }}>{error}</div> : null}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16, marginTop: 24 }}>
        <div>
          <h3 style={{ marginBottom: 8 }}>Results</h3>
          <div style={{ border: "1px solid #eee", borderRadius: 8, maxHeight: 400, overflow: "auto" }}>
            {results.length === 0 ? (
              <div style={{ padding: 12, color: "#666" }}>No files yet</div>
            ) : (
              results.map((f, i) => (
                <div
                  key={f.name}
                  onClick={() => setSelectedIndex(i)}
                  style={{
                    padding: 10,
                    borderBottom: "1px solid #f2f2f2",
                    background: selectedIndex === i ? "#f7f7f7" : "#fff",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{f.name}</span>
                  <a href={f.url} download={f.name} style={{ fontSize: 12 }}>Download</a>
                </div>
              ))
            )}
          </div>
        </div>
        <div>
          <h3 style={{ marginBottom: 8 }}>Preview</h3>
          <div style={{ border: "1px solid #eee", borderRadius: 8, height: 600, overflow: "hidden" }}>
            {selected ? (
              <iframe src={selected.url} title={selected.name} style={{ width: "100%", height: "100%", border: "none" }} />
            ) : (
              <div style={{ padding: 12, color: "#666" }}>Select a file to preview</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
