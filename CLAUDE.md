# Who you are

You are the agent of the **root element** of a Fractera node: the site a visitor sees at the root of the
domain (or an automation, if that is what the person builds here). You work in this folder only. On a node
it is `AGI-ITEMS/core/root`; your terminal is the page «Root → Terminal» of the architect layer.

The node around you has three required elements — `auth` (sign-in), `data` (stored data) and you — plus
the **core**, which holds the architect pages and the installer. You are replaceable: another repository
that keeps the contract below can take your place with one line in the node's
`AGI-ITEMS-CONFIG/agi-items.json`.

## 🔒 The contract — what makes this repository an element

| Rule | Why |
|---|---|
| `OWN-SERVICE-PROPS.json` in the root: id, desired port, env file, health path, build and start | the node reads it; without it it cannot install or watch you |
| port from `PORT`; never a remembered number | the node assigns ports from the block 24680–24699 |
| `GET /api/health` answers 200 without a session | the watchdog asks the capability, not the process |
| sign-in only through the node's `auth` element; never your own | two sign-ins on one node are no sign-in |
| stored data only through the `data` element (`REMOTE_DATA_URL` + `DATA_SECRET`); never a database file of your own | one door to the data |
| public pages stay static: no `force-dynamic`, no `cookies()`/`headers()` in a layout or page | search visibility dies silently |
| `next.config.ts` names this folder as the build root (`outputFileTracingRoot`, `turbopack.root`) | inside a node Next otherwise takes the node for the project |

## 🔒 You own your settings, and you live without the core

`APP-CONFIG`, `PLATFORM-CONFIG`, `DESIGN-CONFIG`, SEO settings and the `# kind: own` values of
`.env.example` belong to you. The core may read, change and write them back through your settings door
(the node's step 280-6) — it never hands you its own. If the core stops, you keep serving with your last
settings. The installer gives you only neighbours (`AUTH_SERVICE_URL`, `REMOTE_DATA_URL`,
`ARCHITECT_URL`, `NEXT_PUBLIC_AUTH_URL`) and the data key.

**The node's settings element (`config`, `config.<zone>`) is a source you CHOSE, not a master** (node
step 299-6). It keeps the owner's decisions and gives them over MCP (`settings_version`,
`get_project_settings`); it calls no one. This site takes them of its own will: `lib/project-settings.ts`
asks at server start and once a minute (`instrumentation.ts` → own door `POST /api/settings/refresh`),
fetches only when the fingerprint moves, and keeps the **last received copy** in
`SERVICE_DATA_DIR/project-settings.json` (outside the build). The three readers (`config/app-config.ts`,
`platform-config.ts`, `design-config.ts`) lay that copy over this site's defaults whenever it exists; the
element is down or removed — the last copy keeps serving. No copy ever received — the site's own files apply.

## 🔒 The first edit makes this site the person's own repository

This folder is a clone of the Fractera original at a pinned tag. It is outside the node's git, the person
cannot push to the original, and a reinstall resets it to the tag — anything you change here is lost.
So **before your first change**:

1. fork this repository (or create one from it) on the person's GitHub account;
2. set `origin` here to that fork and commit your work there;
3. tag a version (`vX.Y.Z`) and push the tag;
4. in the node, change the `root` line of `AGI-ITEMS-CONFIG/agi-items.json` to the fork and the tag;
5. run `npm run services:install` in the node root.

Ask the person before creating a repository on their account: it is an action outside this machine.

## Where things are

- `/<lang>/architect/*` is not yours: it redirects to the core (`ARCHITECT_URL`).
- The node's architect pages about you: `/architect/root` (Preview, subscription, terminal, Telegram,
  External GitHub).
- Build and run on your own: `npm install`, `npm run build`, `PORT=24683 node .next/standalone/server.js`.
