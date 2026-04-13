# UI Components

## Absolute Rules

> **shadcn/ui is the only component library for this application.** Do not hand-write custom UI primitives (buttons, inputs, dialogs, cards, etc.). Every UI element must come from shadcn/ui. No other component libraries (MUI, Radix standalone, Chakra, Ant Design, etc.) may be introduced.

## Stack

- **Library**: [shadcn/ui](https://ui.shadcn.com) (style: `base-nova`, base color: `neutral`)
- **Icons**: `lucide-react` (the configured `iconLibrary`)
- **Styling**: Tailwind v4 via CSS variables — configured in `app/globals.css`, **no** `tailwind.config.js`
- **Utilities**: `cn()` from `@/lib/utils` for merging class names

## Adding Components

Always install new shadcn components via the CLI — never write them by hand:

```bash
npx shadcn add <component-name>
# examples:
npx shadcn add dialog
npx shadcn add input
npx shadcn add table
```

Generated files land in `components/ui/`. Do **not** move, rename, or substantially rewrite them.

## Using Components

Import from the `@/components/ui/` alias:

```tsx
import { Button } from '@/components/ui/button'
import { Input }  from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
```

Always use `cn()` when adding or conditionally merging Tailwind classes on top of a shadcn component:

```tsx
import { cn } from '@/lib/utils'

<Button className={cn('w-full', isLoading && 'opacity-50 cursor-not-allowed')}>
  Submit
</Button>
```

## Rules

1. **No custom primitives.** If a suitable shadcn component exists, use it. If one does not exist, add it with the CLI before writing code.
2. **No style overrides via inline `style` props.** Use Tailwind utility classes passed through `className` (merged with `cn()`).
3. **Do not edit generated files in `components/ui/`** except for minor prop-type additions required by the feature — and only when the CLI cannot produce the needed variant.
4. **Variants before custom classes.** Prefer the built-in `variant` and `size` props (e.g. `<Button variant="outline" size="sm">`) over raw Tailwind overrides.
5. **Icons always from `lucide-react`.** Do not import icons from any other package.

## Component Composition

Build application-level UI in `components/` (outside `components/ui/`) by composing shadcn primitives. These composite components may be Server or Client Components depending on their interactivity needs.

```
components/
├── ui/              ← shadcn primitives (auto-generated, minimal edits)
├── LinkCard.tsx     ← application component (composes shadcn primitives)
├── LinkTable.tsx
└── CreateLinkForm.tsx
```

## Theming

The theme is defined entirely in `app/globals.css` using `@theme inline` and CSS custom properties. To change colors, spacing, or typography, edit the CSS variables there — **never** create a `tailwind.config.js`.
