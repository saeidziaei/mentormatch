# Design Tokens

All tokens live in `web/tailwind.config.js`. Use the named utilities, not raw
hex values.

## Color

| Token              | Hex       | Use                                              |
| ------------------ | --------- | ------------------------------------------------ |
| `primary`          | `#5B2ECC` | Primary CTAs, key links, active nav              |
| `primary-hover`    | `#4A22B0` | Hover state for primary surfaces                 |
| `primary-light`    | `#EDE8FF` | Soft tinted backgrounds, badges, hover hints     |
| `accent`           | `#8B5CF6` | Decorative accents, illustration highlights      |
| `dark`             | `#1A1530` | Default body text, headings on light surfaces    |
| `muted`            | `#7B7490` | Helper text, captions, placeholders              |
| `white`            | `#FFFFFF` | Default page background                          |

**Never** drop in `blue-500`, `indigo-600`, `gray-700`, `slate-*`, etc. They
clash with the brand and instantly read as "generic AI template."

Neutral grays you may use sparingly:
- Borders: `border-black/5` or `border-black/10`
- Dividers: `border-black/5`
- Subtle backgrounds: `bg-black/[0.02]` or `bg-primary-light`

## Typography

| Class            | Family             | Weights |
| ---------------- | ------------------ | ------- |
| `font-display`   | Playfair Display   | 500, 600, 700 |
| `font-body`      | DM Sans            | 400, 500, 600, 700 |

Default `<body>` text is `font-body text-dark`. Apply `font-display` only on:
- `h1`, `h2` (large landing headings)
- Hero numerals or stat call-outs
- Pull quotes

Type scale (mobile → desktop):

| Use            | Mobile           | Desktop          |
| -------------- | ---------------- | ---------------- |
| Hero h1        | `text-4xl`       | `md:text-6xl`    |
| Section h2     | `text-3xl`       | `md:text-4xl`    |
| Card title h3  | `text-lg`        | `md:text-xl`     |
| Body           | `text-base`      | `text-base`      |
| Helper / meta  | `text-sm`        | `text-sm`        |

Headings: `font-display font-semibold tracking-tight leading-tight`.

## Spacing

Stick to Tailwind's default spacing scale. Common rhythms:
- Section vertical padding: `py-20 md:py-28`
- Container side padding: `px-6`
- Card internal padding: `p-6` or `p-8`
- Vertical stack gap: `space-y-4` (tight), `space-y-6` (default), `space-y-10` (section)

## Radius

| Token          | Use                                          |
| -------------- | -------------------------------------------- |
| `rounded-full` | Buttons, pills, avatar circles               |
| `rounded-2xl`  | Cards, modals, image frames                  |
| `rounded-xl`   | Inputs, smaller surfaces                     |
| `rounded-lg`   | Tooltips, badges                             |

Sharp corners (`rounded-none`) are reserved for purposeful editorial moments.

## Shadow

| Token         | Use                                  |
| ------------- | ------------------------------------ |
| `shadow-sm`   | Card at rest                         |
| `shadow-md`   | Floating elements, dropdowns         |
| `shadow-lg`   | Hover elevation, modals              |
| `shadow-xl`   | Hero feature cards, sparingly        |

Prefer **soft, low-spread** shadows. Combine with `ring-1 ring-black/5` on
cards for a refined edge.

## Motion

- Transitions: `transition-colors duration-200` or
  `transition-transform duration-200 ease-out`
- Hover lift on cards: `hover:-translate-y-0.5 hover:shadow-lg`
- Never animate `width`/`height`; use `scale` or `translate`.
- Page enter animations: keep under 400ms.
