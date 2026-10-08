import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendTelegramMessage } from '@/lib/telegram'
import { getRawSiteSettings } from '@/lib/settings'

// Казахстанские DEF-коды
const KZ_DEF_CODES = new Set([
  '700', '701', '702', '705', '706', '707', '708',
  '747', '771', '775', '776', '777', '778',
])
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * POST /api/leads/submit-html
 * HTMX-эндпоинт: принимает form-data, сохраняет заявку,
 * отправляет Telegram-уведомление, возвращает HTML-фрагмент
 * (успех или ошибки) для замены формы через hx-swap.
 *
 * В отличие от /api/leads (JSON), этот роут возвращает HTML.
 */
export async function POST(req: NextRequest) {
  const formData = await req.formData()

  const name = (formData.get('name') as string || '').trim()
  const phone = (formData.get('phone') as string || '').trim()
  const email = (formData.get('email') as string || '').trim()
  const message = (formData.get('message') as string || '').trim()

  // Валидация
  const errors: string[] = []
  if (!name) errors.push('Введите имя')
  if (!phone) errors.push('Введите телефон')
  if (!email) errors.push('Email обязателен')
  else if (!EMAIL_RE.test(email)) errors.push('Некорректный email')

  // Проверка DEF-кода
  if (phone) {
    const digits = phone.replace(/\D/g, '')
    if (digits.length !== 11 || digits[0] !== '7') {
      errors.push('Введите корректный номер: +7 (XXX) XXX-XX-XX')
    } else {
      const defCode = digits.slice(1, 4)
      if (!KZ_DEF_CODES.has(defCode)) {
        errors.push('Поддерживаются только номера казахстанских операторов')
      }
    }
  }

  // Если есть ошибки — возвращаем форму с ошибками
  if (errors.length > 0) {
    const errorHtml = `
      <div class="space-y-3">
        <div class="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-600">
          <ul class="space-y-1">
            ${errors.map((e) => `<li>• ${e}</li>`).join('')}
          </ul>
        </div>
        <form hx-post="/api/leads/submit-html" hx-target="#cta-form-container" hx-swap="innerHTML" class="space-y-3">
          <input type="text" name="name" placeholder="Имя" value="${name.replace(/"/g, '&quot;')}" required
                 class="w-full h-10 px-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <input type="tel" name="phone" placeholder="+7 (___) ___-__-__" value="${phone.replace(/"/g, '&quot;')}" required
                 class="w-full h-10 px-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <input type="email" name="email" placeholder="Email" value="${email.replace(/"/g, '&quot;')}" required
                 class="w-full h-10 px-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <textarea name="message" rows="3" placeholder="Опишите вашу задачу"
                    class="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">${message}</textarea>
          <button type="submit" class="w-full h-10 rounded-md text-sm font-medium text-white transition-colors hover:opacity-90 bg-emerald-500">
            Оставить заявку
          </button>
          <p class="text-xs text-gray-400 text-center">
            Нажимая кнопку, вы соглашаетесь с <a href="/privacy" class="underline hover:text-gray-600">политикой конфиденциальности</a>.
          </p>
        </form>
      </div>
    `
    return new NextResponse(errorHtml, {
      status: 200, // 200 для HTMX swap (не 400 — HTMX не свапает на ошибке)
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  // Сохраняем в БД
  await db.lead.create({
    data: { name, phone, email: email || null, message: message || null, source: 'home-cta' },
  })

  // Telegram-уведомление
  try {
    const settings = await getRawSiteSettings()
    if (settings.telegramBotToken && settings.telegramLeadsChatId) {
      const date = new Date().toLocaleString('ru-RU', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Almaty',
      })
      const tgMsg = `🔔 <b>Новая заявка с сайта!</b>

👤 <b>Имя:</b> ${name}
📞 <b>Телефон:</b> ${phone}
📧 <b>Email:</b> ${email}${message ? `\n💬 <b>Сообщение:</b> ${message}` : ''}

📍 <b>Страница:</b> Главная
🕐 <b>Время:</b> ${date}`
      await sendTelegramMessage(settings.telegramBotToken, settings.telegramLeadsChatId, tgMsg)
    }
  } catch (e) {
    console.error('Telegram error:', e)
  }

  // Возвращаем HTML-фрагмент с сообщением об успехе
  const successHtml = `
    <div class="text-center py-8">
      <div class="mx-auto h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-emerald-600">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h3 class="text-xl font-bold mb-2">Заявка отправлена!</h3>
      <p class="text-gray-500 text-sm mb-6">
        Спасибо за обращение. Наш менеджер свяжется с вами в ближайшее время.
      </p>
      <button onclick="document.getElementById('cta-form-container').innerHTML = document.getElementById('cta-form-template').innerHTML"
              class="px-4 h-9 rounded-md border border-gray-300 hover:bg-gray-100 text-sm transition-colors">
        Отправить ещё одну
      </button>
    </div>
    <template id="cta-form-template">
      <form hx-post="/api/leads/submit-html" hx-target="#cta-form-container" hx-swap="innerHTML" class="space-y-3">
        <input type="text" name="name" placeholder="Имя" required class="w-full h-10 px-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        <input type="tel" name="phone" placeholder="+7 (___) ___-__-__" required class="w-full h-10 px-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        <input type="email" name="email" placeholder="Email" required class="w-full h-10 px-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        <textarea name="message" rows="3" placeholder="Опишите вашу задачу" class="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        <button type="submit" class="w-full h-10 rounded-md text-sm font-medium text-white transition-colors hover:opacity-90 bg-emerald-500">Оставить заявку</button>
        <p class="text-xs text-gray-400 text-center">Нажимая кнопку, вы соглашаетесь с <a href="/privacy" class="underline hover:text-gray-600">политикой конфиденциальности</a>.</p>
      </form>
    </template>
  `

  return new NextResponse(successHtml, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
