'use client';

import React, { useState, useRef } from 'react';
import * as validXlsx from 'xlsx';
import { UploadCloud, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ExcelDataDisplay() {
  const [data, setData] = useState({ drivers: [], owners: [] });
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const DataTable = ({ title, items }) => {
    if (!items || items.length === 0) return null;
    const headers = Object.keys(items[0]);

    return (
      <Card className="mt-8 border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-white border border-slate-200 shadow-sm">
                <FileSpreadsheet className="h-4 w-4 text-blue-600" />
              </div>
              <CardTitle className="text-base font-medium">{title}</CardTitle>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {items.length} records
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-slate-100">
                {headers.map((h) => (
                  <TableHead key={h} className="h-10 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((row, i) => (
                <TableRow key={i} className="hover:bg-slate-50/50 border-slate-100 transition-colors">
                  {headers.map((h) => (
                    <TableCell key={h} className="py-3 text-slate-600">
                      {row[h]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Upload Area */}
      <div
        className={`
          relative group cursor-pointer
          rounded-xl border-2 border-dashed transition-all duration-200 ease-in-out
          ${isDragging
            ? 'border-blue-500 bg-blue-50/50 ring-4 ring-blue-500/10'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerUpload}
      >
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className={`
            p-4 rounded-full mb-4 transition-colors
            ${fileName ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow-sm'}
          `}>
            {fileName ? (
              <CheckCircle2 className="h-8 w-8" />
            ) : (
              <UploadCloud className="h-8 w-8" />
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-900">
              {fileName ? 'File selected' : 'Upload Excel file'}
            </h3>
            <p className="text-sm text-slate-500">
              {fileName || 'Drag and drop or click to browse'}
            </p>
          </div>

          {fileName && (
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              <FileSpreadsheet className="h-3 w-3" />
              {fileName}
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
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {!fileName ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-slate-50 mb-4">
              <AlertCircle className="h-6 w-6 text-slate-300" />
            </div>
            <h3 className="text-sm font-medium text-slate-900">No data to display</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
              Please upload an Excel file containing Drivers and Owners sheets to view the data.
            </p>
          </div>
        ) : (
          <div className="space-y-8 pb-12">
            {data.drivers.length > 0 && <DataTable title="Drivers" items={data.drivers} />}
            {data.owners.length > 0 && <DataTable title="Owners" items={data.owners} />}
          </div>
        )}
      </div>
    </div>
  );
}
