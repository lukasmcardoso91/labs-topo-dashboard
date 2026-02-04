import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

type Props = {
  title: string;
  description?: string;
};

export function YouTubeLockedState({ title, description }: Props) {
  return (
    <div className="p-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-muted-foreground" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {description ||
              "Esta seção precisa de dados avançados do YouTube Analytics. Conecte sua conta Google para liberar métricas como retenção, CTR, receita, origem detalhada, países e dispositivos."}
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button disabled title="Em breve">
              🔒 Conectar com Google (em breve)
            </Button>
            <Button variant="outline" disabled title="Em breve">
              Ver o que será liberado
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Dica: no MVP público você já consegue ver “Visualizações” e conteúdos por vídeo com dados públicos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
