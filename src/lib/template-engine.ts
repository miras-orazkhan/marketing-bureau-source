import { Eta } from 'eta'
import path from 'path'

/**
 * Карта имён иконок → SVG path data.
 * Используется вместо lucide-react в Eta-шаблонах.
 * SVG paths взяты из Lucide Icons (https://lucide.dev).
 */
const ICON_PATHS: Record<string, string> = {
  // Navigation
  arrow_right: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  arrow_left: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  chevron_right: '<path d="m9 18 6-6-6-6"/>',
  chevron_down: '<path d="m6 9 6 6 6-6"/>',
  home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  // Social
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  twitter: '<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 9.6 0 0 2.2.7 4.2-.6-4 0-6-4-6-4s1.5.5 3-.1c-4-1.3-4-5.7-4-5.7s1.5 1 3 .8C3 7.7 3 2.5 3 2.5S6.5 7 12 7c0-2 1-4 3-4s3 1 3 1 2-.5 2-1.5c0 0 .5 2 0 2z"/>',
  instagram: '<rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/>',
  youtube: '<path d="M2.5 17a2.85 2.83 0 0 1-1.43-2.5V9.5a2.85 2.83 0 0 1 1.43-2.5l13.13-6.35a2.18 2.18 0 0 1 3.13 2v14.7a2.18 2.18 0 0 1-3.13 2z"/><path d="m9 12 4-2"/>',
  telegram: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
  send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
  whatsapp: '<path d="M3 11a8 8 0 0 1 15.5-2.5"/><path d="M21 17a8 8 0 0 1-15.5 2.5"/><path d="M3 11v6a2 2 0 0 0 2 2h6"/><path d="M21 17v-6a2 2 0 0 0-2-2h-6"/>',
  message_circle: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>',
  // Business
  megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  pen_tool: '<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M3 12 12 3l9 9-9 9z"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  bar_chart: '<path d="M3 3v18h18"/><rect width="4" height="7" x="7" y="13" rx="1"/><rect width="4" height="10" x="15" y="10" rx="1"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/>',
  award: '<path d="M15.47 17.85 12 21l-3.53-3.15a8 8 0 1 1 7 0z"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  lightbulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/>',
  rocket: '<path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2 0-2.8a2 2 0 0 0-3 0z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 22 2c0 2.7-.9 7.2-3 10a22 22 0 0 1-3.9 2z"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/>',
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  check_circle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
  trending_up: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  // Default
  default: '<circle cx="12" cy="12" r="10"/>',
}

/**
 * Возвращает inline SVG для иконки по имени.
 * @param name — имя иконки (как в БД, например 'facebook', 'target', 'compass')
 * @param className — CSS класс (например 'h-6 w-6')
 * @param color — цвет stroke
 */
export function iconSvg(name?: string | null, className: string = 'h-6 w-6', color?: string): string {
  const key = (name || 'default').toLowerCase().replace(/[-\s]/g, '_')
  const paths = ICON_PATHS[key] || ICON_PATHS.default
  const style = color ? ` style="color: ${color}"` : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}"${style} aria-hidden="true">${paths}</svg>`
}

/**
 * Eta-инстанс для серверного рендеринга HTML-шаблонов.
 */
const eta = new Eta({
  views: path.join(process.cwd(), 'templates'),
  cache: process.env.NODE_ENV === 'production',
  autoTrim: false,
})

/**
 * Рендерит Eta-шаблон и возвращает HTML-строку.
 *
 * @param templatePath — путь от папки templates (например, 'pages/home')
 * @param data — данные для шаблона
 */
export async function render(templatePath: string, data: Record<string, any> = {}): Promise<string> {
  return eta.render(templatePath, data) as string
}

/**
 * Рендерит шаблон и оборачивает в base layout (head, header, footer).
 *
 * @param templatePath — путь к контенту страницы (например, 'pages/home')
 * @param data — данные для шаблона + layout
 */
export async function renderPage(
  templatePath: string,
  data: Record<string, any> = {}
): Promise<string> {
  // Рендерим контент страницы
  const content = await render(templatePath, data)

  // Рендерим base layout с контентом внутри
  const html = await render('layouts/base', {
    ...data,
    content,
  })

  return html
}
