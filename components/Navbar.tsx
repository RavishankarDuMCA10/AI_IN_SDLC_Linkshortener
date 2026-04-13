import { SignInButton, SignUpButton, UserButton, Show } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  return (
    <nav className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          LinkShortener
        </Link>
        <div className="flex items-center gap-2">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm">Sign Up</Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </nav>
  )
}
