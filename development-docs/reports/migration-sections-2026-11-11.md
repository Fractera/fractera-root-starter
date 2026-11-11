# Migration «block → section» — 2026-11-11

Node step 717-2: one word, «section», for a designed part of a page; a section is one folder `components/sections/<kind>/`; a page's
list is `body`. «Block» keeps one meaning — the address of a container (`data-block`, `#block=`, `npm run blocks:ids`).
Script `scripts/migrate-sections.mjs`, map `scripts/migrate-sections.map.json`.

## Done (2)

- rewritten `app/[lang]/(publicLayer)/_data/en.json`
- rewritten `app/[lang]/(publicLayer)/_data/ru.json`

## For your eye (3)

Each line: change the sense «section» to «section» (in Russian «секция»), keep the address; a line that is right as it is stays.

- `app/[lang]/(publicLayer)/_data/en.json:32` — «block» left — the sense «section» becomes «section»; the address (`data-block`) stays: «"text": "From idea to money 99% faster. Sign-in, data, design and blocks are already in the node, so the agent builds only your product.",»
- `app/[lang]/(publicLayer)/_data/ru.json:32` — «block» left — the sense «section» becomes «section»; the address (`data-block`) stays: «"text": "От идеи до денег на 99% быстрее. Вход, данные, оформление и блоки уже есть в узле, поэтому агент строит только ваш продукт.",»
- `app/[lang]/(publicLayer)/_widgets/static/widget-static-root-home/root-prompt.client.tsx:210` — «block» left — the sense «section» becomes «section»; the address (`data-block`) stays: «котором если пользователь не участвует в прокрутке каждые 3 секунды карточки сдвигаются нижний блок с информации обновляется, при»

## Then

`npm run prebuild`, `npx tsc --noEmit`, the build, `npm run eyes` on a page with sections, one commit.
