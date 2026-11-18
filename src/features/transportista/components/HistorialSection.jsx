import { MapPin, Package, User } from 'lucide-react'
import { useHistorial } from '../hooks/useTransportista'
import { formatCordobas, formatFechaHora } from '../utils/formato'
import { Cargando, ErrorMsg, Vacio, SeccionTitulo } from './TransportistaUI'

export const HistorialSection = () => {
  const { data: historial, isLoading, error } = useHistorial()

  return (
    <section>
      <SeccionTitulo titulo="Historial de entregas" descripcion="Entregas que ya cerraste." />

      {isLoading && <Cargando texto="Cargando historial…" />}
      {error && <ErrorMsg error={error} />}
      {historial?.length === 0 && <Vacio texto="Todavía no tenés entregas finalizadas." />}

      <div className="space-y-4">
        {historial?.map((registro) => {
          const pedido = registro.det_entrega?.pedido_entrega
          return (
            <article key={registro.id} className="bg-white border border-line rounded-2xl p-5 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <p className="flex items-start gap-2 text-sm text-strong">
                  <Package className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />
                  {pedido?.descripcion_carga}
                </p>
                <span
                  className={`text-xs font-semibold rounded-full px-3 py-1 border shrink-0 ${
                    registro.concluido_con_exito
                      ? 'bg-brand-50 text-brand-700 border-brand-100'
                      : 'bg-sale/10 text-sale border-sale/30'
                  }`}
                >
                  {registro.concluido_con_exito ? 'Exitosa' : 'Con inconvenientes'}
                </span>
              </div>
              <p className="flex items-start gap-2 text-sm text-body">
                <MapPin className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />
                {pedido?.destino_direccion}
              </p>
              <p className="flex items-center gap-2 text-sm text-body">
                <User className="w-4 h-4 text-brand-500" />
                Recibió: {registro.recibido_por_nombre}
              </p>
              <p className="text-xs text-muted">
                Salida {formatFechaHora(registro.fecha_salida)} · Llegada {formatFechaHora(registro.fecha_llegada_real)} ·{' '}
                {registro.distancia_recorrida_km} km · {formatCordobas(registro.det_entrega?.precio_oferta_acarreo)}
              </p>
            </article>
          )
        })}
      </div>
    </section>
  )
}