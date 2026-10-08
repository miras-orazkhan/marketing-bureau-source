/**
 * Минимальный root layout для Next.js App Router.
 * Все страницы рендерятся через route.ts (Eta-шаблоны),
 * этот layout нужен только чтобы Next.js не падал при сборке.
 * Он НЕ добавляет HTML — это делает Eta-шаблон layouts/base.eta.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
