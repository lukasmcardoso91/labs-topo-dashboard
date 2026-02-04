import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICard } from "@/components/dashboard/KPICard";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Users, UploadCloud, ThumbsUp, MessageCircle, Lock, TrendingUp } from "lucide-react";
import { useYouTubePublicData } from "@/contexts/YouTubePublicDataContext";
import type { PeriodFilter } from "@/types/youtubePublic";

function formatCompact(n: number) {
  return new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

function formatPercent(n: number) {
  return `${(n * 100).toFixed(2)}%`;
}

export function YouTubeExecutiveSummary() {
  const { data, kpis, period, setPeriod } = useYouTubePublicData();

  const periodLabel: Record<PeriodFilter, string> = {
    "7d": "Últimos 7 dias",
    "28d": "Últimos 28 dias",
    "90d": "Últimos 90 dias",
    "all": "Todos os vídeos carregados",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold">YouTube Analytics (Public+)</h2>
          <p className="text-muted-foreground">
            Insights com dados públicos (últimos vídeos) + visão “Pro” bloqueada para OAuth.
          </p>
          {data?.channel?.title && (
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="secondary">{data.channel.title}</Badge>
              <Badge variant="outline">{new Date(data.fetchedAt).toLocaleString("pt-BR")}</Badge>
            </div>
          )}
        </div>

        <div className="w-full sm:w-[260px]">
          <Select value={period} onValueChange={(v) => setPeriod(v as PeriodFilter)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="28d">Últimos 28 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="all">Todos</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-2">{periodLabel[period]}</p>
        </div>
      </div>

      {/* KPIs PUBLIC+ */}
      <div className="grid gap-4 md:grid-cols-4">
        <KPICard
          title="Visualizações (período)"
          value={formatCompact(kpis.periodViews)}
          subtitle="Soma dos vídeos no filtro"
          icon={<Eye className="h-4 w-4" />}
          variant="youtube"
        />

        <KPICard
          title="Inscritos (canal)"
          value={formatCompact(kpis.subscribers)}
          subtitle="Valor atual do canal"
          icon={<Users className="h-4 w-4" />}
          variant="youtube"
        />

        <KPICard
          title="Uploads (últimos 30d)"
          value={kpis.uploads30d}
          subtitle="Cadência recente"
          icon={<UploadCloud className="h-4 w-4" />}
          variant="youtube"
        />

        <KPICard
          title="Engajamento médio"
          value={formatPercent(kpis.avgEngagementRate)}
          subtitle="(likes+comments)/views"
          icon={<TrendingUp className="h-4 w-4" />}
          variant="youtube"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <KPICard
          title="Likes (período)"
          value={formatCompact(kpis.periodLikes)}
          subtitle="Soma no filtro"
          icon={<ThumbsUp className="h-4 w-4" />}
          variant="youtube"
        />

        <KPICard
          title="Comentários (período)"
          value={formatCompact(kpis.periodComments)}
          subtitle="Soma no filtro"
          icon={<MessageCircle className="h-4 w-4" />}
          variant="youtube"
        />

        <KPICard
          title="Views totais (canal)"
          value={formatCompact(kpis.channelTotalViews)}
          subtitle="Valor público do canal"
          icon={<Eye className="h-4 w-4" />}
          variant="youtube"
        />

        <KPICard
          title="Views/dia (média)"
          value={formatCompact(kpis.avgViewsPerDay)}
          subtitle="Média dos vídeos no filtro"
          icon={<TrendingUp className="h-4 w-4" />}
          variant="youtube"
        />
      </div>

      {/* BLOCO PRO (OAuth) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Métricas Pro (exigem login Google / OAuth)
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <KPICard title="Tempo de exibição" value="🔒 Conecte com Google" variant="disabled" />
          <KPICard title="Impressões" value="🔒 Conecte com Google" variant="disabled" />
          <KPICard title="CTR" value="🔒 Conecte com Google" variant="disabled" />
          <KPICard title="Receita / RPM" value="🔒 Conecte com Google" variant="disabled" />
          <p className="md:col-span-4 text-sm text-muted-foreground">
            Quando entrarmos no OAuth (read-only), desbloqueamos: Origem do tráfego, Países/Cidades, Audiência, Dispositivos,
            Impressões/CTR, Watch time, Receita/RPM — e aí sim faz sentido persistir e alimentar o agente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
