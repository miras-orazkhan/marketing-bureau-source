import { renderCaseDetail } from '@/lib/page-renderer'
export const dynamic = 'force-dynamic'
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params
  try { return renderCaseDetail(decodeURIComponent(rawSlug)) }
  catch { return renderCaseDetail(rawSlug) }
}
