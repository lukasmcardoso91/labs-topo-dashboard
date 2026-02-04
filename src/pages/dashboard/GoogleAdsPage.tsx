export default function GoogleAdsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Google Ads</h1>
        <p className="text-sm text-muted-foreground">
          Visão geral de campanhas, cliques, conversões e investimento.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">Investimento</div>
        <div className="card">Cliques</div>
        <div className="card">Conversões</div>
      </section>

      <section className="card h-64 flex items-center justify-center text-muted-foreground">
        Gráfico de performance (em breve)
      </section>
    </div>
  )
}
