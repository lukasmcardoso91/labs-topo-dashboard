import { AppleMusicMetric, AppleMusicData } from "@/types/applemusic";

export function processAppleMusicData(metrics: AppleMusicMetric[]): AppleMusicData {
  const summary = {
    plays: sumMetric(metrics, 'plays'),
    listeners: sumMetric(metrics, 'listeners'),
    shazams: sumMetric(metrics, 'shazams'),
    radioSpins: sumMetric(metrics, 'radio_spins'),
    purchases: sumMetric(metrics, 'purchases'),
  };

  const topTracks = getTopTracks(metrics);
  const geography = getGeography(metrics);

  return { metrics, summary, topTracks, geography };
}

function sumMetric(metrics: AppleMusicMetric[], metricName: string): number {
  return metrics
    .filter(m => m.metric_name === metricName)
    .reduce((sum, m) => sum + m.metric_value, 0);
}

function getTopTracks(metrics: AppleMusicMetric[]) {
  const trackMap = new Map<string, { plays: number; listeners: number; shazams: number }>();
  
  metrics.forEach(m => {
    if (!m.track_name) return;
    const track = trackMap.get(m.track_name) || { plays: 0, listeners: 0, shazams: 0 };
    if (m.metric_name === 'plays') track.plays += m.metric_value;
    if (m.metric_name === 'listeners') track.listeners += m.metric_value;
    if (m.metric_name === 'shazams') track.shazams += m.metric_value;
    trackMap.set(m.track_name, track);
  });

  return Array.from(trackMap.entries())
    .map(([track_name, data]) => ({ track_name, ...data }))
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 10);
}

function getGeography(metrics: AppleMusicMetric[]) {
  const byCountry = aggregateByCountry(metrics, 'plays');
  const byCities = aggregateByCities(metrics, 'plays');

  return { byCountry, byCities };
}

function aggregateByCountry(metrics: AppleMusicMetric[], metricName: string) {
  const map = new Map<string, number>();
  
  metrics
    .filter(m => m.metric_name === metricName && m.country)
    .forEach(m => {
      map.set(m.country!, (map.get(m.country!) || 0) + m.metric_value);
    });

  return Array.from(map.entries())
    .map(([country, plays]) => ({ country, plays }))
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 10);
}

function aggregateByCities(metrics: AppleMusicMetric[], metricName: string) {
  const map = new Map<string, number>();
  
  metrics
    .filter(m => m.metric_name === metricName && m.city)
    .forEach(m => {
      map.set(m.city!, (map.get(m.city!) || 0) + m.metric_value);
    });

  return Array.from(map.entries())
    .map(([city, plays]) => ({ city, plays }))
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 10);
}

export function parseAppleMusicCSV(csvText: string): AppleMusicMetric[] {
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
      city: row.city,
      metric_name: row.metric_name,
      metric_value: parseFloat(row.metric_value) || 0,
    };
  });
}
