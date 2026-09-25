import type { FooterPageCell } from '@/lib/pages/footer-page'
import { itemsBlocks } from './items-list'

// Страница /items — общая идея AGI ITEMS (297; слово владельца 2026-09-25: «страница items будет рассказывать общую
// концепцию … каждый [элемент] рассказывает о себе»). Список элементов — `items.json`, один на меню и на страницу.
export const en: FooterPageCell = {
  eyebrow: 'Items',
  title: 'AGI ITEMS — the parts your project is made of',
  description: 'Every AGI ITEM is a separate service with its own repository, its own public page and its own protocols for programs and agents. The project is assembled from them.',
  keywords: 'AGI ITEM, microservice, sign-in, data, blocks, API, MCP, Fractera',
  blocks: [
    { kind: 'p', text: 'A project here is not one application that holds everything inside. It is assembled from AGI ITEMS: sign-in, data, page blocks — each one a separate service that can be added, replaced or removed. Back to [%SITE%](/en).' },
    { kind: 'h2', text: 'What every item has' },
    {
      kind: 'list',
      items: [
        '**Its own repository.** The code of the item lives apart and is installed into the node by a pinned version.',
        '**Its own public page.** Each item tells about itself on its own address — indexed by search engines and readable by agents.',
        '**Its own protocols.** Programs and agents reach an item through its API and MCP, not through someone else.',
        '**The design of the project.** An item inherits the theme, fonts and spacing of your site — it looks like one product.',
      ],
    },
    { kind: 'h2', text: 'Items of this project' },
    ...itemsBlocks('en'),
  ],
  faq: [
    { q: 'What is an AGI ITEM?', a: 'A separate service of the project with its own repository, public page and protocols. The project is assembled from such items.' },
    { q: 'Can I add an item of my own?', a: 'Yes: an item is a repository described by its passport. The node installs it by a pinned version next to the others.' },
    { q: 'What happens if one item stops?', a: 'Each item is a separate process: the others keep working. Only what that item alone does — for example sign-in — is unavailable meanwhile.' },
  ],
}
