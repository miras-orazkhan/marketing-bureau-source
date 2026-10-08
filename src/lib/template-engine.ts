import { Eta } from 'eta'
import path from 'path'

/**
 * Eta-инстанс для серверного рендеринга HTML-шаблонов.
 * Заменяет React Server Components — шаблоны рендерятся на сервере,
 * отдаются как готовый HTML. HTMX на клиенте обновляет фрагменты.
 */
const eta = new Eta({
  views: path.join(process.cwd(), 'templates'),
  cache: process.env.NODE_ENV === 'production',
  autoTrim: false,
  // Используем <% %> для кода, <%= %> для экранированного вывода, <%~ %> для raw HTML
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
