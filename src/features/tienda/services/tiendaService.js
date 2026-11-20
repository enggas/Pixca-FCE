import { supabase } from '../../../config/supabaseClient'

export const getLotesDisponibles = async () => {
  const { data, error } = await supabase
    .from('lotes')
    .select(`
      id,
      calidad_clasificacion,
      precio_base_lote,
      stock_disponible,
      creado_en,
      cosechas (
        id,
        unidad_medida,
        cantidad_total,
        fecha_cosecha,
        fecha_caducidad_estimada,
        cultivo ( nombre, categoria, descripcion ),
        productor_id,
        perfiles ( nombre_completo, direccion_general, telefono )
      ),
      alerta_remates ( precio_descuento, esta_activa, fecha_fin, motivo_remate )
    `)
    .gt('stock_disponible', 0)
    .order('creado_en', { ascending: false })

  if (error) throw error
  return data
}