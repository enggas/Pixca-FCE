export const CATEGORIA_LABELS = {
  frutas: 'Frutas',
  vegetales: 'Vegetales',
  tuberculos: 'Tubérculos',
  granos_basicos: 'Granos básicos',
}

export const formatCordobas = (monto) =>
  `C$ ${Number(monto).toLocaleString('es-NI', { maximumFractionDigits: 2 })}`

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