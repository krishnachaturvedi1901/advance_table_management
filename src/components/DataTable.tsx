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
import { SpotifyTrack, ColumnMetaType } from '../types/spotify';
import { formatDuration, formatPercentage, formatNumber } from '../utils/formatters';
import { TextFilter, RangeFilter, SelectFilter } from './Filters';
import { exportToCSV } from '../utils/csvParser';
import { useDebounce } from '../hooks/useDebounce';
import { useTableState } from '../hooks/useTableState';
import ColumnManagement from './ColumnManagement';

interface DataTableProps {
  data: SpotifyTrack[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const debouncedGlobalFilter = useDebounce(globalFilter, 300);
  
  // Column management state with localStorage persistence
  const {
    columnVisibility,
    setColumnVisibility,
    columnOrder,
    setColumnOrder,
    columnSizing,
    setColumnSizing,
    resetState,
  } = useTableState();
  
  const [showColumnManager, setShowColumnManager] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Get unique genres for filter dropdown
  const uniqueGenres = useMemo(() => {
    const genres = new Set(data.map(track => track.genre).filter(Boolean));
    return Array.from(genres).sort();
  }, [data]);

  const columns = useMemo<ColumnDef<SpotifyTrack, any>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => {
          const checkbox = React.useRef<HTMLInputElement>(null);
          React.useEffect(() => {
            if (checkbox.current) {
              checkbox.current.indeterminate = table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected();
            }
          }, [table]);
          return (
            <input
              ref={checkbox}
              type="checkbox"
              checked={table.getIsAllPageRowsSelected()}
              onChange={table.getToggleAllPageRowsSelectedHandler()}
              className="w-4 h-4 cursor-pointer"
            />
          );
        },
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
        enableHiding: false,
        enableResizing: false,
        size: 50,
        minSize: 50,
        maxSize: 50,
      },
      {
        accessorKey: 'track_name',
        header: 'Track Name',
        cell: info => <span className="font-medium">{info.getValue() as string}</span>,
        enableColumnFilter: true,
        filterFn: 'includesString',
        size: 250,
        minSize: 150,
        maxSize: 500,
        meta: {
          filterComponent: (column: any) => <TextFilter column={column} />,
        },
      },
      {
        accessorKey: 'artist_name',
        header: 'Artist',
        enableColumnFilter: true,
        filterFn: 'includesString',
        size: 200,
        minSize: 120,
        maxSize: 400,
        meta: {
          filterComponent: (column: any) => <TextFilter column={column} />,
        },
      },
      {
        accessorKey: 'album_name',
        header: 'Album',
        enableColumnFilter: false,
        size: 200,
        minSize: 120,
        maxSize: 400,
      },
      {
        accessorKey: 'genre',
        header: 'Genre',
        enableColumnFilter: true,
        filterFn: 'equals',
        size: 150,
        minSize: 100,
        maxSize: 300,
        meta: {
          filterComponent: (column: any) => <SelectFilter column={column} options={uniqueGenres} />,
        },
      },
      {
        accessorKey: 'popularity',
        header: 'Popularity',
        cell: info => formatNumber(info.getValue() as number, 0),
        enableColumnFilter: true,
        size: 120,
        minSize: 90,
        maxSize: 200,
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
        size: 130,
        minSize: 100,
        maxSize: 200,
      },
      {
        accessorKey: 'energy',
        header: 'Energy',
        cell: info => formatPercentage(info.getValue() as number),
        enableColumnFilter: true,
        size: 120,
        minSize: 80,
        maxSize: 200,
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
        size: 140,
        minSize: 100,
        maxSize: 200,
      },
      {
        accessorKey: 'duration_ms',
        header: 'Duration',
        cell: info => formatDuration(info.getValue() as number),
        enableColumnFilter: false,
        size: 100,
        minSize: 80,
        maxSize: 150,
      },
      {
        accessorKey: 'release_date',
        header: 'Release Date',
        enableColumnFilter: false,
        size: 130,
        minSize: 100,
        maxSize: 200,
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
        size: 100,
        minSize: 80,
        maxSize: 150,
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
      columnVisibility,
      columnOrder,
      columnSizing,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnSizingChange: setColumnSizing,
    enableRowSelection: true,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
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

  const handleClearSelection = () => {
    setRowSelection({});
  };

  // Column reordering handlers
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, columnId: string) => {
    setDraggedColumn(columnId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === targetColumnId) {
      setDraggedColumn(null);
      return;
    }

    const currentOrder = table.getState().columnOrder;
    const allColumns = table.getAllLeafColumns().map(col => col.id);
    const orderToUse = currentOrder.length > 0 ? currentOrder : allColumns;

    const draggedIndex = orderToUse.indexOf(draggedColumn);
    const targetIndex = orderToUse.indexOf(targetColumnId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedColumn(null);
      return;
    }

    const newOrder = [...orderToUse];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedColumn);

    setColumnOrder(newOrder);
    setDraggedColumn(null);
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
            onClick={() => setShowColumnManager(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            title="Manage Columns"
          >
            ☰ Columns
          </button>
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
        <div className="flex flex-col gap-2">
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
          <div className="text-xs text-gray-500">
            💡 Tip: Drag the ☰ icon to reorder columns | Hover & drag column right edge to resize | Click "☰ Columns" to show/hide
          </div>
        </div>
      </div>

      {/* Table Container with Virtual Scrolling */}
      <div 
        ref={tableContainerRef}
        className="flex-1 overflow-auto border border-gray-700 rounded-lg"
        style={{ height: '600px' }}
      >
        <table className="text-sm" style={{ width: table.getCenterTotalSize() }}>
          <thead className="sticky top-0 bg-gray-800 z-10">
            {table.getHeaderGroups().map(headerGroup => (
              <React.Fragment key={headerGroup.id}>
                <tr>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className={`px-4 py-3 text-left font-semibold text-gray-200 border-b border-r border-gray-600 relative ${
                        draggedColumn === header.id ? 'opacity-50 bg-blue-900' : ''
                      }`}
                      style={{ 
                        width: `${header.getSize()}px`,
                        minWidth: `${header.getSize()}px`,
                        maxWidth: `${header.getSize()}px`,
                      }}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, header.id)}
                    >
                      {header.isPlaceholder ? null : (
                        <>
                          <div className="flex items-center gap-2">
                            {/* Drag handle for column reordering */}
                            {header.id !== 'select' && (
                              <div
                                draggable
                                onDragStart={(e) => {
                                  e.stopPropagation();
                                  handleDragStart(e, header.id);
                                }}
                                className="cursor-move text-gray-500 hover:text-gray-300 transition-colors px-1"
                                title="Drag to reorder column"
                              >
                                ☰
                              </div>
                            )}
                            <div
                              className={`flex items-center gap-2 flex-1 ${
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
                          </div>
                          {header.column.getCanResize() && (
                            <div
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                header.getResizeHandler()(e);
                              }}
                              onTouchStart={(e) => {
                                e.stopPropagation();
                                header.getResizeHandler()(e);
                              }}
                              className={`absolute right-0 top-0 h-full w-3 cursor-col-resize select-none touch-none ${
                                header.column.getIsResizing() ? 'bg-blue-500 opacity-100' : 'hover:bg-blue-500 hover:opacity-60'
                              }`}
                              style={{
                                transform: header.column.getIsResizing()
                                  ? `translateX(${table.getState().columnSizingInfo.deltaOffset}px)`
                                  : '',
                              }}
                              title="Drag to resize column"
                            />
                          )}
                        </>
                      )}
                    </th>
                  ))}
                </tr>
                {/* Filter Row */}
                <tr>
                  {headerGroup.headers.map(header => (
                    <th 
                      key={header.id} 
                      className="px-4 py-2 border-b border-r border-gray-600"
                      style={{ 
                        width: `${header.getSize()}px`,
                        minWidth: `${header.getSize()}px`,
                        maxWidth: `${header.getSize()}px`,
                      }}
                    >
                      {header.column.getCanFilter() && (header.column.columnDef.meta as ColumnMetaType)?.filterComponent
                        ? ((header.column.columnDef.meta as ColumnMetaType).filterComponent as any)(header.column)
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
                    <td 
                      key={cell.id} 
                      className="px-4 py-3 text-gray-300 border-r border-gray-700"
                      style={{ 
                        width: `${cell.column.getSize()}px`,
                        minWidth: `${cell.column.getSize()}px`,
                        maxWidth: `${cell.column.getSize()}px`,
                      }}
                    >
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
          <button
            onClick={resetState}
            className="ml-4 px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
            title="Reset column preferences"
          >
            ↻ Reset Columns
          </button>
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

      {/* Column Management Modal */}
      {showColumnManager && (
        <ColumnManagement
          table={table}
          onClose={() => setShowColumnManager(false)}
        />
      )}
    </div>
  );
};

export default DataTable;
