import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSiteSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * GET /sitemap.xml
 * Динамический sitemap — генерируется из БД.
 *
 * ВАЖНО: все URL должны быть XML-экранированы (& → &amp;).
 * Кейсы теперь используют чистые URL: /cases/<slug> (не ?case=).
 */
export async function GET() {
  const settings = await getSiteSettings()
  const baseUrl = (settings.siteUrl || 'https://marketingbureau.kz').replace(/\/$/, '')
  const now = new Date().toISOString()

  const urls: { loc: string; lastmod?: string; changefreq: string; priority: string }[] = []

  // Главная
  urls.push({ loc: `${baseUrl}/`, lastmod: now, changefreq: 'weekly', priority: '1.0' })

  // Статические страницы — чистые URL
  const staticPages = [
    { path: '/services', priority: '0.9', changefreq: 'monthly' },
    { path: '/cases', priority: '0.8', changefreq: 'weekly' },
    { path: '/about', priority: '0.7', changefreq: 'monthly' },
    { path: '/faq', priority: '0.7', changefreq: 'monthly' },
    { path: '/blog', priority: '0.8', changefreq: 'weekly' },
    { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  ]
  staticPages.forEach((p) => {
    urls.push({ loc: `${baseUrl}${p.path}`, lastmod: now, changefreq: p.changefreq, priority: p.priority })
  })

  // Статьи и новости (через ?article=slug)
  const articles = await db.article.findMany({ where: { published: true }, orderBy: { publishedAt: 'desc' } })
  articles.forEach((a) => {
    urls.push({
      loc: `${baseUrl}/?article=${encodeURIComponent(a.slug)}`,
      lastmod: a.updatedAt.toISOString(),
      changefreq: 'monthly',
      priority: '0.6',
    })
  })

  // Кейсы — чистые URL: /cases/<slug>
  const cases = await db.caseItem.findMany({ where: { published: true }, orderBy: { sortOrder: 'asc' } })
  cases.forEach((c) => {
    urls.push({
      loc: `${baseUrl}/cases/${encodeURIComponent(c.slug)}`,
      lastmod: c.updatedAt.toISOString(),
      changefreq: 'monthly',
      priority: '0.7',
    })
  })

  // XML-экранирование: & → &amp;, < → &lt;, > → &gt;
  const escapeXml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
