import { Suspense } from 'react'
import { SiteApp } from '@/components/site/site-app'
import { loadPageData } from '@/lib/page-data'
import { getEffectivePageMeta } from '@/lib/page-meta'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await loadPageData()
  return {
    title: `Админка — ${settings.siteName}`,
    robots: { index: false, follow: false },
  }
}

export default async function AdminPage() {
  const data = await loadPageData()
  const pageMeta = await getEffectivePageMeta('home', {
    siteName: data.settings.siteName,
    siteUrl: data.settings.siteUrl,
    ogImage: data.settings.ogImage,
    email: data.settings.email,
    phone: data.settings.phone,
  })

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Загрузка админ-панели…</div>}>
      <SiteApp
        {...data}
        pageMeta={pageMeta}
        initialView="admin"
        articleSlug={null}
        resetToken={null}
        articleData={null}
        related={[]}
        caseSlug={null}
        caseData={null}
        relatedCases={[]}
      />
    </Suspense>
  )
}
