"use client";

import { useState, useRef } from "react";
import * as validXlsx from 'xlsx';
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  FileText,
  Download,
  Eye,
  AlertCircle,
  AlertCircle,
  Loader2,
  Bug
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function StatementGeneratorClient({ lang }) {
  const [loading, setLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState(null); // For troubleshooting parsing issues
  const [results, setResults] = useState([]);

  // Loads File
  const [loadsFile, setLoadsFile] = useState(null);
  const [loadsSheets, setLoadsSheets] = useState([]);
  const [selectedLoadsSheet, setSelectedLoadsSheet] = useState("");
  const [loadsSheetsLoading, setLoadsSheetsLoading] = useState(false);
  const [loadsSheetsError, setLoadsSheetsError] = useState("");

  // Terms (Drivers/Owners) File
  const [termsFile, setTermsFile] = useState(null);
  const [termsSheets, setTermsSheets] = useState([]);
  const [selectedDriversSheet, setSelectedDriversSheet] = useState("");
  const [selectedOwnersSheet, setSelectedOwnersSheet] = useState("");
  const [termsSheetsLoading, setTermsSheetsLoading] = useState(false);
  const [termsSheetsError, setTermsSheetsError] = useState("");

  // Optional: Tolls File
  const [tollsFile, setTollsFile] = useState(null);
  const [tollsSheets, setTollsSheets] = useState([]);
  const [selectedTollsSheet, setSelectedTollsSheet] = useState("");
  const [tollsSheetsLoading, setTollsSheetsLoading] = useState(false);
  const [tollsSheetsError, setTollsSheetsError] = useState("");

  // Optional: Deductions File
  const [deductionsFile, setDeductionsFile] = useState(null);
  const [deductionsSheets, setDeductionsSheets] = useState([]);
  const [selectedDeductionsSheet, setSelectedDeductionsSheet] = useState("");
  const [deductionsSheetsLoading, setDeductionsSheetsLoading] = useState(false);
  const [deductionsSheetsError, setDeductionsSheetsError] = useState("");

  const loadsInputRef = useRef(null);
  const termsInputRef = useRef(null);
  const tollsInputRef = useRef(null);
  const deductionsInputRef = useRef(null);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setDebugInfo(null);
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
    // Optional validations can go here if needed (e.g., if file selected but no sheet picked)
    if (tollsFile && !selectedTollsSheet) {
      setError("Please select a sheet for the Tolls file");
      return;
    }
    if (deductionsFile && !selectedDeductionsSheet) {
      setError("Please select a sheet for the Deductions file");
      return;
    }

    setLoading(true);
    try {
      const loadsB64 = await readFileAsBase64(loadsFile);
      const termsB64 = await readFileAsBase64(termsFile);

      const payload = {
        loads_excel_base64: loadsB64,
        loads_sheet: selectedLoadsSheet,
        terms_excel_base64: termsB64,
        drivers_sheet: selectedDriversSheet,
        owners_sheet: selectedOwnersSheet,
      };

      if (tollsFile) {
        payload.tolls_excel_base64 = await readFileAsBase64(tollsFile);
        payload.tolls_sheet = selectedTollsSheet;
      }

      if (deductionsFile) {
        payload.deductions_excel_base64 = await readFileAsBase64(deductionsFile);
        payload.deductions_sheet = selectedDeductionsSheet;
      }

      const res = await fetch(`/api/generate-statements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log("Raw API Response:", data);

      let parsedData = data;
      // Handle case where API route returns a wrapped string in 'output'
      if (!data.files && data.output && typeof data.output === 'string') {
        console.log("Detecting wrapped output. Attempting to parse...");
        try {
          parsedData = JSON.parse(data.output);
        } catch (e) {
          console.error("Direct JSON parse failed:", e);
          // Try to clean up the string (find first { and last })
          const start = data.output.indexOf('{');
          const end = data.output.lastIndexOf('}');
          if (start !== -1 && end !== -1) {
            const cleanJson = data.output.substring(start, end + 1);
            try {
              parsedData = JSON.parse(cleanJson);
              console.log("Cleaned JSON parsed successfully");
            } catch (e2) {
              console.error("Cleaned JSON parse failed:", e2);
              setDebugInfo({ raw: data.output, error: String(e2) });
              throw new Error("Failed to parse backend response. See debug info.");
            }
          } else {
            setDebugInfo({ raw: data.output, error: String(e) });
            throw new Error("Invalid backend response format.");
          }
        }
      }

      if (!parsedData.ok) {
        throw new Error(parsedData.error || "Failed to generate statements");
      }

      console.log("Parsed Data Files:", parsedData.files);

      const files = (parsedData.files || []).map((f) => {
        const blob = base64ToPdfBlob(f.pdf_base64);
        const url = URL.createObjectURL(blob);
        return { name: f.name, url, stats: f.stats };
      });

      console.log("Processed Files:", files);
      setResults(files);
      if (files.length === 0) {
        setError("Generated 0 files. Check input data.");
      }
    } catch (err) {
      console.error("onSubmit Error:", err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  // Client-side sheet parsing using xlsx
  async function parseSheets(file, setList, setSelected, setLoading, setError) {
    try {
      setLoading(true);
      setError("");

      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const bstr = e.target.result;
          const wb = validXlsx.read(bstr, { type: 'binary' });
          const sheetNames = wb.SheetNames;

          if (sheetNames && sheetNames.length > 0) {
            setList(sheetNames);
            if (setSelected) {
              // If it's a simple setSelected (loads, tolls, deductions), set the first one
              if (typeof setSelected === 'function') {
                setSelected(sheetNames[0]);
              }
              // If it's the complex callback (terms), call it with the first sheet
              else if (typeof setSelected === 'object' && setSelected.callback) {
                setSelected.callback(sheetNames[0]);
              }
            }
          } else {
            setList([]);
            setError("No sheets found in file.");
          }
        } catch (err) {
          console.error(err);
          setList([]);
          setError("Failed to parse Excel file.");
        } finally {
          setLoading(false);
        }
      };

      reader.onerror = () => {
        setList([]);
        setError("Failed to read file.");
        setLoading(false);
      };

      reader.readAsBinaryString(file);

    } catch (err) {
      console.error(err);
      setList([]);
      setError("Failed to process file.");
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

  const FileUploadBox = ({
    title,
    file,
    setFile,
    onFileChange,
    loading,
    error,
    sheets,
    selectedSheet,
    setSelectedSheet,
    inputRef,
    type,
    optional = false
  }) => (
    <Card className={cn("relative transition-all duration-200 h-full", file ? "border-slate-200" : "border-dashed hover:bg-slate-50/50")}>
      <CardContent className="p-6 h-full flex flex-col">
        <div
          className="flex flex-col items-center justify-center text-center cursor-pointer flex-grow"
          onClick={() => !file && inputRef.current?.click()}
        >
          <div className={cn("p-3 rounded-full mb-3", file ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-400")}>
            {file ? <CheckCircle2 className="h-6 w-6" /> : <UploadCloud className="h-6 w-6" />}
          </div>

          <h3 className="font-semibold text-slate-900 mb-1">
            {title}
            {optional && <span className="text-xs font-normal text-slate-400 ml-1">(Optional)</span>}
          </h3>

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
                  // We don't reset all results on optional file clear, just the file state
                  if (type === 'loads' || type === 'terms') setResults([]);
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
                  // Generic Single Sheet Selection (Loads, Tolls, Deductions)
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
              if (f) await parseSheets(f, setLoadsSheets, setSelectedLoadsSheet, setLoadsSheetsLoading, setLoadsSheetsError);
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
                await parseSheets(f, setTermsSheets, {
                  callback: (first) => {
                    const driversDefault = f && first ? first : "";
                    setSelectedDriversSheet(driversDefault);
                    setSelectedOwnersSheet(driversDefault);
                  }
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

          <FileUploadBox
            title="Tolls"
            file={tollsFile}
            setFile={setTollsFile}
            inputRef={tollsInputRef}
            loading={tollsSheetsLoading}
            error={tollsSheetsError}
            sheets={tollsSheets}
            selectedSheet={selectedTollsSheet}
            setSelectedSheet={setSelectedTollsSheet}
            type="tolls"
            optional={true}
            onFileChange={async (e) => {
              const f = e.target.files?.[0] || null;
              setTollsFile(f);
              setError("");
              setTollsSheets([]);
              setSelectedTollsSheet("");
              if (f) await parseSheets(f, setTollsSheets, setSelectedTollsSheet, setTollsSheetsLoading, setTollsSheetsError);
            }}
          />

          <FileUploadBox
            title="Deductions"
            file={deductionsFile}
            setFile={setDeductionsFile}
            inputRef={deductionsInputRef}
            loading={deductionsSheetsLoading}
            error={deductionsSheetsError}
            sheets={deductionsSheets}
            selectedSheet={selectedDeductionsSheet}
            setSelectedSheet={setSelectedDeductionsSheet}
            type="deductions"
            optional={true}
            onFileChange={async (e) => {
              const f = e.target.files?.[0] || null;
              setDeductionsFile(f);
              setError("");
              setDeductionsSheets([]);
              setSelectedDeductionsSheet("");
              if (f) await parseSheets(f, setDeductionsSheets, setSelectedDeductionsSheet, setDeductionsSheetsLoading, setDeductionsSheetsError);
            }}
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-md flex flex-col gap-2 text-red-600 text-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span className="font-semibold">{error}</span>
            </div>
            {debugInfo && (
              <div className="mt-2 text-xs font-mono bg-white p-2 rounded border border-red-200 overflow-auto max-h-40">
                <p className="font-bold border-b mb-1">Raw Output:</p>
                {debugInfo.raw}
                <p className="font-bold border-b mt-2 mb-1">Parse Error:</p>
                {debugInfo.error}
              </div>
            )}
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
                <div key={f.name} className="flex flex-col md:flex-row md:items-center justify-between py-4 first:pt-0 last:pb-0 hover:bg-slate-50 -mx-4 px-4 transition-colors gap-4">
                  <div className="flex items-center gap-3 overflow-hidden min-w-0">
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-slate-700 block truncate">{f.name}</span>
                      {f.stats && (
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                          <span><span className="font-semibold text-slate-600">Gross:</span> ${f.stats.gross?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          <span><span className="font-semibold text-slate-600">Miles:</span> {f.stats.miles?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                          <span className="text-green-600 font-medium"><span className="text-slate-600 font-semibold">Net Pay:</span> ${f.stats.net?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
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
