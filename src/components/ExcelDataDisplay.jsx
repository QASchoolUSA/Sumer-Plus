'use client';

import React, { useState } from 'react';
import * as validXlsx from 'xlsx';

export default function ExcelDataDisplay() {
  const [data, setData] = useState({ drivers: [], owners: [] });
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
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
          'Unit Number': row['Unit Number'] || '',
          'Driver Name': row['Driver'] || '',
          'Driver Email': row['Driver E-mail'] || '',
          'Terms': row['Per Mile'] ? `${row['Per Mile']} per mile` : ''
        })).filter(row => row['Unit Number'] || row['Driver Name']); // Basic filtering for empty rows
      }

      // Parse Owners Sheet
      const ownerSheet = wb.Sheets['Owner'];
      let ownersData = [];
      if (ownerSheet) {
        const rawOwners = validXlsx.utils.sheet_to_json(ownerSheet);
        ownersData = rawOwners.map(row => ({
          'Owner Name': row['Owner'] || '',
          'Company': row['Firma'] || '',
          'Terms': row['Per Mile'] ? `${row['Per Mile']} per mile` : ''
        })).filter(row => row['Owner Name'] || row['Company']);
      }

      setData({
        drivers: driversData,
        owners: ownersData,
      });
    };
    reader.readAsBinaryString(file);
  };

  const EmptyState = ({ title }) => (
    <div className="p-8 text-center bg-gray-50 rounded-xl border border-gray-100">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mb-4">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">No {title} Data</h3>
      <p className="text-gray-500 text-sm">Upload a valid Excel file to view {title.toLowerCase()} information.</p>
    </div>
  );

  const renderTable = (title, items) => {
    if (!items || items.length === 0) {
      return <EmptyState title={title} />;
    }

    const headers = Object.keys(items[0]);

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="text-lg font-bold text-[#001f3f] tracking-tight">{title}</h3>
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
            {items.length} records
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#001f3f]">
              <tr>
                {headers.map((header) => (
                  <th key={header} scope="col" className="px-6 py-4 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {items.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-blue-50/30 transition-colors duration-150"
                >
                  {headers.map((header) => (
                    <td key={`${index}-${header}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
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
    <div className="w-full">
      {/* Upload Area */}
      <div className="mb-12">
        <div className="max-w-2xl mx-auto">
          <label
            htmlFor="file-upload"
            className={`
                relative flex flex-col items-center justify-center w-full h-32 
                rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
                ${fileName
                ? 'border-green-500 bg-green-50/30'
                : 'border-blue-200 hover:border-[#001f3f] hover:bg-blue-50/30'
              }
            `}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {fileName ? (
                <>
                  <div className="w-10 h-10 mb-3 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="mb-2 text-sm font-semibold text-green-600">File Selected</p>
                  <p className="text-xs text-green-500">{fileName}</p>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 mb-3 rounded-full bg-blue-100 flex items-center justify-center text-[#001f3f]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold text-[#001f3f]">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">Excel files (.xlsx, .xls)</p>
                </>
              )}
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
      </div>

      <div className="space-y-12 animate-fade-in">
        {renderTable('Drivers', data.drivers)}
        {renderTable('Owners', data.owners)}
      </div>
    </div>
  );
}
