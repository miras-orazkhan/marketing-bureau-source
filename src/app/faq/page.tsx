import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SiteApp } from '@/components/site/site-app'
import { loadPageData } from '@/lib/page-data'
import { getEffectivePageMeta } from '@/lib/page-meta'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await loadPageData()
  const meta = await getEffectivePageMeta('faq', {
    siteName: settings.siteName,
    siteUrl: settings.siteUrl,
    ogImage: settings.ogImage,
    email: settings.email,
    phone: settings.phone,
  })
  const baseUrl = (settings.siteUrl || 'https://marketingbureau.kz').replace(/\/$/, '')
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `${baseUrl}/faq` },
    openGraph: { title: meta.ogTitle, description: meta.ogDescription, url: `${baseUrl}/faq`, siteName: settings.siteName },
  }
}

export default async function FaqPage() {
  const data = await loadPageData()
  const pageMeta = await getEffectivePageMeta('faq', {
    siteName: data.settings.siteName,
    siteUrl: data.settings.siteUrl,
    ogImage: data.settings.ogImage,
    email: data.settings.email,
    phone: data.settings.phone,
  })

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Загрузка…</div>}>
      <SiteApp
        {...data}
        pageMeta={pageMeta}
        initialView="faq"
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
