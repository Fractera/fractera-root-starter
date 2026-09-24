import "server-only"
import { getMenuGroups, type MenuGroup } from "@/lib/menu/group-menus"
import { navGroupsFromConfig, defaultFooterGroups } from "@/lib/menu/nav-config"
import { featureOn } from "@/config/platform-config"
import { topMenuUi } from "@/components/menu/top/top-menu.i18n"

// МЕНЮ ПРОЕКТА — ОДНО НА ВСЕ СЛУЖБЫ УЗЛА (шаг 283-1).
//
// Слово владельца 2026-09-24: «на всю глубину проекта все сервисы используют одно и то же меню и сайт и
// авторизация и дата и все те новые которые будут появляться». Меню — настройка САЙТА (элемент root): здесь
// оно собирается ровно так, как его рисует шапка сайта, и этим же отдаётся дверью `/api/menu/<язык>` всем
// остальным службам. Две копии логики разошлись бы в первый же день правки.
//
// 🔒 ЗАГЛУШКИ — ЧАСТЬ МЕНЮ, И ОНИ СОХРАНЯЮТСЯ (слово владельца 2026-09-24: «сохрани кнопки заглушки … мы
// отдельно шагами их добавляли»): Store за Core, A2A за AGI (277), Nostr и Блог в конце (261-6).

/** Верхнее меню так, как его рисует шапка. */
export function resolveTopGroups(lang: string): MenuGroup[] {
  const menuOn = featureOn("topMenu")
  const fromConfig = menuOn ? navGroupsFromConfig("top", lang) : null
  const baseGroups = menuOn ? (fromConfig ?? getMenuGroups("top", lang)) : []
  if (!menuOn) return baseGroups
  const ui0 = topMenuUi(lang)
  // Встают ВПЛОТНУЮ за своим соседом, а не по `order`: меню выводится в порядке массива. Соседа нет —
  // кнопка встаёт перед Nostr, а не пропадает молча.
  const reserved = (slug: string, label: string): MenuGroup =>
    ({ slug, label, order: 0, childrenAsDropdown: false, roles: "public", children: [], inert: true })
  const after: Record<string, MenuGroup> = {
    core: reserved("store", ui0.store),
    "agi-item": reserved("a2a", ui0.a2a),
  }
  const placed = baseGroups.flatMap((g) => (after[g.slug] ? [g, after[g.slug]] : [g]))
  const orphans = Object.keys(after).filter((s) => !baseGroups.some((g) => g.slug === s)).map((s) => after[s])
  return [
    ...placed,
    ...orphans,
    { slug: "nostr", label: ui0.nostr, order: 50, childrenAsDropdown: false, roles: "public", children: [], inert: true },
    { slug: "blog", label: ui0.blog, order: 60, childrenAsDropdown: false, roles: "public", children: [], inert: true },
  ]
}

/** Группы подвала так, как их рисует подвал: пусто, пока страницы подвала не включены в панели. */
export function resolveFooterGroups(lang: string): MenuGroup[] {
  const pagesOn = featureOn("footerPages")
  const fromConfig = pagesOn ? navGroupsFromConfig("footer", lang) : null
  return pagesOn ? (fromConfig ?? [...defaultFooterGroups(lang), ...getMenuGroups("footer", lang)]) : []
}
