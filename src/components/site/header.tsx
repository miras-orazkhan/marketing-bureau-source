'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { SiteSettingsPublic } from '@/lib/settings'

type NavTarget = 'home' | 'services' | 'cases' | 'about' | 'blog' | 'faq'

const NAV_LABELS: Record<NavTarget, string> = {
  home: 'Главная',
  services: 'Услуги',
  cases: 'Кейсы',
  about: 'О нас',
  blog: 'Блог',
  faq: 'FAQ',
}

// Чистые URL для каждого раздела
const NAV_HREFS: Record<NavTarget, string> = {
  home: '/',
  services: '/services',
  cases: '/cases',
  about: '/about',
  blog: '/blog',
  faq: '/faq',
}

type HeaderProps = {
  settings: SiteSettingsPublic
  navItems: NavTarget[]
}

export function Header({ settings, navItems }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const LogoEl = useMemo(() => {
    if (settings.logoUrl) {
      return (
        <img
          src={settings.logoUrl}
          alt={settings.siteName}
          width={180}
          height={40}
          className="h-10 w-auto max-w-[180px] object-contain"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      )
    }
    return (
      <span
        className="text-xl font-bold tracking-tight"
        style={{ color: settings.primaryColor }}
      >
        {settings.logoText || settings.siteName}
      </span>
    )
  }, [settings.logoUrl, settings.logoText, settings.siteName, settings.primaryColor])

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Логотип — ссылка на главную, открывается в новой вкладке */}
        <Link
          href="/"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity"
          aria-label={settings.siteName}
        >
          {LogoEl}
        </Link>

        {/* Десктоп-навигация — чистые URL, каждая в новой вкладке */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Button
              key={item}
              variant="ghost"
              size="default"
              className="text-sm min-h-[44px]"
              asChild
            >
              <Link
                href={NAV_HREFS[item]}
                target="_blank"
                rel="noopener"
                prefetch
              >
                {NAV_LABELS[item]}
              </Link>
            </Button>
          ))}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden min-h-[44px] min-w-[44px]"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Меню"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Мобильное меню */}
      <div
        className={cn(
          'md:hidden border-t bg-background overflow-hidden transition-all',
          mobileOpen ? 'max-h-96' : 'max-h-0'
        )}
      >
        <nav className="container mx-auto flex flex-col p-4 gap-1">
          {navItems.map((item) => (
            <Button
              key={item}
              variant="ghost"
              size="default"
              className="justify-start min-h-[44px]"
              asChild
            >
              <Link
                href={NAV_HREFS[item]}
                target="_blank"
                rel="noopener"
                onClick={() => setMobileOpen(false)}
              >
                {NAV_LABELS[item]}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  )
}
