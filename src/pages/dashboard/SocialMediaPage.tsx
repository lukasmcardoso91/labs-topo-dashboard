export default function SocialMediaPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Redes Sociais</h1>
        <p className="text-sm text-muted-foreground">
          Instagram, TikTok, alcance e engajamento.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">Seguidores</div>
        <div className="card">Engajamento</div>
        <div className="card">Alcance</div>
      </section>

      <section className="card h-64 flex items-center justify-center text-muted-foreground">
        Comparativo entre redes
      </section>
    </div>
  )
}
