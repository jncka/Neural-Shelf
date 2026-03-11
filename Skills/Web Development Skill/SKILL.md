---
name: web-development
description: 
  Full-stack web development skill covering React/Next.js, HTML/CSS/JS static sites, and e-commerce/landing pages. Use this skill whenever the user asks to build, scaffold, design, or improve any website, web app, page, or component — including requests for UI components, page layouts, design systems, style guides, or performance/SEO improvements. Trigger even for casual requests like "build me a site", "make a landing page", "create a component", "style this page", "set up a Next.js project", or "help with my e-commerce store". Always use this skill before writing any web development code to ensure production-grade output with modern, minimal aesthetics.
---

# Web Development Skill

A comprehensive guide for building production-grade websites and web applications with a **modern, minimal aesthetic**. Covers React/Next.js, HTML/CSS/JS, full-stack patterns, and e-commerce/landing pages.

---

## 1. Design Philosophy — Modern & Minimal

Before writing a single line of code, commit to a design direction:

- **Whitespace is architecture**: generous padding, breathing room, intentional emptiness
- **Typography leads**: one strong typeface does more than five competing ones
- **Color restraint**: 1–2 primary colors + neutral backgrounds. Let negative space carry weight
- **Motion is subtle**: 150–300ms transitions, easing curves, no gratuitous animation
- **Content hierarchy**: every element has a clear visual rank — hero → section → detail

### Typography Stack (Minimal)
```css
/* Preferred pairings — pick ONE per project */
--font-display: 'Fraunces', serif;          /* editorial, luxury */
--font-display: 'Syne', sans-serif;         /* geometric, bold */
--font-display: 'DM Serif Display', serif;  /* refined, classic */
--font-body: 'DM Sans', sans-serif;
--font-body: 'Instrument Sans', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

### Color System
```css
:root {
  --color-bg:      #fafaf9;
  --color-surface: #ffffff;
  --color-border:  #e5e5e3;
  --color-text:    #1a1a18;
  --color-muted:   #6b6b68;
  --color-accent:  #1a1a18;   /* swap for brand color */
  --color-accent-hover: #333330;
}
```

---

## 2. Project Setup Patterns

### React / Next.js (App Router)
```bash
npx create-next-app@latest my-app \
  --typescript --tailwind --eslint \
  --app --src-dir --import-alias "@/*"
```

**Key file structure:**
```
src/
├── app/
│   ├── layout.tsx        # Root layout + fonts + metadata
│   ├── page.tsx          # Home page
│   └── (routes)/
├── components/
│   ├── ui/               # Primitive components (Button, Card, etc.)
│   └── sections/         # Page-level sections (Hero, Features, etc.)
├── lib/
│   └── utils.ts          # cn(), formatters, helpers
└── styles/
    └── globals.css       # CSS variables + base styles
```

### HTML/CSS/JS Static Site
```
project/
├── index.html
├── css/
│   ├── reset.css
│   ├── tokens.css        # Design tokens / CSS variables
│   └── main.css
├── js/
│   └── main.js
└── assets/
    ├── images/
    └── fonts/
```

---

## 3. Reusable UI Components

### Design Tokens First
Always define tokens before building components:
```css
/* tokens.css */
:root {
  /* Spacing scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-8: 2rem;
  --space-16: 4rem;
  --space-24: 6rem;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Shadow */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 16px 40px rgba(0,0,0,0.10);

  /* Transition */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
  --duration-base: 250ms;
}
```

### Button Component (React + Tailwind)
```tsx
// components/ui/Button.tsx
type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: 'sm' | 'md' | 'lg'
}

const variants = {
  primary:   'bg-neutral-900 text-white hover:bg-neutral-700',
  secondary: 'bg-white border border-neutral-200 text-neutral-900 hover:bg-neutral-50',
  ghost:     'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-all duration-150 ease-out focus-visible:outline-2
        focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  )
}
```

### Card Component
```tsx
// components/ui/Card.tsx
export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm
      hover:shadow-md transition-shadow duration-250 ${className}`}>
      {children}
    </div>
  )
}
```

---

## 4. Page Layout Patterns

### Hero Section (minimal, text-forward)
```tsx
// components/sections/Hero.tsx
export function Hero() {
  return (
    <section className="min-h-[90vh] flex items-center px-6 pt-24 pb-16 max-w-6xl mx-auto">
      <div className="max-w-3xl">
        <p className="text-sm font-medium text-neutral-400 tracking-widest uppercase mb-6">
          Tagline / Category
        </p>
        <h1 className="text-5xl md:text-7xl font-semibold text-neutral-900 leading-[1.05] mb-8">
          Clear, bold headline<br />
          <span className="text-neutral-400">that spans two lines</span>
        </h1>
        <p className="text-xl text-neutral-500 leading-relaxed mb-10 max-w-xl">
          One sentence that explains what this is and why it matters.
        </p>
        <div className="flex gap-4 flex-wrap">
          <Button size="lg">Primary CTA</Button>
          <Button variant="ghost" size="lg">Learn more →</Button>
        </div>
      </div>
    </section>
  )
}
```

### Feature Grid
```tsx
const features = [
  { icon: '◈', title: 'Feature One', description: 'Short, punchy benefit statement.' },
  // ...
]

export function Features() {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-semibold mb-16">Why it works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map(f => (
          <div key={f.title} className="space-y-3">
            <span className="text-2xl">{f.icon}</span>
            <h3 className="font-semibold text-neutral-900">{f.title}</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
```

---

## 5. Design System / Style Guide

When asked to create a design system, produce:

1. **Token file** — spacing, color, type, shadow, radius (see Section 3)
2. **Component library** — Button, Input, Card, Badge, Modal, Toast
3. **Typography scale**:
```css
.text-xs    { font-size: 0.75rem; line-height: 1rem; }
.text-sm    { font-size: 0.875rem; line-height: 1.25rem; }
.text-base  { font-size: 1rem; line-height: 1.5rem; }
.text-lg    { font-size: 1.125rem; line-height: 1.75rem; }
.text-xl    { font-size: 1.25rem; line-height: 1.75rem; }
.text-2xl   { font-size: 1.5rem; line-height: 2rem; }
.text-4xl   { font-size: 2.25rem; line-height: 2.5rem; }
.text-6xl   { font-size: 3.75rem; line-height: 1; }
```
4. **Grid system**: 12-column with 24px gutter, max-width 1280px
5. **Breakpoints**: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`

---

## 6. Full-Stack Patterns (Next.js)

### API Route (App Router)
```ts
// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  // validate, process, respond
  return NextResponse.json({ success: true }, { status: 200 })
}
```

### Server Component Data Fetching
```tsx
// app/products/page.tsx
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 60 } // ISR: revalidate every 60s
  })
  return res.json()
}

export default async function ProductsPage() {
  const products = await getProducts()
  return <ProductGrid products={products} />
}
```

### Database (Prisma + PostgreSQL)
```ts
// lib/db.ts
import { PrismaClient } from '@prisma/client'
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const db = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

---

## 7. E-commerce & Landing Pages

### Landing Page Checklist
- [ ] Single, clear value proposition above the fold
- [ ] Social proof (testimonials, logos, numbers)
- [ ] One primary CTA — repeated 2–3× down the page
- [ ] FAQ section to handle objections
- [ ] Fast load: images use `next/image`, fonts preloaded
- [ ] Mobile-first layout (test at 375px width)

### Product Card (E-commerce)
```tsx
export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group cursor-pointer">
      <div className="aspect-square bg-neutral-50 rounded-xl overflow-hidden mb-4
        group-hover:bg-neutral-100 transition-colors duration-200">
        <img src={product.image} alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105
          transition-transform duration-500 ease-out" />
      </div>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-medium text-neutral-900 text-sm">{product.name}</h3>
          <p className="text-neutral-400 text-sm mt-0.5">{product.category}</p>
        </div>
        <span className="font-semibold text-neutral-900 text-sm whitespace-nowrap">
          ${product.price}
        </span>
      </div>
    </div>
  )
}
```

---

## 8. Performance & SEO

### Next.js Metadata (App Router)
```tsx
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { default: 'Site Name', template: '%s | Site Name' },
  description: 'Clear, keyword-rich description under 160 chars.',
  openGraph: {
    type: 'website',
    url: 'https://example.com',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
}
```

### Performance Rules
- **Images**: Always use `next/image` or `<img loading="lazy">` + explicit `width`/`height`
- **Fonts**: Use `next/font` to eliminate layout shift; preload critical fonts
- **Code splitting**: Dynamic imports for heavy components (`dynamic(() => import(...))`)
- **Core Web Vitals targets**: LCP < 2.5s, CLS < 0.1, FID < 100ms
- **Bundle**: Analyze with `@next/bundle-analyzer`; keep JS < 200KB gzipped

### HTML Static Site SEO Essentials
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Page Title | Brand</title>
  <meta name="description" content="Under 160 chars">
  <link rel="canonical" href="https://example.com/page">
  <meta property="og:title" content="Page Title">
  <meta property="og:image" content="/og.png">
  <script type="application/ld+json">
    { "@context": "https://schema.org", "@type": "WebSite", "url": "https://example.com" }
  </script>
</head>
```

---

## 9. Code Quality Checklist

Before delivering any code, verify:

- [ ] **Accessibility**: semantic HTML, ARIA labels on interactive elements, keyboard navigation
- [ ] **Responsive**: tested at 375px, 768px, 1280px
- [ ] **TypeScript**: no `any` types; interfaces defined for all props
- [ ] **Error states**: loading, empty, and error UI handled
- [ ] **Environment variables**: secrets in `.env.local`, never hardcoded
- [ ] **Performance**: no render-blocking resources, images optimized
- [ ] **Consistency**: tokens used throughout, no magic numbers in CSS

---

## Reference Files

For deep dives, see:
- `references/nextjs-patterns.md` — Advanced Next.js (auth, middleware, ISR/SSG)
- `references/ecommerce.md` — Cart, checkout, Stripe integration patterns
- `references/component-library.md` — Full component catalog (30+ components)