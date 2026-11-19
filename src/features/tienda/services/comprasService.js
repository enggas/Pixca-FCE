import { supabase } from '../../../config/supabaseClient'

export const procesarCompra = async ({ items, direccion, latitud, longitud, pluscode }) => {
  const { data, error } = await supabase.rpc('procesar_compra', {
    p_items: items,
    p_direccion: direccion,
    p_latitud: latitud,
    p_longitud: longitud,
    p_pluscode: pluscode,
  })
  if (error) throw error
  return data // id de la orden
}

export const getMisPedidos = async () => {
  const { data, error } = await supabase
    .from('ordenes')
    .select(`
      id, total_monto, direccion_envio, latitud, longitud, pluscode, estado_orden, creado_en,
      carrito (
        id, cantidad, precio_unitario_guardado,
        lotes ( calidad_clasificacion, cosechas ( unidad_medida, cultivo ( nombre ) ) )
      ),
      pedido_entrega (
        id, descripcion_carga, estado_entrega, creado_en,
        det_entrega (
          id, precio_oferta_acarreo, esta_aceptada, fecha_oferta,
          perfiles ( nombre_completo, telefono ),
          vehiculo ( placa, tipo_vehiculo, capacidad_carga_libras ),
          estado_entrega ( ultima_latitud_gps, ultima_longitud_gps, ultima_actualizacion_tiempo, observaciones_ruta ),
          historial_entregas ( fecha_salida, fecha_llegada_real, distancia_recorrida_km, recibido_por_nombre, concluido_con_exito )
        )
      )
    `)
    .order('creado_en', { ascending: false })

  if (error) throw error
  return data
}

export const aceptarOfertaEntrega = async (detEntregaId) => {
  const { error } = await supabase.rpc('aceptar_oferta_entrega', { p_det_entrega_id: detEntregaId })
  if (error) throw error
}