// Без `import "server-only"`: модуль зовёт и `instrumentation.ts`, где условия react-server нет. В браузер его не
// пустит `fs` — клиентская сборка упадёт на импорте.
import { readFileSync, writeFileSync, renameSync, mkdirSync, unlinkSync, existsSync } from "fs"
import { join, dirname } from "path"

// НАСТРОЙКИ ПРОЕКТА ПРИХОДЯТ ОТ ЭЛЕМЕНТА «НАСТРОЙКИ ПРОЕКТА» (шаг 299-6, 2026-09-25).
//
// Слово владельца: «весь CONFIG сгруппировать в отдельный AGI ITEM … в нём и шапка и подвал и данные конфигурации».
// Решения владельца (APP · PLATFORM · DESIGN) живут у элемента `config`; сайт — их потребитель.
//
// 🔒 ПОСЛЕДНЯЯ ПОЛУЧЕННАЯ КОПИЯ — ФАЙЛ, А НЕ ПАМЯТЬ ПРОЦЕССА. Элемент недоступен (выключен, пересобирается) —
// сайт работает по копии и не теряет шапку; перезапуск сайта копию не стирает. Копия лежит в папке данных элемента
// у узла (`SERVICE_DATA_DIR`), а не рядом с кодом: собранный сервер работает из папки сборки, и относительный путь
// ушёл бы внутрь неё — следующая сборка стёрла бы копию (тот же класс, что база входа 260-1 и DESIGN-CONFIG 280-6).
//
// 🔒 ЧИТАТЕЛИ ОСТАЮТСЯ СИНХРОННЫМИ. `getAppConfig` / `getPlatformConfig` / `getDesignConfig` зовут десятки мест;
// они читают копию с диска так же, как раньше читали свой файл. Сеть трогают только две вещи: толчок элемента
// (`POST /api/settings/refresh`) и запуск сервера (`instrumentation.ts`).
//
// 🔒 В КОПИИ — ТОЛЬКО РЕШЕНИЯ ВЛАДЕЛЬЦА (`patches`), БЕЗ УМОЛЧАНИЙ ЭЛЕМЕНТА: они ложатся поверх умолчаний САЙТА,
// и «владелец не высказывался» остаётся отличимым от «выбрал то же, что по умолчанию» (`featureDecided`).
// Нет копии — действуют собственные файлы сайта (`APP-CONFIG/…`): это посев, из которого элемент когда-то заполнился.

export type SettingsKind = "app" | "platform" | "design"
const KINDS: SettingsKind[] = ["app", "platform", "design"]

type Copy = { receivedAt: string; from: string; patches: Record<SettingsKind, Record<string, unknown>> }

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v)

export function projectSettingsCopyPath(): string {
  const dir = process.env.SERVICE_DATA_DIR?.trim() || join(process.cwd(), "data")
  return join(dir, "project-settings.json")
}

function readCopy(): Copy | null {
  try {
    const raw = JSON.parse(readFileSync(projectSettingsCopyPath(), "utf8")) as Copy
    return isObj(raw) && isObj(raw.patches) ? raw : null
  } catch {
    return null
  }
}

/**
 * Решения владельца одного вида из последней копии, или `null` — копии нет (элемент ещё ни разу не ответил).
 * `null` значит «читай свой файл», а пустой объект — «владелец ничего не менял»: это разные ответы.
 */
export function projectSettingsPatch(kind: SettingsKind): Record<string, unknown> | null {
  const copy = readCopy()
  if (!copy) return null
  const patch = copy.patches[kind]
  return isObj(patch) ? patch : {}
}

/** Когда и откуда пришла копия — для `/api/health` и отчёта двери обновления. */
export function projectSettingsCopyInfo(): { receivedAt: string; from: string } | null {
  const copy = readCopy()
  return copy ? { receivedAt: copy.receivedAt, from: copy.from } : null
}

export type PullResult =
  | { ok: true; changed: boolean; receivedAt: string }
  | { ok: false; reason: string; detail?: string }

/**
 * Спросить элемент и записать копию. Отказ ничего не стирает: прежняя копия остаётся действовать.
 * `changed` — отличаются ли новые решения от прежней копии (дверь обновления не сбрасывает кэш зря).
 */
export async function pullProjectSettings(): Promise<PullResult> {
  const base = process.env.CONFIG_SERVICE_URL?.trim().replace(/\/+$/, "")
  const key = process.env.SETTINGS_SECRET?.trim()
  // Элемента нет у этого узла — честный ответ, а не сбой: сайт живёт своими файлами.
  if (!base) return { ok: false, reason: "no-config-element" }
  if (!key) return { ok: false, reason: "no-settings-key" }

  let body: unknown
  try {
    const res = await fetch(`${base}/api/settings`, {
      headers: { "x-settings-key": key },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return { ok: false, reason: `http-${res.status}` }
    body = await res.json()
  } catch (err) {
    return { ok: false, reason: "unreachable", detail: err instanceof Error ? err.message : String(err) }
  }

  const patches = isObj(body) && isObj(body.patches) ? body.patches : null
  if (!patches || !KINDS.every((k) => isObj(patches[k]))) return { ok: false, reason: "bad-answer" }

  const before = readCopy()
  const changed = JSON.stringify(before?.patches ?? null) !== JSON.stringify(patches)
  const copy: Copy = { receivedAt: new Date().toISOString(), from: base, patches: patches as Copy["patches"] }

  const file = projectSettingsCopyPath()
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`
  try {
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(tmp, JSON.stringify(copy, null, 2) + "\n", "utf8")
    renameSync(tmp, file) // читатель никогда не видит полузаписанный файл
  } catch (err) {
    if (existsSync(tmp)) try { unlinkSync(tmp) } catch { /* уже нет */ }
    return { ok: false, reason: "write-failed", detail: err instanceof Error ? err.message : String(err) }
  }
  return { ok: true, changed, receivedAt: copy.receivedAt }
}
