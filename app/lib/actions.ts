'use server'

import { auth } from '@clerk/nextjs/server'
import { eq, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import db from '@/db'
import { urlLinks } from '@/db/schema'

function generateShortCode(length = 7): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export async function createLink(
  url: string
): Promise<{ success: boolean; message: string }> {
  const { userId } = await auth()
  if (!userId) return { success: false, message: 'Unauthorized' }

  const trimmed = url.trim()
  if (!trimmed) return { success: false, message: 'URL is required' }
  if (trimmed.length > 2048) return { success: false, message: 'URL is too long' }
  if (!isValidUrl(trimmed)) return { success: false, message: 'Please enter a valid URL (must start with http:// or https://)' }

  let shortCode: string
  let attempts = 0
  do {
    shortCode = generateShortCode()
    attempts++
    if (attempts > 10) return { success: false, message: 'Failed to generate a unique short code. Please try again.' }
    const existing = await db
      .select({ id: urlLinks.id })
      .from(urlLinks)
      .where(eq(urlLinks.shortCode, shortCode))
      .limit(1)
    if (existing.length === 0) break
  } while (true)

  try {
    await db.insert(urlLinks).values({ userId, url: trimmed, shortCode })
    revalidatePath('/dashboard')
    return { success: true, message: 'Link created successfully' }
  } catch {
    return { success: false, message: 'Something went wrong. Please try again.' }
  }
}

export async function deleteLink(
  id: string
): Promise<{ success: boolean; message: string }> {
  const { userId } = await auth()
  if (!userId) return { success: false, message: 'Unauthorized' }

  try {
    await db
      .delete(urlLinks)
      .where(and(eq(urlLinks.id, id), eq(urlLinks.userId, userId)))
    revalidatePath('/dashboard')
    return { success: true, message: 'Link deleted' }
  } catch {
    return { success: false, message: 'Something went wrong. Please try again.' }
  }
}


