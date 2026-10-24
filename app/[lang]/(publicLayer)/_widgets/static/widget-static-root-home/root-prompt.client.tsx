"use client"

import { useEffect, useRef, useState } from "react"
import { AppWindow, Check, CheckCircle2, Factory, Network, Sparkles, X, type LucideIcon } from "lucide-react"
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input"
import { Button, buttonVariants } from "@/components/ui/button"
import { MicIcon } from "@/components/form/mic-icon"
import { useVoiceRecorder, type AllVoiceStrings } from "@/_tools/tool-voice-input/client/use-voice-recorder"
import { signInRedirectUrl } from "@/lib/runtime-urls"
import { cn } from "@/lib/utils"
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

// Значок карточки по её id (одно семейство значков проекта — lucide).
const CARD_ICONS: Record<string, LucideIcon> = { swarm: Network, fullstack: AppWindow, factory: Factory }

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
  links: { claude: string; telegram: string }
}) {
  const [text, setText] = useState("")
  const [card, setCard] = useState<string | null>(null)
  const [state, setState] = useState<State>("idle")
  const areaRef = useRef<HTMLTextAreaElement>(null)
  const v = useVoiceRecorder({ targetRef: areaRef, value: text, onChange: setText, lang, strings: voice })
  const chosen = words.cards.find((c) => c.id === card) ?? null
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
    if (r?.ok) { dropDraft(); setState("accepted"); return }
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

  if (state === "accepted") {
    return (
      <div data-block="v4x9t" className="flex w-full flex-col items-center gap-4 rounded-xl border border-primary/40 bg-primary/5 p-6 text-center" data-root-home="accepted">
        <CheckCircle2 aria-hidden className="size-8 text-primary" />
        <p data-block="jayw3" className="text-lg font-semibold text-foreground">{words.accepted.title}</p>
        <p data-block="heyiz" className="max-w-xl text-sm text-muted-foreground">{words.accepted.text}</p>
        <div data-block="z341y" className="flex flex-wrap justify-center gap-2">
          <a href={links.claude} className={buttonVariants({ size: "sm" })}>{words.accepted.claude}</a>
          <a href={links.telegram} className={buttonVariants({ variant: "outline", size: "sm" })}>{words.accepted.telegram}</a>
        </div>
      </div>
    )
  }

  return (
    <div data-block="wznxc" className="flex w-full flex-col gap-4" data-root-home={state}>
      <PromptInput
        onSubmit={() => void send(combined)}
        className={cn(
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
          при `leading-5`) и обрезкой (`line-clamp`), карточки одной высоты (сетка тянет, `h-full`). */}
      <div data-block="bki2e" className="grid w-full items-stretch gap-3 pt-2 sm:grid-cols-3">
        {words.cards.map((c) => {
          const Icon = CARD_ICONS[c.id] ?? Sparkles
          const on = card === c.id
          return (
            <Button
              key={c.id}
              type="button"
              variant="outline"
              onClick={() => setCard(on ? null : c.id)}
              aria-pressed={on}
              data-root-card={c.id}
              className={cn(
                "relative flex h-full flex-col items-start justify-start gap-3 rounded-2xl bg-card p-4 text-left whitespace-normal",
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
          )
        })}
      </div>
    </div>
  )
}
