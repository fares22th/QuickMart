import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { PrismaClient } from '@prisma/client'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../../.env'), override: true })

const DB_URL = process.env.DATABASE_URL

export const prisma = new PrismaClient({
  datasources: { db: { url: DB_URL } },
  log: process.env.NODE_ENV === 'development' ? ['error'] : ['error'],
})
