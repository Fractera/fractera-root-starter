# widget-static-root-home — the home of root: an AI agent first screen (node steps 587, 649)

The home page of the root element. A pill to the Claude subscription in the core, a heading, the ai-elements `PromptInput` with voice
and a send button, and six compact cards under it, three in a row from `lg`: the Web4 swarm, the full-stack app, the app factory, the integrator (649-2), the content factory and own agents (658-3). A click on a card selects it and puts its task above the field as a chip; the
text sent is the card's task plus the person's words.

## Where it lives
- `index.tsx` — the server part (prerendered): pill, heading, cards and field are in the HTML. The core address is `ARCHITECT_URL`.
- `root-prompt.client.tsx` — the island: card choice, voice (`useVoiceRecorder`), sending.
- `root-reply.client.tsx` — what the island shows once the core has the task: the person's message, the typed reply, «Continue» (665).
- `words.ts` — the words come from the page data `(publicLayer)/_data/<lang>.json` → `rootHome` (en and ru).
- `markdown.ts` — the same heading and cards for machines.

## How a task reaches the agent
1. Send without a session → the task is kept in this site's `localStorage` (`fractera:first-task`) → sign-in (the first person of the
   node becomes the architect) → back to this page.
2. With an architect session the island posts the task to this site's door `POST /api/first-task`; the door checks the architect role and
   passes the task to the core `POST /api/node/first-task` with the node key. The core keeps one task in `data/node/first-task.json`.
3. The page shows the sent text as the person's message and a reply under it, typed out like a model's stream but with no model at all
   (step 665, the owner's words in `rootHome.reply`): the request goes to development right after the Claude Code sign-in. «Continue»
   opens the core's subscription page (`/build/subscription`); there is no timer that navigates by itself, and «reduce motion» shows the
   whole reply at once. The terminal of the main agent or the Telegram bot then takes the task (core, step 587-5).

The browser alone cannot carry the task: the terminal and Telegram live on the core's address, and browser storage is per address.

## Width
The column carries `data-app-column`: 80rem, 64rem when the footer's width button is pressed, the whole screen on a phone
(`styles/globals.css`). The field keeps `max-w-3xl`; the cards (three in a row from `lg` — two rows, two from `sm`) and the story under them follow
the column. A number for the column's width is caught by `check-layout` (`bare-widget-without-column`, step 649-1).

## Changing it
Texts — `_data/en.json` and `_data/ru.json` (`rootHome`); the phrase «From idea to money 99% faster» on the full-stack card is the
owner's and stays as it is. Look — the classes in the two files; colours come from the Design tokens. No timers and no polling.

## Proven by
`completed-steps/587-3-4.md` in `/code` (headless Chrome with a real mouse; the doors with and without a session).
