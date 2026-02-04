import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, CheckCircle, AlertCircle, Download, Youtube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useYouTubePublicData } from "@/contexts/YouTubePublicDataContext";
import { useYouTubeData } from "@/contexts/YouTubeDataContext"; // CSV legacy (se você ainda usa)

export function YouTubeImportSection() {
  const { toast } = useToast();

  // público
  const {
    channelInput,
    setChannelInput,
    maxVideos,
    setMaxVideos,
    connectPublic,
    loading,
    error,
    data,
  } = useYouTubePublicData();

  // CSV legacy (mantém compatível com o projeto antigo)
  const { setRawData } = useYouTubeData();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");

  const handleConnect = async () => {
    await connectPublic();

    if (!error) {
      toast({
        title: "YouTube conectado (modo público)",
        description: "Dados públicos carregados com sucesso.",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus("idle");

    try {
      const text = await file.text();

      // parsing simples (CSV). Mantém seu fluxo atual. Se você tiver parser mais completo, pode trocar aqui.
      const lines = text.split("\n").filter(Boolean);
      const header = lines[0].split(",").map((h) => h.trim());
      const rows = lines.slice(1);

      const data = rows
        .map((line) => line.split(","))
        .filter((cols) => cols.length === header.length)
        .map((cols) => {
          const obj: any = {};
          header.forEach((h, idx) => (obj[h] = cols[idx]));
          obj.value = Number(obj.value ?? 0);
          return obj;
        });

      setRawData(data);
      setUploadStatus("success");

      toast({
        title: "CSV importado",
        description: "Dados do CSV carregados.",
      });
    } catch (err: any) {
      console.error(err);
      setUploadStatus("error");
      toast({
        title: "Erro ao importar CSV",
        description: err?.message || "Falha ao processar o arquivo.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template = `date,video_id,video_title,country,traffic_source,device_type,playback_location,metric,value
2025-07-01,abc123,Example Video,Brazil,YouTube Search,Mobile,YouTube,views,1000`;
    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "youtube_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* CONECTAR PÚBLICO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Youtube className="h-5 w-5" />
            Conectar YouTube (dados públicos)
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-5">
            <div className="md:col-span-4 space-y-2">
              <Label>Canal</Label>
              <Input
                value={channelInput}
                onChange={(e) => setChannelInput(e.target.value)}
                placeholder="https://www.youtube.com/@handle ou /channel/UC..."
              />
              <p className="text-xs text-muted-foreground">
                Esse modo traz views/likes/comments dos últimos vídeos + inscritos atuais. Métricas avançadas exigem login com Google.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Últimos vídeos</Label>
              <Select value={String(maxVideos)} onValueChange={(v) => setMaxVideos(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>

              <Button className="w-full mt-1" onClick={handleConnect} disabled={loading}>
                {loading ? "Buscando..." : "Buscar dados públicos"}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {data && !error && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between gap-2">
                <span>
                  Dados públicos carregados com sucesso: <b>{data.channel.title}</b>
                </span>
                <Badge variant="secondary">{data.videos.length} vídeos</Badge>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* IMPORTAR CSV (LEGACY) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Importar Dados (CSV)</CardTitle>
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Template
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />

            <div className="space-y-2">
              <p className="text-lg font-medium">Arraste seu arquivo CSV aqui</p>
              <p className="text-sm text-muted-foreground">ou clique para selecionar</p>
            </div>

            <Input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
              id="csv-upload"
            />
            <Label htmlFor="csv-upload" className="inline-block mt-4">
              <Button disabled={isUploading}>
                {isUploading ? "Importando..." : "Selecionar Arquivo"}
              </Button>
            </Label>
          </div>

          {uploadStatus === "success" && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Arquivo importado com sucesso!</AlertDescription>
            </Alert>
          )}

          {uploadStatus === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Erro ao importar arquivo. Verifique o formato.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
