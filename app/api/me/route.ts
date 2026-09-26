// @api tell the browser who is signed in and with which roles
import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/get-session"

// 🔒 ПОДДОМЕНЫ ЭТОГО ЖЕ САЙТА ЧИТАЮТ ОТВЕТ (шаг 312, 2026-09-26). Шапка элементов узла — data, config, design,
// blocks на `<id>.<хост сайта>` — спрашивает эту дверь из браузера: своей двери «кто вошёл» у них нет. Это чужой
// источник, и без заголовков CORS браузер прятал ответ — у вошедшего архитектора там всегда стояло «Войти», хотя
// ворота элементов пускали его по той же куке. Разрешён ровно `https://<поддомен>.<хост этого запроса>`: хост
// берётся из запроса, а не помнится, и чужой домен заголовков не получает.
function siblingOrigin(req: NextRequest): string | null {
  const origin = req.headers.get("origin")
  const host = (req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "").split(":")[0].trim().toLowerCase()
  if (!origin || !host) return null
  let url: URL
  try { url = new URL(origin) } catch { return null }
  if (url.protocol !== "https:" || !url.hostname.endsWith(`.${host}`)) return null
  return url.origin
}

function reply(req: NextRequest, body: unknown, status = 200) {
  const res = NextResponse.json(body, { status })
  res.headers.set("Vary", "Origin")
  const origin = siblingOrigin(req)
  if (origin) {
    res.headers.set("Access-Control-Allow-Origin", origin)
    res.headers.set("Access-Control-Allow-Credentials", "true")
  }
  return res
}

export async function GET(req: NextRequest) {
  const session = await getSession(req)
  if (!session) return reply(req, { error: "Unauthorized" }, 401)
  return reply(req, session)
}
