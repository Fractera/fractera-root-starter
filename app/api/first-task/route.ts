// @api hand the first task from the root home to the core
import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/get-session"
import { coreUrl } from "@/lib/a2a/log"

// ПЕРВОЕ ЗАДАНИЕ С ГЛАВНОЙ ROOT (узел, шаг 587-4). Владелец 2026-10-24: «Отправленные сообщения нужно запомнить в каком-то состоянии …
// если пользователь авторизуется в Claude Code Agent а затем придёт терминал … подставить её как в техническое задание».
// Дверь сайта принимает задание только от архитектора узла и передаёт его ядру по петле с ключом узла (`SETTINGS_SECRET` →
// `X-Node-Key`): адрес ядра для браузера другой, и его хранилище задание не увидит. Ядро хранит одно задание.

export const dynamic = "force-dynamic"

const HEADERS = { "Cache-Control": "no-store" }
const MAX = 4000

export async function POST(req: NextRequest) {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ ok: false, error: "sign in first" }, { status: 401, headers: HEADERS })
  if (!session.roles.includes("architect")) {
    return NextResponse.json({ ok: false, error: "only the architect of this node" }, { status: 403, headers: HEADERS })
  }
  const body = (await req.json().catch(() => null)) as { text?: unknown } | null
  const text = typeof body?.text === "string" ? body.text.trim().slice(0, MAX) : ""
  if (!text) return NextResponse.json({ ok: false, error: "empty task" }, { status: 400, headers: HEADERS })
  const core = coreUrl()
  const key = process.env.SETTINGS_SECRET ?? ""
  if (!core || !key) return NextResponse.json({ ok: false, error: "the core is unknown here" }, { status: 503, headers: HEADERS })
  const r = await fetch(`${core}/api/node/first-task`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Node-Key": key },
    body: JSON.stringify({ text, from: session.email }),
    signal: AbortSignal.timeout(10000),
  }).catch(() => null)
  if (!r?.ok) return NextResponse.json({ ok: false, error: "the core did not take the task" }, { status: 502, headers: HEADERS })
  return NextResponse.json({ ok: true }, { headers: HEADERS })
}
