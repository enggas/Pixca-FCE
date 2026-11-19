import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Info, Tractor } from 'lucide-react'
import { useCrearSiembra, useCultivos } from '../hooks/useProductor'
import { useToast } from '../hooks/toastContext'
import { TIPOS_SUELO } from '../utils/constantes'
import { hoy } from '../utils/helpers'
import { btnPrimario, btnSecundario, inputClass, labelClass } from '../utils/estilos'

export const NuevaSiembraPage = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const toast = useToast()
  const { data: cultivos = [] } = useCultivos()
  const crearSiembra = useCrearSiembra()

  const [cultivoId, setCultivoId] = useState(state?.cultivoId ?? '')
  const [fechaSiembra, setFechaSiembra] = useState(hoy())
  const [hectareas, setHectareas] = useState('')
  const [tipoSuelo, setTipoSuelo] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await crearSiembra.mutateAsync({
        cultivoId,
        fechaSiembra,
        tipoSuelo,
        hectareas: Number(hectareas),
      })
      toast('Siembra registrada. Cronograma de fases inicializado.')
      navigate('/productor/siembras')
    } catch (err) {
      toast(`No se pudo guardar la siembra: ${err.message}`, 'error')
    }
  }

  return (
    <section className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          to="/productor/siembras"
          className="text-xs text-gray-500 hover:text-emerald-700 font-medium flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="w-3 h-3" />
          Ver siembras registradas
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Registrar Nueva Siembra</h1>
        <p className="text-sm text-gray-500">Asocia una nueva siembra a un cultivo del catálogo.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>
              Cultivo <span className="text-red-500">*</span>
            </label>
            <select required value={cultivoId} onChange={(e) => setCultivoId(e.target.value)} className={inputClass}>
              <option value="">-- Seleccionar cultivo --</option>
              {cultivos.map((cultivo) => (
                <option key={cultivo.id} value={cultivo.id}>
                  {cultivo.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Fecha de inicio <span className="text-red-500">*</span>
              </label>
              <input type="date" required value={fechaSiembra} onChange={(e) => setFechaSiembra(e.target.value)} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>
                Hectáreas ocupadas <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0.1"
                max="1000"
                value={hectareas}
                onChange={(e) => setHectareas(e.target.value)}
                placeholder="Ej: 3.5"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Tipo de suelo <span className="text-red-500">*</span>
            </label>
            <select required value={tipoSuelo} onChange={(e) => setTipoSuelo(e.target.value)} className={inputClass}>
              <option value="">-- Seleccionar tipo de suelo --</option>
              {TIPOS_SUELO.map((suelo) => (
                <option key={suelo.value} value={suelo.value}>
                  {suelo.value} - {suelo.descripcion}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              Al registrar la siembra se creará automáticamente el cronograma con las fases (semilla, germinación,
              crecimiento, floración, maduración y listo para cosecha) en estado inactivo.
            </span>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
            <button type="button" onClick={() => navigate('/productor')} className={btnSecundario}>
              Cancelar
            </button>
            <button type="submit" disabled={crearSiembra.isPending} className={btnPrimario}>
              <Tractor className="w-4 h-4" />
              {crearSiembra.isPending ? 'Guardando…' : 'Guardar Siembra'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}