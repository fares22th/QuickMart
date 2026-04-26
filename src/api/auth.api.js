import { supabase, throwIf } from '@/lib/supabase'

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  throwIf(error)
  return data
}

export async function registerCustomer({ name, email, password }) {
  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, role: 'customer' } },
  })
  throwIf(signUpError)

  // sign in immediately so the session is active
  const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
  throwIf(signInError)
  return data
}

export async function registerSeller({
  name, email, password,
  phone, national_id,
  storeName, storeCategory, city, address, storeDesc,
  crNumber, delivery_fee, min_order, delivery_time_min,
  bank_name, iban,
}) {
  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, role: 'seller', phone } },
  })
  throwIf(signUpError)

  const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
  throwIf(signInError)

  if (data?.user) {
    const { error: storeErr } = await supabase.from('seller_stores').insert({
      seller_id:        data.user.id,
      name:             storeName,
      description:      storeDesc      ?? '',
      category:         storeCategory,
      city,
      address:          address        ?? '',
      cr_number:        crNumber       ?? '',
      delivery_fee:     Number(delivery_fee)      || 0,
      min_order:        Number(min_order)          || 0,
      delivery_time_min: Number(delivery_time_min) || 30,
      bank_name:        bank_name      ?? '',
      iban:             iban           ?? '',
      status:           'pending',
    })
    throwIf(storeErr)
  }
  return data
}

export async function registerAdmin({ name, email, password }) {
  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, role: 'admin' } },
  })
  throwIf(signUpError)

  // sign in immediately
  const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
  throwIf(signInError)
  return data
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  throwIf(error)
}

export async function forgotPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  throwIf(error)
}

export async function resetPassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  throwIf(error)
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
