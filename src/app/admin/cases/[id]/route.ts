import { NextResponse } from 'next/server'
import { render } from '@/lib/template-engine'
import { isAdmin } from '@/lib/auth'
import { adminGetCase } from '@/lib/company-content'
import { getSiteSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await isAdmin()
  if (!admin) return NextResponse.redirect(new URL('/admin', process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'))

  const { id } = await params
  const isNew = id === 'new'
  const item = isNew ? null : await adminGetCase(id)

  if (!isNew && !item) {
    return new NextResponse('Not Found', { status: 404 })
  }

  const settings = await getSiteSettings()
  const content = await render('admin/case-form', {
    item: item || {},
    isNew,
    settings,
  })
  const html = await render('admin/layout', { content, activeTab: 'cases', pageTitle: isNew ? 'Новый кейс' : 'Редактирование кейса' })

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
