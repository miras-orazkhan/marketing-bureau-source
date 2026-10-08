import { renderBlog } from '@/lib/page-renderer'
export const revalidate = 60
export async function GET() { return renderBlog() }
