import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import { createServer } from 'http'
import { initSocket } from './lib/socketio.js'

import authRoutes       from './routes/auth.routes.js'
import customerRoutes   from './routes/customer.routes.js'
import sellerRoutes     from './routes/seller.routes.js'
import adminRoutes      from './routes/admin.routes.js'
import driverRoutes     from './routes/driver.routes.js'

const app  = express()
const http = createServer(app)

// ── CORS ───────────────────────────────────────────────────
// In production allow any origin — APKs use capacitor:// or file://
// and admin/seller panels will be on known domains.
const isProd = process.env.NODE_ENV === 'production'

const CORS_ORIGINS = isProd
  ? true   // allow all in production (APK has no fixed origin)
  : [
      process.env.CUSTOMER_URL,
      process.env.SELLER_URL,
      process.env.ADMIN_URL,
      process.env.DRIVER_URL,
      process.env.CUSTOMER_URL_LAN,
      process.env.DRIVER_URL_LAN,
      process.env.CAPACITOR_ORIGIN,
      process.env.CAPACITOR_ORIGIN_HTTP,
    ].filter(Boolean)

initSocket(http, CORS_ORIGINS)

// ── Middleware ─────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(cors({ origin: CORS_ORIGINS, credentials: true }))
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())

// Rate limiting
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: 'Too many requests' } }))
app.use('/api',      rateLimit({ windowMs: 60 * 1000,       max: 200 }))

// ── Routes ─────────────────────────────────────────────────
app.use('/api/auth',     authRoutes)
app.use('/api/customer', customerRoutes)
app.use('/api/seller',   sellerRoutes)
app.use('/api/admin',    adminRoutes)
app.use('/api/driver',   driverRoutes)

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

// Debug — shows which env vars are missing (no secret values exposed)
app.get('/debug/env', (_, res) => {
  const required = ['DATABASE_URL','JWT_SECRET','JWT_REFRESH_SECRET','NODE_ENV']
  const result = {}
  for (const k of required) result[k] = process.env[k] ? '✅ set' : '❌ MISSING'
  res.json(result)
})

// Debug — test DB connection
app.get('/debug/db', async (_, res) => {
  try {
    const { prisma } = await import('./lib/prisma.js')
    const count = await prisma.user.count()
    res.json({ db: '✅ connected', users: count })
  } catch (e) {
    res.json({ db: '❌ failed', error: e.message })
  }
})

// Debug — test multiple connection strings
app.get('/debug/db-test', async (_, res) => {
  const { PrismaClient } = await import('@prisma/client')
  const project = 'hoyycmqzqiumsqukhqtd'
  const pass    = '2002n9h15far'

  const urls = {
    direct:          `postgresql://postgres:${pass}@db.${project}.supabase.co:5432/postgres?sslmode=no-verify`,
    pooler_session:  `postgresql://postgres.${project}:${pass}@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=no-verify`,
    pooler_tx:       `postgresql://postgres.${project}:${pass}@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=no-verify&pgbouncer=true`,
    pooler_tx_ssl:   `postgresql://postgres.${project}:${pass}@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true`,
  }

  const results = {}
  for (const [name, url] of Object.entries(urls)) {
    const client = new PrismaClient({ datasources: { db: { url } } })
    try {
      const count = await client.user.count()
      results[name] = `✅ OK — ${count} users`
    } catch (e) {
      results[name] = `❌ ${e.message.slice(0, 120)}`
    } finally {
      await client.$disconnect().catch(() => {})
    }
  }
  res.json(results)
})

// 404
app.use((_, res) => res.status(404).json({ error: 'Not found' }))

// Error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status ?? 500).json({ error: err.message ?? 'Internal server error' })
})

// ── Start ──────────────────────────────────────────────────
const PORT = process.env.PORT ?? 4000
http.listen(PORT, '0.0.0.0', () => console.log(`🚀 QuickMart API running on port ${PORT}`))
