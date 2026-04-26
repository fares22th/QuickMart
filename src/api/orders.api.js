import { supabase, throwIf } from '@/lib/supabase'

async function currentUserId() {
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

export async function getOrders({ status, limit = 20, offset = 0 } = {}) {
  const uid = await currentUserId()

  let q = supabase
    .from('orders')
    .select('*, order_items(*), seller_stores(name, logo_url)')
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false })

  // Filter to current customer's orders (RLS also enforces this)
  if (uid) q = q.eq('customer_id', uid)
  if (status) q = q.eq('status', status)

  const { data, error } = await q
  throwIf(error)
  return data ?? []
}

export async function getOrder(id) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, seller_products(name, images)), seller_stores(name, logo_url, phone, delivery_time_min)')
    .eq('id', id)
    .single()
  throwIf(error)
  return data
}

export async function createOrder({
  storeId, items, subtotal, deliveryFee = 0, discount = 0,
  total, paymentMethod, notes, address,
}) {
  const uid = await currentUserId()
  if (!uid) throw new Error('يجب تسجيل الدخول أولاً')

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      customer_id:    uid,
      store_id:       storeId,
      subtotal,
      delivery_fee:   deliveryFee,
      discount:       discount ?? 0,
      total,
      payment_method: paymentMethod,
      notes:          notes ?? '',
      address:        JSON.stringify(address),
      status:         'pending',
    })
    .select()
    .single()
  throwIf(error)

  const orderItems = items.map(i => ({
    order_id:   order.id,
    product_id: i.productId ?? i.id,
    name:       i.name,
    price:      i.price,
    quantity:   i.qty,
    subtotal:   i.price * i.qty,
  }))
  const { error: itemsErr } = await supabase.from('order_items').insert(orderItems)
  throwIf(itemsErr)

  return order
}

export async function cancelOrder(id) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  throwIf(error)
  return data
}

export async function updateOrderStatus(id, status) {
  const payload = { status, updated_at: new Date().toISOString() }
  if (status === 'delivered') payload.delivered_at = new Date().toISOString()
  const { data, error } = await supabase.from('orders').update(payload).eq('id', id).select().single()
  throwIf(error)
  return data
}
