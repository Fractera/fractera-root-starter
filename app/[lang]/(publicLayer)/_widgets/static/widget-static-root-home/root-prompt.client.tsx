"use client"

import { useEffect, useRef, useState } from "react"
import { CheckCircle2, X } from "lucide-react"
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
        className="[&_[data-slot=input-group]]:transition-colors hover:[&_[data-slot=input-group]]:border-primary/60 focus-within:[&_[data-slot=input-group]]:border-primary focus-within:[&_[data-slot=input-group]]:ring-2 focus-within:[&_[data-slot=input-group]]:ring-primary/30"
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
      <div data-block="bki2e" className="grid w-full gap-3 sm:grid-cols-3">
        {words.cards.map((c) => (
          <Button
            key={c.id}
            type="button"
            variant="outline"
            onClick={() => setCard(card === c.id ? null : c.id)}
            aria-pressed={card === c.id}
            data-root-card={c.id}
            className={cn(
              "h-auto flex-col items-start gap-1.5 rounded-xl bg-card p-4 text-left whitespace-normal transition-colors hover:border-primary/60",
              card === c.id ? "border-primary ring-2 ring-primary/30" : "border-border",
            )}
          >
            <span className="text-sm font-semibold text-foreground">{c.title}</span>
            <span className="text-xs leading-relaxed font-normal text-muted-foreground">{c.text}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
