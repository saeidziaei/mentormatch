# Setup notes

## Fonts

Mentormatch uses Playfair Display (headings) + DM Sans (body). Both are loaded
from Google Fonts via `<link>` in `web/index.html`. If a page looks wrong (Times
New Roman fallback in headings, default sans body), confirm these tags are
present inside `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap"
  rel="stylesheet"
/>
```

The italic weights for Playfair Display are required — the hero uses `<em>`
inside the H1 for editorial emphasis.

Apply the base body font globally in `web/src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { @apply font-body text-dark; }
  body { @apply bg-white antialiased; }
  h1, h2, h3 { @apply font-display tracking-tight; }
}
```

## Tailwind config

The brand palette lives in `web/tailwind.config.js`. Don't introduce new
top-level colors without discussion — extend existing scales instead (e.g.
`primary.50`, `primary.900`).

## Adding a new dependency

Default answer: don't. Before adding a UI library (Headless UI, Radix, shadcn,
MUI, Chakra), check whether a 40-line custom component would suffice. Most do.

Acceptable additions when truly needed:
- `clsx` or `tailwind-merge` — class composition
- `lucide-react` — icons (preferred over Heroicons for variety)
- `@headlessui/react` — only for complex a11y primitives (Combobox, Dialog)

Never add Bootstrap, Material UI, Chakra, Ant Design, or DaisyUI. They fight
the brand.

## Dev loop

From `web/`:
- `npm run dev` — Vite with HMR
- `npm run build` — type-check + production build (run before claiming done)

For visual UI changes, open the dev server in a browser and exercise the
golden path. Don't claim a UI task done from type-check alone.
