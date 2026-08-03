import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { SiteApp } from '@/components/site/site-app'
import { loadPageData } from '@/lib/page-data'
import { getEffectivePageMeta } from '@/lib/page-meta'
import { getPageSchemas } from '@/lib/schema'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await loadPageData()
  const meta = await getEffectivePageMeta('about', {
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
    alternates: { canonical: `${baseUrl}/about` },
    openGraph: { title: meta.ogTitle, description: meta.ogDescription, url: `${baseUrl}/about`, siteName: settings.siteName },
  }
}

export default async function AboutPage() {
  const data = await loadPageData()
  const pageMeta = await getEffectivePageMeta('about', {
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
        initialView="about"
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
