import { NextRequest, NextResponse } from 'next/server'
import { setAdminCookie } from '@/lib/auth'
import { verifyAdminCredentials } from '@/lib/settings'
import { render } from '@/lib/template-engine'
import { getSiteSettings } from '@/lib/settings'

/**
 * POST /api/admin/login-html
 * HTMX-эндпоинт для входа в админку.
 * Принимает form-data (phone, password), проверяет креды,
 * устанавливает cookie, возвращает:
 *   - при успехе: HTMX-редирект на /admin (через HX-Redirect header)
 *   - при ошибке: форму с сообщением об ошибке
 */
export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const phone = (formData.get('phone') as string || '').trim()
  const password = (formData.get('password') as string || '').trim()

  if (!phone || !password) {
    const errorHtml = await render('admin/login-form-error', { error: 'Заполните все поля' })
    return new NextResponse(errorHtml, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  const ok = await verifyAdminCredentials(phone, password)
  if (!ok) {
    const errorHtml = await render('admin/login-form-error', { error: 'Неверный телефон или пароль' })
    return new NextResponse(errorHtml, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  // Устанавливаем cookie
  await setAdminCookie()

  // HTMX-редирект через HX-Redirect header
  const settings = await getSiteSettings()
  const successHtml = `<div class="text-center py-8"><p class="text-emerald-600 font-medium">Вход выполнен...</p></div>`
  return new NextResponse(successHtml, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'HX-Redirect': '/admin',
    },
  })
}
