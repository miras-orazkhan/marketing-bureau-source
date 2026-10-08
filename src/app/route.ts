import { NextResponse } from 'next/server'
import { render, renderPage } from '@/lib/template-engine'
import { getSiteSettings } from '@/lib/settings'
import {
  getPublishedServices,
  getPublishedCases,
  getPublishedFaq,
  getPublishedExpertise,
  getPublishedWhyUs,
  getPublishedSocialLinks,
} from '@/lib/company-content'

export const dynamic = 'force-dynamic'

export async function GET() {
  const [settings, expertise, services, whyUs, cases, faq, socialLinks] = await Promise.all([
    getSiteSettings(),
    getPublishedExpertise(),
    getPublishedServices(),
    getPublishedWhyUs(),
    getPublishedCases(),
    getPublishedFaq(),
    getPublishedSocialLinks(),
  ])

  const header = await render('partials/header', { settings })
  const footer = await render('partials/footer', { settings, socialLinks })

  const html = await renderPage('pages/home', {
    settings, expertise, services, whyUs, cases, faq, socialLinks, header, footer,
  })

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300',
    },
  })
}
