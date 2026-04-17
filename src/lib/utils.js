export const money = v => 'GHS ' + Number(v || 0).toFixed(2)
export const thumb = (url, w = 600) => {
  if (!url) return ''
  if (url.includes('cloudinary')) return url.replace('/upload/', `/upload/w_${w},c_fill,f_auto,q_auto/`)
  return url
}
export const SHOP = {
  name: 'EVERYTINROOM&BEDTIME',
  phone: '024 531 5581',
  phone2: '024 936 5339',
  address: 'Aviation Road J382, Adenta, Accra',
  mapsUrl: 'https://maps.google.com/?q=Everytinroom+Adenta+Aviation+Road+Accra+Ghana',
  whatsapp: '233245315581',
  domain: 'erbliving.shop',
}
