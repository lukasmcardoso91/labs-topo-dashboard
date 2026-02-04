import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

export function YouTubeTrafficSources() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Origem do Tráfego (Pro)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Dados públicos não trazem “origem de tráfego”. Essa aba será liberada com OAuth (YouTube Analytics API - read-only).
        </p>
      </CardContent>
    </Card>
  );
}
