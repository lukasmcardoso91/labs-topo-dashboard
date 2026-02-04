export default function ImportDataPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Importar Dados</h1>
        <p className="text-sm text-muted-foreground">
          Upload manual ou integração de fontes externas.
        </p>
      </header>

      <section className="card h-48 flex items-center justify-center text-muted-foreground">
        Área de upload / conexão com APIs
      </section>

      <section className="card h-32">
        Histórico de importações
      </section>
    </div>
  )
}
