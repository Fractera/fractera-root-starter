import type { Block } from '@/lib/content/blocks/types'
import LIST from './items.json'
import { publicAuth } from '@/lib/domain/public-auth.cjs'

// ОДИН СПИСОК AGI ITEMS — для страницы /items и для выпадающего меню «Items» (297). Адрес элемента — его публичная
// главная `https://<slug>.<зона>/<язык>` (главная любого AGI ITEM публичная); без подключённого домена адреса нет —
// тогда пункт ведёт к карточке на этой странице (якорь), а не в никуда.
type Item = { slug: string; title: Record<string, string>; text: Record<string, string> }
const ITEMS = (LIST as { items: Item[] }).items
const word = (m: Record<string, string>, lang: string) => m[lang] ?? m.en

export function itemHref(slug: string, lang: string): string {
  const pub = publicAuth(process.cwd())
  return pub ? `https://${slug}.${pub.zone}/${lang}` : `/${lang}/items#${slug}`
}

export function itemsMenu(lang: string): { slug: string; title: string; href: string }[] {
  return ITEMS.map((i) => ({ slug: i.slug, title: word(i.title, lang), href: itemHref(i.slug, lang) }))
}

export function itemsBlocks(lang: string): Block[] {
  // Под h2 страницы — h3 на каждый элемент (якорь = slug), абзац и кнопка на его публичную главную: h1 → h2 → h3.
  // Ссылка — кнопкой, а не внутри текста: адрес вычисляется из домена, а ссылки в тексте проверяются по исходнику.
  return ITEMS.flatMap((i): Block[] => [
    { kind: 'h3', text: word(i.title, lang), id: i.slug },
    { kind: 'p', text: word(i.text, lang) },
    { kind: 'cta', href: itemHref(i.slug, lang), label: `${word({ en: 'Open', ru: 'Открыть' }, lang)} — ${word(i.title, lang)}` },
  ])
}
