import { useState } from 'react'
import { useHistorialTraslados } from '../hooks/usePedidosEntrega'
import { PanelHeader } from '../components/PanelHeader'
import { PedidoCard } from '../components/PedidoCard'
import { PedidoDetalleModal } from '../components/PedidoDetalleModal'

export const HistorialTraslados = () => {
  const { data: traslados, isLoading, error } = useHistorialTraslados()
  const [pedidoId, setPedidoId] = useState(null)

  return (
    <>
      <PanelHeader
        titulo="Historial de Traslados"
        subtitulo="Todos los traslados que has realizado."
      />

      <div className="space-y-4">
        {isLoading && <p className="p-8 text-center text-slate-500">Cargando historial...</p>}

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
            Error al obtener el historial: {error.message}
          </div>
        )}

        {traslados?.length === 0 && (
          <div className="p-8 text-center text-slate-500 bg-white rounded-xl">
            Aún no has realizado traslados.
          </div>
        )}

        {traslados?.map((pedido) => (
          <PedidoCard
            key={pedido.id}
            pedido={pedido}
            estadoLabel="Entregado"
            onVerDetalles={setPedidoId}
          />
        ))}
      </div>

      {pedidoId && <PedidoDetalleModal pedidoId={pedidoId} onClose={() => setPedidoId(null)} />}
    </>
  )
}