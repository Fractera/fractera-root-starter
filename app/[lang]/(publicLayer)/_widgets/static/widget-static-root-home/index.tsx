import { ChevronRight, Sparkles } from "lucide-react"
import { H1 } from "@/components/ui/typography"
import { voiceStrings } from "@/lib/i18n/voice-field.i18n"
import { RootPrompt } from "./root-prompt.client"
import { rootHomeWords } from "./words"

// ГЛАВНАЯ ROOT — ПЕРВЫЙ ЭКРАН ИИ-АГЕНТА (узел, шаг 587-3). Владелец 2026-10-24: «хорошо было бы чтобы она была выполнена в стиле
// традиционного первого экрана ии агента, у нас для этого есть необходимые библиотека ai-elements. Посмотри первый экран v0.app но
// внизу три карточки компактные».
// 🔒 ВИД ПЕРЕРИСОВАН НАВЫКОМ TASTE (`design-taste-frontend`) по слову владельца того же дня («Вызови Навык Тести … перерисует эту
// страницу»). Design read: первый экран продукта-строителя (как v0) для основателей и разработчиков, спокойный язык Linear/v0;
// ручки 6/4/3. Из навыка: заголовок без засечек (`font-sans`, «serif discipline»), одна строка подзаголовка до 20 слов, верхний
// отступ ≤ pt-24, свечение — только цветом акцента «Дизайна» и сдержанно, появление по очереди с `motion-reduce`. Три компактные
// карточки и центр — бриф владельца (образец v0), поэтому запреты навыка на них здесь не действуют.
// 🔒 Страница предрендерена: сервер отдаёт заголовок, карточки и поле в HTML; живое (выбор карточки, голос, отправка) — островок.
// 🔒 Адрес ядра — `ARCHITECT_URL` узла (как у баннера стартера в `app/[lang]/layout.tsx`), без рукописного домена.
const RISE = "animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both motion-reduce:animate-none"

export function RootHome({ lang }: { lang: string }) {
  const w = rootHomeWords(lang)
  const core = (process.env.ARCHITECT_URL ?? "").replace(/\/+$/, "")
  const at = (path: string) => (core ? `${core}/${lang}${path}` : `/${lang}${path}`)
  return (
    <section data-block="nxlwe" className="relative isolate w-full overflow-hidden">
      {/* Свечение сверху — цветом акцента «Дизайна», без отдельной палитры. */}
      <div data-block="r4bt6"
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(55%_60%_at_50%_0%,color-mix(in_oklab,var(--primary)_16%,transparent),transparent_70%)]"
      />
      <div data-block="r7hq2" className="mx-auto flex min-h-[calc(100dvh-8rem)] w-full max-w-[760px] flex-col items-center px-4 pt-16 pb-16 md:pt-24">
        <a
          href={at("/build/subscription")}
          className={`${RISE} group inline-flex items-center gap-2 rounded-full border border-border bg-background/80 py-1 pr-2 pl-1 text-sm text-muted-foreground shadow-sm backdrop-blur transition-colors hover:border-primary/50 hover:text-foreground`}
        >
          <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles aria-hidden className="size-3.5" />
          </span>
          <span>{w.pill}</span>
          <ChevronRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
        </a>
        <H1
          data-block="s78y5"
          className={`${RISE} mt-6 text-center font-sans text-4xl font-semibold tracking-tight text-balance delay-100 md:text-6xl`}
        >
          {w.heading}
        </H1>
        <p data-block="pbho2" className={`${RISE} mt-4 max-w-[52ch] text-center text-base text-muted-foreground delay-150 md:text-lg`}>{w.sub}</p>
        <div data-block="k3m8d" className={`${RISE} mt-10 w-full delay-200`}>
          <RootPrompt
            lang={lang}
            words={w}
            voice={voiceStrings(lang)}
            links={{ claude: at("/build/subscription"), telegram: at("/build/telegram") }}
          />
        </div>
      </div>
    </section>
  )
}
