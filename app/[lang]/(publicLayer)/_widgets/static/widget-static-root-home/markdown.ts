import { rootHomeWords } from "./words"

// Главная root для машин (markdown-копия страницы и llms-full.txt): заголовок и три карточки.
export function markdown(lang: string): string {
  const w = rootHomeWords(lang)
  if (!w) return ""
  return [`# ${w.heading}`, "", ...w.cards.map((c) => `- **${c.title}** — ${c.text}`), ""].join("\n")
}
