export const CATEGORIA_LABELS = {
  frutas: 'Frutas',
  vegetales: 'Vegetales',
  tuberculos: 'Tubérculos',
  granos_basicos: 'Granos básicos',
}

// Imágenes en /public/productos, buscadas por palabra clave del nombre del cultivo
const IMAGENES_POR_CULTIVO = [
  { clave: 'naranja', src: '/productos/naranjas.jpg' },
  { clave: 'tomate', src: '/productos/tomates.jpg' },
  { clave: 'platano', src: '/productos/platanos.jpg' },
  { clave: 'aguacate', src: '/productos/aguacates.jpg' },
  { clave: 'frijol', src: '/productos/frijoles.jpg' },
]

const getImagenCultivo = (nombre = '') => {
  const normalizado = nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
  return IMAGENES_POR_CULTIVO.find(({ clave }) => normalizado.includes(clave))?.src ?? null
}

export const formatCordobas = (monto) =>
  `C$ ${Number(monto).toLocaleString('es-NI', { maximumFractionDigits: 2 })}`

const formatFecha = (valor) => {
  if (!valor) return null
  const fecha = new Date(valor.length === 10 ? `${valor}T00:00:00` : valor)
  return fecha.toLocaleDateString('es-NI', { day: 'numeric', month: 'short', year: 'numeric' })
}

const diasHasta = (valor) => {
  if (!valor) return null
  return Math.ceil((new Date(`${valor}T00:00:00`) - new Date()) / 86400000)
}

export const normalizarLote = (lote) => {
  const cosecha = Array.isArray(lote.cosechas) ? lote.cosechas[0] : lote.cosechas
  const cultivo = Array.isArray(cosecha?.cultivo) ? cosecha.cultivo[0] : cosecha?.cultivo
  const productor = Array.isArray(cosecha?.perfiles) ? cosecha.perfiles[0] : cosecha?.perfiles
  const remateRaw = Array.isArray(lote.alerta_remates) ? lote.alerta_remates[0] : lote.alerta_remates
  const remate =
    remateRaw?.esta_activa && new Date(remateRaw.fecha_fin) > new Date() ? remateRaw : null
  const unidad = cosecha?.unidad_medida === 'libras' ? 'lb' : 'u'
  const precioBase = Number(lote.precio_base_lote)

  return {
    id: lote.id,
    nombre: cultivo?.nombre || 'Producto',
    imagen: getImagenCultivo(cultivo?.nombre),
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

    // ---- Detalles extra del producto ----
    descripcion: cultivo?.descripcion || null,
    categoriaTexto: CATEGORIA_LABELS[cultivo?.categoria] || null,
    cantidadTotal: cosecha?.cantidad_total != null ? Number(cosecha.cantidad_total) : null,
    fechaCosechaTexto: formatFecha(cosecha?.fecha_cosecha),
    fechaCaducidadTexto: formatFecha(cosecha?.fecha_caducidad_estimada),
    diasParaCaducar: diasHasta(cosecha?.fecha_caducidad_estimada),
    productorTelefono: productor?.telefono || null,
  }
}