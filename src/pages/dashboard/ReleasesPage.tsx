export default function ReleasesPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Releases</h1>
        <p className="text-sm text-muted-foreground">
          Lançamentos, singles, álbuns e distribuição.
        </p>
      </header>

      <section className="card h-56 flex items-center justify-center text-muted-foreground">
        Lista de lançamentos conectados às plataformas
      </section>

      <section className="card h-40">
        Histórico de lançamentos
      </section>
    </div>
  )
}
