import { useQuery } from '@tanstack/react-query'
import { getProducts, getProduct } from '@/api/products.api'

export function useProducts(idOrFilters) {
  const isSingle = typeof idOrFilters === 'string' || typeof idOrFilters === 'number'

  return useQuery({
    queryKey: isSingle ? ['product', idOrFilters] : ['products', idOrFilters],
    queryFn:  isSingle ? () => getProduct(idOrFilters) : () => getProducts(idOrFilters),
    enabled:  idOrFilters !== undefined,
  })
}
