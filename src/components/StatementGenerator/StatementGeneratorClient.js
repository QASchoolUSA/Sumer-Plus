"use client";

import { useState, useRef } from "react";
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  FileText,
  Download,
  Eye,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

  const loadsInputRef = useRef(null);
  const termsInputRef = useRef(null);

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

  const FileUploadBox = ({ title, file, setFile, onFileChange, loading, error, sheets, selectedSheet, setSelectedSheet, inputRef, type }) => (
    <Card className={cn("relative transition-all duration-200", file ? "border-slate-200" : "border-dashed hover:bg-slate-50/50")}>
      <CardContent className="p-6">
        <div
          className="flex flex-col items-center justify-center text-center cursor-pointer"
          onClick={() => !file && inputRef.current?.click()}
        >
          <div className={cn("p-3 rounded-full mb-3", file ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-400")}>
            {file ? <CheckCircle2 className="h-6 w-6" /> : <UploadCloud className="h-6 w-6" />}
          </div>

          <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>

          {!file && (
            <p className="text-sm text-slate-500 mb-4">Click to select file</p>
          )}

          {file && (
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full mb-4">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span className="truncate max-w-[200px]">{file.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setResults([]);
                }}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept=".xls,.xlsx"
            onChange={onFileChange}
            className="hidden"
          />
        </div>

        {/* Sheet Selection Area */}
        {file && (
          <div className="mt-4 pt-4 border-t border-slate-100 w-full space-y-4">
            {error && (
              <div className="text-sm text-red-500 flex items-center gap-2 justify-center">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Reading sheets...
              </div>
            ) : sheets.length > 0 && (
              <div className="space-y-3">
                {type === 'terms' ? (
                  // Terms File - Drivers & Owners Sheets (Always Selects)
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500 uppercase">Drivers Sheet</label>
                      <select
                        value={selectedSheet.drivers}
                        onChange={(e) => setSelectedSheet.setDrivers(e.target.value)}
                        className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {sheets.map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500 uppercase">Owners Sheet</label>
                      <select
                        value={selectedSheet.owners}
                        onChange={(e) => setSelectedSheet.setOwners(e.target.value)}
                        className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {sheets.map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  // Loads File - Single Sheet
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-medium text-slate-500 uppercase">Select Sheet</label>
                    {sheets.length <= 8 ? (
                      <div className="flex flex-wrap gap-2">
                        {sheets.map((name) => (
                          <button
                            type="button"
                            key={name}
                            onClick={() => setSelectedSheet(name)}
                            className={cn(
                              "px-3 py-1.5 text-sm rounded-md border transition-all",
                              selectedSheet === name
                                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                            )}
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <select
                        value={selectedSheet}
                        onChange={(e) => setSelectedSheet(e.target.value)}
                        className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {sheets.map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileUploadBox
            title="Loads File"
            file={loadsFile}
            setFile={setLoadsFile}
            inputRef={loadsInputRef}
            loading={loadsSheetsLoading}
            error={loadsSheetsError}
            sheets={loadsSheets}
            selectedSheet={selectedLoadsSheet}
            setSelectedSheet={setSelectedLoadsSheet}
            type="loads"
            onFileChange={async (e) => {
              const f = e.target.files?.[0] || null;
              setLoadsFile(f);
              setResults([]);
              setError("");
              setLoadsSheets([]);
              setSelectedLoadsSheet("");
              if (f) await fetchSheets(f, setLoadsSheets, setSelectedLoadsSheet, setLoadsSheetsLoading, setLoadsSheetsError);
            }}
          />

          <FileUploadBox
            title="Drivers & Owners Terms"
            file={termsFile}
            setFile={setTermsFile}
            inputRef={termsInputRef}
            loading={termsSheetsLoading}
            error={termsSheetsError}
            sheets={termsSheets}
            selectedSheet={{ drivers: selectedDriversSheet, owners: selectedOwnersSheet }}
            setSelectedSheet={{ setDrivers: setSelectedDriversSheet, setOwners: setSelectedOwnersSheet }}
            type="terms"
            onFileChange={async (e) => {
              const f = e.target.files?.[0] || null;
              setTermsFile(f);
              setResults([]);
              setError("");
              setTermsSheets([]);
              setSelectedDriversSheet("");
              setSelectedOwnersSheet("");
              if (f) {
                await fetchSheets(f, setTermsSheets, (first) => {
                  const driversDefault = f && first ? first : "";
                  setSelectedDriversSheet(driversDefault);
                  setSelectedOwnersSheet(driversDefault);
                }, setTermsSheetsLoading, setTermsSheetsError);

                // Auto-select smart defaults
                if (Array.isArray(termsSheets) && termsSheets.length > 0) {
                  const driversDefault = termsSheets.find((n) => String(n).toLowerCase() === "drivers") || termsSheets[0] || "";
                  const ownersDefault = termsSheets.find((n) => String(n).toLowerCase() === "owner") || termsSheets[1] || termsSheets[0] || "";
                  setSelectedDriversSheet(driversDefault);
                  setSelectedOwnersSheet(ownersDefault);
                }
              }
            }}
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-md flex items-center gap-3 text-red-600 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={loading || !loadsFile || !termsFile}
            className="w-full md:w-auto min-w-[140px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Generate PDF Statements"
            )}
          </Button>
        </div>
      </form>

      {/* Results Section */}
      {results.length > 0 && (
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <CardTitle>Generated Statements</CardTitle>
            <CardDescription>Successfully generated {results.length} PDF files.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-slate-100">
              {results.map((f) => (
                <div key={f.name} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 hover:bg-slate-50 -mx-4 px-4 transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                      <FileText className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 truncate">{f.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(f.url, '_blank')}
                      className="h-8 md:h-9"
                    >
                      <Eye className="h-3.5 w-3.5 mr-2" />
                      <span className="hidden sm:inline">Preview</span>
                    </Button>
                    <a href={f.url} download={f.name} className="inline-block">
                      <Button size="sm" className="h-8 md:h-9">
                        <Download className="h-3.5 w-3.5 mr-2" />
                        <span className="hidden sm:inline">Download</span>
                      </Button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
