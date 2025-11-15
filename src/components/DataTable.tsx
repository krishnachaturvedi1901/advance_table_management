import React, { useMemo, useState, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
  RowSelectionState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { SpotifyTrack } from '../types/spotify';
import { formatDuration, formatPercentage, formatNumber } from '../utils/formatters';
import { TextFilter, RangeFilter, SelectFilter } from './Filters';
import { exportToCSV } from '../utils/csvParser';
import { useDebounce } from '../hooks/useDebounce';

interface DataTableProps {
  data: SpotifyTrack[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const debouncedGlobalFilter = useDebounce(globalFilter, 300);
  
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [renderTime, setRenderTime] = useState<number>(0);

  // Get unique genres for filter dropdown
  const uniqueGenres = useMemo(() => {
    const genres = new Set(data.map(track => track.genre).filter(Boolean));
    return Array.from(genres).sort();
  }, [data]);

  const columns = useMemo<ColumnDef<SpotifyTrack>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="w-4 h-4 cursor-pointer"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="w-4 h-4 cursor-pointer"
          />
        ),
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: 'track_name',
        header: 'Track Name',
        cell: info => <span className="font-medium">{info.getValue() as string}</span>,
        enableColumnFilter: true,
        filterFn: 'includesString',
        meta: {
          filterComponent: (column: any) => <TextFilter column={column} />,
        },
      },
      {
        accessorKey: 'artist_name',
        header: 'Artist',
        enableColumnFilter: true,
        filterFn: 'includesString',
        meta: {
          filterComponent: (column: any) => <TextFilter column={column} />,
        },
      },
      {
        accessorKey: 'album_name',
        header: 'Album',
        enableColumnFilter: false,
      },
      {
        accessorKey: 'genre',
        header: 'Genre',
        enableColumnFilter: true,
        filterFn: 'equals',
        meta: {
          filterComponent: (column: any) => <SelectFilter column={column} options={uniqueGenres} />,
        },
      },
      {
        accessorKey: 'popularity',
        header: 'Popularity',
        cell: info => formatNumber(info.getValue() as number, 0),
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          const value = row.getValue(columnId) as number;
          const [min, max] = filterValue as [number, number];
          return value >= min && value <= max;
        },
        meta: {
          filterComponent: (column: any) => <RangeFilter column={column} min={0} max={100} />,
        },
      },
      {
        accessorKey: 'tempo',
        header: 'Tempo (BPM)',
        cell: info => formatNumber(info.getValue() as number, 1),
        enableColumnFilter: false,
      },
      {
        accessorKey: 'energy',
        header: 'Energy',
        cell: info => formatPercentage(info.getValue() as number),
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          const value = row.getValue(columnId) as number;
          const [min, max] = filterValue as [number, number];
          return value >= min / 100 && value <= max / 100;
        },
        meta: {
          filterComponent: (column: any) => <RangeFilter column={column} min={0} max={100} />,
        },
      },
      {
        accessorKey: 'danceability',
        header: 'Danceability',
        cell: info => formatPercentage(info.getValue() as number),
        enableColumnFilter: false,
      },
      {
        accessorKey: 'duration_ms',
        header: 'Duration',
        cell: info => formatDuration(info.getValue() as number),
        enableColumnFilter: false,
      },
      {
        accessorKey: 'release_date',
        header: 'Release Date',
        enableColumnFilter: false,
      },
      {
        accessorKey: 'explicit',
        header: 'Explicit',
        cell: info => (
          <span className={`px-2 py-1 rounded text-xs ${
            info.getValue() ? 'bg-red-900 text-red-200' : 'bg-gray-700 text-gray-300'
          }`}>
            {info.getValue() ? 'Yes' : 'No'}
          </span>
        ),
        enableColumnFilter: false,
      },
    ],
    [uniqueGenres]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter: debouncedGlobalFilter,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: 'includesString',
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
  });

  const { rows } = table.getRowModel();
  
  // Performance measurement for virtual scrolling
  React.useEffect(() => {
    const startTime = performance.now();
    const endTime = performance.now();
    setRenderTime(endTime - startTime);
  }, [rows.length]);
  
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 50,
    overscan: 10,
  });

  // Get selected rows
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;

  const handleExport = () => {
    const filteredData = rows.map(row => row.original);
    exportToCSV(filteredData, `spotify-tracks-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportSelected = () => {
    if (selectedCount === 0) return;
    const selectedData = selectedRows.map(row => row.original);
    exportToCSV(selectedData, `spotify-tracks-selected-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleDeleteSelected = () => {
    if (selectedCount === 0) return;
    const confirmed = window.confirm(`Are you sure you want to delete ${selectedCount} selected track(s)?`);
    if (confirmed) {
      // Clear selection after deletion
      setRowSelection({});
      alert(`${selectedCount} track(s) would be deleted (demo mode - no actual deletion)`);
    }
  };

  const handleSelectAll = () => {
    table.toggleAllPageRowsSelected();
  };

  const handleClearSelection = () => {
    setRowSelection({});
  };

  const totalRows = table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize } = table.getState().pagination;
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className="flex flex-col h-full">
      {/* Header Controls */}
      <div className="mb-4 space-y-4">
        {/* Global Search and Export */}
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <input
              type="text"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="🔍 Search across all columns..."
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            📥 Export All
          </button>
        </div>

        {/* Bulk Actions Bar */}
        {selectedCount > 0 && (
          <div className="flex gap-4 items-center p-4 bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg">
            <span className="text-blue-300 font-medium">
              {selectedCount} row(s) selected
            </span>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={handleExportSelected}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
              >
                📥 Export Selected
              </button>
              <button
                onClick={handleDeleteSelected}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm"
              >
                🗑️ Delete Selected
              </button>
              <button
                onClick={handleClearSelection}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors text-sm"
              >
                ✕ Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Stats and Performance */}
        <div className="flex gap-4 text-sm text-gray-300 items-center">
          <span>
            Showing <span className="font-semibold text-white">{startRow}-{endRow}</span> of{' '}
            <span className="font-semibold text-white">{totalRows}</span> tracks
          </span>
          {debouncedGlobalFilter && (
            <span className="text-blue-400">
              ✓ Search active
            </span>
          )}
          <span className="text-gray-500 ml-auto">
            ⚡ Virtual scrolling: {rows.length} rows rendered
          </span>
        </div>
      </div>

      {/* Table Container with Virtual Scrolling */}
      <div 
        ref={tableContainerRef}
        className="flex-1 overflow-auto border border-gray-700 rounded-lg"
        style={{ height: '600px' }}
      >
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-800 z-10">
            {table.getHeaderGroups().map(headerGroup => (
              <React.Fragment key={headerGroup.id}>
                <tr>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left font-semibold text-gray-200 border-b border-gray-700"
                      style={{ minWidth: header.column.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center gap-2 ${
                            header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <span className="text-gray-400">
                              {{
                                asc: ' ▲',
                                desc: ' ▼',
                              }[header.column.getIsSorted() as string] ?? ' ⇅'}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
                {/* Filter Row */}
                <tr>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-4 py-2 border-b border-gray-700">
                      {header.column.getCanFilter() && header.column.columnDef.meta?.filterComponent
                        ? (header.column.columnDef.meta.filterComponent as any)(header.column)
                        : null}
                    </th>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </thead>
          <tbody>
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index];
              const isSelected = row.getIsSelected();
              return (
                <tr
                  key={row.id}
                  className={`border-b border-gray-800 transition-colors ${
                    isSelected 
                      ? 'bg-blue-900 bg-opacity-30 hover:bg-blue-900 hover:bg-opacity-40' 
                      : 'hover:bg-gray-800'
                  }`}
                  style={{
                    height: `${virtualRow.size}px`,
                  }}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3 text-gray-300">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-300">Rows per page:</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="px-3 py-1 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[25, 50, 100, 200].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border border-gray-600 rounded bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {'<<'}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border border-gray-600 rounded bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {'<'}
          </button>
          <span className="text-sm text-gray-300">
            Page <span className="font-semibold text-white">{table.getState().pagination.pageIndex + 1}</span> of{' '}
            <span className="font-semibold text-white">{table.getPageCount()}</span>
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border border-gray-600 rounded bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {'>'}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border border-gray-600 rounded bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {'>>'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
