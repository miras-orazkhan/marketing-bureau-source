import '@/app/globals.css'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from '@/components/ui/sonner'

/**
 * Root layout — нужен только для React page.tsx файлов (админка).
 * HTMX route.ts файлы возвращают собственный HTML через Eta-шаблоны
 * и НЕ проходят через этот layout.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground min-h-screen">
        {children}
        <Toaster />
        <SonnerToaster richColors position="top-right" />
      </body>
    </html>
  )
}
