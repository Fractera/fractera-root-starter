"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Message, MessageContent } from "@/components/ai-elements/message"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ОТВЕТ ГЛАВНОЙ ROOT ПОСЛЕ ОТПРАВКИ (узел, шаг 665). Владелец 2026-11-06: «после того как пользователь выбрал соответствующую кнопку и
// добавил описание например он сказал я хочу агента тренера, и нажал кнопку отправить ты выводишь информацию которая не использует
// никакой искусственный интеллект, просто анимировано как будто идёт стрим ты пишешь соответствии от того какой язык пользователя
// установлен … Кнопка: продолжить (переадресация на вход в подписку)».
// 🔒 Модели здесь нет: слова — из данных главной (`rootHome.reply`), «поток» — печать кусками по 2–5 знаков, как приходят токены.
// 🔒 Задание к этому моменту уже лежит в ядре (`/api/first-task` → `data/node/first-task.json`); его берёт первая сессия главного агента
// после входа в Claude Code (узел, 587-5) — поэтому слова «будет отправлен сразу после авторизации» правдивы.
// 🔒 Переход — только по нажатию «Продолжить»: таймера перехода нет. «Меньше движения» — текст и кнопка сразу. Читалка экрана получает
// весь текст одной строкой, а не каждый кусок печати.

const TICK_MS = 28

export function RootReply({ task, text, cta, href }: { task: string; text: string; cta: string; href: string }) {
  const [shown, setShown] = useState(0)
  const still = useRef<boolean | null>(null)

  useEffect(() => {
    if (still.current === null) still.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (shown >= text.length) return
    if (still.current) { setShown(text.length); return }
    const t = window.setTimeout(() => setShown((n) => Math.min(text.length, n + 2 + Math.floor(Math.random() * 4))), TICK_MS)
    return () => window.clearTimeout(t)
  }, [shown, text])

  const done = shown >= text.length
  return (
    <div data-block="w5k8d" className="mx-auto flex w-full max-w-3xl flex-col gap-5" data-root-home="accepted">
      <Message data-block="w5k8e" from="user">
        <MessageContent className="text-base whitespace-pre-wrap">{task}</MessageContent>
      </Message>
      <Message data-block="w5k8f" from="assistant" data-root-reply={done ? "done" : "typing"}>
        <MessageContent className="text-base leading-7">
          <p data-block="w5k8g" className="sr-only">{text}</p>
          <p data-block="w5k8h" aria-hidden>
            {text.slice(0, shown)}
            {/* Курсор печати неподвижен: «поток» виден по растущему тексту (сторож shadcn: пульсация — только у Skeleton). */}
            {done ? null : <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 rounded-sm bg-primary/80" />}
          </p>
        </MessageContent>
      </Message>
      {done ? (
        <a
          href={href}
          data-root-continue
          className={cn(buttonVariants(), "animate-in fade-in slide-in-from-bottom-1 duration-300 motion-reduce:animate-none self-start")}
        >
          {cta}
          <ArrowRight aria-hidden className="size-4" />
        </a>
      ) : null}
    </div>
  )
}
