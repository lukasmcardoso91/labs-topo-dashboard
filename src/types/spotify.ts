export interface SpotifyMetric {
  date: string;
  track_id?: string;
  track_name?: string;
  country?: string;
  traffic_source?: string;
  gender?: string;
  age_bucket?: string;
  metric_name: string;
  metric_value: number;
}

export interface SpotifyData {
  metrics: SpotifyMetric[];
  summary: {
    streams: number;
    listeners: number;
    saves: number;
    playlists: number;
    followers: number;
  };
  topTracks: Array<{
    track_name: string;
    streams: number;
    listeners: number;
    saves: number;
  }>;
  demographics: {
    byGender: Array<{ gender: string; streams: number }>;
    byAge: Array<{ age_bucket: string; streams: number }>;
    byCountry: Array<{ country: string; streams: number }>;
  };
  trafficSources: Array<{ source: string; streams: number }>;
}
