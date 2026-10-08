import { NextResponse } from 'next/server'
import { clearAdminCookie } from '@/lib/auth'

/**
 * GET /api/admin/logout-html
 * Очищает cookie и редиректит на главную.
 */
export async function GET() {
  await clearAdminCookie()
  return new NextResponse('<div>Выход...</div>', {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'HX-Redirect': '/',
    },
  })
}
