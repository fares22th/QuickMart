import { supabase, throwIf } from '@/lib/supabase'

// ── Store stats ────────────────────────────────────────────────────────────
export async function getSellerStats(storeId) {
  const todayISO = new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
  const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString()

  const [
    { count: totalOrders },
    { count: pendingOrders },
    { count: todayOrders },
    { count: totalProducts },
    { data: revenueRows },
    { data: monthRows },
    { data: store },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('store_id', storeId),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('store_id', storeId).in('status', ['pending', 'confirmed', 'preparing']),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('store_id', storeId).gte('created_at', todayISO),
    supabase.from('seller_products').select('*', { count: 'exact', head: true }).eq('store_id', storeId),
    supabase.from('orders').select('total').eq('store_id', storeId).eq('status', 'delivered'),
    supabase.from('orders').select('total').eq('store_id', storeId).eq('status', 'delivered').gte('created_at', monthAgo),
    supabase.from('seller_stores').select('rating, category, status, name').eq('id', storeId).single(),
  ])

  const totalRevenue = revenueRows?.reduce((s, o) => s + (Number(o.total) || 0), 0) ?? 0
  const monthRevenue = monthRows?.reduce((s, o) => s + (Number(o.total) || 0), 0) ?? 0

  return {
    totalOrders:   totalOrders  ?? 0,
    pendingOrders: pendingOrders ?? 0,
    todayOrders:   todayOrders  ?? 0,
    totalProducts: totalProducts ?? 0,
    totalRevenue,
    monthRevenue,
    rating:        store?.rating ?? 0,
    storeStatus:   store?.status ?? 'pending',
    storeName:     store?.name ?? '',
  }
}

// ── Revenue time-series ────────────────────────────────────────────────────
export async function getSellerTimeSeries(storeId, days = 30) {
  const from = new Date(Date.now() - days * 86400000).toISOString()
  const { data, error } = await supabase
    .from('orders')
    .select('created_at, total, status')
    .eq('store_id', storeId)
    .gte('created_at', from)
    .order('created_at')
  throwIf(error)

  const byDay = {}
  for (let i = days - 1; i >= 0; i--) {
    const key = new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
    byDay[key] = { date: key, orders: 0, revenue: 0 }
  }
  data?.forEach(o => {
    const key = o.created_at.split('T')[0]
    if (byDay[key]) {
      byDay[key].orders++
      if (o.status === 'delivered') byDay[key].revenue += Number(o.total) || 0
    }
  })
  return Object.values(byDay)
}

// ── Orders ────────────────────────────────────────────────────────────────
export async function getSellerOrders({ storeId, status, limit = 30, offset = 0 } = {}) {
  let q = supabase
    .from('orders')
    .select('*, customer_profiles!orders_customer_id_fkey(name, phone), order_items(quantity, price, name, product_id)')
    .eq('store_id', storeId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status && status !== 'all') q = q.eq('status', status)

  const { data, error } = await q
  throwIf(error)
  return data ?? []
}

// ── Products ──────────────────────────────────────────────────────────────
export async function getSellerProducts({ storeId, search, availability, limit = 50, offset = 0 } = {}) {
  let q = supabase
    .from('seller_products')
    .select('*, categories(name)')
    .eq('store_id', storeId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (search)               q = q.ilike('name', `%${search}%`)
  if (availability === 'active')   q = q.eq('is_available', true)
  if (availability === 'inactive') q = q.eq('is_available', false)

  const { data, error } = await q
  throwIf(error)
  return data ?? []
}

export async function toggleProductAvailability(id, is_available) {
  const { data, error } = await supabase
    .from('seller_products')
    .update({ is_available, updated_at: new Date().toISOString() })
    .eq('id', id).select().single()
  throwIf(error)
  return data
}

// ── Order status update ────────────────────────────────────────────────────
export async function updateSellerOrderStatus(orderId, status) {
  const payload = { status, updated_at: new Date().toISOString() }
  if (status === 'delivered') payload.delivered_at = new Date().toISOString()
  const { data, error } = await supabase.from('orders').update(payload).eq('id', orderId).select().single()
  throwIf(error)
  return data
}
