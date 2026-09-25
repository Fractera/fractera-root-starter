// ЗАПУСК СЕРВЕРА — САЙТ САМ ЗАБИРАЕТ НАСТРОЙКИ ПРОЕКТА (шаг 299-6).
//
// Элемент «Настройки проекта» никого не зовёт: сайт, решивший жить по его настройкам, спрашивает сам. При запуске —
// сразу (копия пишется до первых запросов); потом раз в минуту — своей же дверью `POST /api/settings/refresh` по петле,
// потому что сброс кэша страниц Next делает только внутри запроса. Опрос дешёвый: сравнивается отпечаток
// (`settings_version`), сами настройки берутся лишь при его смене. Элемент не ответил — остаётся прежняя копия.
// Элемента нет у узла (`CONFIG_SERVICE_URL` пуст) — опроса нет вовсе.
const EVERY_MS = 60_000

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return
  if (!process.env.CONFIG_SERVICE_URL?.trim()) return
  const { pullProjectSettings } = await import("./lib/project-settings")
  const r = await pullProjectSettings()
  if (r.ok) console.log(`[settings] настройки проекта: ${r.changed ? "получена новая копия" : "копия актуальна"} (${r.version})`)
  else console.warn(`[settings] элемент настроек не ответил: ${r.reason} — работаю по прежней копии`)

  const port = process.env.PORT?.trim()
  const key = process.env.SETTINGS_SECRET?.trim()
  if (!port || !key) return
  const timer = setInterval(() => {
    fetch(`http://127.0.0.1:${port}/api/settings/refresh`, {
      method: "POST",
      headers: { "x-settings-key": key },
      signal: AbortSignal.timeout(15_000),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((b) => { if (b?.changed) console.log(`[settings] настройки проекта изменились (${b.version}) — страницы обновлены`) })
      .catch(() => { /* сайт ещё не слушает порт или элемент молчит — следующая попытка через минуту */ })
  }, EVERY_MS)
  timer.unref()
}
