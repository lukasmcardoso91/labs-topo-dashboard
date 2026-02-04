export interface SocialMetric {
  date: string;
  platform: 'facebook' | 'instagram';
  content_id?: string;
  content_title?: string;
  content_type?: string;
  gender?: string;
  age_bucket?: string;
  country?: string;
  metric_name: string;
  metric_value: number;
}

export interface SocialData {
  metrics: SocialMetric[];
  facebook: {
    reach: number;
    interactions: number;
    linkClicks: number;
    videoViews: number;
  };
  instagram: {
    views: number;
    followers: number;
    reach: number;
    interactions: number;
  };
  topContent: Array<{
    platform: string;
    title: string;
    type: string;
    views: number;
    interactions: number;
  }>;
  demographics: {
    byGender: Array<{ gender: string; reach: number }>;
    byAge: Array<{ age_bucket: string; reach: number }>;
    byCountry: Array<{ country: string; reach: number }>;
  };
}
