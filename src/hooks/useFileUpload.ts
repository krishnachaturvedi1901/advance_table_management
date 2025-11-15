import { useState } from 'react';
import { parseCSV } from '../utils/csvParser';
import { SpotifyTrack } from '../types/spotify';

export const useFileUpload = () => {
  const [data, setData] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    
    try {
      const tracks = await parseCSV(file);
      setData(tracks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, handleFileUpload };
};
