import { redirect, notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import db from '@/db'
import { urlLinks } from '@/db/schema'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params

  const result = await db
    .select({ url: urlLinks.url })
    .from(urlLinks)
    .where(eq(urlLinks.shortCode, slug))
    .limit(1)

  if (result.length === 0) {
    notFound()
  }

  redirect(result[0].url)
}
