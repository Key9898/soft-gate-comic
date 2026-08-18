import { useCallback, useEffect, useState } from 'react'

const EPSILON = 2

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useOverflowScrollX() {
  const [node, setNode] = useState<HTMLDivElement | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const ref = useCallback((el: HTMLDivElement | null) => {
    setNode(el)
  }, [])

  const update = useCallback(() => {
    if (!node) {
      setCanScrollLeft(false)
      setCanScrollRight(false)
      return
    }

    const { scrollLeft, scrollWidth, clientWidth } = node
    setCanScrollLeft(scrollLeft > EPSILON)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - EPSILON)
  }, [node])

  useEffect(() => {
    if (!node) {
      setCanScrollLeft(false)
      setCanScrollRight(false)
      return
    }

    update()

    node.addEventListener('scroll', update, { passive: true })
    const resizeObserver = new ResizeObserver(() => update())
    resizeObserver.observe(node)
    for (const child of Array.from(node.children)) {
      resizeObserver.observe(child)
    }

    return () => {
      node.removeEventListener('scroll', update)
      resizeObserver.disconnect()
    }
  }, [node, update])

  const scrollByPage = useCallback(
    (direction: 'right' | 'left') => {
      if (!node) return

      const amount = node.clientWidth * 0.7
      node.scrollBy({
        left: direction === 'right' ? amount : -amount,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      })
    },
    [node]
  )

  return { ref, canScrollLeft, canScrollRight, update, scrollByPage }
}
