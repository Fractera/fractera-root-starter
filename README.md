# Fractera Root — the site at the root of the node domain

A custom element. Since **v3.0.0** (node step 587, owner 2026-10-24: «мы сейчас удалим старый код, стартуем с кастомного шаблона, и
немного допишем логики и дизайна чтобы это был именно стартовый шаблон корня») it is the tree of the standard custom template
`fractera-custom-item-starter` v0.3.140 plus only three things of its own:
- **the home** — an AI agent first screen (`app/[lang]/(publicLayer)/_widgets/static/widget-static-root-home/`, its README): a pill to the
  Claude subscription, a heading, the ai-elements `PromptInput` with voice and three compact cards; the sent task survives sign-in and
  reaches the core (`app/api/first-task/route.ts` → the core's `/api/node/first-task`), where the main agent's terminal or Telegram bot
  takes it;
- **the starter banner** (`components/shell/starter-banner.client.tsx`) links to the core's «Passport → How it works» by `ARCHITECT_URL`
  and has a «Don't show again» box kept in `localStorage`;
- own files: passport id `root`, port 24683 (`NODE-CONTRACT.json`), this README, package name `fractera-root`.
Everything else must equal the template: a newer template version is brought over the same way (tree of the template + these files).
The project shell `/api/shell/<lang>` and menu `/api/menu/<lang>` that the other elements read are the template doors. Former versions
(v1.7.36 pages, v2.x the bare template) stay in this repository's history.

---

## In the Fractera project

The site at the root of the node's domain. It is a custom element born from the standard custom template with nothing of its own, so it is the
place where your main site grows.

You can change it freely: it is your site. Open it in the core (left menu, root), go to Build and tell its agent what you need; the agent
edits `WEB4-ITEMS/user/root` and commits. The change goes live with Deploy in Build, Deployments. Two template doors of root are read by
other elements, the project shell `/api/shell/<lang>` and the menu `/api/menu/<lang>`; keep their requests and answers as they are.
To keep your site when the node is reinstalled, save it to your own GitHub repository in Build, GitHub.

# fractera-custom-item-starter

The reference starter template of a Fractera custom element (WEB4 ITEM). The node's button «Create WEB4 ITEM» births every new
custom element from it by a pinned tag. Native elements — the root ones of every node — have their own template, `fractera-native-item-starter`. This one is a mirror of the
standard custom element without anyone's data: the home page shows
one line, «Reference starter template», and the yellow starter sign says what to do next.

An element is a **replaceable element**, like the node's auth and data elements: its own repository, its own port, a pinned tag
in the node's `WEB4-ITEMS-REGISTRY/web4-items.json`.

## The contract a replacement must keep

- `OWN-SERVICE-PROPS/` — the passport, the element's main door (`GET /api/own-service-props`); `NODE-CONTRACT.json` — what the node needs to install it.
- The port comes from the `PORT` environment variable.
- `GET /api/health` answers 200 without a session.
- Sign-in only through the node's auth element; stored data only through the node's data element.
- Public pages stay static.

A repository that does not keep this contract is refused; the node does not bend to it.

## Run on its own

```
npm install
npm run build
PORT=24683 node .next/standalone/server.js
```

License: MIT.
