import { renderCases } from '@/lib/page-renderer'
export const dynamic = 'force-dynamic'
export async function GET() { return renderCases() }
