// ЗАПУСК СЕРВЕРА — ROOT ЗАБИРАЕТ НАСТРОЙКИ ПРОЕКТА У CONFIG (шаг 299-6) И ОФОРМЛЕНИЕ У ЭЛЕМЕНТА «ДИЗАЙН» (шаг 309) И
// ПОДПИСЫВАЕТСЯ НА СИГНАЛЫ ОБОИХ (шаги 306, 309).
//
// При запуске root спрашивает версию и, если она сменилась, забирает настройки (копия пишется до первых запросов), затем
// берёт оформление и кладёт его в свой DESIGN-CONFIG. После сохранения архитектором CONFIG или «Дизайн» пришлёт «версия
// сменилась» на `/api/settings/changed`, и root заберёт новое сам. Элемента нет у узла (переменная пуста) — root живёт
// своими файлами. Два источника не зависят друг от друга.
// 🔒 Сигналы — решения владельца 2026-09-26. Действие только в ответ на сохранение человеком. 🪦 Опрос раз в минуту отменён
// владельцем 2026-09-25 и остаётся отменённым: таймеров здесь нет.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return
  if (process.env.CONFIG_SERVICE_URL?.trim()) {
    const { pullProjectSettings } = await import("./lib/project-settings")
    const r = await pullProjectSettings()
    if (r.ok) console.log(`[settings] настройки проекта: ${r.changed ? "получена новая копия" : "копия актуальна"} (${r.version})`)
    else console.warn(`[settings] элемент настроек не ответил: ${r.reason} — работаю по прежней копии`)
    const { subscribeToConfig } = await import("./lib/settings-listener")
    const s = await subscribeToConfig("root")
    if (s.ok) console.log(`[settings] подписан на сигнал CONFIG: ${s.url}`)
    else console.warn(`[settings] подписка на сигнал CONFIG не удалась: ${s.reason}${"detail" in s && s.detail ? ` (${s.detail})` : ""} — правки дойдут при следующем запуске`)
  }
  if (process.env.DESIGN_SERVICE_URL?.trim()) {
    const { pullDesign, subscribeToDesign } = await import("./lib/design-follow")
    const d = await pullDesign()
    if (d.ok) console.log(`[design] оформление: ${d.changed ? "получено" : "актуально"}`)
    else console.warn(`[design] оформление не получено: ${d.reason} — работаю по своему DESIGN-CONFIG`)
    const ds = await subscribeToDesign("root")
    if (ds.ok) console.log(`[design] подписан на сигнал элемента «Дизайн»: ${ds.url}`)
    else console.warn(`[design] подписка не удалась: ${ds.reason}`)
  }
}
