import Papa from 'papaparse';
import { SpotifyTrack } from '../types/spotify';

export const parseCSV = (file: File): Promise<SpotifyTrack[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse<SpotifyTrack>(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const tracks = results.data.map((row: any) => ({
          track_name: row.track_name || row['Track Name'] || '',
          artist_name: row.artist_name || row['Artist Name'] || row.artist || '',
          album_name: row.album_name || row['Album Name'] || row.album || '',
          genre: row.genre || row.playlist_genre || '',
          popularity: Number(row.popularity) || 0,
          tempo: Number(row.tempo) || 0,
          energy: Number(row.energy) || 0,
          danceability: Number(row.danceability) || 0,
          duration_ms: Number(row.duration_ms) || 0,
          release_date: row.release_date || row.track_album_release_date || '',
          explicit: Boolean(row.explicit) || false,
        }));
        resolve(tracks);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

export const exportToCSV = (data: SpotifyTrack[], filename: string = 'spotify-tracks.csv') => {
  const csv = Papa.unparse(data, {
    quotes: true,
    header: true,
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
