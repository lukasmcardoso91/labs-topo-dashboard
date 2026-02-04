import { YouTubeMetric } from "@/types/youtube";

function sumMetric(data: YouTubeMetric[], metric: string) {
  return data
    .filter((d) => d.metric === metric)
    .reduce((acc, cur) => acc + (Number(cur.value) || 0), 0);
}

export function processYouTubeData(rawData: YouTubeMetric[]) {
  if (!rawData || rawData.length === 0) return null;

  const isPublic = rawData.some((d) => d.traffic_source === "PublicAPI");

  const views = sumMetric(rawData, "views");
  const likes = sumMetric(rawData, "likes");
  const comments = sumMetric(rawData, "comments");

  // Top vídeos (público: pela soma de views no snapshot)
  const viewsByVideo = new Map<string, { title: string; views: number }>();
  rawData
    .filter((d) => d.metric === "views")
    .forEach((d) => {
      const prev = viewsByVideo.get(d.video_id);
      viewsByVideo.set(d.video_id, {
        title: d.video_title,
        views: (prev?.views || 0) + (Number(d.value) || 0),
      });
    });

  const videos = Array.from(viewsByVideo.entries())
    .map(([video_id, v]) => ({
      video_id,
      video_title: v.title,
      format: "video" as const,
      kpis: {
        views: v.views,
        impressions: 0,
        watch_time_hours: 0,
        average_view_duration: 0,
        revenue: 0,
        rpm: 0,
        new_subscribers: 0,
        ctr: 0,
        likes: 0,
        comments: 0,
        shares: 0,
      },
    }))
    .sort((a, b) => b.kpis.views - a.kpis.views);

  return {
    source: isPublic ? "public" : "csv", // preparado para oauth | stored
    kpis: {
      views,
      impressions: 0,
      watch_time_hours: 0,
      average_view_duration: 0,
      revenue: 0,
      rpm: 0,
      new_subscribers: 0,
      ctr: 0,
      likes,
      comments,
      shares: 0,
    },
    videos,
    trafficSources: isPublic
      ? [
          {
            source: "PublicAPI",
            views,
            percentage: 100,
            watch_time_hours: 0,
          },
        ]
      : [],
    geographic: [],
    demographics: [],
    devices: [],
    endScreens: [],
    captions: [],
    revenue: [],
    insights: [
      isPublic
        ? "Dados públicos do YouTube conectados. Métricas avançadas exigem login com Google."
        : "Dados importados via CSV.",
    ],
  };
}
