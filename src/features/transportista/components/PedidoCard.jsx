import { User, Calendar, MapPin, ChevronRight } from 'lucide-react'

export const formatearFecha = (iso) =>
  new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })

export const codigoPedido = (id) => `#TR-${String(id).slice(0, 4).toUpperCase()}`

export const PedidoCard = ({ pedido, estadoLabel, onVerDetalles }) => {
  const nombre = pedido.ordenes?.perfiles?.nombre_completo || 'Cliente sin nombre'

  return (
    <div className="bg-white rounded-2xl border-l-4 border-l-[#3d7289] shadow-sm flex flex-col md:flex-row md:items-center gap-5 p-5">
      <div className="flex items-center gap-4 md:w-72">
        <span className="flex items-center justify-center w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 text-[#3d7289] shrink-0">
          <User className="w-6 h-6" />
        </span>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-[#3d7289] bg-slate-100 rounded px-2 py-0.5">
              {codigoPedido(pedido.id)}
            </span>
            <span className="text-xs font-medium text-green-700 bg-green-50 rounded-full px-2 py-0.5">
              ● {estadoLabel}
            </span>
          </div>
          <p className="font-bold text-slate-900 uppercase">{nombre}</p>
        </div>
      </div>

      <div className="flex items-start gap-3 md:w-44">
        <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
        <div>
          <p className="text-[11px] tracking-wider text-slate-400 uppercase">Fecha programada</p>
          <p className="text-sm font-medium text-slate-800">{formatearFecha(pedido.creado_en)}</p>
        </div>
      </div>

      <div className="flex items-start gap-3 flex-1">
        <MapPin className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-[11px] tracking-wider text-slate-400 uppercase">Dirección de entrega</p>
          <p className="text-sm text-slate-800">{pedido.destino_direccion || 'Sin dirección registrada'}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onVerDetalles(pedido.id)}
        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold rounded-lg transition-colors"
      >
        Ver Detalles
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}