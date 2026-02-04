import type { YouTubePublicData, YouTubeVideoPublic, YouTubeChannelPublic } from "@/types/youtubePublic";

const API_BASE = "https://www.googleapis.com/youtube/v3";

function getApiKey(): string {
  const key = import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined;
  if (!key) {
    throw new Error("Missing VITE_YOUTUBE_API_KEY in .env");
  }
  return key;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function parseISO8601DurationToSeconds(iso: string): number {
  // Ex: PT1H2M3S
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const h = Number(match[1] ?? 0);
  const m = Number(match[2] ?? 0);
  const s = Number(match[3] ?? 0);
  return h * 3600 + m * 60 + s;
}

function daysBetween(fromISO: string, to = new Date()): number {
  const from = new Date(fromISO).getTime();
  const diff = Math.max(0, to.getTime() - from);
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function safeNumber(v: any): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function inferLikelyShort(durationSeconds: number): boolean {
  // Shorts normalmente <= 60s (mas existem exceções)
  return durationSeconds > 0 && durationSeconds <= 60;
}

async function fetchJson<T>(path: string, params: Record<string, string | number | undefined>) {
  const key = getApiKey();
  const url = new URL(`${API_BASE}/${path}`);
  Object.entries({ ...params, key }).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).length > 0) url.searchParams.set(k, String(v));
  });

  const res = await fetch(url.toString());
  const data = await res.json();
  if (!res.ok) {
    const msg = data?.error?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as T;
}

function extractChannelIdFromUrl(input: string): string | null {
  // /channel/UCxxxx
  const m = input.match(/youtube\.com\/channel\/(UC[a-zA-Z0-9_-]{10,})/);
  return m?.[1] ?? null;
}

function extractHandleFromUrl(input: string): string | null {
  // /@handle
  const m = input.match(/youtube\.com\/@([a-zA-Z0-9._-]+)/);
  return m?.[1] ?? null;
}

function extractCustomPathFromUrl(input: string): string | null {
  // /c/Name or /user/Name
  const m = input.match(/youtube\.com\/(?:c|user)\/([a-zA-Z0-9._-]+)/);
  return m?.[1] ?? null;
}

async function resolveChannelId(channelInput: string): Promise<string> {
  const input = channelInput.trim();

  // 1) já é um channelId
  if (/^UC[a-zA-Z0-9_-]{10,}$/.test(input)) return input;

  // 2) URL /channel/...
  const direct = extractChannelIdFromUrl(input);
  if (direct) return direct;

  // 3) handle /@...
  const handle = extractHandleFromUrl(input);
  const q1 = handle ? `@${handle}` : null;

  // 4) custom /c/ ou /user/
  const custom = extractCustomPathFromUrl(input);

  // 5) tenta usar o que sobrar como query
  const fallbackQuery =
    q1 ??
    custom ??
    input
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/youtube\.com\//, "")
      .replace(/\?.*$/, "")
      .trim();

  // busca por canal (search)
  type SearchResp = { items: Array<{ id: { channelId?: string } }> };
  const sr = await fetchJson<SearchResp>("search", {
    part: "snippet",
    type: "channel",
    q: fallbackQuery,
    maxResults: 1,
  });

  const chId = sr.items?.[0]?.id?.channelId;
  if (!chId) {
    throw new Error("Não consegui resolver o canal. Tente usar o link /channel/UC... ou /@handle.");
  }
  return chId;
}

export async function fetchYouTubePublicData(channelInput: string, maxVideos: number): Promise<YouTubePublicData> {
  const channelId = await resolveChannelId(channelInput);
  const wanted = clamp(maxVideos, 1, 50);

  // 1) channel details
  type ChannelsResp = {
    items: Array<{
      id: string;
      snippet: { title: string; customUrl?: string; thumbnails?: any };
      statistics: { subscriberCount?: string; viewCount?: string; videoCount?: string };
      contentDetails: { relatedPlaylists?: { uploads?: string } };
    }>;
  };

  const ch = await fetchJson<ChannelsResp>("channels", {
    part: "snippet,statistics,contentDetails",
    id: channelId,
    maxResults: 1,
  });

  const item = ch.items?.[0];
  if (!item) throw new Error("Canal não encontrado.");

  const channel: YouTubeChannelPublic = {
    channelId: item.id,
    title: item.snippet?.title ?? "Canal",
    customUrl: item.snippet?.customUrl,
    thumbnailUrl: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url,
    subscribers: safeNumber(item.statistics?.subscriberCount),
    totalViews: safeNumber(item.statistics?.viewCount),
    totalVideos: safeNumber(item.statistics?.videoCount),
  };

  const uploadsPlaylistId = item.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsPlaylistId) throw new Error("Não consegui localizar a playlist de uploads do canal.");

  // 2) playlistItems (pega IDs dos últimos vídeos)
  type PlaylistResp = {
    nextPageToken?: string;
    items: Array<{
      contentDetails?: { videoId?: string; videoPublishedAt?: string };
      snippet?: { publishedAt?: string };
    }>;
  };

  const videoIds: string[] = [];
  let pageToken: string | undefined = undefined;

  while (videoIds.length < wanted) {
    const pr = await fetchJson<PlaylistResp>("playlistItems", {
      part: "contentDetails",
      playlistId: uploadsPlaylistId,
      maxResults: Math.min(50, wanted - videoIds.length),
      pageToken,
    });

    for (const it of pr.items ?? []) {
      const id = it.contentDetails?.videoId;
      if (id) videoIds.push(id);
    }

    pageToken = pr.nextPageToken;
    if (!pageToken) break;
  }

  if (videoIds.length === 0) {
    return { channel, videos: [], fetchedAt: new Date().toISOString() };
  }

  // 3) videos details
  type VideosResp = {
    items: Array<{
      id: string;
      snippet: { title: string; publishedAt: string; thumbnails?: any };
      statistics: { viewCount?: string; likeCount?: string; commentCount?: string };
      contentDetails: { duration: string };
    }>;
  };

  const vr = await fetchJson<VideosResp>("videos", {
    part: "snippet,statistics,contentDetails",
    id: videoIds.join(","),
    maxResults: wanted,
  });

  const now = new Date();

  const videos: YouTubeVideoPublic[] = (vr.items ?? []).map((v) => {
    const durationSeconds = parseISO8601DurationToSeconds(v.contentDetails?.duration ?? "PT0S");
    const views = safeNumber(v.statistics?.viewCount);
    const likes = safeNumber(v.statistics?.likeCount);
    const comments = safeNumber(v.statistics?.commentCount);
    const days = daysBetween(v.snippet.publishedAt, now);
    const viewsPerDay = views / days;
    const engagementRate = views > 0 ? (likes + comments) / views : 0;

    return {
      videoId: v.id,
      title: v.snippet?.title ?? "Vídeo",
      thumbnailUrl: v.snippet?.thumbnails?.high?.url || v.snippet?.thumbnails?.default?.url,
      publishedAt: v.snippet?.publishedAt,
      durationSeconds,
      views,
      likes,
      comments,
      daysSincePublished: days,
      viewsPerDay,
      engagementRate,
      isLikelyShort: inferLikelyShort(durationSeconds),
    };
  });

  // mantém ordem de playlist (recentes primeiro)
  const order = new Map(videoIds.map((id, idx) => [id, idx]));
  videos.sort((a, b) => (order.get(a.videoId) ?? 9999) - (order.get(b.videoId) ?? 9999));

  return {
    channel,
    videos,
    fetchedAt: new Date().toISOString(),
  };
}
