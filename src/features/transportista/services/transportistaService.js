import { supabase } from '@/config/supabaseClient'

// ⚠️ Ajusta estos valores a tu ENUM / columnas reales
const ESTADO_PENDIENTE = 'buscando_distribuidor'
const ESTADO_HISTORIAL = 'entregado'
const COLUMNA_DISTRIBUIDOR = 'distribuidor_id'

export const getPedidosEntrega = async () => {
  const { data, error } = await supabase
    .from('pedido_entrega')
    .select(`
      id,
      destino_direccion,
      creado_en,
      estado_entrega,
      ordenes (
        id,
        comprador_id,
        perfiles ( nombre_completo, telefono )
      )
    `)
    .eq('estado_entrega', ESTADO_PENDIENTE)
    .order('creado_en', { ascending: false })

  if (error) throw error
  return data
}

export const getHistorialTraslados = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No hay una sesión activa')

  const { data, error } = await supabase
    .from('pedido_entrega')
    .select(`
      id,
      destino_direccion,
      creado_en,
      estado_entrega,
      ordenes (
        id,
        comprador_id,
        perfiles ( nombre_completo, telefono )
      )
    `)
    .eq('estado_entrega', ESTADO_HISTORIAL)
    .eq(COLUMNA_DISTRIBUIDOR, user.id)
    .order('creado_en', { ascending: false })

  if (error) throw error
  return data
}

export const getPedidoDetalle = async (id) => {
  const { data, error } = await supabase
    .from('pedido_entrega')
    .select(`
      *,
      ordenes (
        *,
        perfiles ( nombre_completo, telefono )
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export const getPerfilActual = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No hay una sesión activa')

  const { data, error } = await supabase
    .from('perfiles')
    .select('id, nombre_completo, telefono, direccion_general')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return { ...data, email: user.email }
}

export const actualizarPerfil = async (id, campos) => {
  const { error } = await supabase.from('perfiles').update(campos).eq('id', id)
  if (error) throw error
}