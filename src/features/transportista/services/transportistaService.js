import { supabase } from '@/config/supabaseClient'

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
        perfiles ( nombre_completo )
      )
    `)
    .eq('estado_entrega', 'asignado')
    .order('creado_en', { ascending: false })

  if (error) {
    console.error('Error detallado de Supabase:', error)
    throw error
  }
  return data
}

export const getMisOfertas = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Iniciá sesión para ver tus ofertas')

  const { data, error } = await supabase
    .from('det_entrega')
    .select(`
      id,
      precio_oferta_acarreo,
      esta_aceptada,
      fecha_oferta,
      vehiculo ( placa, tipo_vehiculo ),
      pedido_entrega ( descripcion_carga, destino_direccion )
    `)
    .eq('distribuidor_id', user.id)
    .order('fecha_oferta', { ascending: false })

  if (error) throw error
  return data
}

export const actualizarOfertaAcarreo = async ({ id, precio }) => {
  if (!Number.isFinite(precio) || precio <= 0) {
    throw new Error('Ingresá un precio válido mayor a 0')
  }

  const { data, error } = await supabase
    .from('det_entrega')
    .update({ precio_oferta_acarreo: precio })
    .eq('id', id)
    .eq('esta_aceptada', false)
    .select('id')

  if (error) throw error
  if (!data?.length) throw new Error('La oferta ya fue aceptada y no se puede editar')
  return data[0]
}