export default function SpotifyPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Spotify</h1>
        <p className="text-sm text-muted-foreground">
          Streams, ouvintes, seguidores e performance.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">Streams</div>
        <div className="card">Ouvintes</div>
        <div className="card">Seguidores</div>
        <div className="card">Playlists</div>
      </section>

      <section className="card h-64 flex items-center justify-center text-muted-foreground">
        Gráfico de crescimento Spotify
      </section>
    </div>
  )
}
