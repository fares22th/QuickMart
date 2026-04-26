import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON) {
  console.error('❌ Supabase env vars missing — add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// Helper: phone → internal email for Supabase auth
export const phoneToEmail = (phone) => {
  const digits = String(phone).replace(/\D/g, '')
  const normalized = digits.startsWith('966') ? digits : `966${digits.replace(/^0/, '')}`
  return `${normalized}@quickmart.sa`
}

// Helper: throw Supabase errors uniformly
export function throwIf(error) {
  if (error) throw new Error(error.message)
}
