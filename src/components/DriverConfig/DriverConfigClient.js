"use client";

import { useState } from "react";

export default function DriverConfigClient() {
  const [unitNumber, setUnitNumber] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverEmail, setDriverEmail] = useState("");
  const [company, setCompany] = useState("");
  const [ratePerMile, setRatePerMile] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [lookupUnit, setLookupUnit] = useState("");
  const [record, setRecord] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");
    const unit = Number(unitNumber);
    const rpm = Number(ratePerMile);
    if (!unit || !driverName || !rpm) {
      setError("Unit number, Driver name, and Rate per mile are required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/driver-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unitNumber: unit,
          driverName,
          driverEmail: driverEmail || null,
          company: company || null,
          ratePerMile: rpm,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Failed to save");
      } else {
        setMessage("Saved successfully");
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  async function onLookup(e) {
    e.preventDefault();
    setRecord(null);
    setError("");
    const unit = Number(lookupUnit);
    if (!unit) {
      setError("Enter a valid unit number");
      return;
    }
    try {
      const res = await fetch(`/api/driver-config?unit=${unit}`);
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Lookup failed");
        return;
      }
      setRecord(data.data || null);
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 12 }}>Driver Configuration</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <label>Unit Number</label>
          <input
            type="number"
            value={unitNumber}
            onChange={(e) => setUnitNumber(e.target.value)}
            placeholder="e.g., 5490"
            style={{ padding: "8px 10px", border: "1px solid #ddd", borderRadius: 6 }}
          />
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          <label>Driver Name</label>
          <input
            type="text"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            placeholder="e.g., Nikita Bogdanov"
            style={{ padding: "8px 10px", border: "1px solid #ddd", borderRadius: 6 }}
          />
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          <label>Driver Email</label>
          <input
            type="email"
            value={driverEmail}
            onChange={(e) => setDriverEmail(e.target.value)}
            placeholder="e.g., nikita@kedrov.com"
            style={{ padding: "8px 10px", border: "1px solid #ddd", borderRadius: 6 }}
          />
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          <label>Company</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g., Arba Express LLC"
            style={{ padding: "8px 10px", border: "1px solid #ddd", borderRadius: 6 }}
          />
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          <label>Rate Per Mile</label>
          <input
            type="number"
            step="0.01"
            value={ratePerMile}
            onChange={(e) => setRatePerMile(e.target.value)}
            placeholder="e.g., 0.65"
            style={{ padding: "8px 10px", border: "1px solid #ddd", borderRadius: 6 }}
          />
        </div>
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
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
      {message ? <div style={{ color: "green", marginTop: 8 }}>{message}</div> : null}
      {error ? <div style={{ color: "red", marginTop: 8 }}>{error}</div> : null}

      <div style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 8 }}>Lookup</h3>
        <form onSubmit={onLookup} style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <input
            type="number"
            value={lookupUnit}
            onChange={(e) => setLookupUnit(e.target.value)}
            placeholder="Unit number"
            style={{ padding: "8px 10px", border: "1px solid #ddd", borderRadius: 6 }}
          />
          <button
            type="submit"
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Fetch
          </button>
        </form>
        {record ? (
          <div style={{ marginTop: 12, border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
            <div>Unit: {record.unit_number}</div>
            <div>Driver: {record.driver_name}</div>
            <div>Email: {record.driver_email || "-"}</div>
            <div>Company: {record.company || "-"}</div>
            <div>Rate/Mile: {String(record.rate_per_mile)}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
