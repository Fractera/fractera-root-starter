# Fractera Root — the site at the root of the node domain

A custom element (owner, 2026-10-21: «Root это не нативный элемент, это кастомный элемент … должен оставаться пустым таким же как
стандартный custom template»). Since **v2.0.0** (node step 549-6) it is the standard custom template `fractera-custom-item-starter`
v0.3.124 with nothing of its own: passport id `root`, port 24683. The project shell `/api/shell/<lang>` and menu `/api/menu/<lang>` that the
other elements read are the template doors. The former pages of root (v1.7.36) stay in this repository's history.

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
