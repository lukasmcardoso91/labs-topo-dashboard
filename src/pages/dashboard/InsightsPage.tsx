export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Insights</h1>
        <p className="text-sm text-muted-foreground">
          Análises inteligentes e leituras estratégicas dos dados.
        </p>
      </header>

      <section className="card h-56 flex items-center justify-center text-muted-foreground">
        Insights gerados por IA aparecerão aqui
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card h-40">Insight #1</div>
        <div className="card h-40">Insight #2</div>
      </section>
    </div>
  )
}
