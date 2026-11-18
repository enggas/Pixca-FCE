import { supabase } from '@/config/supabaseClient'

const getUserId = async () => {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) throw new Error('Sesión no válida. Iniciá sesión de nuevo.')
  return data.user.id
}

/* ---------- RF-10: Vehículos ---------- */
export const getVehiculos = async () => {
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('vehiculo')
    .select('*')
    .eq('distribuidor_id', userId)
    .order('placa')
  if (error) throw error
  return data
}

export const crearVehiculo = async ({ placa, tipo_vehiculo, capacidad_carga_libras, volumen_disponible_m3 }) => {
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('vehiculo')
    .insert({
      distribuidor_id: userId,
      placa: placa.trim().toUpperCase(),
      tipo_vehiculo: tipo_vehiculo.trim(),
      capacidad_carga_libras: Number(capacidad_carga_libras),
      volumen_disponible_m3: volumen_disponible_m3 ? Number(volumen_disponible_m3) : null,
    })
    .select()
    .single()
  if (error) {
    if (error.code === '23505') throw new Error('Ya existe un vehículo con esa placa')
    throw error
  }
  return data
}

/* ---------- RF-11 / RF-12: Solicitudes y ofertas ---------- */
export const getSolicitudes = async () => {
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('pedido_entrega')
    .select(`
      id,
      descripcion_carga,
      destino_direccion,
      creado_en,
      det_entrega ( id, distribuidor_id, precio_oferta_acarreo, esta_aceptada )
    `)
    .eq('estado_entrega', 'buscando_distribuidor')
    .order('creado_en', { ascending: false })
  if (error) throw error

  return data.map((pedido) => ({
    ...pedido,
    totalOfertas: pedido.det_entrega?.length ?? 0,
    miOferta: pedido.det_entrega?.find((d) => d.distribuidor_id === userId) ?? null,
  }))
}

export const enviarOferta = async ({ pedidoId, vehiculoId, precio }) => {
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('det_entrega')
    .insert({
      pedido_entrega_id: pedidoId,
      distribuidor_id: userId,
      vehiculo_id: vehiculoId,
      precio_oferta_acarreo: Number(precio),
    })
    .select()
    .single()
  if (error) throw error
  return data
}

/* ---------- Viajes del distribuidor (ofertas, aceptados, en ruta) ---------- */
export const getViajes = async () => {
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('det_entrega')
    .select(`
      id,
      precio_oferta_acarreo,
      esta_aceptada,
      fecha_oferta,
      vehiculo ( placa, tipo_vehiculo ),
      pedido_entrega ( id, descripcion_carga, destino_direccion, estado_entrega ),
      estado_entrega ( ultima_latitud_gps, ultima_longitud_gps, ultima_actualizacion_tiempo )
    `)
    .eq('distribuidor_id', userId)
    .order('fecha_oferta', { ascending: false })
  if (error) throw error
  return data
}

const claveSalida = (detEntregaId) => `salida_${detEntregaId}`

export const iniciarViaje = async ({ detEntregaId, pedidoId }) => {
  const { error: errPedido } = await supabase
    .from('pedido_entrega')
    .update({ estado_entrega: 'en_transito' })
    .eq('id', pedidoId)
  if (errPedido) throw errPedido

  localStorage.setItem(claveSalida(detEntregaId), new Date().toISOString())

  const { error: errEstado } = await supabase
    .from('estado_entrega')
    .upsert({ det_entrega_id: detEntregaId }, { onConflict: 'det_entrega_id' })
  if (errEstado) throw errEstado
}

/* ---------- RF-13: Telemetría ---------- */
export const enviarUbicacion = async ({ detEntregaId, latitud, longitud }) => {
  const { error } = await supabase
    .from('estado_entrega')
    .upsert(
      {
        det_entrega_id: detEntregaId,
        ultima_latitud_gps: latitud,
        ultima_longitud_gps: longitud,
        ultima_actualizacion_tiempo: new Date().toISOString(),
      },
      { onConflict: 'det_entrega_id' }
    )
  if (error) throw error
}

/* ---------- RF-14: Cierre histórico ---------- */
export const cerrarEntrega = async ({ viaje, recibidoPor, distanciaKm, exito }) => {
  const salida = localStorage.getItem(claveSalida(viaje.id)) || viaje.fecha_oferta

  const { error: errHistorial } = await supabase.from('historial_entregas').insert({
    det_entrega_id: viaje.id,
    fecha_salida: salida,
    fecha_llegada_real: new Date().toISOString(),
    distancia_recorrida_km: Number(distanciaKm),
    recibido_por_nombre: recibidoPor.trim(),
    concluido_con_exito: exito,
  })
  if (errHistorial) throw errHistorial

  const { error: errPedido } = await supabase
    .from('pedido_entrega')
    .update({ estado_entrega: 'completado' })
    .eq('id', viaje.pedido_entrega.id)
  if (errPedido) throw errPedido

  localStorage.removeItem(claveSalida(viaje.id))
}

export const getHistorial = async () => {
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('historial_entregas')
    .select(`
      id,
      fecha_salida,
      fecha_llegada_real,
      distancia_recorrida_km,
      recibido_por_nombre,
      concluido_con_exito,
      det_entrega!inner (
        distribuidor_id,
        precio_oferta_acarreo,
        pedido_entrega ( descripcion_carga, destino_direccion )
      )
    `)
    .eq('det_entrega.distribuidor_id', userId)
    .order('fecha_llegada_real', { ascending: false })
  if (error) throw error
  return data
}