import { supabase } from '../../../config/supabaseClient'
import { getRolUsuario } from '../../auth/services/authService'

export const getEntregasRelacionadas = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Iniciá sesión para ver tus entregas')

  const rol = await getRolUsuario(user.id)
  const esProductor = rol === 'productor'

  const ordenes = esProductor
    ? 'ordenes!inner ( id, historial_venta!inner ( productor_id ) )'
    : 'ordenes!inner ( id, comprador_id )'
  const filtro = esProductor
    ? 'pedido_entrega.ordenes.historial_venta.productor_id'
    : 'pedido_entrega.ordenes.comprador_id'

  const { data, error } = await supabase
    .from('det_entrega')
    .select(`
      id,
      distribuidor_id,
      precio_oferta_acarreo,
      distribuidor:perfiles!det_entrega_distribuidor_id_fkey ( nombre_completo ),
      vehiculo ( placa, tipo_vehiculo ),
      confirmacion_ubicacion ( reportado_por, compartio_ubicacion, comentario ),
      pedido_entrega!inner ( id, descripcion_carga, destino_direccion, estado_entrega, ${ordenes} )
    `)
    .eq('esta_aceptada', true)
    .eq(filtro, user.id)
    .order('fecha_oferta', { ascending: false })

  if (error) throw error
  return { userId: user.id, rol, entregas: data }
}

export const guardarConfirmacionUbicacion = async ({ detEntregaId, userId, comparto, comentario }) => {
  const { error } = await supabase.from('confirmacion_ubicacion').upsert(
    {
      det_entrega_id: detEntregaId,
      reportado_por: userId,
      compartio_ubicacion: comparto,
      comentario: comentario?.trim() || null,
      actualizado_en: new Date().toISOString(),
    },
    { onConflict: 'det_entrega_id,reportado_por' },
  )
  if (error) throw error
}