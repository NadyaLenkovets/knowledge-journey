import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

/**
 * Тонкий API-proxy (этап 0 — только health).
 * Ключ OpenRouter и generate/grade — на этапе 4.
 */
const app = new Hono()

app.use(
  '/api/*',
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  }),
)

app.get('/api/health', (c) => {
  const modelConfigured = Boolean(process.env.OPENROUTER_API_KEY?.trim())
  return c.json({
    ok: true,
    modelConfigured,
    model: process.env.OPENROUTER_MODEL ?? 'openrouter/free',
  })
})

const port = Number(process.env.PORT) || 3001

serve({ fetch: app.fetch, port }, () => {
  console.log(`[knowledge-journey] API listening on http://localhost:${port}`)
})
