import type { Site } from '../types/site'

export async function fetchSite(signal?: AbortSignal): Promise<Site> {
  const res = await fetch('/api/site', { signal })
  if (!res.ok) throw new Error(`No se pudo cargar la información del local (HTTP ${res.status}).`)
  return res.json()
}

/** Enlaces listos para usar a partir de los datos de contacto. */
export function socialLinks(site: Site) {
  const { contact } = site
  return {
    whatsapp: `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(contact.whatsappMessage)}`,
    instagram: `https://www.instagram.com/${contact.instagram}/`,
    facebook: `https://www.facebook.com/${contact.facebook}/`,
    tiktok: `https://www.tiktok.com/@${contact.tiktok}`,
    phone: (p: string) => `tel:+51${p.replace(/\s/g, '')}`,
    map: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.location.mapQuery)}`,
    mapEmbed: `https://www.google.com/maps?q=${encodeURIComponent(site.location.mapQuery)}&output=embed`,
  }
}
