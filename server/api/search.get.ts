import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { q = '', page = '1', perPage = '20' } = getQuery(event) as Record<string, string>
  const term = (q || '').trim()
  const limit = Math.min(Number(perPage) || 20, 50)
  const pageNum = Math.max(Number(page) || 1, 1)
  const from = (pageNum - 1) * limit
  const to = from + limit - 1

  let base = client
    .from('documents')
    .select('id, name, description, url, categories (name), subcategories1 (name), subcategories2 (name), subcategories3 (name), created_at', { count: 'exact' })

  if (term.length > 0) {
    // substring match over name OR description (case-insensitive)
    base = base.or(`name.ilike.%${term}%,description.ilike.%${term}%`)
  } else {
    // Empty search: show recent items so the UI still has data
    // (or return [] if preferring empty state)
  }

  base = base.order('created_at', { ascending: false }).range(from, to)

  const { data, count, error } = await base
  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { items: data ?? [], total: count ?? 0, page: pageNum, perPage: limit }
})
