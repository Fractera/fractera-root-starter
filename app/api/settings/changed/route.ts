// @api take the CONFIG signal that settings changed and refresh pages
// POST /api/settings/changed — сигнал CONFIG «версия сменилась» (шаг 306). Ключ узла в `X-Settings-Key`.
// Забирает настройки по MCP и, если они изменились, обновляет собранные страницы без пересборки (`revalidatePath`):
// страницы остаются статическими — сервер один раз перерисовывает их и дальше отдаёт готовый HTML.
// Модуль и правила — `lib/settings-listener.ts`.
import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { onSettingsSignal, signalKeyOk } from "@/lib/settings-listener"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  if (!signalKeyOk(req.headers.get("x-settings-key"))) return NextResponse.json({ ok: false, reason: "bad-key" }, { status: 401 })

  const pulled = await onSettingsSignal()
  if (!pulled.ok) {
    console.warn(`[settings] сигнал CONFIG: забрать не удалось — ${pulled.reason}`)
    return NextResponse.json(pulled, { status: pulled.reason === "no-config-element" ? 200 : 502 })
  }
  if (pulled.changed) {
    revalidatePath("/", "layout")
    revalidatePath("/[lang]", "layout")
    revalidatePath("/api/shell/[lang]", "page")
    revalidatePath("/api/menu/[lang]", "page")
  }
  console.log(`[settings] сигнал CONFIG: ${pulled.changed ? `новая копия ${pulled.version} — страницы обновлены` : "копия актуальна"}`)
  return NextResponse.json({ ok: true, changed: pulled.changed, version: pulled.version })
}
