import { useState } from 'react'
import Sidebar, { PageKey } from '@/components/layout/Sidebar'

import ExecutiveSummary from '@/pages/dashboard/ExecutiveSummary'
import SpotifyPage from '@/pages/dashboard/SpotifyPage'
import AppleMusicPage from '@/pages/dashboard/AppleMusicPage'
import YouTubePage from '@/pages/dashboard/YouTubePage'
import SocialMediaPage from '@/pages/dashboard/SocialMediaPage'
import GoogleAdsPage from '@/pages/dashboard/GoogleAdsPage'
import MetaAdsPage from '@/pages/dashboard/MetaAdsPage'
import ReleasesPage from '@/pages/dashboard/ReleasesPage'
import InsightsPage from '@/pages/dashboard/InsightsPage'
import ImportDataPage from '@/pages/dashboard/ImportDataPage'

const pageMap: Record<PageKey, React.ComponentType> = {
  home: ExecutiveSummary,
  spotify: SpotifyPage,
  'apple-music': AppleMusicPage,
  youtube: YouTubePage,
  social: SocialMediaPage,
  'google-ads': GoogleAdsPage,
  'meta-ads': MetaAdsPage,
  releases: ReleasesPage,
  insights: InsightsPage,
  import: ImportDataPage,
}

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState<PageKey>('home')

  const PageComponent = pageMap[currentPage]

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <main className="flex-1 overflow-y-auto p-6">
        <PageComponent />
      </main>
    </div>
  )
}
