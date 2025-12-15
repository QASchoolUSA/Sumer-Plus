"use client";

import { useState } from "react";

export default function StatementGeneratorClient({ lang }) {
  const [file, setFile] = useState(null);
  const [sheet, setSheet] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [sheets, setSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [sheetsLoading, setSheetsLoading] = useState(false);
  const [sheetsError, setSheetsError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Please select an Excel file");
      return;
    }
    if (sheets.length > 0 && !selectedSheet) {
      setError("Please select a sheet to generate statements");
      return;
    }
    setLoading(true);
    try {
      const base64 = await readFileAsBase64(file);
      const res = await fetch(`/api/generate-statements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ excel_base64: base64, sheet: selectedSheet || sheet }),
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
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  async function fetchSheetsForFile(f) {
    try {
      setSheetsLoading(true);
      setSheetsError("");
      const base64 = await readFileAsBase64(f);
      const res = await fetch(`/api/generate-statements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sheets", excel_base64: base64 }),
      });
      const data = await res.json();
      if (res.ok && data.ok && Array.isArray(data.sheets)) {
        setSheets(data.sheets);
        setSelectedSheet(data.sheets[0] || "");
      } else {
        setSheets([]);
        setSelectedSheet("");
        setSheetsError("Could not read sheet names. Enter manually.");
      }
    } catch {
      setSheets([]);
      setSelectedSheet("");
      setSheetsError("Failed to read sheet names.");
    } finally {
      setSheetsLoading(false);
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
        <input
          type="file"
          accept=".xls,.xlsx"
          onChange={async (e) => {
            const f = e.target.files?.[0] || null;
            setFile(f);
            setResults([]);
            setError("");
            setSheets([]);
            setSelectedSheet("");
            if (f) {
              await fetchSheetsForFile(f);
            }
          }}
        />
        {sheetsLoading ? (
          <div style={{ padding: "8px 10px" }}>Loading sheets…</div>
        ) : sheets.length > 0 ? (
          sheets.length <= 8 ? (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {sheets.map((name) => (
                <label key={name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    type="radio"
                    name="sheet"
                    value={name}
                    checked={selectedSheet === name}
                    onChange={(e) => setSelectedSheet(e.target.value)}
                  />
                  {name}
                </label>
              ))}
            </div>
          ) : (
            <select
              value={selectedSheet}
              onChange={(e) => setSelectedSheet(e.target.value)}
              style={{ padding: "8px 10px", border: "1px solid #ddd", borderRadius: 6 }}
            >
              {sheets.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          )
        ) : (
          <input
            type="text"
            placeholder="Sheet name (optional)"
            value={sheet}
            onChange={(e) => setSheet(e.target.value)}
            style={{ padding: "8px 10px", border: "1px solid #ddd", borderRadius: 6 }}
          />
        )}
        {sheetsError ? <div style={{ color: "red" }}>{sheetsError}</div> : null}
        <button
          type="submit"
          disabled={loading || !file}
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
      <div style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 8 }}>Results</h3>
        <div style={{ border: "1px solid #eee", borderRadius: 8, maxHeight: 500, overflow: "auto" }}>
          {results.length === 0 ? (
            <div style={{ padding: 12, color: "#666" }}>No files yet</div>
          ) : (
            results.map((f) => (
              <div
                key={f.name}
                style={{
                  padding: 12,
                  borderBottom: "1px solid #f2f2f2",
                  display: "flex",
                  gap: 12,
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ flex: 1, minWidth: 200 }}>{f.name}</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <a
                    href={f.url}
                    download={f.name}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "1px solid #ddd",
                      textDecoration: "none",
                    }}
                  >
                    Download
                  </a>
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "1px solid #ddd",
                      textDecoration: "none",
                    }}
                  >
                    Preview
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
