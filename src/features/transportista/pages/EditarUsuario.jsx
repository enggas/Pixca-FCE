import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { usePerfilActual } from '../hooks/usePedidosEntrega'
import { actualizarPerfil } from '../services/transportistaService'

const input =
  'w-full px-3 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent'

export const EditarUsuario = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: perfil, isLoading, error } = usePerfilActual()

  const [form, setForm] = useState({ nombre_completo: '', telefono: '', direccion_general: '' })
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState(null)

  useEffect(() => {
    if (perfil) {
      setForm({
        nombre_completo: perfil.nombre_completo || '',
        telefono: perfil.telefono || '',
        direccion_general: perfil.direccion_general || '',
      })
    }
  }, [perfil])

  const handleChange = (campo) => (e) => setForm((prev) => ({ ...prev, [campo]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setMensaje(null)
    try {
      await actualizarPerfil(perfil.id, form)
      queryClient.invalidateQueries({ queryKey: ['perfil-actual'] })
      setMensaje({ tipo: 'ok', texto: 'Datos actualizados correctamente' })
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.message })
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-sm p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Editar Usuario</h1>
      <p className="text-sm text-slate-600 mb-6">Actualiza los datos de tu cuenta.</p>

      {isLoading && <p className="text-slate-500">Cargando datos...</p>}
      {error && <p className="text-red-600 text-sm">Error: {error.message}</p>}

      {perfil && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {mensaje && (
            <p
              role="alert"
              className={`text-sm rounded-lg px-3 py-2 border ${
                mensaje.tipo === 'ok'
                  ? 'text-green-700 bg-green-50 border-green-200'
                  : 'text-red-600 bg-red-50 border-red-200'
              }`}
            >
              {mensaje.texto}
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo electrónico</label>
            <input value={perfil.email || ''} disabled className={`${input} bg-slate-100 text-slate-500`} />
          </div>

          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 mb-1.5">
              Nombre completo
            </label>
            <input id="nombre" required value={form.nombre_completo} onChange={handleChange('nombre_completo')} className={input} />
          </div>

          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-slate-700 mb-1.5">
              Teléfono
            </label>
            <input id="telefono" type="tel" value={form.telefono} onChange={handleChange('telefono')} className={input} />
          </div>

          <div>
            <label htmlFor="direccion" className="block text-sm font-medium text-slate-700 mb-1.5">
              Dirección general
            </label>
            <input id="direccion" value={form.direccion_general} onChange={handleChange('direccion_general')} className={input} />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/transportista')}
              className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Volver
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="flex-1 py-2.5 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition-colors disabled:opacity-60"
            >
              {guardando ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}