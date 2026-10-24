import { ChevronRight } from "lucide-react"
import { H1 } from "@/components/ui/typography"
import { voiceStrings } from "@/lib/i18n/voice-field.i18n"
import { RootPrompt } from "./root-prompt.client"
import { rootHomeWords } from "./words"

// ГЛАВНАЯ ROOT — ПЕРВЫЙ ЭКРАН ИИ-АГЕНТА (узел, шаг 587-3). Владелец 2026-10-24: «хорошо было бы чтобы она была выполнена в стиле
// традиционного первого экрана ии агента, у нас для этого есть необходимые библиотека ai-elements. Посмотри первый экран v0.app но
// внизу три карточки компактные». Вид — по устройству первого экрана v0.app (таблетка, заголовок по центру, поле до 690 px, под ним
// подсказки), наши средства: `PromptInput` ai-elements, голос узла, токены «Дизайна».
// 🔒 Страница предрендерена: сервер отдаёт заголовок, карточки и поле в HTML; живое (выбор карточки, голос, отправка) — островок.
// 🔒 Адрес ядра — `ARCHITECT_URL` узла (как у баннера стартера в `app/[lang]/layout.tsx`), без рукописного домена.
export function RootHome({ lang }: { lang: string }) {
  const w = rootHomeWords(lang)
  const core = (process.env.ARCHITECT_URL ?? "").replace(/\/+$/, "")
  const at = (path: string) => (core ? `${core}/${lang}${path}` : `/${lang}${path}`)
  return (
    <section data-block="nxlwe" className="mx-auto flex min-h-[80vh] w-full max-w-[720px] flex-col items-center gap-6 px-4 pt-24 pb-16 lg:pt-36">
      <a
        href={at("/build/subscription")}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
      >
        <span>{w.pill}</span>
        <ChevronRight aria-hidden className="size-4" />
      </a>
      <H1 data-block="s78y5" className="text-center text-balance">{w.heading}</H1>
      <RootPrompt
        lang={lang}
        words={w}
        voice={voiceStrings(lang)}
        links={{ claude: at("/build/subscription"), telegram: at("/build/telegram") }}
      />
    </section>
  )
}
