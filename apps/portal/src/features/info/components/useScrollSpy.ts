import { useEffect, useState } from 'react'

export const useScrollSpy = (ids: string[]) => {
  const [activeId, setActiveId] = useState('')
  const idsKey = ids.join('|')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) {
          setActiveId(visible.target.id)
        }
      },
      { rootMargin: '-10% 0px -75% 0px', threshold: 0 }
    )

    idsKey.split('|').forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [idsKey])

  return { activeId, setActiveId }
}
