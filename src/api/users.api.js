import { supabase, throwIf } from '@/lib/supabase'

function roleTable(role) {
  if (role === 'seller') return 'seller_profiles'
  if (role === 'admin')  return 'admin_profiles'
  return 'customer_profiles'
}

export async function getMe() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const role  = user.user_metadata?.role ?? 'customer'
  const table = roleTable(role)
  const { data, error } = await supabase.from(table).select('*').eq('id', user.id).single()
  if (error) return null
  return { ...data, role }
}

export async function updateMe(payload) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('غير مسجل')
  const role  = user.user_metadata?.role ?? 'customer'
  const table = roleTable(role)
  const { data, error } = await supabase
    .from(table)
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', user.id)
    .select()
    .single()
  throwIf(error)
  return { ...data, role }
}

export async function uploadAvatar(file) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('غير مسجل')
  const ext  = file.name.split('.').pop()
  const path = `${user.id}/avatar.${ext}`
  const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
  throwIf(error)
  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  await updateMe({ avatar_url: data.publicUrl })
  return data.publicUrl
}

// ── Customer-only: addresses ─────────────────────────────────

export async function getAddresses() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data, error } = await supabase
    .from('customer_addresses')
    .select('*')
    .eq('customer_id', user.id)
    .order('is_default', { ascending: false })
  throwIf(error)
  return data
}

export async function addAddress(payload) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('غير مسجل')
  if (payload.is_default) {
    await supabase.from('customer_addresses').update({ is_default: false }).eq('customer_id', user.id)
  }
  const { data, error } = await supabase
    .from('customer_addresses')
    .insert({ ...payload, customer_id: user.id })
    .select()
    .single()
  throwIf(error)
  return data
}

export async function deleteAddress(id) {
  const { error } = await supabase.from('customer_addresses').delete().eq('id', id)
  throwIf(error)
}
