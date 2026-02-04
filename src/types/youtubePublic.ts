export type PeriodFilter = "7d" | "28d" | "90d" | "all";
export type SortBy = "views" | "viewsPerDay" | "engagementRate" | "publishedAt";

export interface YouTubeChannelPublic {
  channelId: string;
  title: string;
  customUrl?: string;
  thumbnailUrl?: string;
  subscribers: number;
  totalViews: number;
  totalVideos: number;
}

export interface YouTubeVideoPublic {
  videoId: string;
  title: string;
  thumbnailUrl?: string;
  publishedAt: string; // ISO
  durationSeconds: number;

  views: number;
  likes: number;
  comments: number;

  // derivados
  daysSincePublished: number;
  viewsPerDay: number;
  engagementRate: number; // (likes+comments)/views
  isLikelyShort: boolean;
}

export interface YouTubePublicData {
  channel: YouTubeChannelPublic;
  videos: YouTubeVideoPublic[];
  fetchedAt: string; // ISO
}
