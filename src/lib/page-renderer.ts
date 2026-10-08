import { NextResponse } from 'next/server'
import { render, renderPage, iconSvg } from '@/lib/template-engine'
import { getSiteSettings } from '@/lib/settings'
import {
  getPublishedServices,
  getPublishedCases,
  getPublishedFaq,
  getPublishedExpertise,
  getPublishedWhyUs,
  getPublishedSocialLinks,
  getPublishedCaseBySlug,
  getRelatedCases,
} from '@/lib/company-content'
import {
  getPublishedArticles,
  getArticleBySlug,
  getFeaturedArticle,
} from '@/lib/articles'
import { getPrivacyContent } from '@/lib/privacy'

type PageContext = {
  settings: Awaited<ReturnType<typeof getSiteSettings>>
  socialLinks: Awaited<ReturnType<typeof getPublishedSocialLinks>>
  header: string
  footer: string
  iconSvg: typeof import('./template-engine').iconSvg
}

/**
 * Загружает общие данные (settings, socialLinks) и рендерит header+footer.
 * Используется каждой страницей.
 */
async function loadContext(): Promise<PageContext> {
  const [settings, socialLinks] = await Promise.all([
    getSiteSettings(),
    getPublishedSocialLinks(),
  ])
  const header = await render('partials/header', { settings })
  const footer = await render('partials/footer', { settings, socialLinks })
  return { settings, socialLinks, header, footer, iconSvg }
}

/**
 * Рендерит страницу: загружает контекст + переданные данные, оборачивает в base layout.
 * Возвращает NextResponse с HTML.
 */
async function renderTemplate(
  templatePath: string,
  extraData: Record<string, any> = {},
  title?: string
): Promise<NextResponse> {
  const ctx = await loadContext()
  const html = await renderPage(templatePath, {
    ...ctx,
    ...extraData,
    title: title || ctx.settings.metaTitle,
  })
  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300',
    },
  })
}

// ─── Главная ───────────────────────────────────────

export async function renderHome(): Promise<NextResponse> {
  const [expertise, services, whyUs, cases, faq] = await Promise.all([
    getPublishedExpertise(),
    getPublishedServices(),
    getPublishedWhyUs(),
    getPublishedCases(),
    getPublishedFaq(),
  ])
  return renderTemplate('pages/home', { expertise, services, whyUs, cases, faq })
}

// ─── About ─────────────────────────────────────────

export async function renderAbout(): Promise<NextResponse> {
  return renderTemplate('pages/about', {}, 'О нас')
}

// ─── Services ──────────────────────────────────────

export async function renderServices(): Promise<NextResponse> {
  const services = await getPublishedServices()
  return renderTemplate('pages/services', { services }, 'Услуги')
}

// ─── Cases (список) ────────────────────────────────

export async function renderCases(): Promise<NextResponse> {
  const cases = await getPublishedCases()
  return renderTemplate('pages/cases', { cases }, 'Кейсы')
}

// ─── Case detail ───────────────────────────────────

export async function renderCaseDetail(slug: string): Promise<NextResponse> {
  const caseItem = await getPublishedCaseBySlug(slug)
  if (!caseItem) {
    return new NextResponse('Not Found', { status: 404 })
  }
  const related = await getRelatedCases(caseItem.id, 3)
  return renderTemplate('pages/case-detail', { caseItem, related }, caseItem.title)
}

// ─── FAQ ───────────────────────────────────────────

export async function renderFaq(): Promise<NextResponse> {
  const faq = await getPublishedFaq()
  return renderTemplate('pages/faq', { faq }, 'FAQ')
}

// ─── Blog (список статей) ──────────────────────────

export async function renderBlog(): Promise<NextResponse> {
  const articles = await getPublishedArticles('ARTICLE', { limit: 20 })
  const featured = await getFeaturedArticle()
  return renderTemplate('pages/blog', { articles, featured }, 'Блог')
}

// ─── Article detail ────────────────────────────────

export async function renderArticleDetail(slug: string): Promise<NextResponse> {
  const article = await getArticleBySlug(slug, true)
  if (!article) {
    return new NextResponse('Not Found', { status: 404 })
  }
  let related = await getPublishedArticles(article.type as 'ARTICLE' | 'NEWS', { limit: 4 })
  related = related.filter((r) => r.id !== article.id).slice(0, 3)
  return renderTemplate('pages/article-detail', { article, related }, article.title)
}

// ─── Privacy ───────────────────────────────────────

export async function renderPrivacy(): Promise<NextResponse> {
  const privacyContent = await getPrivacyContent()
  return renderTemplate('pages/privacy', { privacyContent }, 'Политика конфиденциальности')
}
