"use client";

import { useState } from "react";

export default function StatementGeneratorClient({ lang }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);

  const [loadsFile, setLoadsFile] = useState(null);
  const [loadsSheets, setLoadsSheets] = useState([]);
  const [selectedLoadsSheet, setSelectedLoadsSheet] = useState("");
  const [loadsSheetsLoading, setLoadsSheetsLoading] = useState(false);
  const [loadsSheetsError, setLoadsSheetsError] = useState("");

  const [termsFile, setTermsFile] = useState(null);
  const [termsSheets, setTermsSheets] = useState([]);
  const [selectedDriversSheet, setSelectedDriversSheet] = useState("");
  const [selectedOwnersSheet, setSelectedOwnersSheet] = useState("");
  const [termsSheetsLoading, setTermsSheetsLoading] = useState(false);
  const [termsSheetsError, setTermsSheetsError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!loadsFile || !termsFile) {
      setError("Please select both Loads and Drivers/Owners files");
      return;
    }
    if (!selectedLoadsSheet) {
      setError("Please select a sheet for the Loads file");
      return;
    }
    if (!selectedDriversSheet || !selectedOwnersSheet) {
      setError("Please select Drivers and Owner sheets for the Terms file");
      return;
    }
    setLoading(true);
    try {
      const loadsB64 = await readFileAsBase64(loadsFile);
      const termsB64 = await readFileAsBase64(termsFile);
      const res = await fetch(`/api/generate-statements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loads_excel_base64: loadsB64,
          loads_sheet: selectedLoadsSheet,
          terms_excel_base64: termsB64,
          drivers_sheet: selectedDriversSheet,
          owners_sheet: selectedOwnersSheet,
        }),
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

  async function fetchSheets(file, setList, setSelected, setLoading, setError) {
    try {
      setLoading(true);
      setError("");
      const base64 = await readFileAsBase64(file);
      const res = await fetch(`/api/generate-statements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sheets", excel_base64: base64 }),
      });
      const data = await res.json();
      if (res.ok && data.ok && Array.isArray(data.sheets)) {
        setList(data.sheets);
        setSelected(data.sheets[0] || "");
      } else {
        setList([]);
        setSelected("");
        setError("Could not read sheet names.");
      }
    } catch {
      setList([]);
      setSelected("");
      setError("Failed to read sheet names.");
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
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <strong>Loads file</strong>
          <input
            type="file"
            accept=".xls,.xlsx"
            onChange={async (e) => {
              const f = e.target.files?.[0] || null;
              setLoadsFile(f);
              setResults([]);
              setError("");
              setLoadsSheets([]);
              setSelectedLoadsSheet("");
              if (f) {
                await fetchSheets(f, setLoadsSheets, setSelectedLoadsSheet, setLoadsSheetsLoading, setLoadsSheetsError);
              }
            }}
          />
          {loadsSheetsLoading ? (
            <div style={{ padding: "8px 10px" }}>Loading sheets…</div>
          ) : loadsSheets.length > 0 ? (
            loadsSheets.length <= 8 ? (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {loadsSheets.map((name) => (
                  <label key={name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input
                      type="radio"
                      name="loads_sheet"
                      value={name}
                      checked={selectedLoadsSheet === name}
                      onChange={(e) => setSelectedLoadsSheet(e.target.value)}
                    />
                    {name}
                  </label>
                ))}
              </div>
            ) : (
              <select
                value={selectedLoadsSheet}
                onChange={(e) => setSelectedLoadsSheet(e.target.value)}
                style={{ padding: "8px 10px", border: "1px solid #ddd", borderRadius: 6 }}
              >
                {loadsSheets.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            )
          ) : null}
          {loadsSheetsError ? <div style={{ color: "red" }}>{loadsSheetsError}</div> : null}
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <strong>Drivers/Owners terms file</strong>
          <input
            type="file"
            accept=".xls,.xlsx"
            onChange={async (e) => {
              const f = e.target.files?.[0] || null;
              setTermsFile(f);
              setResults([]);
              setError("");
              setTermsSheets([]);
              setSelectedDriversSheet("");
              setSelectedOwnersSheet("");
              if (f) {
                await fetchSheets(f, setTermsSheets, (first) => {
                  const driversDefault =
                    f && first
                      ? first
                      : "";
                  setSelectedDriversSheet(driversDefault);
                  setSelectedOwnersSheet(driversDefault);
                }, setTermsSheetsLoading, setTermsSheetsError);
                if (Array.isArray(termsSheets) && termsSheets.length > 0) {
                  const driversDefault = termsSheets.find((n) => String(n).toLowerCase() === "drivers") || termsSheets[0] || "";
                  const ownersDefault = termsSheets.find((n) => String(n).toLowerCase() === "owner") || termsSheets[1] || termsSheets[0] || "";
                  setSelectedDriversSheet(driversDefault);
                  setSelectedOwnersSheet(ownersDefault);
                }
              }
            }}
          />
          {termsSheetsLoading ? (
            <div style={{ padding: "8px 10px" }}>Loading sheets…</div>
          ) : termsSheets.length > 0 ? (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span>Drivers:</span>
                <select
                  value={selectedDriversSheet}
                  onChange={(e) => setSelectedDriversSheet(e.target.value)}
                  style={{ padding: "8px 10px", border: "1px solid #ddd", borderRadius: 6 }}
                >
                  {termsSheets.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span>Owner:</span>
                <select
                  value={selectedOwnersSheet}
                  onChange={(e) => setSelectedOwnersSheet(e.target.value)}
                  style={{ padding: "8px 10px", border: "1px solid #ddd", borderRadius: 6 }}
                >
                  {termsSheets.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : null}
          {termsSheetsError ? <div style={{ color: "red" }}>{termsSheetsError}</div> : null}
        </div>

        <button
          type="submit"
          disabled={loading || !loadsFile || !termsFile}
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
