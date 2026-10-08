import { renderServices } from '@/lib/page-renderer'
export const revalidate = 60
export async function GET() { return renderServices() }
