export interface YouTubeMetric {
  date: string;
  video_id: string;
  video_title: string;
  country: string;
  traffic_source: string;
  device_type: string;
  playback_location: string;
  end_screen_element?: string;
  end_screen_element_type?: string;
  captions_language?: string;
  playlist?: string;
  music_track?: string;
  subscription_source?: string;
  gender?: string;
  age_bucket?: string;
  metric: string;
  value: number;
}

export interface YouTubeKPIs {
  views: number;
  impressions: number;
  watch_time_hours: number;
  average_view_duration: number;
  revenue: number;
  rpm: number;
  new_subscribers: number;
  ctr: number;
  likes: number;
  comments: number;
  shares: number;
}

export interface YouTubeVideo {
  video_id: string;
  video_title: string;
  format: 'video' | 'short' | 'post';
  kpis: YouTubeKPIs;
  performance_change?: number;
}

export interface TrafficSource {
  source: string;
  views: number;
  percentage: number;
  watch_time_hours: number;
}

export interface GeographicData {
  country: string;
  city?: string;
  views: number;
  watch_time_hours: number;
  percentage: number;
}

export interface DemographicData {
  gender: string;
  age_bucket: string;
  views: number;
  percentage: number;
}

export interface DeviceData {
  device_type: string;
  playback_location: string;
  views: number;
  percentage: number;
}

export interface EndScreenData {
  element_type: string;
  views_generated: number;
  subscribers_generated: number;
  ctr: number;
}

export interface CaptionData {
  language: string;
  views: number;
  percentage: number;
}

export interface RevenueData {
  date: string;
  rpm: number;
  cpm: number;
  revenue: number;
  subscribers_change: number;
}