import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local' });

// Neon's serverless driver requires WebSockets and cannot be used by drizzle-kit.
// Derive the direct (non-pooled) connection URL by removing the '-pooler' suffix
// and stripping 'channel_binding' which is unsupported by the pg driver.
const poolerUrl = process.env.DATABASE_URL!;
const directUrl = poolerUrl
  .replace('-pooler.', '.')
  .replace(/[?&]channel_binding=[^&]*/g, (m) =>
    m.startsWith('?') ? '?' : ''
  )
  .replace(/\?$/, '')
  .replace('sslmode=verify-full', 'sslmode=require')
  + '&uselibpqcompat=true';

export default defineConfig({
  out: './drizzle',
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: directUrl,
  },
});
