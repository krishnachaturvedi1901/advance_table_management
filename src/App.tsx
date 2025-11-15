import { useState } from 'react';
import FileUpload from './components/FileUpload';
import DataTable from './components/DataTable';
import { useFileUpload } from './hooks/useFileUpload';

function App() {
  const { data, loading, error, handleFileUpload } = useFileUpload();
  const [showTable, setShowTable] = useState(false);

  const handleFileSelect = async (file: File) => {
    await handleFileUpload(file);
    setShowTable(true);
  };

  const handleReset = () => {
    setShowTable(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 py-6 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">🎵 Spotify Table Management</h1>
          <p className="text-gray-400 mt-2">
            A high-performance table application for managing large datasets
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-xl text-gray-300">Loading your data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-6 py-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Error</h3>
            <p>{error}</p>
          </div>
        )}

        {!showTable && !loading && (
          <div className="py-12">
            <FileUpload onFileSelect={handleFileSelect} loading={loading} />
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">Features</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>✓ Virtual scrolling for smooth performance with 30,000+ rows</li>
                  <li>✓ Multi-row selection with checkboxes</li>
                  <li>✓ Bulk actions (export selected, delete selected)</li>
                  <li>✓ Column sorting (click headers to sort)</li>
                  <li>✓ Advanced filtering on multiple columns</li>
                  <li>✓ Global search across all data</li>
                  <li>✓ Pagination with customizable page sizes</li>
                  <li>✓ Export filtered data to CSV</li>
                  <li>✓ Responsive design</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {showTable && data.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Dataset loaded: <span className="text-blue-400">{data.length.toLocaleString()}</span> tracks
              </h2>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Upload Different File
              </button>
            </div>
            <DataTable data={data} />
          </div>
        )}

        {showTable && data.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400">No data found in the uploaded file.</p>
            <button
              onClick={handleReset}
              className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Try Another File
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-800 py-6 px-8 mt-12">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>Built with React, TypeScript, TanStack Table & TanStack Virtual</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
