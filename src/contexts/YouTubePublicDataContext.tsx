import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import type { PeriodFilter, SortBy, YouTubePublicData, YouTubeVideoPublic } from "@/types/youtubePublic";
import { fetchYouTubePublicData } from "@/connectors/youtube/youtubePublicApi";

type Ctx = {
  data: YouTubePublicData | null;
  loading: boolean;
  error: string | null;

  channelInput: string;
  setChannelInput: (v: string) => void;

  maxVideos: number;
  setMaxVideos: (v: number) => void;

  period: PeriodFilter;
  setPeriod: (p: PeriodFilter) => void;

  sortBy: SortBy;
  setSortBy: (s: SortBy) => void;

  connectPublic: () => Promise<void>;

  filteredVideos: YouTubeVideoPublic[];
  kpis: {
    subscribers: number;
    channelTotalViews: number;
    uploads30d: number;
    periodViews: number;
    periodLikes: number;
    periodComments: number;
    avgEngagementRate: number;
    avgViewsPerDay: number;
  };
};

const YouTubePublicDataContext = createContext<Ctx | undefined>(undefined);

function daysAgoISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export function YouTubePublicDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<YouTubePublicData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [channelInput, setChannelInput] = useState<string>("https://www.youtube.com/@MarceloSirotsky");
  const [maxVideos, setMaxVideos] = useState<number>(25);

  const [period, setPeriod] = useState<PeriodFilter>("28d");
  const [sortBy, setSortBy] = useState<SortBy>("publishedAt");

  const connectPublic = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchYouTubePublicData(channelInput, maxVideos);
      setData(res);
    } catch (e: any) {
      setError(e?.message || "Falha ao buscar dados públicos do YouTube.");
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = useMemo(() => {
    if (!data) return [];
    const cutoff =
      period === "7d" ? daysAgoISO(7) : period === "28d" ? daysAgoISO(28) : period === "90d" ? daysAgoISO(90) : null;

    const base = cutoff ? data.videos.filter((v) => v.publishedAt >= cutoff) : data.videos.slice();

    const sorted = base.sort((a, b) => {
      if (sortBy === "views") return b.views - a.views;
      if (sortBy === "viewsPerDay") return b.viewsPerDay - a.viewsPerDay;
      if (sortBy === "engagementRate") return b.engagementRate - a.engagementRate;
      // publishedAt
      return b.publishedAt.localeCompare(a.publishedAt);
    });

    return sorted;
  }, [data, period, sortBy]);

  const kpis = useMemo(() => {
    if (!data) {
      return {
        subscribers: 0,
        channelTotalViews: 0,
        uploads30d: 0,
        periodViews: 0,
        periodLikes: 0,
        periodComments: 0,
        avgEngagementRate: 0,
        avgViewsPerDay: 0,
      };
    }

    const cutoff30 = daysAgoISO(30);
    const uploads30d = data.videos.filter((v) => v.publishedAt >= cutoff30).length;

    const periodViews = filteredVideos.reduce((acc, v) => acc + v.views, 0);
    const periodLikes = filteredVideos.reduce((acc, v) => acc + v.likes, 0);
    const periodComments = filteredVideos.reduce((acc, v) => acc + v.comments, 0);

    const avgEngagementRate =
      filteredVideos.length > 0 ? filteredVideos.reduce((acc, v) => acc + v.engagementRate, 0) / filteredVideos.length : 0;

    const avgViewsPerDay =
      filteredVideos.length > 0 ? filteredVideos.reduce((acc, v) => acc + v.viewsPerDay, 0) / filteredVideos.length : 0;

    return {
      subscribers: data.channel.subscribers,
      channelTotalViews: data.channel.totalViews,
      uploads30d,
      periodViews,
      periodLikes,
      periodComments,
      avgEngagementRate,
      avgViewsPerDay,
    };
  }, [data, filteredVideos]);

  const value: Ctx = {
    data,
    loading,
    error,
    channelInput,
    setChannelInput,
    maxVideos,
    setMaxVideos,
    period,
    setPeriod,
    sortBy,
    setSortBy,
    connectPublic,
    filteredVideos,
    kpis,
  };

  return <YouTubePublicDataContext.Provider value={value}>{children}</YouTubePublicDataContext.Provider>;
}

export function useYouTubePublicData() {
  const ctx = useContext(YouTubePublicDataContext);
  if (!ctx) throw new Error("useYouTubePublicData must be used within YouTubePublicDataProvider");
  return ctx;
}
