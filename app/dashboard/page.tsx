import { headers } from 'next/headers'
import { getLinks } from '@/data/links'
import CreateLinkForm from '@/components/CreateLinkForm'
import LinkTable from '@/components/LinkTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link2 } from 'lucide-react'

export default async function DashboardPage() {
  const [links, headersList] = await Promise.all([getLinks(), headers()])

  const host = headersList.get('host') ?? 'localhost:3000'
  const protocol = host.startsWith('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <div className="flex items-center gap-2">
        <Link2 className="h-5 w-5" />
        <h1 className="text-2xl font-bold tracking-tight">My Links</h1>
      </div>

      <CreateLinkForm />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Your Links{' '}
            <span className="text-muted-foreground font-normal">({links.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <LinkTable links={links} baseUrl={baseUrl} />
        </CardContent>
      </Card>
    </main>
  )
}

