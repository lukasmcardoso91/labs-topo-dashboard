export default function AppleMusicPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Apple Music</h1>
        <p className="text-sm text-muted-foreground">
          Desempenho no ecossistema Apple.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">Plays</div>
        <div className="card">Ouvintes</div>
        <div className="card">Países</div>
      </section>

      <section className="card h-64 flex items-center justify-center text-muted-foreground">
        Gráfico Apple Music
      </section>
    </div>
  )
}
