import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useEntregas } from '../hooks/useEntregas'
import { EntregaCard } from '../components/EntregaCard'

export const EntregasPage = () => {
  const { data, isLoading, error } = useEntregas()

  return (
    <div className="min-h-screen bg-cream">
      <main className="max-w-3xl mx-auto px-6 py-8">
        <Link to="/tienda" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Volver al catálogo
        </Link>

        <h1 className="text-2xl font-bold text-ink mb-1">Mis entregas</h1>
        <p className="text-sm text-muted mb-6">Contactá al transportista y reportá si compartió su ubicación</p>

        {isLoading && <p className="py-16 text-center text-muted">Cargando entregas…</p>}
        {error && <p className="p-4 bg-sale/10 text-sale rounded-lg border border-sale/30">{error.message}</p>}
        {data?.entregas.length === 0 && (
          <p className="py-16 text-center text-muted bg-white rounded-2xl border border-line">
            No tenés entregas con transportista asignado.
          </p>
        )}

        <div className="space-y-4">
          {data?.entregas.map((entrega) => (
            <EntregaCard key={entrega.id} entrega={entrega} userId={data.userId} />
          ))}
        </div>
      </main>
    </div>
  )
}