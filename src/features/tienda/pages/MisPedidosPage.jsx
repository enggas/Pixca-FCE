import { Link } from 'react-router-dom'
import { TiendaTopBar } from '../components/TiendaTopBar'
import { PedidoCard } from '../components/PedidoCard'
import { useMisPedidos } from '../hooks/useMisPedidos'

export const MisPedidosPage = () => {
  const { data: pedidos, isLoading, error } = useMisPedidos()

  return (
    <div className="min-h-screen bg-cream">
      <TiendaTopBar />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-ink mb-1">Mis pedidos</h1>
        <p className="text-sm text-muted mb-6">Compras, ofertas de transporte y seguimiento de entregas</p>

        {isLoading && <div className="py-16 text-center text-muted">Cargando pedidos…</div>}

        {error && (
          <div className="p-4 bg-sale/10 text-sale rounded-lg border border-sale/30">
            No se pudieron cargar tus pedidos: {error.message}
          </div>
        )}

        {!isLoading && !error && pedidos?.length === 0 && (
          <div className="py-16 text-center bg-white rounded-2xl border border-line">
            <p className="text-muted mb-4">Todavía no has hecho ninguna compra.</p>
            <Link to="/tienda" className="px-5 py-2.5 bg-brand-500 hover:bg-brand-700 text-white font-semibold rounded-lg transition-colors">
              Ir al catálogo
            </Link>
          </div>
        )}

        <div className="space-y-5">
          {pedidos?.map((orden) => (
            <PedidoCard key={orden.id} orden={orden} />
          ))}
        </div>
      </main>
    </div>
  )
}