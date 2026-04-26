import { supabase, throwIf } from '@/lib/supabase'

// ---------------------------------------------------------------------------
// UUID guard — prevents "invalid input syntax for type uuid" errors globally
// ---------------------------------------------------------------------------

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isValidUuid(v) {
  return typeof v === 'string' && UUID_RE.test(v)
}

/**
 * Strip any *_id field that is not a valid UUID before it reaches Supabase.
 * Covers the common root cause: z.coerce.number("") → 0, or an empty <select>
 * sending "", both of which blow up with "invalid input syntax for type uuid".
 *
 * Non-UUID numeric fields (price, stock, discount) are untouched because their
 * keys do not end with _id.
 */
export function cleanPayload(obj) {
  const cleaned = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue

    if (key.endsWith('_id')) {
      if (!value || !isValidUuid(String(value))) {
        console.warn(`[products] stripped invalid UUID field "${key}":`, JSON.stringify(value))
        continue
      }
    }

    cleaned[key] = value
  }
  return cleaned
}

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

export async function getProducts({
  storeId, categoryId, search, featured, isNew, limit = 20, offset = 0,
} = {}) {
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

// ---------------------------------------------------------------------------
// Write — always pass payload through cleanPayload first
// ---------------------------------------------------------------------------

export async function createProduct(rawPayload) {
  const payload = cleanPayload(rawPayload)
  console.debug('[createProduct] validated payload →', payload)

  const { data, error } = await supabase
    .from('seller_products')
    .insert(payload)
    .select()
    .single()

  if (error) {
    console.error('[createProduct] Supabase error:', error.code, error.message, error.details)
    throw new Error(error.message)
  }
  return data
}

export async function updateProduct(id, rawPayload) {
  const payload = cleanPayload(rawPayload)
  console.debug('[updateProduct] validated payload →', payload)

  const { data, error } = await supabase
    .from('seller_products')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[updateProduct] Supabase error:', error.code, error.message, error.details)
    throw new Error(error.message)
  }
  return data
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('seller_products').delete().eq('id', id)
  throwIf(error)
}

// ---------------------------------------------------------------------------
// Images — upload after product is created so we have a real UUID path
// ---------------------------------------------------------------------------

export async function uploadProductImages(productId, files) {
  if (!isValidUuid(productId)) {
    throw new Error(`uploadProductImages: productId is not a valid UUID (got "${productId}")`)
  }

  const urls = []
  for (const file of files) {
    const ext  = file.name.split('.').pop().toLowerCase()
    const path = `${productId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      console.error('[uploadProductImages] upload error:', uploadError)
      throw new Error(uploadError.message)
    }

    const { data } = supabase.storage.from('products').getPublicUrl(path)
    urls.push(data.publicUrl)
  }
  return urls
}
