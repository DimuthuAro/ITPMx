import React from 'react';
import Button from './Button';
import { FaPlus, FaFileExport, FaEdit, FaTrash } from 'react-icons/fa';

const Table = ({ headers, data, onEdit, onDelete }) => {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl">
      <div className="p-6 border-b border-white/10">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Data Table</h2>
          <div className="flex space-x-3">
            <Button variant="primary" size="sm" className="flex items-center space-x-2">
              <FaPlus className="text-sm" />
              <span>Add New</span>
            </Button>
            <Button variant="secondary" size="sm" className="flex items-center space-x-2">
              <FaFileExport className="text-sm" />
              <span>Export</span>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-white/5 transition-colors duration-200"
              >
                {Object.values(row).map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-300"
                  >
                    {cell}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(row)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <FaEdit className="text-sm" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(row)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FaTrash className="text-sm" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing 1 to 10 of {data.length} results
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm">Previous</Button>
            <Button variant="ghost" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table; 