import { auth } from '@clerk/nextjs/server'
import { eq, desc } from 'drizzle-orm'
import db from '@/db'
import { urlLinks } from '@/db/schema'
import type { UrlLink } from '@/db/schema'

export async function getLinks(): Promise<UrlLink[]> {
  const { userId } = await auth()
  if (!userId) return []

  return db
    .select()
    .from(urlLinks)
    .where(eq(urlLinks.userId, userId))
    .orderBy(desc(urlLinks.createdAt))
}
