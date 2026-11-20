<<<<<<< HEAD
// Imágenes en /public/productos (las mismas del landing)
=======
// Imágenes en /public/productos, buscadas por palabra clave del nombre del cultivo
>>>>>>> 760c7ce (feat(images) modulo comprador con imagenes)
const IMAGENES_POR_CULTIVO = [
  { clave: 'naranja', src: '/productos/naranjas.jpg' },
  { clave: 'tomate', src: '/productos/tomates.jpg' },
  { clave: 'platano', src: '/productos/platanos.jpg' },
  { clave: 'aguacate', src: '/productos/aguacates.jpg' },
  { clave: 'frijol', src: '/productos/frijoles.jpg' },
]
<<<<<<< HEAD

const EXTENSIONES = ['jpg', 'jpeg', 'png', 'webp']

const slug = (texto = '') =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

// Lista de rutas candidatas: primero el mapeo conocido, luego variantes del nombre del cultivo
const getImagenesCultivo = (nombre = '') => {
  const normalizado = slug(nombre).replace(/-/g, ' ')
  const conocida = IMAGENES_POR_CULTIVO.find(({ clave }) => normalizado.includes(clave))?.src

  const completo = slug(nombre)
  const primera = completo.split('-')[0]
  const bases = [...new Set([`${primera}s`, primera, `${primera}es`, completo, `${completo}s`])].filter(Boolean)

  const candidatas = bases.flatMap((base) => EXTENSIONES.map((ext) => `/productos/${base}.${ext}`))
  return [...new Set([conocida, ...candidatas].filter(Boolean))]
}

export const formatCordobas = (monto) =>
  `C$ ${Number(monto).toLocaleString('es-NI', { maximumFractionDigits: 2 })}`

export const CATEGORIA_LABELS = {
  frutas: 'Frutas',
  vegetales: 'Vegetales',
  tuberculos: 'Tubérculos',
  granos_basicos: 'Granos básicos',
}

export const normalizarLote = (lote)  => {
=======

const getImagenCultivo = (nombre = '') => {
  const normalizado = nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
  return IMAGENES_POR_CULTIVO.find(({ clave }) => normalizado.includes(clave))?.src ?? null
}
export const formatCordobas = (monto) =>
  `C$ ${Number(monto).toLocaleString('es-NI', { maximumFractionDigits: 2 })}`

export const normalizarLote = (lote) => {
>>>>>>> 760c7ce (feat(images) modulo comprador con imagenes)
  const cosecha = Array.isArray(lote.cosechas) ? lote.cosechas[0] : lote.cosechas
  const cultivo = Array.isArray(cosecha?.cultivo) ? cosecha.cultivo[0] : cosecha?.cultivo
  const productor = Array.isArray(cosecha?.perfiles) ? cosecha.perfiles[0] : cosecha?.perfiles
  const remateRaw = Array.isArray(lote.alerta_remates) ? lote.alerta_remates[0] : lote.alerta_remates
  const remate =
    remateRaw?.esta_activa && new Date(remateRaw.fecha_fin) > new Date() ? remateRaw : null
  const unidad = cosecha?.unidad_medida === 'libras' ? 'lb' : 'u'
  const precioBase = Number(lote.precio_base_lote)
<<<<<<< HEAD



  return {
    id: lote.id,
    nombre: cultivo?.nombre || 'Producto',
    imagen: getImagenesCultivo(cultivo?.nombre),
=======
  
  return {
    id: lote.id,
    nombre: cultivo?.nombre || 'Producto',
    imagen: getImagenCultivo(cultivo?.nombre),
>>>>>>> 760c7ce (feat(images) modulo comprador con imagenes)
    categoria: cultivo?.categoria || null,
    calidad: lote.calidad_clasificacion,
    productorNombre: productor?.nombre_completo || 'Productor',
    ubicacion: productor?.direccion_general || null,
    stock: Number(lote.stock_disponible),
    unidad,
    precioBase,
    precioUnitario: remate ? Number(remate.precio_descuento) : precioBase,
    precioBaseTexto: `${formatCordobas(precioBase)}/${unidad}`,
    tieneRemate: Boolean(remate),
    precioRemateTexto: remate ? `${formatCordobas(remate.precio_descuento)}/${unidad}` : null,
    remateMotivo: remate?.motivo_remate || null,
    remateFinTexto: remate?.fecha_fin
      ? new Date(remate.fecha_fin).toLocaleDateString('es-NI', { day: 'numeric', month: 'short', year: 'numeric' })
      : null,
    descuentoTexto: remate ? `-${Math.round((1 - remate.precio_descuento / precioBase) * 100)}% remate` : null,
  }
}