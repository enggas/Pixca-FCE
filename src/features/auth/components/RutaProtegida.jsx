import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../../../config/supabaseClient'
import { getRolUsuario } from '../services/authService'

export const RutaProtegida = ({ rolPermitido, children }) => {
  const [estado, setEstado] = useState({ cargando: true, sesion: false, rol: null })

  useEffect(() => {
    let activo = true
    const verificar = async () => {
      const { data } = await supabase.auth.getSession()
      const user = data.session?.user
      if (!user) {
        if (activo) setEstado({ cargando: false, sesion: false, rol: null })
        return
      }
      let rol = null
      try {
        rol = await getRolUsuario(user.id)
      } catch {
        rol = null
      }
      if (activo) setEstado({ cargando: false, sesion: true, rol })
    }
    verificar()
    return () => {
      activo = false
    }
  }, [])

  if (estado.cargando) {
    return <div className="min-h-screen flex items-center justify-center text-muted">Cargando…</div>
  }
  if (!estado.sesion) return <Navigate to="/login" replace />
  if (rolPermitido && estado.rol !== rolPermitido) return <Navigate to="/" replace />

  return children
}