import { NextResponse } from 'next/server'
import { render } from '@/lib/template-engine'
import { isAdmin } from '@/lib/auth'
import { adminListCases } from '@/lib/company-content'

export const dynamic = 'force-dynamic'

export async function GET() {
  const admin = await isAdmin()
  if (!admin) return NextResponse.redirect(new URL('/admin', process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'))

  const cases = await adminListCases()
  const content = await render('admin/cases-list', { cases })
  const html = await render('admin/layout', { content, activeTab: 'cases', pageTitle: 'Кейсы' })

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
