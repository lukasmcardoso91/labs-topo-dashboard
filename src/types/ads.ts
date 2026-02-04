export interface GoogleAdsMetric {
  date: string;
  campaign_id?: string;
  campaign_name?: string;
  ad_group?: string;
  keyword?: string;
  metric_name: string;
  metric_value: number;
}

export interface MetaAdsMetric {
  date: string;
  campaign_id?: string;
  campaign_name?: string;
  ad_set?: string;
  ad_id?: string;
  metric_name: string;
  metric_value: number;
}

export interface GoogleAdsData {
  metrics: GoogleAdsMetric[];
  summary: {
    cpv: number;
    cpm: number;
    ctr: number;
    conversions: number;
    costPerConversion: number;
    impressions: number;
    views: number;
  };
  retention: {
    p25: number;
    p50: number;
    p75: number;
    p100: number;
  };
  campaigns: Array<{
    name: string;
    impressions: number;
    views: number;
    ctr: number;
    cpv: number;
  }>;
}

export interface MetaAdsData {
  metrics: MetaAdsMetric[];
  summary: {
    cpm: number;
    cpc: number;
    ctr: number;
    reach: number;
    clicks: number;
    conversions: number;
    costPerResult: number;
  };
  campaigns: Array<{
    name: string;
    reach: number;
    clicks: number;
    ctr: number;
    cpc: number;
  }>;
}
