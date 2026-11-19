import { Link } from 'react-router-dom'
import { Sprout, Wheat, Ruler, Package, Tractor, ListChecks } from 'lucide-react'
import { useCultivos, useSiembras } from '../hooks/useProductor'
import { StatCard } from '../components/StatCard'
import { Cargando, ErrorCarga } from '../components/Estados'
import { formatFecha, getFaseBadge, unwrap } from '../utils/helpers'

const ACCESOS = [
  { to: '/productor/cultivos', titulo: 'Mis Cultivos', sub: 'Ver catálogo de especies', icono: Wheat, color: 'bg-emerald-100 text-emerald-900' },
  { to: '/productor/siembras/nueva', titulo: 'Registrar Siembra', sub: 'Iniciar nuevo lote/área', icono: Tractor, color: 'bg-amber-100 text-amber-700' },
  { to: '/productor/siembras', titulo: 'Estado de Siembras', sub: 'Monitorear fases activas', icono: ListChecks, color: 'bg-emerald-800 text-white' },
  { to: '/productor/cosechas', titulo: 'Registrar Cosecha', sub: 'Crear lotes para vender', icono: Package, color: 'bg-blue-100 text-blue-600' },
]

export const DashboardPage = () => {
  const { data: siembras = [], isLoading, error } = useSiembras()
  const { data: cultivos = [] } = useCultivos()

  if (isLoading) return <Cargando />
  if (error) return <ErrorCarga error={error} />

  const listas = siembras.filter((s) => unwrap(s.estado_siembra)?.fase_lista_cosecha).length
  const hectareas = siembras.reduce((acc, s) => acc + Number(s.hectareas_ocupadas || 0), 0)

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Panel Principal del Productor</h1>
        <p className="text-sm text-gray-500 mt-1">
          Resumen de operaciones agrícolas, siembras en curso e indicadores generales.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard etiqueta="Cultivos disponibles" valor={cultivos.length} nota="Catálogo de especies" icono={Wheat} tono="emerald" />
        <StatCard etiqueta="Siembras activas" valor={siembras.length - listas} nota="En proceso de cultivo" icono={Sprout} tono="blue" />
        <StatCard etiqueta="Hectáreas totales" valor={hectareas.toFixed(1)} nota="Área sembrada" icono={Ruler} tono="amber" />
        <StatCard etiqueta="Listas para cosecha" valor={listas} nota="Fase final completada" icono={Package} tono="purple" />
      </div>

      <div>
        <h2 className="text-base font-bold text-gray-800 mb-3">Accesos Directos</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ACCESOS.map(({ to, titulo, sub, icono: Icono, color }) => (
            <Link
              key={to}
              to={to}
              className="bg-white hover:bg-emerald-50/50 p-4 rounded-xl border border-gray-200 text-left transition shadow-sm group"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform ${color}`}>
                <Icono className="w-5 h-5" />
              </div>
              <div className="font-semibold text-gray-800 text-sm">{titulo}</div>
              <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800 text-base">Siembras Recientes</h2>
          <Link to="/productor/siembras" className="text-xs text-emerald-700 font-semibold hover:underline">
            Ver todas →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase border-b border-gray-100">
              <tr>
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Cultivo</th>
                <th className="px-5 py-3">Fecha siembra</th>
                <th className="px-5 py-3">Hectáreas</th>
                <th className="px-5 py-3">Tipo de suelo</th>
                <th className="px-5 py-3">Fase actual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {siembras.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-6 text-center text-gray-400">
                    No hay siembras registradas aún.
                  </td>
                </tr>
              )}
              {siembras.slice(0, 5).map((s) => {
                const badge = getFaseBadge(unwrap(s.estado_siembra))
                return (
                  <tr key={s.id} className="hover:bg-gray-50/80 transition">
                    <td className="px-5 py-3 font-mono text-xs font-bold text-gray-500">#{s.id.slice(0, 8)}</td>
                    <td className="px-5 py-3 font-semibold text-gray-800">{unwrap(s.cultivo)?.nombre}</td>
                    <td className="px-5 py-3 text-gray-600">{formatFecha(s.fecha_siembra)}</td>
                    <td className="px-5 py-3 font-semibold">{s.hectareas_ocupadas} ha</td>
                    <td className="px-5 py-3 text-gray-600">{s.tipo_suelo || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.clase}`}>{badge.label}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}