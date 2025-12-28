'use client';

import React, { useState, useCallback } from 'react';
import * as validXlsx from 'xlsx';

export default function ExcelDataDisplay() {
  const [data, setData] = useState({ drivers: [], owners: [] });
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);

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
          'Unit Number': row['Unit Number'] || '-',
          'Driver Name': row['Driver'] || 'Unknown Driver',
          'Driver Email': row['Driver E-mail'] || '-',
          'Terms': row['Per Mile'] ? `${row['Per Mile']} per mile` : '-'
        })).filter(row => row['Unit Number'] !== '-' || row['Driver Name'] !== 'Unknown Driver');
      }

      // Parse Owners Sheet
      const ownerSheet = wb.Sheets['Owner'];
      let ownersData = [];
      if (ownerSheet) {
        const rawOwners = validXlsx.utils.sheet_to_json(ownerSheet);
        ownersData = rawOwners.map(row => ({
          'Owner Name': row['Owner'] || 'Unknown Owner',
          'Company': row['Firma'] || '-',
          'Terms': '88% of Gross' // Hardcoded logic as requested
        })).filter(row => row['Owner Name'] !== 'Unknown Owner');
      }

      setData({
        drivers: driversData,
        owners: ownersData,
      });
    };
    reader.readAsBinaryString(file);
  };

  const handleFileUpload = (e) => {
    processFile(e.target.files[0]);
  };

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  }, []);

  const EmptyState = ({ title }) => (
    <div className="py-12 border border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      </div>
      <p className="text-sm font-medium">No {title} data found</p>
    </div>
  );

  const TableSection = ({ title, items, iconPath }) => {
    if (!items || items.length === 0) return null;

    const headers = Object.keys(items[0]);

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={iconPath} />
            </svg>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">{title}</h3>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {items.length} records
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((header) => (
                  <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                  {headers.map((header) => (
                    <td key={`${index}-${header}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row[header]}
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
    <div className="w-full max-w-5xl mx-auto">
      {/* Upload Zone */}
      <div
        className={`mb-12 transition-all duration-200 ease-in-out
          ${isDragging ? 'scale-[1.01] ring-2 ring-blue-500 ring-offset-2' : ''}
        `}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <label
          htmlFor="file-upload"
          className={`
            relative flex flex-col items-center justify-center w-full h-32
            rounded-xl border border-dashed cursor-pointer transition-colors duration-200
            ${fileName
              ? 'border-green-300 bg-green-50/30 hover:bg-green-50/50'
              : 'border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400'
            }
          `}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${fileName ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
              {fileName ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              )}
            </div>
            <div className="text-left">
              {fileName ? (
                <>
                  <p className="text-sm font-medium text-gray-900">{fileName}</p>
                  <p className="text-xs text-green-600">Ready to process</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-900">Upload Excel File</p>
                  <p className="text-xs text-gray-500">Drag & drop or click to browse</p>
                </>
              )}
            </div>
          </div>
          <input
            id="file-upload"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="space-y-6 animate-fade-in">
        {data.drivers.length > 0 ? (
          <TableSection
            title="Drivers"
            items={data.drivers}
            iconPath="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        ) : fileName && <EmptyState title="Drivers" />}

        {data.owners.length > 0 ? (
          <TableSection
            title="Owners"
            items={data.owners}
            iconPath="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        ) : fileName && <EmptyState title="Owners" />}
      </div>
    </div>
  );
}
