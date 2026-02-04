import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Integration = {
  id: string
  youtube_channel_id: string
}

type ChannelStats = {
  date: string
  views_total: number
  subscribers_total: number
}

export default function YouTubePage() {
  const [loading, setLoading] = useState(true)
  const [integration, setIntegration] = useState<Integration | null>(null)
  const [stats, setStats] = useState<any[]>([])
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })
  }, [])

  useEffect(() => {
    if (!session) return

    loadIntegration()
  }, [session])

  const loadIntegration = async () => {
    setLoading(true)

    const { data } = await supabase
      .from('youtube_integrations')
      .select('id, youtube_channel_id')
      .limit(1)
      .maybeSingle()

    if (data) {
      setIntegration(data)
      await loadStats()
    }

    setLoading(false)
  }

  const loadStats = async () => {
    const { data } = await supabase
      .from('youtube_video_stats_daily')
      .select('*')
      .order('date', { ascending: false })
      .limit(10)

    setStats(data || [])
  }

  const connectYouTube = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes:
          'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly',
      },
    })

    if (error) {
      alert('Erro ao conectar YouTube')
    }
  }

  const saveIntegration = async () => {
    if (!session?.provider_token) {
      alert('Token Google não encontrado')
      return
    }

    // ⚠️ MVP: canal hardcoded ou selecionado depois
    const youtubeChannelId = prompt(
      'Cole o ID do canal do YouTube (UCxxxx)'
    )

    if (!youtubeChannelId) return

    const { data: channel } = await supabase
      .from('youtube_channels')
      .select('id')
      .limit(1)
      .maybeSingle()

    if (!channel) {
      alert('Canal interno não encontrado')
      return
    }

    const { data, error } = await supabase
      .from('youtube_integrations')
      .insert({
        user_id: session.user.id,
        channel_id: channel.id,
        youtube_channel_id: youtubeChannelId,
        access_token: session.provider_token,
        refresh_token: session.provider_refresh_token,
        token_expires_at: new Date(
          session.expires_at * 1000
        ).toISOString(),
      })
      .select()
      .single()

    if (error) {
      alert('Erro ao salvar integração')
      return
    }

    setIntegration(data)
  }

  const syncYouTube = async () => {
    if (!integration) return

    await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/youtube-sync`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          integration_id: integration.id,
        }),
      }
    )

    await loadStats()
  }

  // ---------------- RENDER ----------------

  if (loading) {
    return <div>Carregando YouTube...</div>
  }

  if (!integration) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">YouTube</h2>
        <p>Nenhum canal conectado.</p>

        <button className="btn" onClick={connectYouTube}>
          Conectar YouTube
        </button>

        <button className="btn-outline" onClick={saveIntegration}>
          Já autorizei, salvar canal
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">YouTube</h2>

      <button className="btn" onClick={syncYouTube}>
        Sincronizar métricas
      </button>

      <div className="grid grid-cols-3 gap-4">
        {stats.slice(0, 3).map((s, i) => (
          <div key={i} className="card">
            <p className="text-sm">{s.date}</p>
            <p className="text-xl font-bold">{s.views}</p>
            <p className="text-xs text-muted-foreground">Views</p>
          </div>
        ))}
      </div>

      <div className="card">
        <pre className="text-xs overflow-auto">
          {JSON.stringify(stats, null, 2)}
        </pre>
      </div>
    </div>
  )
}
