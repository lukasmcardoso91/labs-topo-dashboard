import { YouTubeVideoInfo } from "./youtubePublicApi";

export function adaptYouTubeVideosToRawData(videos: YouTubeVideoInfo[]) {
  const today = new Date().toISOString().split("T")[0];

  // Importante: marcamos traffic_source como "PublicAPI"
  // para o processor detectar source="public"
  const base = {
    country: "Unknown",
    traffic_source: "PublicAPI",
    device_type: "Unknown",
    playback_location: "YouTube",
  };

  return videos.flatMap((video) => [
    {
      date: today,
      video_id: video.videoId,
      video_title: video.title,
      ...base,
      metric: "views",
      value: video.views,
    },
    {
      date: today,
      video_id: video.videoId,
      video_title: video.title,
      ...base,
      metric: "likes",
      value: video.likes,
    },
    {
      date: today,
      video_id: video.videoId,
      video_title: video.title,
      ...base,
      metric: "comments",
      value: video.comments,
    },
  ]);
}
