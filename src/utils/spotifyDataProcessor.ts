import { SpotifyMetric, SpotifyData } from "@/types/spotify";

export function processSpotifyData(metrics: SpotifyMetric[]): SpotifyData {
  const summary = {
    streams: sumMetric(metrics, 'streams'),
    listeners: sumMetric(metrics, 'listeners'),
    saves: sumMetric(metrics, 'saves'),
    playlists: sumMetric(metrics, 'playlists'),
    followers: sumMetric(metrics, 'followers'),
  };

  const topTracks = getTopTracks(metrics);
  const demographics = getDemographics(metrics);
  const trafficSources = getTrafficSources(metrics);

  return { metrics, summary, topTracks, demographics, trafficSources };
}

function sumMetric(metrics: SpotifyMetric[], metricName: string): number {
  return metrics
    .filter(m => m.metric_name === metricName)
    .reduce((sum, m) => sum + m.metric_value, 0);
}

function getTopTracks(metrics: SpotifyMetric[]) {
  const trackMap = new Map<string, { streams: number; listeners: number; saves: number }>();
  
  metrics.forEach(m => {
    if (!m.track_name) return;
    const track = trackMap.get(m.track_name) || { streams: 0, listeners: 0, saves: 0 };
    if (m.metric_name === 'streams') track.streams += m.metric_value;
    if (m.metric_name === 'listeners') track.listeners += m.metric_value;
    if (m.metric_name === 'saves') track.saves += m.metric_value;
    trackMap.set(m.track_name, track);
  });

  return Array.from(trackMap.entries())
    .map(([track_name, data]) => ({ track_name, ...data }))
    .sort((a, b) => b.streams - a.streams)
    .slice(0, 10);
}

function getDemographics(metrics: SpotifyMetric[]) {
  const byGender = aggregateByGender(metrics, 'streams');
  const byAge = aggregateByAge(metrics, 'streams');
  const byCountry = aggregateByCountry(metrics, 'streams');

  return { byGender, byAge, byCountry };
}

function getTrafficSources(metrics: SpotifyMetric[]) {
  const map = new Map<string, number>();
  
  metrics
    .filter(m => m.metric_name === 'streams' && m.traffic_source)
    .forEach(m => {
      const key = m.traffic_source!;
      map.set(key, (map.get(key) || 0) + m.metric_value);
    });

  return Array.from(map.entries())
    .map(([source, streams]) => ({ source, streams }))
    .sort((a, b) => b.streams - a.streams);
}

function aggregateByGender(metrics: SpotifyMetric[], metricName: string) {
  const map = new Map<string, number>();
  
  metrics
    .filter(m => m.metric_name === metricName && m.gender)
    .forEach(m => {
      map.set(m.gender!, (map.get(m.gender!) || 0) + m.metric_value);
    });

  return Array.from(map.entries())
    .map(([gender, streams]) => ({ gender, streams }))
    .sort((a, b) => b.streams - a.streams);
}

function aggregateByAge(metrics: SpotifyMetric[], metricName: string) {
  const map = new Map<string, number>();
  
  metrics
    .filter(m => m.metric_name === metricName && m.age_bucket)
    .forEach(m => {
      map.set(m.age_bucket!, (map.get(m.age_bucket!) || 0) + m.metric_value);
    });

  return Array.from(map.entries())
    .map(([age_bucket, streams]) => ({ age_bucket, streams }))
    .sort((a, b) => b.streams - a.streams);
}

function aggregateByCountry(metrics: SpotifyMetric[], metricName: string) {
  const map = new Map<string, number>();
  
  metrics
    .filter(m => m.metric_name === metricName && m.country)
    .forEach(m => {
      map.set(m.country!, (map.get(m.country!) || 0) + m.metric_value);
    });

  return Array.from(map.entries())
    .map(([country, streams]) => ({ country, streams }))
    .sort((a, b) => b.streams - a.streams);
}

export function parseSpotifyCSV(csvText: string): SpotifyMetric[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const row: any = {};
    headers.forEach((header, i) => {
      row[header] = values[i];
    });
    
    return {
      date: row.date,
      track_id: row.track_id,
      track_name: row.track_name,
      country: row.country,
      traffic_source: row.traffic_source,
      gender: row.gender,
      age_bucket: row.age_bucket,
      metric_name: row.metric_name,
      metric_value: parseFloat(row.metric_value) || 0,
    };
  });
}
