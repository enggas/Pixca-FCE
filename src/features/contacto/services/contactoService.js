import { supabase } from '../../../config/supabaseClient'

// Abre WhatsApp sin que el frontend llegue a manejar el teléfono como dato visible.
export const abrirWhatsApp = async (destinoId, mensaje = '') => {
  // Se abre antes del await para que el navegador no bloquee la ventana emergente
  const ventana = window.open('', '_blank')
  try {
    const { data, error } = await supabase.rpc('whatsapp_destino', { p_destino: destinoId })
    if (error) throw error
    const url = `${data}?text=${encodeURIComponent(mensaje)}`
    if (ventana) ventana.location.href = url
    else window.location.href = url
  } catch (err) {
    ventana?.close()
    throw err
  }
}