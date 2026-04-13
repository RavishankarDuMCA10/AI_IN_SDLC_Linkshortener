'use client'

import { useState, useTransition } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { deleteLink } from '@/app/lib/actions'
import type { UrlLink } from '@/db/schema'
import { Copy, Trash2, Check } from 'lucide-react'

interface LinkTableProps {
  links: UrlLink[]
  baseUrl: string
}

export default function LinkTable({ links, baseUrl }: LinkTableProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function handleCopy(shortCode: string) {
    const url = `${baseUrl}/${shortCode}`
    navigator.clipboard.writeText(url)
    setCopied(shortCode)
    setTimeout(() => setCopied(null), 2000)
  }

  function handleDelete(id: string) {
    setDeletingId(id)
    startTransition(async () => {
      await deleteLink(id)
      setDeletingId(null)
    })
  }

  if (links.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No links yet. Shorten your first URL above.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Original URL</TableHead>
          <TableHead>Short Link</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {links.map((link) => (
          <TableRow key={link.id}>
            <TableCell className="max-w-xs">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate text-sm hover:underline"
                title={link.url}
              >
                {link.url}
              </a>
            </TableCell>
            <TableCell>
              <Badge variant="secondary" className="font-mono text-xs">
                {link.shortCode}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {new Date(link.createdAt).toLocaleDateString('en-CA')}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(link.shortCode)}
                  title="Copy short link"
                >
                  {copied === link.shortCode ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  title="Delete link"
                  disabled={isPending && deletingId === link.id}
                  onClick={() => handleDelete(link.id)}
                  className={cn(
                    'text-destructive hover:text-destructive',
                    isPending && deletingId === link.id && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
