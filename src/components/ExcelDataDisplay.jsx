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

      const driversSheet = wb.Sheets['Drivers'];
      const ownerSheet = wb.Sheets['Owner'];

      const driversData = driversSheet ? validXlsx.utils.sheet_to_json(driversSheet) : [];
      const ownersData = ownerSheet ? validXlsx.utils.sheet_to_json(ownerSheet) : [];

      setData({
        drivers: driversData,
        owners: ownersData,
      });
    };
    reader.readAsBinaryString(file);
  };

  const renderTable = (title, items) => {
    if (!items || items.length === 0) {
      return (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
          <p className="text-gray-500 italic">No data found in {title} sheet or sheet is missing.</p>
        </div>
      );
    }

    const headers = Object.keys(items[0]);

    return (
      <div className="mb-12">
        <h3 className="text-2xl font-bold mb-4 text-[#001f3f] border-b pb-2">{title}</h3>
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white text-sm text-left text-gray-500">
            <thead className="text-xs text-white uppercase bg-[#001f3f]">
              <tr>
                {headers.map((header) => (
                  <th key={header} scope="col" className="px-6 py-3 whitespace-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((row, index) => (
                <tr
                  key={index}
                  className={`border-b hover:bg-gray-50 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  {headers.map((header) => (
                    <td key={`${index}-${header}`} className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {row[header] !== undefined && row[header] !== null ? String(row[header]) : ''}
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <label
          htmlFor="file-upload"
          className="cursor-pointer inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Upload Excel File
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="hidden"
        />
        {fileName && (
          <p className="mt-2 text-sm text-gray-600">
            Selected file: <span className="font-medium">{fileName}</span>
          </p>
        )}
      </div>

      {(data.drivers.length > 0 || data.owners.length > 0) && (
        <div className="animate-fade-in">
          {renderTable('Drivers', data.drivers)}
          {renderTable('Owners', data.owners)}
        </div>
      )}
    </div>
  );
}
