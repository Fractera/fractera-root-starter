// @api take fresh project settings from the settings element and refresh pages
import { timingSafeEqual } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

import { pullProjectSettings } from "@/lib/project-settings"

// ОБНОВИТЬ НАСТРОЙКИ ПРОЕКТА — СОБСТВЕННАЯ ДВЕРЬ САЙТА (шаг 299-6).
//
// Её зовёт опрос самого сайта раз в минуту (`instrumentation.ts`, по петле) — элемент настроек никого не зовёт. Дверь
// спрашивает элемент по MCP (`pullProjectSettings`); отпечаток сменился — пишет последнюю копию и сбрасывает кэш
// статических страниц и дверей оболочки: правка видна на следующей загрузке, без пересборки. Страницы остаются
// статическими (ISR). Почему дверь, а не прямой вызов из таймера: сброс кэша Next работает только внутри запроса.
//
// 🔒 КЛЮЧ, А НЕ РОЛЬ: `SETTINGS_SECRET` узла. Ключа в окружении нет — дверь закрыта для всех.
export const dynamic = "force-dynamic"

function keyOk(req: NextRequest): boolean {
  const expected = process.env.SETTINGS_SECRET ?? ""
  const given = req.headers.get("x-settings-key") ?? ""
  if (!expected || given.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(given), Buffer.from(expected))
}

export async function POST(req: NextRequest) {
  if (!keyOk(req)) return NextResponse.json({ ok: false, reason: "bad-key" }, { status: 401 })

  const pulled = await pullProjectSettings()
  // Элемент не ответил — копия прежняя, кэш страниц не трогаем.
  if (!pulled.ok) return NextResponse.json(pulled, { status: pulled.reason === "no-config-element" ? 200 : 502 })

  if (pulled.changed) {
    // Всё дерево: настройки питают мету, JSON-LD, манифест, шапку и подвал каждой страницы.
    revalidatePath("/", "layout")
    revalidatePath("/[lang]", "layout")
    // Двери оболочки, из которых шапку и подвал рисуют остальные элементы узла.
    revalidatePath("/api/shell/[lang]", "page")
    revalidatePath("/api/menu/[lang]", "page")
  }
  return NextResponse.json({ ok: true, changed: pulled.changed, version: pulled.version })
}
