type Snapshot = {
    channelId: string;
    channelTitle: string;
    fetchedAt: string; // ISO
    videoCount: number;
    viewsRecent: number;
    subscriberCount: number;
  };
  
  const KEY = "topo_youtube_snapshots_v1";
  
  function readAll(): Snapshot[] {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch {
      return [];
    }
  }
  
  function writeAll(items: Snapshot[]) {
    localStorage.setItem(KEY, JSON.stringify(items));
  }
  
  export function saveSnapshot(s: Snapshot) {
    const all = readAll();
    all.push(s);
    writeAll(all);
  }
  
  export function getLatestSnapshot(channelId: string): Snapshot | null {
    const all = readAll().filter((s) => s.channelId === channelId);
    if (all.length === 0) return null;
    all.sort((a, b) => (a.fetchedAt < b.fetchedAt ? 1 : -1));
    return all[0];
  }
  
  export function getPreviousSnapshot(channelId: string): Snapshot | null {
    const all = readAll().filter((s) => s.channelId === channelId);
    if (all.length < 2) return null;
    all.sort((a, b) => (a.fetchedAt < b.fetchedAt ? 1 : -1));
    return all[1];
  }
  