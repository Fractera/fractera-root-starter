# heroCentered — the centered first screen: glow, badge, two-line title, three steps

**Type:** Hero (1). A first screen without a picture (owner, 2026-09-26).

## What it actually draws

Everything centered over a glow in the brand colour: the badge with ✦, a title of at most two lines, the
description, one or two actions and a strip of three steps (a column on a phone, a row from a tablet up).

🔒 **It carries the H1 itself.** A page using this section declares `titleInBody`, and the factory stops
printing its own title.

🔒 **Everything comes from the design system.** Type — the typography primitives (the title on
`--fs-hero-one*`), colours — theme tokens, the glow `.hero-ignite*`, the entrance `.hero-appear`, the badge
frame `.pill-ai` — classes in `styles/globals.css`. A new palette re-colours it without a code change.

🔒 **The glow starts at the top of the page**, not at the edge of the section: cut by the section it drew a
straight line under the header.

## When to take it

The first screen of a page where the point is said in words: a product page, a service home page.

## When NOT to take it

- The page needs a picture beside the words — that is `heroSplit`.
- Only the mark and a label above a title the page prints itself — that is `heroBadge`.
