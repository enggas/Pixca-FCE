import { useState } from 'react'
import { Modal } from './Modal'
import { MOTIVO_REMATE_DEFAULT } from '../utils/constantes'
import { formatCordobas, hoy, unidadCorta } from '../utils/helpers'
import { btnPrimario, btnSecundario, inputClass, labelClass } from '../utils/estilos'

export const RemateModal = ({ lote, enviando, onSubmit, onClose }) => {
  const remate = lote.remate
  const [precio, setPrecio] = useState(remate?.precio_descuento ?? '')
  const [motivo, setMotivo] = useState(remate?.motivo_remate ?? MOTIVO_REMATE_DEFAULT)
  const [fechaFin, setFechaFin] = useState(
    remate ? new Date(remate.fecha_fin).toLocaleDateString('en-CA') : lote.cosecha.fecha_caducidad_estimada,
  )
  const [error, setError] = useState(null)

  const unidad = unidadCorta(lote.cosecha.unidad_medida)
  const precioBase = Number(lote.precio_base_lote)

  const handleSubmit = (event) => {
    event.preventDefault()
    setError(null)
    if (Number(precio) >= precioBase) {
      return setError('El precio de remate debe ser menor al precio base')
    }
    onSubmit({ loteId: lote.id, precioDescuento: Number(precio), motivo: motivo.trim(), fechaFin })
  }

  const descuento = precio ? Math.round((1 - Number(precio) / precioBase) * 100) : null

  return (
    <Modal
      titulo={remate ? 'Editar remate' : 'Crear remate'}
      descripcion={`${lote.cosecha.cultivo?.nombre} · ${lote.calidad_clasificacion} · Precio base ${formatCordobas(precioBase)}/${unidad}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div>
          <label className={labelClass}>Precio de remate (C$/{unidad})</label>
          <input
            type="number"
            required
            min="0.01"
            step="0.01"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className={inputClass}
          />
          {descuento > 0 && <span className="text-xs text-amber-700 mt-1 block">Descuento de {descuento}%</span>}
        </div>

        <div>
          <label className={labelClass}>Motivo</label>
          <input
            type="text"
            required
            maxLength={150}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Fecha límite de la oferta</label>
          <input type="date" required min={hoy()} value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className={inputClass} />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className={btnSecundario}>
            Cancelar
          </button>
          <button type="submit" disabled={enviando} className={btnPrimario}>
            {enviando ? 'Guardando…' : 'Publicar remate'}
          </button>
        </div>
      </form>
    </Modal>
  )
}