import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useYouTubePublicData } from "@/contexts/YouTubePublicDataContext";
import type { SortBy } from "@/types/youtubePublic";

function formatCompact(n: number) {
  return new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

function formatPercent(n: number) {
  return `${(n * 100).toFixed(2)}%`;
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  if (h > 0) return `${h}h ${mm}m`;
  return `${mm}m ${String(s).padStart(2, "0")}s`;
}

export function YouTubeContentAnalysis() {
  const { filteredVideos, sortBy, setSortBy } = useYouTubePublicData();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold">Análise de Conteúdos (Public+)</h2>
          <p className="text-muted-foreground">Performance individual dos últimos vídeos carregados.</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary">{filteredVideos.length} vídeos</Badge>

          <div className="w-[220px]">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="publishedAt">Mais recentes</SelectItem>
                <SelectItem value="views">Mais views</SelectItem>
                <SelectItem value="viewsPerDay">Mais views/dia</SelectItem>
                <SelectItem value="engagementRate">Maior engajamento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredVideos.slice(0, 6).map((v) => (
          <Card key={v.videoId}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="text-base truncate">{v.title}</CardTitle>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{new Date(v.publishedAt).toLocaleDateString("pt-BR")}</span>
                    <span>•</span>
                    <span>{formatDuration(v.durationSeconds)}</span>
                    {v.isLikelyShort && (
                      <>
                        <span>•</span>
                        <Badge variant="outline">Provável Shorts</Badge>
                      </>
                    )}
                  </div>
                </div>
                <Badge variant="secondary">{formatCompact(v.views)} views</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Likes</p>
                <p className="font-semibold">{formatCompact(v.likes)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Comentários</p>
                <p className="font-semibold">{formatCompact(v.comments)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Engajamento</p>
                <p className="font-semibold">{formatPercent(v.engagementRate)}</p>
              </div>

              <div className="md:col-span-3 grid gap-3 md:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Views/dia</p>
                  <p className="font-semibold">{formatCompact(v.viewsPerDay)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Dias desde publicação</p>
                  <p className="font-semibold">{v.daysSincePublished}d</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Tabela Detalhada</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Título</th>
                <th className="text-left py-2">Publicado</th>
                <th className="text-right py-2">Duração</th>
                <th className="text-right py-2">Views</th>
                <th className="text-right py-2">Views/dia</th>
                <th className="text-right py-2">Likes</th>
                <th className="text-right py-2">Comentários</th>
                <th className="text-right py-2">Engaj.</th>
              </tr>
            </thead>
            <tbody>
              {filteredVideos.map((v) => (
                <tr key={v.videoId} className="border-b last:border-b-0">
                  <td className="py-2 max-w-[460px] truncate">
                    {v.title} {v.isLikelyShort ? <Badge className="ml-2" variant="outline">Shorts</Badge> : null}
                  </td>
                  <td className="py-2">{new Date(v.publishedAt).toLocaleDateString("pt-BR")}</td>
                  <td className="py-2 text-right">{formatDuration(v.durationSeconds)}</td>
                  <td className="py-2 text-right">{formatCompact(v.views)}</td>
                  <td className="py-2 text-right">{formatCompact(v.viewsPerDay)}</td>
                  <td className="py-2 text-right">{formatCompact(v.likes)}</td>
                  <td className="py-2 text-right">{formatCompact(v.comments)}</td>
                  <td className="py-2 text-right">{formatPercent(v.engagementRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
