import { useEffect, useRef } from 'react'

export function useInfiniteScroll(onLoadMore, { threshold = 200, enabled = true } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    if (!enabled) return

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onLoadMore() },
      { rootMargin: `${threshold}px` },
    )

    const el = ref.current
    if (el) observer.observe(el)
    return () => { if (el) observer.unobserve(el) }
  }, [onLoadMore, threshold, enabled])

  return ref
}
