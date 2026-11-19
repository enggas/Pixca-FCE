import { supabase } from '@/config/supabaseClient'
import { MOTIVO_REMATE_DEFAULT } from '../utils/constantes'

const getUserId = async () => {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  const userId = data.session?.user?.id
  if (!userId) throw new Error('No hay una sesión activa')
  return userId
}

const lanzarSiError = (error) => {
  if (error) throw error
}

// ---------- Perfil ----------
export const getPerfilProductor = async () => {
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('perfiles')
    .select('id, nombre_completo, direccion_general, rol')
    .eq('id', userId)
    .single()
  lanzarSiError(error)
  return data
}

// ---------- Cultivos (catálogo, solo lectura por RLS) ----------
export const getCultivos = async () => {
  const { data, error } = await supabase
    .from('cultivo')
    .select('id, nombre, categoria, descripcion')
    .order('nombre')
  lanzarSiError(error)
  return data
}

// ---------- Siembras (RF-01, RF-02, RF-03) ----------
export const getSiembras = async () => {
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('siembras')
    .select(`
      id,
      fecha_siembra,
      tipo_suelo,
      hectareas_ocupadas,
      creado_en,
      cultivo ( id, nombre, categoria ),
      estado_siembra (
        id,
        fase_semilla,
        fase_germinacion,
        fase_crecimiento,
        fase_floracion,
        fase_maduracion,
        fase_lista_cosecha,
        ultima_actualizacion
      )
    `)
    .eq('productor_id', userId)
    .gt('hectareas_ocupadas', 0) // oculta las siembras simuladas de cosechas directas (RF-05)
    .order('creado_en', { ascending: false })
  lanzarSiError(error)
  return data
}

// El trigger tr_inicializar_cronograma crea estado_siembra con las 6 fases en FALSE (RF-02)
export const crearSiembra = async ({ cultivoId, fechaSiembra, tipoSuelo, hectareas }) => {
  const productorId = await getUserId()
  const { data, error } = await supabase
    .from('siembras')
    .insert({
      productor_id: productorId,
      cultivo_id: cultivoId,
      fecha_siembra: fechaSiembra,
      tipo_suelo: tipoSuelo,
      hectareas_ocupadas: hectareas,
    })
    .select('id')
    .single()
  lanzarSiError(error)
  return data
}

export const actualizarFase = async ({ estadoId, fase, valor }) => {
  const { error } = await supabase
    .from('estado_siembra')
    .update({ [fase]: valor, ultima_actualizacion: new Date().toISOString() })
    .eq('id', estadoId)
  lanzarSiError(error)
}

// ---------- Consulta fitosanitaria (RF-04) ----------
export const getInformacion = async () => {
  const { data, error } = await supabase
    .from('informacion')
    .select('id, cultivo_id, enfermedad_nombre, sintomas, consejo_fase_crecimiento, consejo_fase_maduracion, tratamiento_sugerido')
  lanzarSiError(error)
  return data
}

// ---------- Cosechas, lotes y remates (RF-05, RF-06, RF-07) ----------
export const getCosechas = async () => {
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('cosechas')
    .select(`
      id,
      siembra_id,
      cantidad_total,
      unidad_medida,
      fecha_cosecha,
      fecha_caducidad_estimada,
      cultivo ( id, nombre, categoria ),
      lotes (
        id,
        calidad_clasificacion,
        precio_base_lote,
        stock_disponible,
        alerta_remates ( id, precio_descuento, motivo_remate, fecha_inicio, fecha_fin, esta_activa )
      )
    `)
    .eq('productor_id', userId)
    .order('fecha_cosecha', { ascending: false })
  lanzarSiError(error)
  return data
}

// Si siembraId es null, el trigger asegurar_siembra_fantasma crea la siembra simulada (RF-05)
export const crearCosecha = async ({
  siembraId,
  cultivoId,
  cantidad,
  unidad,
  fechaCosecha,
  fechaCaducidad,
}) => {
  const productorId = await getUserId()
  const fila = {
    productor_id: productorId,
    cultivo_id: cultivoId,
    cantidad_total: cantidad,
    unidad_medida: unidad,
    fecha_cosecha: fechaCosecha,
    fecha_caducidad_estimada: fechaCaducidad,
  }
  if (siembraId) fila.siembra_id = siembraId

  const { data, error } = await supabase.from('cosechas').insert(fila).select('id').single()
  lanzarSiError(error)
  return data
}

export const crearLote = async ({ cosechaId, calidad, precio, cantidad }) => {
  const { error } = await supabase.from('lotes').insert({
    cosecha_id: cosechaId,
    calidad_clasificacion: calidad,
    precio_base_lote: precio,
    stock_disponible: cantidad,
  })
  lanzarSiError(error)
}

// alerta_remates.lote_id es UNIQUE: un lote tiene como máximo un remate, se crea o se actualiza
export const guardarRemate = async ({ loteId, precioDescuento, motivo, fechaFin }) => {
  const { error } = await supabase.from('alerta_remates').upsert(
    {
      lote_id: loteId,
      precio_descuento: precioDescuento,
      motivo_remate: motivo || MOTIVO_REMATE_DEFAULT,
      fecha_inicio: new Date().toISOString(),
      fecha_fin: new Date(`${fechaFin}T23:59:59`).toISOString(),
      esta_activa: true,
    },
    { onConflict: 'lote_id' },
  )
  lanzarSiError(error)
}

export const cambiarEstadoRemate = async ({ remateId, activa }) => {
  const { error } = await supabase.from('alerta_remates').update({ esta_activa: activa }).eq('id', remateId)
  lanzarSiError(error)
}

// ---------- Historial de ventas (RF-09) ----------
export const getVentas = async () => {
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('historial_venta')
    .select(`
      id,
      orden_id,
      cantidad_vendida,
      monto_total_neto,
      fecha_venta,
      lotes (
        calidad_clasificacion,
        cosechas ( unidad_medida, cultivo ( nombre ) )
      )
    `)
    .eq('productor_id', userId)
    .order('fecha_venta', { ascending: false })
  lanzarSiError(error)
  return data
}