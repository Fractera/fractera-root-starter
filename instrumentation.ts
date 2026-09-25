// ЗАПУСК СЕРВЕРА — ROOT ЗАБИРАЕТ НАСТРОЙКИ ПРОЕКТА У ЭЛЕМЕНТА CONFIG (шаг 299-6).
//
// Элемент CONFIG никого не зовёт: root, решивший жить по его настройкам, спрашивает сам — ОДИН РАЗ, при запуске
// (копия пишется до первых запросов). Элемент не ответил — остаётся прежняя копия. Элемента нет у узла
// (`CONFIG_SERVICE_URL` пуст) — root живёт своими файлами.
// 🪦 Опрос раз в минуту отменён владельцем 2026-09-25: «Отменить свою инициативу на уровне инструкции запретить
// подобное поведение» — это было изобретение агента, а не заказ. Самообновление без действия человека не строится.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return
  if (!process.env.CONFIG_SERVICE_URL?.trim()) return
  const { pullProjectSettings } = await import("./lib/project-settings")
  const r = await pullProjectSettings()
  if (r.ok) console.log(`[settings] настройки проекта: ${r.changed ? "получена новая копия" : "копия актуальна"} (${r.version})`)
  else console.warn(`[settings] элемент настроек не ответил: ${r.reason} — работаю по прежней копии`)
}
