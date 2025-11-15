export interface SpotifyTrack {
  track_name: string;
  artist_name: string;
  album_name: string;
  genre: string;
  popularity: number;
  tempo: number;
  energy: number;
  danceability: number;
  duration_ms: number;
  release_date: string;
  explicit: boolean;
}

export interface ColumnFilter {
  id: string;
  value: string | number | [number, number] | boolean;
}

export interface TableState {
  globalFilter: string;
  columnFilters: ColumnFilter[];
  sorting: Array<{ id: string; desc: boolean }>;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
}
