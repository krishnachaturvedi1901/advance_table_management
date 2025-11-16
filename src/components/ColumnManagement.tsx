import React, { useState } from 'react';
import { Table } from '@tanstack/react-table';
import { SpotifyTrack } from '../types/spotify';

interface ColumnManagementProps {
  table: Table<SpotifyTrack>;
  onClose: () => void;
}

const ColumnManagement: React.FC<ColumnManagementProps> = ({ table, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = table.getAllLeafColumns().filter(col => col.id !== 'select');

  const filteredColumns = columns.filter(col =>
    col.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleAll = (visible: boolean) => {
    columns.forEach(col => {
      if (col.getCanHide()) {
        col.toggleVisibility(visible);
      }
    });
  };

  const visibleCount = columns.filter(col => col.getIsVisible()).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Manage Columns</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Search */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search columns..."
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Stats */}
          <div className="mt-3 text-sm text-gray-400">
            {visibleCount} of {columns.length} columns visible
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="p-4 border-b border-gray-700 flex gap-2">
          <button
            onClick={() => handleToggleAll(true)}
            className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
          >
            Show All
          </button>
          <button
            onClick={() => handleToggleAll(false)}
            className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm font-medium transition-colors"
          >
            Hide All
          </button>
        </div>

        {/* Column List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {filteredColumns.map((column) => (
              <label
                key={column.id}
                className="flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                  disabled={!column.getCanHide()}
                  className="w-4 h-4 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="text-white font-medium">
                    {typeof column.columnDef.header === 'string'
                      ? column.columnDef.header
                      : column.id}
                  </div>
                  {!column.getCanHide() && (
                    <div className="text-xs text-gray-400">Cannot be hidden</div>
                  )}
                </div>
              </label>
            ))}
          </div>

          {filteredColumns.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No columns match your search
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColumnManagement;
