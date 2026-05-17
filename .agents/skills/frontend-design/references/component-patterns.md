# Component Patterns

Canonical recipes. Copy from `../templates/` rather than rewriting.

## Buttons

Three variants only:

```tsx
// Primary — main CTA, one per view
<button className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 font-body font-medium text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
  Find a Tutor
</button>

// Secondary — alternative action
<button className="inline-flex items-center justify-center rounded-full border border-dark/15 bg-white px-6 py-3 font-body font-medium text-dark transition-colors hover:border-dark/30 hover:bg-black/[0.02]">
  Become a Tutor
</button>

// Ghost — tertiary, used inline
<button className="inline-flex items-center gap-1 font-body font-medium text-primary transition-colors hover:text-primary-hover">
  Learn more →
</button>
```

Don't introduce a fourth variant without a real need.

## Cards

Base card:

```tsx
<div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
  {/* … */}
</div>
```

Tutor cards: see `../templates/TutorCard.tsx`.

## Inputs

```tsx
<label className="block">
  <span className="mb-2 block text-sm font-medium text-dark">Subject</span>
  <input
    type="text"
    className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 font-body text-dark placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
    placeholder="e.g. Year 11 Maths"
  />
</label>
```

## Badges

```tsx
// Subtle (default)
<span className="inline-flex items-center rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary">
  Verified
</span>

// Status (availability)
<span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
  Available this week
</span>
```

Use the emerald variant ONLY for live availability — not as a brand color.

## Section layout

```tsx
<section className="bg-white py-20 md:py-28">
  <div className="mx-auto max-w-6xl px-6">
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="font-display text-3xl font-semibold tracking-tight text-dark md:text-4xl">
        How it works
      </h2>
      <p className="mt-4 text-muted">
        Three simple steps from "what subject?" to "first session booked."
      </p>
    </div>
    {/* content */}
  </div>
</section>
```

## Hero

See `../templates/Hero.tsx`. Key rules:
- Single H1, `font-display`, with one phrase italicized via `<em>` for
  editorial feel.
- Two CTAs max: one primary, one secondary.
- Right-side visual: rounded tutor portrait or stat card stack — never a stock
  hero illustration.

## Avatars

```tsx
<img
  src={tutor.photo}
  alt={tutor.name}
  className="h-12 w-12 rounded-full object-cover ring-2 ring-white"
/>
```

For tutor card hero photos use `h-48 w-full rounded-2xl object-cover`.

## Star ratings

```tsx
<div className="flex items-center gap-1 text-amber-500" aria-label={`${rating} out of 5`}>
  {/* 5 stars filled to `rating` */}
  <span className="ml-1 text-sm text-muted">({reviewCount})</span>
</div>
```

Amber (`text-amber-500`) is the only "warm" color allowed and is reserved for
star icons.

## Navigation

Sticky, translucent header:

```tsx
<header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur">
  <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
    {/* logo · nav · CTA */}
  </div>
</header>
```
