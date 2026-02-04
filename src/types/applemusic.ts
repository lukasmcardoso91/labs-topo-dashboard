export interface AppleMusicMetric {
  date: string;
  track_id?: string;
  track_name?: string;
  country?: string;
  city?: string;
  metric_name: string;
  metric_value: number;
}

export interface AppleMusicData {
  metrics: AppleMusicMetric[];
  summary: {
    plays: number;
    listeners: number;
    shazams: number;
    radioSpins: number;
    purchases: number;
  };
  topTracks: Array<{
    track_name: string;
    plays: number;
    listeners: number;
    shazams: number;
  }>;
  geography: {
    byCountry: Array<{ country: string; plays: number }>;
    byCities: Array<{ city: string; plays: number }>;
  };
}
