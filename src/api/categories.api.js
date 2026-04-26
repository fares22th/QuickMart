import { supabase, throwIf } from '@/lib/supabase'

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  throwIf(error)
  return data
}

export async function getCategory(slug) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()
  throwIf(error)
  return data
}
