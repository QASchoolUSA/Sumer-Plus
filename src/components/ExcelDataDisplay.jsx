'use client';

import React, { useState, useRef } from 'react';
import * as validXlsx from 'xlsx';

export default function ExcelDataDisplay() {
  const [data, setData] = useState({ drivers: [], owners: [] });
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = validXlsx.read(bstr, { type: 'binary' });

      // Parse Drivers Sheet
      const driversSheet = wb.Sheets['Drivers'];
      let driversData = [];
      if (driversSheet) {
        const rawDrivers = validXlsx.utils.sheet_to_json(driversSheet);
        driversData = rawDrivers.map(row => ({
          'Unit': row['Unit Number'] || '-',
          'Driver': row['Driver'] || 'Unknown',
          'Email': row['Driver E-mail'] || '-',
          'Terms': row['Per Mile'] ? `${row['Per Mile']} / mi` : '-'
        })).filter(row => row['Unit'] !== '-' || row['Driver'] !== 'Unknown');
      }

      // Parse Owners Sheet
      const ownerSheet = wb.Sheets['Owner'];
      let ownersData = [];
      if (ownerSheet) {
        const rawOwners = validXlsx.utils.sheet_to_json(ownerSheet);
        ownersData = rawOwners.map(row => ({
          'Owner': row['Owner'] || 'Unknown',
          'Company': row['Firma'] || '-',
          'Terms': '88% Gross'
        })).filter(row => row['Owner'] !== 'Unknown');
      }

      setData({
        drivers: driversData,
        owners: ownersData,
      });
    };
    reader.readAsBinaryString(file);
  };

  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const Table = ({ title, items }) => {
    if (!items || items.length === 0) return null;
    const headers = Object.keys(items[0]);

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h3>
          <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-md">
            {items.length} rows
          </span>
        </div>
        <div className="rounded-md border border-slate-200">
          <table className="w-full text-sm text-left">
            <thead className="text-slate-500 font-medium border-b border-slate-200 bg-slate-50/50">
              <tr>
                {headers.map((h) => (
                  <th key={h} className="h-10 px-4 align-middle font-medium text-slate-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  {headers.map((h) => (
                    <td key={h} className="p-4 align-middle text-slate-900">
                      {row[h]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Compact Header / Upload Bar */}
      <div className="flex items-center justify-between p-1 bg-white">
        <div className="flex items-center gap-4">
          <button
            onClick={triggerUpload}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 shadow hover:bg-slate-900/90 h-9 px-4 py-2"
          >
            <svg
              className="mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
            Import Excel
          </button>

          {fileName && (
            <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
              <svg
                className="h-4 w-4 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span>{fileName}</span>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {!fileName ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="rounded-full bg-slate-100 p-3">
                <svg className="h-6 w-6 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-slate-900">No data imported</h3>
              <p className="text-sm text-slate-500 max-w-xs">
                Upload an Excel file to view driver and owner terms.
              </p>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {data.drivers.length > 0 && <Table title="Drivers" items={data.drivers} />}
            {data.owners.length > 0 && <Table title="Owners" items={data.owners} />}
          </div>
        )}
      </div>
    </div>
  );
}
