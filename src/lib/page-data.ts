import { getSiteSettings } from '@/lib/settings'
import { isAdmin } from '@/lib/auth'
import {
  getPublishedServices,
  getPublishedCases,
  getPublishedFaq,
  getPublishedExpertise,
  getPublishedWhyUs,
  getPublishedSocialLinks,
} from '@/lib/company-content'
import { getPrivacyContent } from '@/lib/privacy'
import {
  getPublishedArticles,
  getFeaturedArticle,
} from '@/lib/articles'

/**
 * Общий тип для данных, которые нужны каждой странице
 * (Header, Footer, навигация — общие для всех).
 */
export type PageData = {
  settings: Awaited<ReturnType<typeof getSiteSettings>>
  isAdmin: boolean
  featured: Awaited<ReturnType<typeof getFeaturedArticle>>
  articles: Awaited<ReturnType<typeof getPublishedArticles>>
  news: Awaited<ReturnType<typeof getPublishedArticles>>
  services: Awaited<ReturnType<typeof getPublishedServices>>
  cases: Awaited<ReturnType<typeof getPublishedCases>>
  faq: Awaited<ReturnType<typeof getPublishedFaq>>
  expertise: Awaited<ReturnType<typeof getPublishedExpertise>>
  whyUs: Awaited<ReturnType<typeof getPublishedWhyUs>>
  privacyContent: Awaited<ReturnType<typeof getPrivacyContent>>
  socialLinks: Awaited<ReturnType<typeof getPublishedSocialLinks>>
}

/**
 * Загружает ВСЕ данные для рендера страницы (settings, services, cases, FAQ и т.д.)
 * в одном параллельном Promise.all. Используется каждой страницей.
 *
 * Все запросы кешируются через unstable_cache (60 сек) — повторные запросы
 * в течение минуты берутся из кеша, не ходят в БД.
 */
export async function loadPageData(): Promise<PageData> {
  const [
    settings,
    isAdminResult,
    featured,
    articles,
    news,
    services,
    cases,
    faq,
    expertise,
    whyUs,
    privacyContent,
    socialLinks,
  ] = await Promise.all([
    getSiteSettings(),
    isAdmin(),
    getFeaturedArticle(),
    getPublishedArticles('ARTICLE', { limit: 12 }),
    getPublishedArticles('NEWS', { limit: 12 }),
    getPublishedServices(),
    getPublishedCases(),
    getPublishedFaq(),
    getPublishedExpertise(),
    getPublishedWhyUs(),
    getPrivacyContent(),
    getPublishedSocialLinks(),
  ])

  return {
    settings,
    isAdmin: isAdminResult,
    featured,
    articles,
    news,
    services,
    cases,
    faq,
    expertise,
    whyUs,
    privacyContent,
    socialLinks,
  }
}
