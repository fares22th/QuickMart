import { supabase, throwIf } from '@/lib/supabase'

// ── Platform Stats ─────────────────────────────────────────────────────
export async function getPlatformStats() {
  const todayISO = new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
  const weekAgo  = new Date(Date.now() - 7 * 86400000).toISOString()

  const [
    { count: customers },
    { count: sellers },
    { count: totalOrders },
    { count: todayOrders },
    { count: newCustomers },
    { count: pendingStores },
    { data: revenueRows },
  ] = await Promise.all([
    supabase.from('customer_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('seller_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', todayISO),
    supabase.from('customer_profiles').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo),
    supabase.from('seller_stores').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('orders').select('total').eq('status', 'delivered'),
  ])

  const totalRevenue = revenueRows?.reduce((s, o) => s + (Number(o.total) || 0), 0) ?? 0
  return { customers, sellers, totalOrders, todayOrders, newCustomers, pendingStores, totalRevenue }
}

// ── Time-series (last N days) ──────────────────────────────────────────
export async function getOrdersTimeSeries(days = 30) {
  const from = new Date(Date.now() - days * 86400000).toISOString()
  const { data, error } = await supabase
    .from('orders')
    .select('created_at, total, status')
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

// ── Customer growth ────────────────────────────────────────────────────
export async function getCustomerGrowth(days = 30) {
  const from = new Date(Date.now() - days * 86400000).toISOString()
  const { data, error } = await supabase
    .from('customer_profiles').select('created_at').gte('created_at', from)
  throwIf(error)

  const byDay = {}
  for (let i = days - 1; i >= 0; i--) {
    const key = new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
    byDay[key] = { date: key, count: 0 }
  }
  data?.forEach(p => {
    const key = p.created_at.split('T')[0]
    if (byDay[key]) byDay[key].count++
  })
  return Object.values(byDay)
}

// ── Orders by status ───────────────────────────────────────────────────
export async function getOrdersByStatus() {
  const { data, error } = await supabase.from('orders').select('status')
  throwIf(error)
  const map = {}
  data?.forEach(o => { map[o.status] = (map[o.status] || 0) + 1 })
  return Object.entries(map).map(([status, count]) => ({ status, count }))
}

// ── Top stores by revenue ──────────────────────────────────────────────
export async function getTopStores(limit = 5) {
  const { data, error } = await supabase
    .from('orders')
    .select('store_id, total, seller_stores(name, logo_url)')
    .eq('status', 'delivered')
  throwIf(error)

  const map = {}
  data?.forEach(o => {
    if (!o.store_id) return
    if (!map[o.store_id]) map[o.store_id] = { id: o.store_id, name: o.seller_stores?.name, logo_url: o.seller_stores?.logo_url, revenue: 0, orders: 0 }
    map[o.store_id].revenue += Number(o.total) || 0
    map[o.store_id].orders++
  })
  return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, limit)
}

// ── Customers ──────────────────────────────────────────────────────────
export async function getCustomers({ search = '', limit = 50, offset = 0 } = {}) {
  let q = supabase
    .from('customer_profiles').select('*')
    .order('created_at', { ascending: false }).range(offset, offset + limit - 1)
  if (search) q = q.or(`name.ilike.%${search}%,phone.ilike.%${search}%`)
  const { data, error } = await q
  throwIf(error)
  return data ?? []
}

export async function getCustomer(id) {
  const [{ data: profile, error: e1 }, { data: orders, error: e2 }] = await Promise.all([
    supabase.from('customer_profiles').select('*').eq('id', id).single(),
    supabase.from('orders').select('*, seller_stores(name), order_items(quantity, price, name)')
      .eq('customer_id', id).order('created_at', { ascending: false }),
  ])
  throwIf(e1); throwIf(e2)
  return { profile: { ...profile, role: 'customer' }, orders: orders ?? [] }
}

export async function updateCustomer(id, payload) {
  const { data, error } = await supabase
    .from('customer_profiles').update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id).select().single()
  throwIf(error)
  return data
}

// ── Sellers / Stores ───────────────────────────────────────────────────
export async function getStore(id) {
  const { data, error } = await supabase
    .from('seller_stores')
    .select('*, seller_profiles(id, name, phone, email, national_id, avatar_url, created_at)')
    .eq('id', id)
    .single()
  throwIf(error)
  return data
}

export async function getAllStores({ status, search, limit = 50, offset = 0 } = {}) {
  let q = supabase
    .from('seller_stores').select('*, seller_profiles(name, phone, avatar_url)')
    .order('created_at', { ascending: false }).range(offset, offset + limit - 1)
  if (status) q = q.eq('status', status)
  if (search) q = q.ilike('name', `%${search}%`)
  const { data, error } = await q
  throwIf(error)
  return data ?? []
}

export async function setStoreStatus(id, status) {
  const { data, error } = await supabase
    .from('seller_stores').update({ status, updated_at: new Date().toISOString() })
    .eq('id', id).select().single()
  throwIf(error)
  return data
}

// ── All Orders ─────────────────────────────────────────────────────────
export async function getAllOrders({ status, limit = 50, offset = 0 } = {}) {
  let q = supabase
    .from('orders')
    .select('*, customer_profiles!orders_customer_id_fkey(name, phone), seller_stores(name)')
    .order('created_at', { ascending: false }).range(offset, offset + limit - 1)
  if (status) q = q.eq('status', status)
  const { data, error } = await q
  throwIf(error)
  return data ?? []
}

export async function adminUpdateOrderStatus(id, status) {
  const payload = { status, updated_at: new Date().toISOString() }
  if (status === 'delivered') payload.delivered_at = new Date().toISOString()
  const { data, error } = await supabase.from('orders').update(payload).eq('id', id).select().single()
  throwIf(error)
  return data
}

// ── Recent Activity ────────────────────────────────────────────────────
export async function getRecentActivity(limit = 8) {
  const { data, error } = await supabase
    .from('orders')
    .select('id, status, total, created_at, customer_profiles!orders_customer_id_fkey(name), seller_stores(name)')
    .order('created_at', { ascending: false }).limit(limit)
  throwIf(error)
  return data ?? []
}
