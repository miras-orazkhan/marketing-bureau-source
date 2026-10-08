import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'
import { adminUpdateCase } from '@/lib/company-content'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await isAdmin()
  if (!admin) return new NextResponse('Unauthorized', { status: 401 })
  const { id } = await params

  const formData = await req.formData()
  const title = (formData.get('title') as string || '').trim()
  const slug = (formData.get('slug') as string || '').trim()
  const client = (formData.get('client') as string || '').trim()
  const excerpt = (formData.get('excerpt') as string || '').trim()
  const content = (formData.get('content') as string || '').trim()
  const results = (formData.get('results') as string || '').trim()
  const coverImage = (formData.get('coverImage') as string || '').trim()
  const sortOrder = parseInt(formData.get('sortOrder') as string || '0', 10)
  const published = formData.get('published') === 'on'
  const featured = formData.get('featured') === 'on'

  if (!title) {
    return new NextResponse('<div class="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-600">Заголовок обязателен</div>', {
      status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  try {
    await adminUpdateCase(id, {
      title, slug, client: client || undefined, excerpt: excerpt || undefined,
      content: content || undefined, results: results || undefined,
      coverImage: coverImage || null, sortOrder, published, featured,
    })
    return new NextResponse('<div class="bg-emerald-50 border border-emerald-200 rounded-md p-3 text-sm text-emerald-600">✓ Сохранено</div>', {
      status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  } catch (e: any) {
    return new NextResponse(`<div class="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-600">${e?.message || 'Ошибка'}</div>`, {
      status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }
}
