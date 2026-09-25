// @api take fresh project settings from the settings element and refresh pages
import { timingSafeEqual } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

import { pullProjectSettings } from "@/lib/project-settings"

// ТОЛЧОК ЭЛЕМЕНТА «НАСТРОЙКИ ПРОЕКТА» (шаг 299-6).
//
// Элемент `config` после каждого сохранения зовёт эту дверь у всех элементов узла. Сайт сам спрашивает элемент
// (`pullProjectSettings`), записывает последнюю копию и сбрасывает кэш статических страниц и дверей оболочки —
// правка видна на следующей загрузке, без пересборки. Страницы остаются статическими (ISR): сброс кэша не делает
// их динамическими.
//
// 🔒 ТОЛЧОК НЕ НЕСЁТ НАСТРОЕК — ТОЛЬКО ПОВОД. Сайт берёт их сам, тем же ключом, что при запуске: одна дорога
// данных вместо двух, и чужой толчок с подделанным телом ничего не запишет.
// 🔒 КЛЮЧ, А НЕ РОЛЬ: элемент приходит без сессии посетителя. Ключ `SETTINGS_SECRET` общий у узла (установщик
// кладёт одно значение всем, кто его объявил). Ключа в окружении нет — дверь закрыта для всех.
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
  // Отказ элемента — не повод держать старый кэш страниц, но и не повод его сбрасывать: копия прежняя.
  if (!pulled.ok) return NextResponse.json(pulled, { status: 502 })

  if (pulled.changed) {
    // Всё дерево: настройки питают мету, JSON-LD, манифест, шапку и подвал каждой страницы.
    revalidatePath("/", "layout")
    revalidatePath("/[lang]", "layout")
    // Двери оболочки, из которых шапку и подвал рисуют остальные элементы узла.
    revalidatePath("/api/shell/[lang]", "page")
    revalidatePath("/api/menu/[lang]", "page")
  }
  return NextResponse.json({ ok: true, changed: pulled.changed, receivedAt: pulled.receivedAt })
}
