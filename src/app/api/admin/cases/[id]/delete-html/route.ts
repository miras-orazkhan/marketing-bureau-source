import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'
import { adminDeleteCase } from '@/lib/company-content'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await isAdmin()
  if (!admin) return new NextResponse('Unauthorized', { status: 401 })
  const { id } = await params

  try {
    await adminDeleteCase(id)
    // Возвращаем пустой HTML — HTMX удалит элемент
    return new NextResponse('', { status: 200 })
  } catch (e: any) {
    return new NextResponse(`<div class="text-red-500 text-sm p-2">${e?.message || 'Ошибка'}</div>`, {
      status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }
}
