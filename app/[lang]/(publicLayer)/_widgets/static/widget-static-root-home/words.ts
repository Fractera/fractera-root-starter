import { branchRoot } from "@/lib/page-tree"

// Слова главной root (узел, шаг 587-3) — из данных главной (`(publicLayer)/_data/<язык>.json` → `rootHome`). Слов в коде нет: язык без
// своего файла получает английский, как вся страница.

export type RootHomeCard = { id: string; title: string; text: string; task: string }
export type RootHomeWords = {
  pill: string
  heading: string
  /** Одна строка под заголовком, до 20 слов (навык taste, «hero stack discipline»). */
  sub: string
  placeholder: string
  send: string
  chosen: string
  clear: string
  cards: RootHomeCard[]
  accepted: { title: string; text: string; claude: string; telegram: string }
  notArchitect: string
  failed: string
}

export function rootHomeWords(lang: string): RootHomeWords {
  const root = branchRoot("(publicLayer)")
  const en = (root?.en as { rootHome?: RootHomeWords } | undefined)?.rootHome
  const own = (root?.overrides[lang] as { rootHome?: RootHomeWords } | undefined)?.rootHome
  return (own ?? en) as RootHomeWords
}
