import type { SectionRenderer } from '@/sections/contract'
import { inline } from '@/lib/content/blocks/inline'
import { CtaButton, CtaLink } from '@/sections/cta-button.server'
import { H1, H5, Lead, Small, Eyebrow } from '@/components/ui/typography'

// Первый экран по центру (шаги 303–304, образец владельца 2026-09-26): зарево фирменного цвета → бейдж → заголовок
// не длиннее двух строк → описание → кнопки → полоса из трёх шагов. Картинки и логотипа нет.
// Вёрстка — та же, что у блока реестра «Блоков» `components/blocks/hero-centered`; здесь добавлена вторая кнопка,
// потому что на первом экране стоят те же ДВА действия, что после каждого раздела (решение владельца 2026-09-20).
//
// 🔒 ВСЁ ИЗ ДИЗАЙН-СИСТЕМЫ: шрифты — примитивы типографики (H1 на `--fs-hero-one*`), цвета — токены темы, зарево
// `.hero-ignite*`, появление `.hero-appear`, каёмка `.pill-ai` — классы styles/globals.css.
// 🔒 H1 ЗДЕСЬ: страница с этой секцией объявляет `titleInBody`, фабрика второй H1 не печатает.
// 🔒 ЗАРЕВО НАЧИНАЕТСЯ ОТ ВЕРХА СТРАНИЦЫ (владелец, снимок 2026-09-26): обрезанное краем секции, оно давало прямую
// кромку под шапкой. Слой выходит вверх на 7rem и гаснет к краям сам.
const TITLE = 'mx-auto max-w-4xl line-clamp-2 text-balance text-[length:var(--fs-hero-one,1.95rem)] md:text-[length:var(--fs-hero-one-md,2.4375rem)] lg:text-[length:var(--fs-hero-one-lg,2.925rem)] leading-tight'

export const heroCentered: SectionRenderer<'heroCentered'> = (b, { key: k }) => (
  <section key={k} aria-labelledby={`${k}-t`} className="relative isolate mx-auto mb-6 flex w-full flex-col px-6 pt-10 pb-4 text-center" style={{ maxWidth: 'var(--hero-w)' }}>
    <div aria-hidden className="hero-ignite pointer-events-none absolute inset-x-0 -top-28 bottom-0 -z-10" />
    <div aria-hidden className="hero-ignite-inner pointer-events-none absolute inset-x-[15%] -top-28 bottom-0 -z-10" />

    {b.pill && (
      <div className="hero-appear mb-6 flex justify-center [animation-delay:0.3s]">
        <span className="pill-ai inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-foreground/85">
          <span aria-hidden className="text-base leading-none text-primary">✦</span>
          {b.pill}
        </span>
      </div>
    )}
    <H1 id={`${k}-t`} className={`hero-appear [animation-delay:0.5s] ${TITLE}`}>{b.title}</H1>
    <Lead className="hero-appear mx-auto mt-5 max-w-xl [animation-delay:0.65s]">{inline(b.description, `${k}-d`)}</Lead>
    {b.cta && (
      <div className="hero-appear mt-8 flex flex-wrap items-center justify-center gap-3 [animation-delay:0.75s]">
        <CtaButton href={b.cta.href}>{b.cta.label}</CtaButton>
        {b.cta.secondary ? <CtaLink href={b.cta.secondary.href}>{b.cta.secondary.label}</CtaLink> : null}
      </div>
    )}

    {b.steps && (
      // Телефон — столбик строк с разделителями; с планшета — ряд из трёх колонок с разделителями между ними.
      <ol className="hero-appear mx-auto mt-12 grid w-full max-w-3xl list-none divide-y divide-border/60 overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-0 text-left backdrop-blur-md [animation-delay:0.8s] md:grid-cols-3 md:divide-x md:divide-y-0 md:text-center">
        {b.steps.map((s, i) => (
          <li key={`${k}-s${i}`} className="flex items-center gap-3 px-4 py-3.5 md:flex-col md:gap-2 md:px-6 md:py-5">
            <Eyebrow className="font-mono font-normal text-muted-foreground">{String(i + 1).padStart(2, '0')}</Eyebrow>
            <span className="flex flex-col gap-1">
              <H5>{s.title}</H5>
              <Small>{inline(s.text, `${k}-s${i}-t`)}</Small>
            </span>
          </li>
        ))}
      </ol>
    )}
  </section>
)
