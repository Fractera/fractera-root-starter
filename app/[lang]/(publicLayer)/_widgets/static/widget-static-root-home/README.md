# widget-static-root-home — the home of root: an AI agent first screen (node step 587)

The home page of the root element. A pill to the Claude subscription in the core, a heading, the ai-elements `PromptInput` with voice
and a send button, and three compact cards under it. A click on a card selects it and puts its task above the field as a chip; the
text sent is the card's task plus the person's words.

## Where it lives
- `index.tsx` — the server part (prerendered): pill, heading, cards and field are in the HTML. The core address is `ARCHITECT_URL`.
- `root-prompt.client.tsx` — the island: card choice, voice (`useVoiceRecorder`), sending.
- `words.ts` — the words come from the page data `(publicLayer)/_data/<lang>.json` → `rootHome` (en and ru).
- `markdown.ts` — the same heading and cards for machines.

## How a task reaches the agent
1. Send without a session → the task is kept in this site's `localStorage` (`fractera:first-task`) → sign-in (the first person of the
   node becomes the architect) → back to this page.
2. With an architect session the island posts the task to this site's door `POST /api/first-task`; the door checks the architect role and
   passes the task to the core `POST /api/node/first-task` with the node key. The core keeps one task in `data/node/first-task.json`.
3. The page shows «Task accepted» with links to connect Claude Code and Telegram in the core. The terminal of the main agent or the
   Telegram bot then takes the task (core, step 587-5).

The browser alone cannot carry the task: the terminal and Telegram live on the core's address, and browser storage is per address.

## Changing it
Texts — `_data/en.json` and `_data/ru.json` (`rootHome`); the phrase «From idea to money 99% faster» on the full-stack card is the
owner's and stays as it is. Look — the classes in the two files; colours come from the Design tokens. No timers and no polling.

## Proven by
`completed-steps/587-3-4.md` in `/code` (headless Chrome with a real mouse; the doors with and without a session).
