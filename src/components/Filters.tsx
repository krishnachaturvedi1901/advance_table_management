import React from 'react';
import { Column } from '@tanstack/react-table';
import { SpotifyTrack } from '../types/spotify';

interface FilterProps {
  column: Column<SpotifyTrack, unknown>;
}

export const TextFilter: React.FC<FilterProps> = ({ column }) => {
  const filterValue = (column.getFilterValue() as string) ?? '';

  return (
    <input
      type="text"
      value={filterValue}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="w-full px-2 py-1 text-sm border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export const RangeFilter: React.FC<FilterProps & { min?: number; max?: number }> = ({ 
  column, 
  min = 0, 
  max = 100 
}) => {
  const filterValue = (column.getFilterValue() as [number, number]) ?? [min, max];

  return (
    <div className="flex gap-2 items-center">
      <input
        type="number"
        value={filterValue[0]}
        onChange={(e) => column.setFilterValue([Number(e.target.value), filterValue[1]])}
        placeholder="Min"
        className="w-20 px-2 py-1 text-sm border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <span className="text-gray-400">-</span>
      <input
        type="number"
        value={filterValue[1]}
        onChange={(e) => column.setFilterValue([filterValue[0], Number(e.target.value)])}
        placeholder="Max"
        className="w-20 px-2 py-1 text-sm border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export const SelectFilter: React.FC<FilterProps & { options: string[] }> = ({ 
  column, 
  options 
}) => {
  const filterValue = (column.getFilterValue() as string) ?? '';

  return (
    <select
      value={filterValue}
      onChange={(e) => column.setFilterValue(e.target.value || undefined)}
      className="w-full px-2 py-1 text-sm border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">All</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};
