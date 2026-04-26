import { supabase, throwIf } from '@/lib/supabase'

export async function getProducts({ storeId, categoryId, search, featured, isNew, limit = 20, offset = 0 } = {}) {
  let q = supabase
    .from('seller_products')
    .select('*, seller_stores(id, name, logo_url), categories(id, name)')
    .eq('is_available', true)
    .range(offset, offset + limit - 1)

  if (storeId)    q = q.eq('store_id', storeId)
  if (categoryId) q = q.eq('category_id', categoryId)
  if (featured)   q = q.eq('is_featured', true)
  if (isNew)      q = q.eq('is_new', true)
  if (search)     q = q.ilike('name', `%${search}%`)

  const { data, error } = await q.order('created_at', { ascending: false })
  throwIf(error)
  return data
}

export async function getProduct(id) {
  const { data, error } = await supabase
    .from('seller_products')
    .select('*, seller_stores(id, name, logo_url, rating, delivery_time, min_order), categories(id, name)')
    .eq('id', id)
    .single()
  throwIf(error)
  return data
}

export async function createProduct(payload) {
  const { data, error } = await supabase.from('seller_products').insert(payload).select().single()
  throwIf(error)
  return data
}

export async function updateProduct(id, payload) {
  const { data, error } = await supabase
    .from('seller_products')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  throwIf(error)
  return data
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('seller_products').delete().eq('id', id)
  throwIf(error)
}

export async function uploadProductImages(productId, files) {
  const urls = []
  for (const file of files) {
    const ext  = file.name.split('.').pop()
    const path = `${productId}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('products').upload(path, file, { upsert: true })
    throwIf(error)
    const { data } = supabase.storage.from('products').getPublicUrl(path)
    urls.push(data.publicUrl)
  }
  return urls
}
