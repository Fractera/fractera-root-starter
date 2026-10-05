import { readFileSync } from "fs"
import { join } from "path"

// АДРЕС САЙТА УЗЛА ДАЁТ УЗЕЛ, А НЕ НАСТРОЙКИ (шаг 396, владелец 2026-10-05: «да, строй 396»).
// ✗ Оплачено выводом `check:addresses` с Mac: узел на `aifa.dev`, а root называл себя `throughsongs.com` в robots, карте
// сайта и canonical — адрес приехал посевом шаблона (APP-CONFIG, 280-2a) и узлом не перекрывался. Правило то же, что у
// элемента (`fractera-item-starter` `lib/own-site.ts`, 324-5/394) и у двери узла preview-url (393): `domain.json` в папке
// данных (`url`), иначе корень зоны узла — `https://<hostname ?? zone>` из `NODE_DOMAIN_FILE`. У узла нет своего домена —
// `null`: остаётся `url` настроек (пустой — сайт закрыт для поиска, `app/robots.ts`).
const HOST = /^[a-z0-9.-]+$/

export function ownSiteUrl(): string | null {
  const dir = process.env.SERVICE_DATA_DIR?.trim()
  if (dir) {
    try {
      const url = (JSON.parse(readFileSync(join(dir, "domain.json"), "utf8")) as { url?: unknown }).url
      if (typeof url === "string" && /^https:\/\/[a-z0-9.-]+$/.test(url)) return url
    } catch { /* своего домена нет */ }
  }
  const file = process.env.NODE_DOMAIN_FILE?.trim()
  if (!file) return null
  try {
    const d = JSON.parse(readFileSync(file, "utf8")) as { zone?: unknown; hostname?: unknown }
    const host = typeof d.hostname === "string" && HOST.test(d.hostname) ? d.hostname : d.zone
    return typeof host === "string" && HOST.test(host) ? `https://${host}` : null
  } catch {
    return null
  }
}
