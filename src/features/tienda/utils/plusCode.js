const ALFABETO = '23456789CFGHJMPQRVWX'

export const coordenadasValidas = (lat, lng) =>
  Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180

export const generarPlusCode = (lat, lng) => {
  if (!coordenadasValidas(lat, lng)) return ''
  let latVal = Math.min(Math.floor((lat + 90) * 8000), 180 * 8000 - 1)
  let lngVal = Math.floor((((lng + 180) % 360) + 360) % 360 * 8000)

  let codigo = ''
  for (let i = 0; i < 5; i++) {
    codigo = ALFABETO[latVal % 20] + ALFABETO[lngVal % 20] + codigo
    latVal = Math.floor(latVal / 20)
    lngVal = Math.floor(lngVal / 20)
  }
  return `${codigo.slice(0, 8)}+${codigo.slice(8)}`
}