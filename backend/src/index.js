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
