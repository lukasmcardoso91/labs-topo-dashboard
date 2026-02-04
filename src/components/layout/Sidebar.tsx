import clsx from 'clsx'

export type PageKey =
  | 'home'
  | 'spotify'
  | 'apple-music'
  | 'youtube'
  | 'social'
  | 'google-ads'
  | 'meta-ads'
  | 'releases'
  | 'insights'
  | 'import'

type SidebarProps = {
  currentPage: PageKey
  onPageChange: (page: PageKey) => void
}

const items: { key: PageKey; label: string; icon: string }[] = [
  { key: 'home', label: 'Resumo', icon: '🏠' },
  { key: 'spotify', label: 'Spotify', icon: '🎧' },
  { key: 'apple-music', label: 'Apple Music', icon: '🍎' },
  { key: 'youtube', label: 'YouTube', icon: '▶️' },
  { key: 'social', label: 'Redes Sociais', icon: '📱' },
  { key: 'google-ads', label: 'Google Ads', icon: '📊' },
  { key: 'meta-ads', label: 'Meta Ads', icon: '📣' },
  { key: 'releases', label: 'Lançamentos', icon: '🚀' },
  { key: 'insights', label: 'Insights', icon: '💡' },
  { key: 'import', label: 'Importar Dados', icon: '⬆️' },
]

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r h-screen p-4">
      <div className="text-xl font-bold mb-6">TOPO Dashboard</div>

      <nav className="space-y-1">
        {items.map(item => (
          <button
            key={item.key}
            onClick={() => onPageChange(item.key)}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition',
              currentPage === item.key
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
