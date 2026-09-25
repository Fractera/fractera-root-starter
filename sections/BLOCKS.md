# Каталог видов секций

> **Файл порождается.** `npm run build:blocks-map`; свежесть стережёт `check:blocks-map` в
> `prebuild`. Правки руками теряются при первом же порождении — правьте типы и карточки.

**КОД — ТО, ЧЕМ ВЛАДЕЛЕЦ НАЗЫВАЕТ БЛОК.** Он видит его на витрине блоков и говорит: «собери секцию
из `quote01` и `workspace02`». Найди строку по коду и возьми поля образца из неё — этого хватает,
чтобы собрать секцию, не открывая ни одного рендерера.

🔒 **Код указывает на ОБРАЗЕЦ, а не на вид, и разница существенна.** У одного вида образцов бывает
несколько: `workspace01` — рабочий экран без верхнего ряда разделов, `workspace02` — он же с рядом.
Вид один, настройки разные, и номер различает именно настройку. Сами образцы лежат в
`app/[lang]/(architectLayer)/architect/blocks/page-material/_data/specimen.ts` — открывать их нужно только тогда,
когда полей из этой таблицы не хватило.

🔒 **Не путать с числовым `id`** (`0015`) из `SECTIONS.json`: это внутренний ключ панели, и языком
общения он не является. Решение владельца 2026-08-30.

Сводка нужна в момент ВЫБОРА вида: она отвечает, что вообще есть, и не заставляет открывать
двадцать девять рендереров. Но она не заменяет карточку: **каталог говорит, что вид СУЩЕСТВУЕТ,
и только карточка говорит, что он выдержит** — сколько элементов, что ломается за пределом, когда
его не брать. Есть карточка — прочти её перед использованием.

Видов: **63** · рендереров: **62** · карточек: **37**

| Код | Вид | Семейство | Что это | Поля | Правила владельца |
|---|---|---|---|---|---|
| — | `p` | Page material | — | text: string | — |
| — | `h2` | Page material | — | text: string | — |
| — | `h3` | Page material | — | text: string; id?: string | — |
| — | `h4` | Page material | — | text: string | — |
| — | `h5` | Page material | — | text: string | — |
| — | `quote` | Page material | — | text: string; cite?: string; lead?: string | — |
| — | `list` | Page material | — | items: string[] | — |
| — | `olist` | Page material | — | items: string[] | — |
| — | `figure` | Page material | картинка или видео с подписью | media: 'image' \| 'video'; src: string; alt: string; caption?: string; href?: string | [карточка](blocks/figure.md) |
| — | `code` | Page material | — | text: string | — |
| — | `note` | Page material | — | text: string | — |
| — | `cta` | Page material | призыв к действию | text?: string; href: string; label: string; secondary?: { href: string; label: string } | [карточка](blocks/cta.md) |
| — | `callout` | Page material | — | title: string; text: string | — |
| — | `table` | Page material | — | headers: string[]; rows: string[][]; caption?: string | — |
| — | `docref` | Page material | — | title: string; summary: string; href: string; label?: string; kicker?: string | — |
| — | `founder` | Testimonials and social proof | the owner's quote, signed from settings | text: string | [карточка](blocks/founder.md) |
| — | `columns` | Page material | — | children: Block[]; cols?: 2 \| 3 | — |
| — | `group` | Page material | — | children: Block[] | — |
| — | `heroBadge` | Hero | the mark and the eyebrow above the title | pill?: string | [карточка](blocks/heroBadge.md) |
| — | `heroSplit` | Hero | the landing first screen: words left, picture right | title: string; description: string; pill?: string; image: 'homePage' \| 'agiNode'; imageAlt: string; diagram?: { core: string; ring: [string, string, string, string]; peers: string }; mark?: boolean; cta?: { href: string; label: string; secondary?: { href: string; label: string } } | [карточка](blocks/heroSplit.md) |
| — | `heroCentered` | Hero | the centered first screen: glow, badge, two-line title, three steps | title: string; description: string; pill?: string; cta?: { href: string; label: string; secondary?: { href: string; label: string } }; steps?: [{ title: string; text: string }, { title: string; text: string }, { title: string; text: string }] | [карточка](blocks/heroCentered.md) |
| — | `badges` | Benefits and value | a row of capability labels | items: BadgeItem[] | [карточка](blocks/badges.md) |
| — | `panel` | Page material | — | tone?: 'plain' \| 'warn' \| 'accent'; eyebrow?: string; title: string; children: Block[] | — |
| — | `metrics` | Trust and logos | the numbers that prove it | items: { value: string; label: string }[] | [карточка](blocks/metrics.md) |
| — | `flow` | How it works | how it works, step by step | badge?: string; title: string; note?: string; steps: [FlowStep, FlowStep, FlowStep] }; \| { kind: 'personaCases'; badge?: string; title: string; note?: string; personas: [Persona, Persona, Persona] }; \| { kind: 'statement'; text: string }; \| { kind: 'invite'; href: string; label: string }; \| {; title?: string; note?: string; cols?: 2 \| 3; items: { title: string; text: string; href?: string; linkLabel?: string }[] | [карточка](blocks/flow.md) |
| — | `personaCases` | Page material | one deal, told three times | badge?: string; title: string; note?: string; personas: [Persona, Persona, Persona] }; \| { kind: 'statement'; text: string }; \| { kind: 'invite'; href: string; label: string }; \| {; title?: string; note?: string; cols?: 2 \| 3; items: { title: string; text: string; href?: string; linkLabel?: string }[] | [карточка](blocks/personaCases.md) |
| — | `problemSolution` | Comparison | cases on the left, the chosen one broken down on the right | badge?: string; title: string; note?: string; demandLabel: string; answerLabel: string; items: { title: string; demand: string; answer: string }[] }; \| { kind: 'flow'; badge?: string; title: string; note?: string; steps: [FlowStep, FlowStep, FlowStep] }; \| { kind: 'personaCases'; badge?: string; title: string; note?: string; personas: [Persona, Persona, Persona] }; \| { kind: 'statement'; text: string }; \| { kind: 'invite'; href: string; label: string }; \| {; title?: string; note?: string; cols?: 2 \| 3; items: { title: string; text: string; href?: string; linkLabel?: string }[] | [карточка](blocks/problemSolution.md) |
| — | `cards` | Benefits and value | a section made of cards | badge?: string; title: string; note?: string; cols?: 2 \| 3; children: Block[] | [карточка](blocks/cards.md) |
| — | `card` | Page material | — | tone?: Tone; children: Block[] | — |
| — | `statement` | Page material | крупное утверждение в разрядку | text: string | [карточка](blocks/statement.md) |
| — | `invite` | Page material | приглашение в пунктирной рамке | href: string; label: string | [карточка](blocks/invite.md) |
| — | `noBill` | Pricing and plans | the invoices that will not come | badge?: string; heading: string; note?: string; items: { vendor: string; text: string; badge: BadgeItem }[]; title: string; text: string; cta?: { page: 'm2m' } | [карточка](blocks/noBill.md) |
| — | `faq` | Page material | questions and answers, last on the page | title?: string; items: FaqPair[] | [карточка](blocks/faq.md) |
| — | `toc` | Page material | the table of contents of a page | items: TocItem[] | [карточка](blocks/toc.md) |
| — | `languageMarquee` | Trust and logos | the language ribbon, closing the page | title: string; note?: string | [карточка](blocks/languageMarquee.md) |
| — | `projectTypeMarquee` | Trust and logos | the ribbon of directions | title?: string; note?: string | [карточка](blocks/projectTypeMarquee.md) |
| — | `voiceField` | Page material | a text field that can be dictated | variant?: 'line' \| 'area'; title: string; hint?: string; comment?: string; placeholder?: string | [карточка](blocks/voiceField.md) |
| — | `workspace` | Workspace | рабочий экран | menuTitle?: string; menu: WorkspaceItem[]; title: string; lead?: string; notes?: WorkspaceNote[]; tabs?: WorkspaceItem[]; children: Block[]; widget?: import('react').ReactNode | [карточка](blocks/workspace.md) |
| — | `accordion` | Page material | раскрывающиеся полосы | title?: string; lead?: string; capped?: boolean; cards?: boolean; children: Block[] | [карточка](blocks/accordion.md) |
| — | `accordionItem` | Page material | — | summary: string; open?: boolean; details?: { title: string; children: Block[] }; children: Block[] | — |
| — | `benefitCards` | Benefits and value | карточки возможностей со ссылкой | title?: string; note?: string; cols?: 2 \| 3; items: { title: string; text: string; href?: string; linkLabel?: string }[] | [карточка](blocks/benefitCards.md) |
| — | `splitPair` | Product in action | — | title?: string; note?: string; left: { image?: string; alt?: string; title: string; text: string }; right: { image?: string; alt?: string; title: string; text: string } | — |
| — | `logoCards` | Cases and portfolio | — | title?: string; note?: string; items: { title: string; text: string; source?: string }[] | — |
| — | `carousel` | How it works | — | title?: string; note?: string; slides: { image?: string; alt?: string; title: string; text?: string }[] | — |
| — | `support` | Pricing and plans | поддержка проекта: ряд тарифов со звёздочками | badge?: string; title: string; body?: string[]; tiers: {; amount: string; period?: string; sublabel: string; badge?: string; perks: string[]; cta?: { href: string; label: string }; }[]; note?: string; link?: { label: string; text: string; href: string } | [карточка](blocks/support.md) |
| — | `showcaseCarousel` | Use cases | — | badge?: string; title?: string; note?: string; slides: {; image?: string; label: string; sublabel: string; title: string; description: string; }[] | — |
| — | `featureGrid` | Benefits and value | — | badge?: string; title?: string; note?: string; items: { icon?: FeatureIcon; title: string; label?: string; tone?: Tone; text: string }[] | — |
| — | `promoBand` | Trust and logos | полоса с текстом слева и картинкой справа | title: string; text: string; cta?: { href: string; label: string; icon?: 'github' \| 'link' }; image?: string; alt?: string | [карточка](blocks/promoBand.md) |
| — | `priceTable` | Pricing and plans | тарифы с переключателем периода | title: string; note?: string; periodLabels?: { monthly: string; yearly: string }; plans: {; name: string; monthlyPrice: string; yearlyPrice?: string; monthlyPeriod?: string; yearlyPeriod?: string; features: string[]; cta?: { href: string; label: string }; highlighted?: boolean; }[] | [карточка](blocks/priceTable.md) |
| — | `spotlightPair` | Comparison | пара, между которой ходит подсветка | badge?: string; title?: string; note?: string; left: SpotlightHalf; right: SpotlightHalf | [карточка](blocks/spotlightPair.md) |
| — | `platformGrid` | Benefits and value | сетка площадок, светящаяся из щелей | badge?: string; title: string; note?: string; cards: { title: string; subtitle: string; company?: string }[]; disclaimer?: string | [карточка](blocks/platformGrid.md) |
| — | `chartArea` | Charts | область: как менялось целое и из чего оно состояло | title: string; description?: string; rows?: ChartRow[]; labels?: { a?: string; b?: string }; ranges?: ChartRange[] | [карточка](blocks/chartArea.md) |
| — | `chartBar` | Charts | столбцы: сравнить величины поточечно | title: string; description?: string; rows?: ChartRow[]; labels?: { a?: string; b?: string } | [карточка](blocks/chartBar.md) |
| — | `chartLine` | Charts | линия: увидеть форму движения | title: string; description?: string; rows?: ChartRow[]; labels?: { a?: string; b?: string } | [карточка](blocks/chartLine.md) |
| — | `chartPie` | Charts | круговая: из чего состоит целое | title: string; description?: string; shares?: ChartShareRow[]; footer?: { note?: string; hint?: string } | [карточка](blocks/chartPie.md) |
| — | `chartRadar` | Charts | лепестковая: профиль по нескольким мерам | title: string; description?: string; rows?: ChartRow[]; labels?: { a?: string; b?: string }; footer?: { note?: string; hint?: string } | [карточка](blocks/chartRadar.md) |
| — | `chartRadial` | Charts | радиальные полосы: доля и её величина сразу | title: string; description?: string; shares?: ChartShareRow[]; footer?: { note?: string; hint?: string } | [карточка](blocks/chartRadial.md) |
| — | `chartTooltip` | Charts | подсказка, видимая без наведения | title: string; description?: string; rows?: ChartRow[]; labels?: { a?: string; b?: string }; openAt?: number | [карточка](blocks/chartTooltip.md) |
| — | `orbitLayers` | Product in action | орбита: четыре опоры как одна конструкция | badge?: string; title: string; accent?: string; lead?: string; core?: FeatureIcon; cards: [OrbitLayerCard, OrbitLayerCard, OrbitLayerCard, OrbitLayerCard] | [карточка](blocks/orbitLayers.md) |
| — | `chat` | Workspace | `chat` — переписка как секция страницы | title?: string; note?: string; size?: 'compact' \| 'tall'; messages: ChatBlockMessage[] | [карточка](blocks/chat.md) |
| — | `servicePort` | Page material | — | serviceId: string; words: import('@/components/services/service-port.i18n').ServicePortWords | — |
| — | `authGoogleSetup` | Page material | — | words: import('@/components/auth/google-setup.i18n').GoogleSetupWords | — |
| — | `authResendSetup` | Page material | — | words: import('@/components/auth/resend-setup.i18n').ResendSetupWords | — |

## Чего в этой таблице нет

**Вместимости.** Сколько карточек влезает в `cards`, сколько чисел в `metrics`, что происходит с
неполным рядом — этого из типа не видно, потому что тип принимает массив любой длины, а сетка
рассчитана на кратность. Это живёт в карточке вида, и там же живут правила владельца, сказанные
по конкретному поводу.

**Карточка рождается, когда о виде что-то узнали** — обычно когда владелец поправил внешность и
объяснил почему. Пустая карточка, написанная ради полноты таблицы, не учит никого.
