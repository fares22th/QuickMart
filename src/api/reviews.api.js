import { supabase, throwIf } from '@/lib/supabase'

export async function getReviews(productId) {
  const { data, error } = await supabase
    .from('product_reviews')
    .select('*, customer_profiles(name, avatar_url)')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })

  // Gracefully return empty array if table doesn't exist yet
  if (error?.code === '42P01') return []
  throwIf(error)

  return (data ?? []).map(r => ({
    ...r,
    customerName: r.customer_profiles?.name ?? 'مستخدم',
    avatarUrl:    r.customer_profiles?.avatar_url ?? null,
  }))
}

export async function createReview(productId, { rating, comment }) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('يجب تسجيل الدخول أولاً')

  const { data, error } = await supabase
    .from('product_reviews')
    .insert({
      product_id:  productId,
      customer_id: user.id,
      rating,
      comment,
    })
    .select('*, customer_profiles(name, avatar_url)')
    .single()
  throwIf(error)

  return {
    ...data,
    customerName: data.customer_profiles?.name ?? 'مستخدم',
    avatarUrl:    data.customer_profiles?.avatar_url ?? null,
  }
}

export async function deleteReview(id) {
  const { error } = await supabase.from('product_reviews').delete().eq('id', id)
  throwIf(error)
}
