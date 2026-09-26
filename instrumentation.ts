// ЗАПУСК СЕРВЕРА — ROOT ЗАБИРАЕТ НАСТРОЙКИ ПРОЕКТА У ЭЛЕМЕНТА CONFIG (шаг 299-6) И ПОДПИСЫВАЕТСЯ НА ЕГО СИГНАЛ (шаг 306).
//
// При запуске root спрашивает версию и, если она сменилась, забирает настройки (копия пишется до первых запросов). Затем
// подписывается: после сохранения архитектором CONFIG пришлёт «версия сменилась» на `/api/settings/changed`, и root
// заберёт настройки сам (`lib/settings-listener.ts`). Элемент не ответил — остаётся прежняя копия. Элемента нет у узла
// (`CONFIG_SERVICE_URL` пуст) — root живёт своими файлами.
// 🔒 Сигнал — решение владельца 2026-09-26 («заводи шаг, строим уведомление от CONFIG»). Действие только в ответ на
// сохранение человеком. 🪦 Опрос раз в минуту отменён владельцем 2026-09-25 и остаётся отменённым: таймеров здесь нет.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return
  if (!process.env.CONFIG_SERVICE_URL?.trim()) return
  const { pullProjectSettings } = await import("./lib/project-settings")
  const r = await pullProjectSettings()
  if (r.ok) console.log(`[settings] настройки проекта: ${r.changed ? "получена новая копия" : "копия актуальна"} (${r.version})`)
  else console.warn(`[settings] элемент настроек не ответил: ${r.reason} — работаю по прежней копии`)
  const { subscribeToConfig } = await import("./lib/settings-listener")
  const s = await subscribeToConfig("root")
  if (s.ok) console.log(`[settings] подписан на сигнал CONFIG: ${s.url}`)
  else console.warn(`[settings] подписка на сигнал CONFIG не удалась: ${s.reason}${"detail" in s && s.detail ? ` (${s.detail})` : ""} — правки дойдут при следующем запуске`)
}
