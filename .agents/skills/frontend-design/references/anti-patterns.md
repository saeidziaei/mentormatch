# Anti-patterns — fix before shipping

If a change matches any of these, revise it.

## Color

- ❌ Using raw Tailwind colors: `bg-blue-500`, `text-indigo-600`, `bg-gray-100`, `slate-*`.
  - ✅ Use `bg-primary`, `text-primary`, `bg-primary-light`, `border-black/10`.
- ❌ Multiple competing accent colors on one screen.
  - ✅ One accent at a time. Default to `primary`.
- ❌ Pure black text (`text-black`).
  - ✅ `text-dark` (#1A1530) for warmth.

## Typography

- ❌ Mixing in Inter, Roboto, or system sans for headings.
  - ✅ Headings = `font-display` (Playfair Display).
- ❌ Setting `font-bold` on hero copy.
  - ✅ `font-display font-semibold` reads more refined.
- ❌ `tracking-wide` on body text.
  - ✅ Body keeps default tracking; only headings get `tracking-tight`.
- ❌ All-caps section labels with default font.
  - ✅ If you must use small caps, pair with `font-body text-xs font-medium tracking-[0.18em] text-primary uppercase`.

## Layout

- ❌ Full-width content stretched edge-to-edge on desktop.
  - ✅ Wrap in `mx-auto max-w-6xl px-6`.
- ❌ Tiny vertical padding between sections (`py-8`).
  - ✅ `py-20 md:py-28` for breathing room.
- ❌ Cards crammed flush together.
  - ✅ Grids use `gap-6` minimum; `gap-8` for featured carousels.

## Imagery

- ❌ Generic stock photography of "diverse business team smiling at laptop."
  - ✅ Real tutor portraits, framed `rounded-2xl`, with a soft `ring-1 ring-black/5`.
- ❌ AI-generated hero illustrations with floating gradient blobs.
  - ✅ Editorial photography or a confident geometric collage.

## Motion

- ❌ Bouncy `transition-bounce` springs, parallax, scroll-jacking.
  - ✅ 150–300ms `ease-out` transitions on color/transform only.
- ❌ Animating in every element on scroll.
  - ✅ Reserve scroll-reveal for hero stats or testimonials, sparingly.

## Buttons

- ❌ Three primary CTAs on the same screen.
  - ✅ One primary, one secondary. Tertiary actions use the ghost link style.
- ❌ Square buttons (`rounded` or `rounded-md`).
  - ✅ Pill buttons (`rounded-full`).
- ❌ Drop shadows on every button.
  - ✅ Subtle `shadow-sm` on primary only.

## Trust signals

- ❌ Fake "10,000+ happy parents!" without source.
  - ✅ Concrete, verifiable lines: "All tutors verified · Sydney-based · Online or in-person."

## Code smell

- ❌ Inline `style={{ ... }}` for static values.
- ❌ Importing `App.css` for ad-hoc selectors.
- ❌ Hex values hardcoded in JSX className strings.
  - ✅ Extend `tailwind.config.js` instead.
