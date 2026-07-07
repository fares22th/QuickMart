import { useQuery } from '@tanstack/react-query'
import { getStores, getStore } from '@/api/stores.api'

export function useStores(idOrParams) {
  const isSingle = typeof idOrParams === 'string' || typeof idOrParams === 'number'

  return useQuery({
    queryKey: isSingle ? ['store', idOrParams] : ['stores', idOrParams],
    queryFn:  isSingle ? () => getStore(idOrParams) : () => getStores(idOrParams),
  })
}
