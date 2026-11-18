import { NavLink } from 'react-router-dom'
import { Clock, History } from 'lucide-react'
import { usePedidosEntrega } from '../hooks/usePedidosEntrega'

const tab = ({ isActive }) =>
  `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
    isActive ? 'bg-green-700 text-white' : 'text-slate-600 hover:bg-slate-100'
  }`

export const PanelHeader = ({ titulo, subtitulo }) => {
  const { data: pedidos } = usePedidosEntrega()

  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#3d7289] bg-white rounded-full px-3 py-1 mb-3">
          <span className="w-2 h-2 rounded-full bg-green-600" />
          Panel Operativo de Logística
        </span>
        <h1 className="text-3xl font-bold text-slate-900">{titulo}</h1>
        <p className="text-sm text-slate-600">{subtitulo}</p>
      </div>

      <nav className="flex gap-1 p-1.5 bg-white rounded-2xl border border-slate-200">
        <NavLink to="/transportista" end className={tab}>
          <Clock className="w-4 h-4" />
          Pedidos Pendientes
          <span className="text-xs bg-white/25 rounded-full px-2 py-0.5">{pedidos?.length ?? 0}</span>
        </NavLink>
        <NavLink to="/transportista/historial" className={tab}>
          <History className="w-4 h-4" />
          Historial Traslados
        </NavLink>
      </nav>
    </div>
  )
}