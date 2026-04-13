'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { createLink } from '@/app/lib/actions'
import { Link2 } from 'lucide-react'

export default function CreateLinkForm() {
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    startTransition(async () => {
      const result = await createLink(url)
      setMessage({ text: result.message, success: result.success })
      if (result.success) setUrl('')
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Link2 className="h-4 w-4" />
          Shorten a new link
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="url"
            placeholder="https://example.com/very-long-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isPending}
            required
            className="flex-1"
          />
          <Button type="submit" disabled={isPending} className={cn(isPending && 'opacity-50 cursor-not-allowed')}>
            {isPending ? 'Shortening…' : 'Shorten'}
          </Button>
        </form>
        {message && (
          <p className={cn('mt-2 text-sm', message.success ? 'text-green-500' : 'text-destructive')}>
            {message.text}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
