export interface Release {
  id: string;
  title: string;
  release_date: string;
  type: 'single' | 'ep' | 'album';
  cover_url?: string;
  spotify?: {
    streams: number;
    listeners: number;
    saves: number;
  };
  appleMusic?: {
    plays: number;
    listeners: number;
    shazams: number;
  };
  youtube?: {
    views: number;
    watch_time_hours: number;
    likes: number;
  };
  social?: {
    reach: number;
    interactions: number;
  };
}

export interface ReleasesData {
  releases: Release[];
}
