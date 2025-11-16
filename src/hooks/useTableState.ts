import { useState, useEffect } from 'react';
import { ColumnOrderState, VisibilityState, ColumnSizingState } from '@tanstack/react-table';

interface TableStateStorage {
  columnVisibility: VisibilityState;
  columnOrder: ColumnOrderState;
  columnSizing: ColumnSizingState;
}

const STORAGE_KEY = 'spotify-table-preferences';

export const useTableState = () => {
  // Load initial state from localStorage
  const loadState = (): Partial<TableStateStorage> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load table state from localStorage:', error);
    }
    return {};
  };

  const initialState = loadState();

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialState.columnVisibility || {}
  );
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    initialState.columnOrder || []
  );
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(
    initialState.columnSizing || {}
  );

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      const state: TableStateStorage = {
        columnVisibility,
        columnOrder,
        columnSizing,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save table state to localStorage:', error);
    }
  }, [columnVisibility, columnOrder, columnSizing]);

  const resetState = () => {
    setColumnVisibility({});
    setColumnOrder([]);
    setColumnSizing({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear table state from localStorage:', error);
    }
  };

  return {
    columnVisibility,
    setColumnVisibility,
    columnOrder,
    setColumnOrder,
    columnSizing,
    setColumnSizing,
    resetState,
  };
};
