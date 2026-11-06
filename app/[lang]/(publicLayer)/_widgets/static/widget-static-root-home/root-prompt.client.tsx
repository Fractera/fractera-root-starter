"use client"

import { useEffect, useRef, useState } from "react"
import { AppWindow, Check, ChevronLeft, ChevronRight, Factory, Megaphone, Network, Sparkles, Target, Users, X, type LucideIcon } from "lucide-react"
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input"
import { Button } from "@/components/ui/button"
import { MicIcon } from "@/components/form/mic-icon"
import { useVoiceRecorder, type AllVoiceStrings } from "@/_tools/tool-voice-input/client/use-voice-recorder"
import { signInRedirectUrl } from "@/lib/runtime-urls"
import { cn } from "@/lib/utils"
import { RootReply } from "./root-reply.client"
import type { RootHomeWords } from "./words"

// ОСТРОВОК ГЛАВНОЙ ROOT (узел, шаги 587-3 и 587-4).
//
// 587-3 — владелец 2026-10-24: «при наведении … подсветку карточек при нажатии сделать подсветку выделенной при наведении на область
// ввода текста делаю его подсветку. Нужно объединить тот текст который напишет пользователь в поле ввода с текстом который отправит
// кнопка». Выбранная карточка встаёт чипом над полем; отправляется задание карточки и слова человека одним текстом.
//
// 587-4 — первое задание переживает вход: «любое действие приведёт сначала к авторизации в которых первый пользователь получит права
// архитектора». Черновик ждёт в `localStorage` этого сайта, пока человек входит; вошедший архитектор отдаёт его своей двери
// `/api/first-task`, она — ядру. 🔒 Только браузером задание не донести: терминал и Telegram живут на адресе ядра, а хранилище браузера у
// каждого адреса своё. Таймеров и опроса нет: всё по действию человека и по одному возврату после входа.

const DRAFT_KEY = "fractera:first-task"

// Значок карточки по её id (одно семейство значков проекта — lucide). `integrator` — четвёртая карточка (узел, шаг 649-2).
const CARD_ICONS: Record<string, LucideIcon> = { swarm: Network, fullstack: AppWindow, factory: Factory, integrator: Users, content: Megaphone, personal: Target }

type State = "idle" | "sending" | "accepted" | "not-architect" | "failed"

function readDraft(): string | null {
  try { return window.localStorage.getItem(DRAFT_KEY) } catch { return null }
}
function writeDraft(text: string): void {
  try { window.localStorage.setItem(DRAFT_KEY, text) } catch { /* хранилище недоступно — отправка пойдёт без черновика */ }
}
function dropDraft(): void {
  try { window.localStorage.removeItem(DRAFT_KEY) } catch { /* нечего удалять */ }
}

export function RootPrompt({ lang, words, voice, links }: {
  lang: string
  words: RootHomeWords
  voice: AllVoiceStrings
  links: { claude: string }
}) {
  const [text, setText] = useState("")
  // 665: что ушло ядру — пузырём человека над ответом (и после возврата со входа, когда задание пришло из черновика).
  const [sent, setSent] = useState("")
  // 587-3 (владелец 2026-10-24): «По умолчанию пусть первая карточка будет подсвечена».
  const [card, setCard] = useState<string | null>(words.cards[0]?.id ?? null)
  const [state, setState] = useState<State>("idle")
  const areaRef = useRef<HTMLTextAreaElement>(null)
  const v = useVoiceRecorder({ targetRef: areaRef, value: text, onChange: setText, lang, strings: voice })
  const chosen = words.cards.find((c) => c.id === card) ?? null
  // 662-4: карусель — лента и автопрокрутка раз в 3 с.
  // 665 (владелец 2026-11-06): «анимация прекращается сразу после того как мы нажимаем на любую карточку и в дальнейшем прокрутка
  // возможно только в ручном режиме. Это позволит сохранить выбранный режим в Input». ✗ Замер 665: клик по «factory» — через 3,5 с
  // выбрана «integrator», через 7 с «content», и стрелка ленту не останавливала. Теперь первое нажатие на карточку или стрелку
  // выключает автопрокрутку до перезагрузки страницы.
  const track = useRef<HTMLDivElement>(null)
  const [auto, setAuto] = useState(true)
  const downAt = useRef(0)
  const step = (d: number) => {
    setAuto(false)
    const n = words.cards.length
    const at = Math.max(0, words.cards.findIndex((c) => c.id === card))
    setCard(words.cards[(at + d + n) % n]?.id ?? null)
  }
  useEffect(() => {
    if (!auto || card === null || text.trim() !== "") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const t = window.setTimeout(() => {
      const n = words.cards.length
      const at = words.cards.findIndex((c) => c.id === card)
      setCard(words.cards[(at + 1) % n]?.id ?? null)
    }, 3000)
    return () => window.clearTimeout(t)
  }, [auto, card, text, words.cards])
  useEffect(() => {
    const box = track.current
    const el = box?.querySelector<HTMLElement>(`[data-root-slide="${card}"]`)
    if (!box || !el) return
    // Текущая карточка — первая в ленте («карточки сдвигаются»); у конца ленты браузер останавливается сам. Двигается только лента,
    // страница по вертикали — нет. ✗ Проверка «уже видна» ошибалась посреди плавной прокрутки и оставляла карточку за краем.
    box.scrollTo({ left: el.offsetLeft - box.offsetLeft, behavior: "smooth" })
  }, [card])
  const combined = [chosen?.task, text.trim()].filter(Boolean).join("\n\n")

  /** Вошёл ли человек и архитектор ли он: 401 — нет входа, иначе роли сессии. */
  async function who(): Promise<"none" | "architect" | "other"> {
    const r = await fetch("/api/me", { cache: "no-store" }).catch(() => null)
    if (!r || r.status === 401) return "none"
    const s = (await r.json().catch(() => null)) as { roles?: string[] } | null
    return s?.roles?.includes("architect") ? "architect" : "other"
  }

  async function hand(task: string) {
    setState("sending")
    const r = await fetch("/api/first-task", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: task }),
    }).catch(() => null)
    if (r?.ok) { dropDraft(); setSent(task); setState("accepted"); return }
    setState(r?.status === 403 ? "not-architect" : "failed")
  }

  async function send(task: string) {
    if (!task) return
    writeDraft(task)
    const me = await who()
    if (me === "none") { window.location.href = signInRedirectUrl(window.location.href, "architect"); return }
    if (me === "other") { setState("not-architect"); return }
    await hand(task)
  }

  // Возврат после входа: черновик есть — отдать его один раз.
  useEffect(() => {
    const draft = readDraft()
    if (!draft) return
    let alive = true
    who().then((me) => {
      if (!alive || me === "none") return
      if (me === "other") { setState("not-architect"); return }
      void hand(draft)
    })
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 665 (владелец 2026-11-06): вместо карточки «Задание принято» — ответ без модели, напечатанный как поток, и «Продолжить» на вход в подписку.
  if (state === "accepted") return <RootReply task={sent} text={words.reply.text} cta={words.reply.continue} href={links.claude} />


  return (
    <div data-block="wznxc" className="flex w-full flex-col gap-4" data-root-home={state}>
      <PromptInput
        onSubmit={() => void send(combined)}
        className={cn(
          // 649-1: поле держит меру чтения, лента под ним — ширину переключателя подвала.
          "mx-auto max-w-3xl",
          // Поле — главный предмет экрана: крупнее, мягкая тень в тон акцента; наведение и фокус — свечение акцентом (владелец).
          "[&_[data-slot=input-group]]:rounded-2xl [&_[data-slot=input-group]]:bg-card [&_[data-slot=input-group]]:transition-[border-color,box-shadow] [&_[data-slot=input-group]]:duration-300",
          "[&_[data-slot=input-group]]:shadow-[0_12px_40px_-18px_color-mix(in_oklab,var(--primary)_45%,transparent)]",
          "hover:[&_[data-slot=input-group]]:border-primary/50 hover:[&_[data-slot=input-group]]:shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_35%,transparent),0_14px_44px_-14px_color-mix(in_oklab,var(--primary)_55%,transparent)]",
          "focus-within:[&_[data-slot=input-group]]:border-primary focus-within:[&_[data-slot=input-group]]:shadow-[0_0_0_3px_color-mix(in_oklab,var(--primary)_22%,transparent),0_16px_48px_-12px_color-mix(in_oklab,var(--primary)_60%,transparent)]",
          "[&_textarea]:min-h-24 [&_textarea]:text-base",
        )}
      >
        <PromptInputBody>
          {chosen ? (
            <div data-block="awj7o" className="flex w-full items-center gap-2 px-3 pt-3" data-root-chosen={chosen.id}>
              <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-foreground">
                <span className="text-muted-foreground">{words.chosen}:</span>
                <span className="truncate font-medium">{chosen.title}</span>
                <Button type="button" variant="ghost" size="icon-xs" onClick={() => setCard(null)} aria-label={words.clear} className="size-5 text-muted-foreground hover:text-foreground">
                  <X aria-hidden className="size-3.5" />
                </Button>
              </span>
            </div>
          ) : null}
          <PromptInputTextarea
            ref={areaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={words.placeholder}
            disabled={state === "sending"}
          />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools />
          <div data-block="u2be3" className="flex items-center gap-1">
            <PromptInputButton
              aria-label={v.strings.mic}
              title={v.supported ? v.strings.tipOk : v.strings.tipInsecure}
              disabled={v.busy || !v.supported}
              data-recording={v.recording ? "true" : "false"}
              onPointerDown={(e) => { e.preventDefault(); v.start() }}
              onPointerUp={v.stop}
              onPointerLeave={v.stop}
              onPointerCancel={v.stop}
              className={v.recording ? "text-recording" : undefined}
            >
              <MicIcon off={!v.supported} />
            </PromptInputButton>
            <PromptInputSubmit aria-label={words.send} disabled={!combined || state === "sending"} status={state === "sending" ? "submitted" : undefined} />
          </div>
        </PromptInputFooter>
      </PromptInput>
      {v.note ? <p data-block="hb6bu" className="text-center text-xs text-muted-foreground">{v.note}</p> : null}
      {state === "not-architect" ? <p data-block="t60z0" className="text-center text-sm text-destructive" role="alert">{words.notArchitect}</p> : null}
      {state === "failed" ? <p data-block="eqxq1" className="text-center text-sm text-destructive" role="alert">{words.failed}</p> : null}
      {/* 587-3 (владелец 2026-10-24): «Количество строк заголовки каждой карточки зафиксируй два … в описании … четыре. Карточки должны
          быть одинаково ровно выровнены»; свечение — при наведении и у выбранной. Строки зафиксированы высотой (`min-h` = 2 и 4 строки
          при `leading-5`) и обрезкой (`line-clamp`), карточки одной высоты — их тянет сетка (`items-stretch`). 🔒 `h-auto`, не `h-full`:
          Safari на Mac считает 100% высоты кнопки не от ряда сетки, и карточки вытягивались на экран, наезжая на панель ниже. */}
      {/* 649-2 (владелец 2026-11-05: «создать четвёртую вкладку интегратора агентов»): четыре в ряд на компьютере, по две на
          планшете, одна на телефоне. */}
      {/* 662-4 (владелец 2026-11-06: «используй карусель с кнопками прокрутки влево и вправо, добавь автоматизированное проигрывание в
          котором если пользователь не участвует в прокрутке каждые 3 секунды карточки сдвигаются нижний блок с информации обновляется, при
          нажатии на какую-либо карточку проигрывание приостанавливается пока пользователю удерживает эту карточку»): лента по одной карточке
          на телефоне, по две на планшете, по три на компьютере; каждые 3 с выбирается следующая (рассказ ниже следует за ней). Стоит, пока
          в поле есть текст (иначе менялась бы задача под рукой человека), когда выбор снят и при «меньше движения»; 665 — первое нажатие
          на карточку или стрелку останавливает её насовсем, дальше лента листается только руками. */}
      <div data-block="bki2e" className="relative w-full pt-2" data-root-carousel>
        <div data-block="bki2f" ref={track} className="-mx-2 flex snap-x snap-mandatory scroll-px-2 items-stretch gap-3 overflow-x-auto scroll-smooth px-2 pt-1 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {words.cards.map((c) => {
            const Icon = CARD_ICONS[c.id] ?? Sparkles
            const on = card === c.id
            return (
              <div data-block="gh70h" key={c.id} data-root-slide={c.id} className="flex shrink-0 basis-full snap-start sm:basis-[calc((100%-0.75rem)/2)] lg:basis-[calc((100%-1.5rem)/3)]">
              <Button
                type="button"
                variant="outline"
                // 662-4: отпускание после удержания — не клик: выбор остаётся (иначе удержание снимало бы карточку).
                onClick={() => { if (Date.now() - downAt.current > 400) return; setCard(on ? null : c.id) }}
                onPointerDown={() => { downAt.current = Date.now(); setAuto(false) }}
                aria-pressed={on}
                data-root-card={c.id}
                className={cn(
                  "relative flex h-auto w-full flex-col items-start justify-start gap-3 rounded-2xl bg-card p-4 text-left whitespace-normal",
                  "transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                  on
                    ? "border-primary shadow-[0_0_0_1px_var(--primary),0_12px_36px_-10px_color-mix(in_oklab,var(--primary)_55%,transparent)]"
                    : "border-border hover:border-primary/50 hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_30%,transparent),0_10px_32px_-12px_color-mix(in_oklab,var(--primary)_45%,transparent)]",
                )}
              >
                <span className={cn("flex size-9 items-center justify-center rounded-xl transition-colors", on ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary")}>
                  <Icon aria-hidden className="size-4.5" />
                </span>
                {on ? <Check aria-hidden className="absolute top-4 right-4 size-4 text-primary" /> : null}
                <span className="line-clamp-2 min-h-10 text-sm leading-5 font-semibold text-foreground">{c.title}</span>
                <span className="line-clamp-4 min-h-20 text-xs leading-5 font-normal text-muted-foreground">{c.text}</span>
              </Button>
              </div>
            )
          })}
        </div>
        <div data-block="bki2g" className="mt-3 flex items-center justify-center gap-2">
          <Button type="button" variant="outline" size="icon" onClick={() => step(-1)} aria-label={words.prev} data-root-prev className="size-8 rounded-full"><ChevronLeft aria-hidden className="size-4" /></Button>
          <div data-block="bki2h" className="flex items-center gap-1.5" aria-hidden>
            {words.cards.map((c) => <span key={c.id} className={cn("h-1.5 rounded-full transition-all", card === c.id ? "w-5 bg-primary" : "w-1.5 bg-border")} />)}
          </div>
          <Button type="button" variant="outline" size="icon" onClick={() => step(1)} aria-label={words.next} data-root-next className="size-8 rounded-full"><ChevronRight aria-hidden className="size-4" /></Button>
        </div>
      </div>
      {/* 587-3 (владелец 2026-10-24): «в случае выделения карточки внизу показать контейнер с более подробным рассказом … при нажатии на
          карточку подсвечивать внизу содержимое этой подсказки». Панель принадлежит выбранной карточке: тот же акцент и свечение,
          смена карточки — мягкое появление (`key` по карточке), `aria-live` читает новый рассказ. */}
      {chosen ? (() => {
        const Icon = CARD_ICONS[chosen.id] ?? Sparkles
        return (
          <div
            key={chosen.id}
            data-block="mr7p2"
            data-root-more={chosen.id}
            aria-live="polite"
            className="animate-in fade-in slide-in-from-top-1 duration-300 motion-reduce:animate-none rounded-2xl border border-primary/30 bg-primary/5 p-5 shadow-[0_12px_36px_-18px_color-mix(in_oklab,var(--primary)_50%,transparent)] md:p-6"
          >
            <div data-block="mr7p3" className="flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Icon aria-hidden className="size-4" />
              </span>
              <span className="text-sm font-semibold text-foreground">{chosen.title}</span>
            </div>
            <p data-block="mr7p4" className="mt-3 text-sm leading-6 text-foreground">{chosen.more}</p>
          </div>
        )
      })() : null}
    </div>
  )
}
