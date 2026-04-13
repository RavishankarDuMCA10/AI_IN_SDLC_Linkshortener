<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent Instructions

This file is the entry point for LLM coding agents working in this repository. Before writing or modifying any code, read the relevant guide(s) from the `/docs` directory listed below.

For detailed guidelines on specific topics, refer to the modular documentation in the `/docs` directory. ALWAYS refer to the relevant .md file BEFORE generating any code:

## Docs Index

| Topic | File | When to read |
|---|---|---|
| Authentication (Clerk v7) | [docs/auth.md](docs/auth.md) | Any time you work with auth, protected routes, sign-in/sign-up UI, or user identity |

## Critical Rules (Summary)

The following rules are the most likely to trip up an agent relying on outdated training data. Violating any of these will break the application.

1. **Middleware is `proxy.ts`** — Next.js 16 renamed `middleware.ts` to `proxy.ts`. Do not create or reference `middleware.ts`.

2. **`params` and `searchParams` are Promises** — Always `await` them in page/layout components before accessing properties.

3. **No `tailwind.config.js`** — Tailwind v4 is configured via `@theme inline` in `app/globals.css`. Do not create a config file.

4. **Clerk v7 auth is async** — `auth()` and `currentUser()` from `@clerk/nextjs/server` must be `await`ed in server contexts.

5. **DB access is server-only** — Never import `db` from `@/db` inside a Client Component (`'use client'`). Use Server Components, Server Functions, or Route Handlers.

6. **Use `cn()` for class names** — Always merge Tailwind classes with `cn()` from `@/lib/utils` to avoid conflicts.

7. **shadcn components live in `components/ui/`** — Add via `npx shadcn add <component>`. Do not hand-write or move them.

8. **Clerk is the only auth provider** — Do not implement or suggest any other authentication method. See [docs/auth.md](docs/auth.md).

9. **`/dashboard` is a protected route** — Unauthenticated users must be blocked at the middleware level in `proxy.ts`. See [docs/auth.md](docs/auth.md).

10. **Authenticated users visiting `/` are redirected to `/dashboard`** — Handle in `proxy.ts`. See [docs/auth.md](docs/auth.md).

11. **Sign in and sign up are always modals** — Use `<SignInButton mode="modal">` and `<SignUpButton mode="modal">`. Never create `/sign-in` or `/sign-up` pages. See [docs/auth.md](docs/auth.md).

---

## Project Architecture

### Data Flow

```
Browser
  └── Client Component (interaction, state)
        └── Server Action / Route Handler  ← "use server" boundary
              └── db (Drizzle + Neon)       ← server-only
```

User-triggered mutations flow from Client Components through Server Actions. Data reads happen directly in Server Components without an API layer.

### Layer Responsibilities

| Layer | Location | Responsibility |
|---|---|---|
| **Pages** | `app/**/page.tsx` | Fetch data, compose layout, no business logic |
| **Layouts** | `app/**/layout.tsx` | Persistent UI shell; fetch session-scoped data once |
| **Server Components** | `app/**/*.tsx` (no directive) | Data access, auth checks, pass data down as props |
| **Client Components** | `'use client'` files | Interactivity, state, browser APIs only |
| **Server Actions** | `app/lib/actions.ts` or co-located `actions.ts` | Mutations, form handling, always auth-gated |
| **Route Handlers** | `app/api/**/route.ts` | Public-facing REST endpoints (webhooks, redirects) |
| **DB schema** | `db/schema.ts` | Single source of truth for all table shapes |
| **DB client** | `db/index.ts` | Singleton Drizzle instance; never re-instantiate |
| **Shared utilities** | `lib/` | Pure functions; no framework imports |
| **UI primitives** | `components/ui/` | shadcn-generated; minimal edits, no moves |
| **App components** | `components/` | Composed application UI; can be Server or Client |

### URL Shortener Core Flow

1. **Create link** — authenticated user submits a URL → Server Action validates, generates a unique slug, inserts into `url_links`, revalidates the dashboard cache.
2. **Redirect** — visitor hits `/:slug` → a Route Handler (or `page.tsx` with `redirect()`) looks up the slug in the DB, increments `click_count`, and issues a 307/308 redirect.
3. **Dashboard** — authenticated user views their links → Server Component fetches links scoped to `userId`, renders a Client Component table with copy/delete actions.

### File Naming at a Glance

```
app/
├── layout.tsx                  # Root layout (ClerkProvider, fonts)
├── page.tsx                    # Landing / marketing page
├── globals.css                 # Tailwind v4 theme config
├── [slug]/
│   └── page.tsx                # Redirect handler
├── dashboard/
│   ├── layout.tsx              # Auth-protected shell
│   ├── page.tsx                # Link list page
│   └── _components/            # Route-private components
├── api/
│   └── webhooks/
│       └── clerk/
│           └── route.ts        # Clerk webhook handler (if needed)
└── lib/
    └── actions.ts              # All Server Actions

components/
├── ui/                         # shadcn primitives (auto-generated)
├── LinkCard.tsx
├── LinkTable.tsx
└── CreateLinkForm.tsx

db/
├── index.ts                    # Drizzle client
└── schema.ts                   # Table definitions

lib/
└── utils.ts                    # cn() and other pure helpers

proxy.ts                        # Clerk middleware (Next.js 16)
```

---

## Best Practices

### Security

- **Authenticate inside every Server Action.** Server Actions are reachable via direct POST requests — never assume the caller is authenticated.
- **Scope all DB queries to `userId`** returned from `auth()`. Never accept `userId` as a client-side input.
- **Validate all user input** before writing to the database (length, format, URL validity).
- **Never expose raw DB errors** to the client. Catch errors in Server Actions and return safe user-facing messages.
- **Environment variables:** access via `process.env.VAR_NAME` only. Never commit `.env.local`. Never expose `CLERK_SECRET_KEY` or `DATABASE_URL` to the client bundle (no `NEXT_PUBLIC_` prefix on secrets).

### Performance

- Keep the `'use client'` boundary as deep as possible. Fetching data in Server Components avoids round-trip latency and keeps secrets off the client.
- Use `Promise.all` when fetching multiple independent data sources in a Server Component to avoid sequential waterfalls.
- Use `loading.tsx` files to stream UI progressively — wrap expensive async components in `<Suspense>`.
- Export `unstable_instant = true` from routes that feel slow on client-side navigation (see `docs/nextjs.md`).
- Use `next/image` for all images — never raw `<img>` tags.

### Code Quality

- **One concern per file.** Components render UI. Actions mutate data. Schema defines shape. Utilities are pure.
- **No business logic in layouts or pages.** Extract to Server Actions (`lib/actions.ts`) or pure utility functions (`lib/`).
- **Avoid prop drilling beyond 2 levels.** Lift data fetching to the nearest Server Component ancestor that can pass it directly.
- **TypeScript strict:** no `any`, no `@ts-ignore`, no casting away `null/undefined` without a real check.
- **Lint must pass** (`npm run lint`) before considering a change complete.

### Mutations Checklist

Before shipping any Server Action:

- [ ] `await auth()` is called and `userId` is checked
- [ ] All user-supplied values are validated (type, length, format)
- [ ] DB query is scoped to the authenticated user's data
- [ ] `revalidatePath` or `revalidateTag` is called after mutating so the UI reflects the change
- [ ] Errors are caught and surfaced as user-friendly messages, not stack traces

### Adding a New Feature

1. Read [docs/project-overview.md](docs/project-overview.md) to confirm where the feature fits.
2. If it touches the DB: update `db/schema.ts`, run `npx drizzle-kit generate && npx drizzle-kit migrate`.
3. If it needs a new UI component: `npx shadcn add <component>` — do not hand-write primitive components.
4. Build the data layer first (schema → action/query), then the UI.
5. Default new components to Server Components; add `'use client'` only when interactivity is required.
6. Run `npm run lint` and fix all errors before finishing.
