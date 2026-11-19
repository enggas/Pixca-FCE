import { useState } from 'react'
import { Info, Save } from 'lucide-react'
import { UNIDADES } from '../utils/constantes'
import { formatFecha, hoy, unwrap } from '../utils/helpers'
import { btnPrimario, btnSecundario, inputClass, labelClass } from '../utils/estilos'

export const CosechaForm = ({ cultivos, siembras, enviando, onSubmit, onCancel }) => {
  const [siembraId, setSiembraId] = useState('')
  const [cultivoId, setCultivoId] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [unidad, setUnidad] = useState('libras')
  const [fechaCosecha, setFechaCosecha] = useState(hoy())
  const [fechaCaducidad, setFechaCaducidad] = useState('')
  const [error, setError] = useState(null)

  const siembraSeleccionada = siembras.find((siembra) => siembra.id === siembraId)
  const cultivoFinal = siembraSeleccionada ? unwrap(siembraSeleccionada.cultivo)?.id : cultivoId

  const handleSubmit = (event) => {
    event.preventDefault()
    setError(null)
    if (!cultivoFinal) return setError('Selecciona un cultivo o una siembra')
    if (fechaCaducidad < fechaCosecha) return setError('La fecha de caducidad no puede ser anterior a la cosecha')
    onSubmit({
      siembraId: siembraId || null,
      cultivoId: cultivoFinal,
      cantidad: Number(cantidad),
      unidad,
      fechaCosecha,
      fechaCaducidad,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
      <h2 className="font-bold text-gray-900">Registrar cosecha</h2>

      {error && (
        <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Siembra de origen</label>
          <select value={siembraId} onChange={(e) => setSiembraId(e.target.value)} className={inputClass}>
            <option value="">Sin siembra previa (cosecha directa)</option>
            {siembras.map((siembra) => (
              <option key={siembra.id} value={siembra.id}>
                {unwrap(siembra.cultivo)?.nombre} · {formatFecha(siembra.fecha_siembra)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>
            Cultivo <span className="text-red-500">*</span>
          </label>
          <select
            required={!siembraId}
            disabled={Boolean(siembraId)}
            value={siembraSeleccionada ? cultivoFinal : cultivoId}
            onChange={(e) => setCultivoId(e.target.value)}
            className={`${inputClass} disabled:bg-gray-50 disabled:text-gray-500`}
          >
            <option value="">-- Seleccionar cultivo --</option>
            {cultivos.map((cultivo) => (
              <option key={cultivo.id} value={cultivo.id}>
                {cultivo.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>
            Cantidad obtenida <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            required
            min="0.01"
            step="0.01"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            placeholder="Ej: 1200"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Unidad de medida <span className="text-red-500">*</span>
          </label>
          <select value={unidad} onChange={(e) => setUnidad(e.target.value)} className={inputClass}>
            {UNIDADES.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>
            Fecha de cosecha <span className="text-red-500">*</span>
          </label>
          <input type="date" required value={fechaCosecha} onChange={(e) => setFechaCosecha(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>
            Caducidad estimada <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            required
            min={fechaCosecha}
            value={fechaCaducidad}
            onChange={(e) => setFechaCaducidad(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {!siembraId && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          <span>
            Al registrar una cosecha sin siembra previa, el sistema creará internamente una siembra simulada para
            mantener la consistencia de los datos.
          </span>
        </div>
      )}

      <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
        <button type="button" onClick={onCancel} className={btnSecundario}>
          Cancelar
        </button>
        <button type="submit" disabled={enviando} className={btnPrimario}>
          <Save className="w-4 h-4" />
          {enviando ? 'Guardando…' : 'Guardar cosecha'}
        </button>
      </div>
    </form>
  )
}