import { useState } from 'react'
import { Modal } from './Modal'
import { CALIDADES } from '../utils/constantes'
import { formatCordobas, unidadCorta } from '../utils/helpers'
import { btnPrimario, btnSecundario, inputClass, labelClass } from '../utils/estilos'

export const LoteModal = ({ cosecha, enviando, onSubmit, onClose }) => {
  const [calidad, setCalidad] = useState(CALIDADES[1])
  const [precio, setPrecio] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [error, setError] = useState(null)

  const unidad = unidadCorta(cosecha.unidad_medida)
  const asignado = (cosecha.lotes ?? []).reduce((acc, lote) => acc + Number(lote.stock_disponible), 0)
  const restante = Math.max(Number(cosecha.cantidad_total) - asignado, 0)

  const handleSubmit = (event) => {
    event.preventDefault()
    setError(null)
    if (Number(cantidad) > restante) {
      return setError(`Solo quedan ${restante} ${unidad} sin asignar a lotes`)
    }
    onSubmit({ cosechaId: cosecha.id, calidad, precio: Number(precio), cantidad: Number(cantidad) })
  }

  return (
    <Modal
      titulo="Agregar lote comercial"
      descripcion={`Desglosa la cosecha de ${cosecha.cultivo?.nombre}. Sin asignar: ${restante} ${unidad}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div>
          <label className={labelClass}>Clasificación de calidad</label>
          <select value={calidad} onChange={(e) => setCalidad(e.target.value)} className={inputClass}>
            {CALIDADES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Precio base (C$/{unidad})</label>
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className={inputClass}
            />
            {precio && <span className="text-xs text-gray-400 mt-1 block">{formatCordobas(precio)}/{unidad}</span>}
          </div>
          <div>
            <label className={labelClass}>Cantidad ({unidad})</label>
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              max={restante}
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className={btnSecundario}>
            Cancelar
          </button>
          <button type="submit" disabled={enviando || restante <= 0} className={btnPrimario}>
            {enviando ? 'Guardando…' : 'Guardar lote'}
          </button>
        </div>
      </form>
    </Modal>
  )
}