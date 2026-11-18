import { useState } from 'react'
import { usePedidosEntrega } from '../hooks/usePedidosEntrega'
import { PanelHeader } from '../components/PanelHeader'
import { PedidoCard } from '../components/PedidoCard'
import { PedidoDetalleModal } from '../components/PedidoDetalleModal'

export const TransportistaHome = () => {
  const { data: pedidos, isLoading, error } = usePedidosEntrega()
  const [pedidoId, setPedidoId] = useState(null)

  return (
    <>
      <PanelHeader
        titulo="Pedidos Pendientes de Traslado"
        subtitulo="Gestiona las recolecciones asignadas y consulta los detalles de entrega de cada cliente."
      />

      <div className="space-y-4">
        {isLoading && <p className="p-8 text-center text-slate-500">Cargando pedidos disponibles...</p>}

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
            Error al obtener los datos: {error.message}
          </div>
        )}

        {pedidos?.length === 0 && (
          <div className="p-8 text-center text-slate-500 bg-white rounded-xl">
            No hay pedidos pendientes en este momento.
          </div>
        )}

        {pedidos?.map((pedido) => (
          <PedidoCard
            key={pedido.id}
            pedido={pedido}
            estadoLabel="Listo para traslado"
            onVerDetalles={setPedidoId}
          />
        ))}
      </div>

      {pedidoId && <PedidoDetalleModal pedidoId={pedidoId} onClose={() => setPedidoId(null)} />}
    </>
  )
}