import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Al cambiar de página vuelve arriba (salvo que la ruta traiga #ancla). */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0 })
  }, [pathname, hash])
  return null
}
