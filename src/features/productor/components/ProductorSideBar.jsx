import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Sprout, Tractor, ListChecks, Package, Tag, Receipt, ChevronRight } from 'lucide-react'

const NAV = [
  { to: '/productor', label: 'Panel Principal', icono: LayoutDashboard, activo: 'bg-emerald-700', end: true },
  { to: '/productor/cultivos', label: 'Mis Cultivos', icono: Sprout, activo: 'bg-blue-600' },
  { to: '/productor/siembras/nueva', label: 'Registrar Siembra', icono: Tractor, activo: 'bg-emerald-700' },
  { to: '/productor/siembras', label: 'Estado de Siembras', icono: ListChecks, activo: 'bg-emerald-900', end: true },
  { to: '/productor/cosechas', label: 'Cosechas y Lotes', icono: Package, activo: 'bg-emerald-700' },
  { to: '/productor/remates', label: 'Remates', icono: Tag, activo: 'bg-emerald-700' },
  { to: '/productor/ventas', label: 'Historial de Ventas', icono: Receipt, activo: 'bg-emerald-700' },
]

export const ProductorSidebar = ({ perfil }) => (
  <aside className="w-full md:w-64 bg-gray-100/70 border-r border-gray-200 p-4 md:p-6 flex flex-col gap-2 shrink-0">
    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1 hidden md:block">
      Menú Productor
    </div>

    {NAV.map(({ to, label, icono: Icono, activo, end }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        className={({ isActive }) =>
          `w-full px-4 py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-between ${
            isActive
              ? `${activo} text-white shadow-sm`
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`
        }
      >
        <span className="flex items-center gap-3">
          <Icono className="w-4 h-4" />
          {label}
        </span>
        <ChevronRight className="w-4 h-4 opacity-60" />
      </NavLink>
    ))}

    <div className="mt-auto pt-6 hidden md:block">
      <div className="bg-white border border-emerald-100 rounded-xl p-3.5 shadow-sm text-xs text-gray-600">
        <div className="font-semibold text-emerald-900 mb-1">Productor conectado</div>
        <p className="text-gray-500">
          Nombre: <span className="font-medium text-gray-700">{perfil.nombre_completo}</span>
        </p>
        <p className="text-gray-500">
          ID: <span className="font-mono font-medium text-gray-700">{perfil.id.slice(0, 8)}</span>
        </p>
        <p className="text-gray-500">
          Finca: <span className="font-medium text-gray-700">{perfil.direccion_general || 'Sin dirección'}</span>
        </p>
      </div>
    </div>
  </aside>
)