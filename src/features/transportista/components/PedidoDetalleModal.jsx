import { useEffect } from 'react'
import { X } from 'lucide-react'
import { usePedidoDetalle } from '../hooks/usePedidosEntrega'
import { formatearFecha, codigoPedido } from './PedidoCard'

const Fila = ({ etiqueta, valor }) => (
  <div className="flex justify-between gap-4 py-2.5 border-b border-slate-100 last:border-0">
    <span className="text-sm text-slate-500">{etiqueta}</span>
    <span className="text-sm font-medium text-slate-900 text-right">{valor}</span>
  </div>
)

export const PedidoDetalleModal = ({ pedidoId, onClose }) => {
  const { data: pedido, isLoading, error } = usePedidoDetalle(pedidoId)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const orden = pedido?.ordenes
  const cliente = orden?.perfiles
  const monto = orden?.monto_total

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Detalles del pedido</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading && <p className="py-6 text-center text-slate-500">Cargando…</p>}
        {error && <p className="text-sm text-red-600">No se pudo cargar: {error.message}</p>}

        {pedido && (
          <div>
            <Fila etiqueta="Código" valor={codigoPedido(pedido.id)} />
            <Fila etiqueta="Estado" valor={pedido.estado_entrega} />
            <Fila etiqueta="Fecha" valor={formatearFecha(pedido.creado_en)} />
            <Fila etiqueta="Cliente" valor={cliente?.nombre_completo || '—'} />
            <Fila etiqueta="Teléfono" valor={cliente?.telefono || '—'} />
            <Fila etiqueta="Dirección de entrega" valor={pedido.destino_direccion || '—'} />
            {monto != null && (
              <Fila etiqueta="Monto de la orden" valor={`C$ ${Number(monto).toLocaleString('es-NI')}`} />
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}