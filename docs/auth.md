# Authentication

## Absolute Rules

> **Clerk is the only authentication provider for this application.** Do not implement, add, or suggest any other authentication method (NextAuth, Auth.js, custom JWT, session cookies, Firebase Auth, etc.). All auth flows — sign in, sign up, session management, user identity — are handled exclusively by Clerk.

## Stack

- **Provider**: [Clerk](https://clerk.com) (`@clerk/nextjs` v7)
- **Middleware**: `proxy.ts` (Next.js 16 — do **not** name it `middleware.ts`)

## Protected Routes

### `/dashboard` requires authentication

Any user who is **not signed in** must not be able to access `/dashboard` or any route nested under it. Enforce this at the middleware level in `proxy.ts` using `createRouteMatcher`:

```ts
// proxy.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
```

`auth.protect()` will automatically redirect unauthenticated users to Clerk's sign-in flow. Do not manually redirect to `/sign-in` — let Clerk handle it.

As a secondary guard, also check auth at the top of the `app/dashboard/layout.tsx` to ensure no data is fetched for unauthenticated requests that bypass the middleware:

```tsx
// app/dashboard/layout.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  if (!userId) redirect('/')
  return <>{children}</>
}
```

## Logged-In Users on the Homepage

If a user is **already signed in** and navigates to the homepage (`/`), redirect them to `/dashboard`. Handle this in `proxy.ts`:

```ts
// proxy.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])
const isHomePage = createRouteMatcher(['/'])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  // Redirect authenticated users away from the homepage
  if (isHomePage(req) && userId) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Protect dashboard from unauthenticated users
  if (isProtectedRoute(req)) await auth.protect()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
```

## Sign In and Sign Up: Always Modal

Sign in and sign up must **always open as a Clerk modal**. Never navigate to a dedicated `/sign-in` or `/sign-up` page. Use `<SignInButton mode="modal">` and `<SignUpButton mode="modal">`:

```tsx
// app/layout.tsx
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  UserButton,
  Show,
} from '@clerk/nextjs'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <header>
            <Show when="signed-out">
              <SignInButton mode="modal" />
              <SignUpButton mode="modal" />
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
```

Do **not** set `NEXT_PUBLIC_CLERK_SIGN_IN_URL` or `NEXT_PUBLIC_CLERK_SIGN_UP_URL` environment variables — doing so overrides the modal behavior and routes users to dedicated pages instead.

Do **not** create `app/sign-in/` or `app/sign-up/` route directories.

## Getting the Current User

### In Server Components and Server Actions

Always `await` — Clerk v7 auth is asynchronous:

```ts
import { auth, currentUser } from '@clerk/nextjs/server'

// Lightweight — userId only
const { userId } = await auth()

// Full user object (additional network call)
const user = await currentUser()
```

### In Client Components

```tsx
'use client'
import { useAuth, useUser } from '@clerk/nextjs'

const { userId, isLoaded, isSignedIn } = useAuth()
const { user } = useUser()
```

## Scoping Data to the Authenticated User

Always filter DB queries to the `userId` from `auth()`. Never accept a `userId` from client input:

```ts
// ✅ Correct
export async function getMyLinks() {
  'use server'
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return db.select().from(urlLinks).where(eq(urlLinks.userId, userId))
}

// ❌ Never trust userId from the client
export async function getMyLinks(userId: string) {
  'use server'
  return db.select().from(urlLinks).where(eq(urlLinks.userId, userId))
}
```

## Environment Variables

Required in `.env.local`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

Never add `NEXT_PUBLIC_CLERK_SIGN_IN_URL` or `NEXT_PUBLIC_CLERK_SIGN_UP_URL` — these break the modal-only sign-in requirement.
