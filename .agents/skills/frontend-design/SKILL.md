---
name: frontend-design
description: >-
  Builds premium, trustworthy React + Tailwind UI for Mentormatch (K–12 tutoring
  marketplace). Use when creating or modifying any page, component, or layout in
  `web/`. Enforces the Mentormatch design system (brand colors, Playfair Display
  + DM Sans typography, generous spacing, calm motion) and avoids generic AI
  aesthetics or default Tailwind blues/grays.
---

# Frontend Design — Mentormatch

This skill governs every UI decision in `web/`. The goal is a calm, premium,
trustworthy feel — closer to a high-end education brand than a directory site.

## Core principles

1. **Trust over flash.** No dark patterns, no aggressive CTAs, no neon. Soft
   surfaces, generous whitespace, confident typography.
2. **Distinctive, not generic.** Avoid the AI-default look: never use the
   stock Tailwind `blue-500`, `gray-100`, `indigo-600` palette directly. Always
   reach for the brand tokens in `tailwind.config.js`.
3. **Mobile-first.** Design the 375px layout first; then `md:` and `lg:`.
4. **Typography pairing.** `font-display` (Playfair Display) for headings and
   hero copy; `font-body` (DM Sans) for everything else. Never use Inter,
   Roboto, or Arial.
5. **Motion is subtle.** `transition-colors`, `transition-transform`, ease-out,
   150–300ms. No bouncing, no parallax, no scroll-jacking.

## Workflow

When asked to build or modify UI:

1. **Read [references/design-tokens.md](references/design-tokens.md)** to
   confirm the brand palette, type scale, radii, and shadow conventions.
2. **Read [references/component-patterns.md](references/component-patterns.md)**
   for the canonical Button, Card, Input, Badge, Hero, and TutorCard recipes.
   Reuse — don't reinvent.
3. **Check [references/anti-patterns.md](references/anti-patterns.md)** before
   shipping. If the change matches anything on that list, fix it first.
4. **If a new token is needed** (color shade, font size, breakpoint), add it to
   `web/tailwind.config.js` rather than hardcoding values.

## When fonts aren't loaded yet

Playfair Display and DM Sans must be linked from Google Fonts in
`web/index.html`. If a hero looks wrong, verify the `<link>` tags exist — see
[references/setup.md](references/setup.md) for the exact snippet.

## Quick reference

- Brand primary: `bg-primary text-white` (deep violet `#5B2ECC`)
- Hover primary: `hover:bg-primary-hover`
- Subtle surface: `bg-primary-light` (`#EDE8FF`) for badges, soft panels
- Body text: `text-dark` on `bg-white`; muted helper text: `text-muted`
- Default radius: `rounded-2xl` for cards, `rounded-full` for pills and CTAs
- Default shadow: `shadow-sm` for cards at rest, `shadow-lg` on hover
- Container: `mx-auto max-w-6xl px-6` (use `max-w-7xl` only for wide grids)

## Templates

- [templates/Button.tsx](templates/Button.tsx) — primary/secondary/ghost button
- [templates/Card.tsx](templates/Card.tsx) — base card surface
- [templates/TutorCard.tsx](templates/TutorCard.tsx) — featured tutor card
- [templates/Hero.tsx](templates/Hero.tsx) — homepage hero scaffold
