import { NextResponse } from 'next/server'
import { render } from '@/lib/template-engine'
import { isAdmin } from '@/lib/auth'
import { getSiteSettings } from '@/lib/settings'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * GET /admin — дашборд админки (HTML, HTMX)
 */
export async function GET() {
  const admin = await isAdmin()
  if (!admin) {
    // Не авторизован — показываем логин
    const settings = await getSiteSettings()
    const html = await render('admin/login', { settings })
    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  // Авторизован — показываем дашборд
  const [stats, recentLeads] = await Promise.all([
    Promise.all([
      db.caseItem.count(),
      db.service.count(),
      db.article.count(),
      db.lead.count(),
    ]),
    db.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ])

  const content = await render('admin/dashboard', {
    stats: { cases: stats[0], services: stats[1], articles: stats[2], leads: stats[3] },
    recentLeads,
  })

  const html = await render('admin/layout', {
    content,
    activeTab: 'dashboard',
    pageTitle: 'Дашборд',
  })

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
