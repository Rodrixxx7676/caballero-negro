/** Contrato de GET /api/site — espejo de Models/Site.cs. */
export interface Site {
  name: string
  slogan: string
  founded: string
  story: string[]
  values: { title: string; text: string }[]
  location: {
    address: string
    district: string
    reference: string
    directions: string[]
    mapQuery: string
    hours: { days: string; open: string; close: string }[]
  }
  contact: {
    phones: string[]
    whatsapp: string
    whatsappMessage: string
    instagram: string
    facebook: string
    tiktok: string
  }
}
