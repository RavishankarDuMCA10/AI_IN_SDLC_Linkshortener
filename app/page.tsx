import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Link2, BarChart3, Shield, Zap, Copy, Globe } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Instant Shortening',
    description:
      'Paste any long URL and get a clean, shareable short link in seconds. No sign-up required to try.',
  },
  {
    icon: BarChart3,
    title: 'Click Analytics',
    description:
      'Track every click on your links. See how many times your link was visited directly from your dashboard.',
  },
  {
    icon: Copy,
    title: 'One-Click Copy',
    description:
      'Copy your short URL to the clipboard with a single click — ready to drop into any message or post.',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description:
      'All links are stored securely and scoped to your account. Only you can manage or delete your links.',
  },
  {
    icon: Globe,
    title: 'Works Everywhere',
    description:
      'Short links redirect cleanly on every device and platform — mobile, desktop, social media, and more.',
  },
  {
    icon: Link2,
    title: 'Dashboard Control',
    description:
      'View, copy, and delete all your links from one tidy dashboard. Stay organized without digging through emails.',
  },
]

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Shorten links.{' '}
          <span className="text-muted-foreground">Track clicks.</span>
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          LinkShortener turns your long, unwieldy URLs into clean, memorable
          short links — with built-in click tracking so you always know how your
          links are performing.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <SignUpButton mode="modal">
            <Button size="lg" className="px-8">
              Get Started Free
            </Button>
          </SignUpButton>
          <SignInButton mode="modal">
            <Button size="lg" variant="outline" className="px-8">
              Sign In
            </Button>
          </SignInButton>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Everything you need
            </h2>
            <p className="mt-3 text-muted-foreground">
              Simple, powerful tools for managing your links.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title}>
                <CardHeader className="pb-3">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="border-t px-4 py-20 text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Ready to get started?
        </h2>
        <p className="mt-3 text-muted-foreground">
          Create your free account and shorten your first link in under a
          minute.
        </p>
        <div className="mt-8 flex justify-center">
          <SignUpButton mode="modal">
            <Button size="lg" className="px-10">
              Create Free Account
            </Button>
          </SignUpButton>
        </div>
      </section>
    </div>
  )
}


