import { supabase, throwIf } from '@/lib/supabase'

export async function getStores({ featured, category, city, limit = 20, offset = 0 } = {}) {
  let q = supabase
    .from('seller_stores')
    .select('*')
    .eq('status', 'active')
    .range(offset, offset + limit - 1)

  if (featured) q = q.eq('is_featured', true)
  if (category) q = q.eq('category', category)
  if (city)     q = q.eq('city', city)

  const { data, error } = await q.order('rating', { ascending: false })
  throwIf(error)
  return data
}

export async function getStore(id) {
  const { data, error } = await supabase
    .from('seller_stores')
    .select('*, seller_products(*)')
    .eq('id', id)
    .single()
  throwIf(error)
  return data
}

export async function getMyStore() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('غير مسجل')
  const { data, error } = await supabase
    .from('seller_stores')
    .select('*')
    .eq('seller_id', user.id)
    .single()
  throwIf(error)
  return data
}

export async function createStore(payload) {
  const { data, error } = await supabase.from('seller_stores').insert(payload).select().single()
  throwIf(error)
  return data
}

export async function updateStore(id, payload) {
  const { data, error } = await supabase
    .from('seller_stores')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  throwIf(error)
  return data
}
