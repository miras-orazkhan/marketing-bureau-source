'use client'

import type { ExpertisePublic } from '@/lib/company-content'
import type { SiteSettingsPublic } from '@/lib/settings'
import { DynamicIcon } from '@/components/site/dynamic-icon'
import { SectionHeader } from './section-header'

type ExpertiseSectionProps = {
  settings: SiteSettingsPublic
  items: ExpertisePublic[]
}

export function ExpertiseSection({ settings, items }: ExpertiseSectionProps) {
  return (
    <section id="expertise" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeader
          label="Что мы умеем"
          title={settings.expertiseSectionTitle}
          text={settings.expertiseSectionText}
          primaryColor={settings.primaryColor}
          accentColor={settings.accentColor}
        />
        {items.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Скоро здесь появится наша экспертиза.
          </p>
        ) : (
          // Мобильный: 2 колонки (компактно, иконки хорошо видны)
          // Планшет (sm): 2 колонки
          // Десктоп (lg): 3 колонки
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="group p-3 sm:p-4 rounded-lg hover:bg-muted/30 transition-colors"
              >
                {/* На мобильном: иконка сверху, текст под ней (вертикальная компоновка).
                    На десктопе (sm+): иконка слева, текст справа (горизонтальная). */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                  <div
                    className="h-12 w-12 rounded-lg flex items-center justify-center shrink-0 overflow-hidden bg-transparent mx-auto sm:mx-0"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    <DynamicIcon
                      name={item.icon}
                      image={item.iconImage}
                      className="h-7 w-7"
                      // Lucide-иконка рисуется цветом accentColor (фирменный);
                      // для загруженного изображения фон и так не нужен.
                      iconStyle={{ color: settings.accentColor }}
                      imgClassName="h-12 w-12 object-contain"
                      alt={item.title}
                    />
                  </div>
                  <div className="min-w-0 flex-1 text-center sm:text-left">
                    <h3 className="font-semibold mb-1 text-sm sm:text-base" style={{ color: settings.primaryColor }}>
                      {item.title}
                    </h3>
                    {item.description && (
                      <div
                        className="article-content prose prose-sm max-w-none text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
