import { MapPin, Truck, Check, Navigation } from 'lucide-react'
import { useAceptarOferta } from '../hooks/useMisPedidos'
import { formatCordobas } from '../utils/normalizarLote'

const uno = (valor) => (Array.isArray(valor) ? valor[0] : valor)
const fechaHora = (iso) => new Date(iso).toLocaleString('es-NI', { dateStyle: 'medium', timeStyle: 'short' })

const ESTADO_ORDEN = {
  pendiente: 'Pendiente',
  pagado: 'Pagado',
  en_viaje: 'En viaje',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
}

const ESTADO_ENTREGA = {
  buscando_distribuidor: 'Buscando transportista',
  asignado: 'Transportista asignado',
  en_transito: 'En tránsito',
  completado: 'Entrega completada',
  cancelado: 'Entrega cancelada',
}

const EntregaSection = ({ pedido }) => {
  const aceptarOferta = useAceptarOferta()

  if (!pedido) return null

  const ofertas = [...(pedido.det_entrega ?? [])].sort((a, b) => a.precio_oferta_acarreo - b.precio_oferta_acarreo)
  const aceptada = ofertas.find((o) => o.esta_aceptada)
  const seguimiento = aceptada ? uno(aceptada.estado_entrega) : null
  const cierre = aceptada ? uno(aceptada.historial_entregas) : null

  return (
    <div className="border-t border-line pt-4 mt-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-strong mb-3">
        <Truck className="w-4 h-4 text-brand-700" />
        Entrega: {ESTADO_ENTREGA[pedido.estado_entrega] ?? pedido.estado_entrega}
      </p>

      {!aceptada && (
        <>
          {ofertas.length === 0 ? (
            <p className="text-sm text-muted">Aún no hay ofertas de transportistas. Se actualiza automáticamente.</p>
          ) : (
            <div className="space-y-2">
              {aceptarOferta.error && <p className="text-sm text-sale">{aceptarOferta.error.message}</p>}
              {ofertas.map((oferta, indice) => (
                <div key={oferta.id} className="flex flex-wrap items-center gap-3 border border-line rounded-lg p-3">
                  <div className="flex-1 min-w-48 text-sm">
                    <p className="font-semibold text-ink">
                      {oferta.perfiles?.nombre_completo ?? 'Transportista'}
                      {indice === 0 && (
                        <span className="ml-2 text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2 py-0.5">
                          Más conveniente
                        </span>
                      )}
                    </p>
                    <p className="text-muted">
                      {oferta.vehiculo?.tipo_vehiculo} · {oferta.vehiculo?.placa} · hasta {oferta.vehiculo?.capacidad_carga_libras} lb
                    </p>
                  </div>
                  <p className="font-bold text-ink">{formatCordobas(oferta.precio_oferta_acarreo)}</p>
                  <button
                    type="button"
                    disabled={aceptarOferta.isPending}
                    onClick={() => aceptarOferta.mutate(oferta.id)}
                    className="px-4 py-2 bg-brand-500 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
                  >
                    Aceptar oferta
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {aceptada && (
        <div className="space-y-3 text-sm">
          <p className="text-body">
            <span className="font-semibold text-ink">{aceptada.perfiles?.nombre_completo}</span>
            {aceptada.perfiles?.telefono ? ` · ${aceptada.perfiles.telefono}` : ''} · {aceptada.vehiculo?.tipo_vehiculo} (
            {aceptada.vehiculo?.placa}) · Acarreo {formatCordobas(aceptada.precio_oferta_acarreo)}
          </p>

          {seguimiento?.ultima_latitud_gps != null && !cierre && (
            <div className="bg-mint border border-line rounded-lg p-3">
              <p className="flex items-center gap-2 font-semibold text-strong">
                <Navigation className="w-4 h-4 text-brand-700" /> Ubicación en ruta
              </p>
              <p className="text-muted">
                {seguimiento.ultima_latitud_gps.toFixed(5)}, {seguimiento.ultima_longitud_gps.toFixed(5)} · actualizado{' '}
                {fechaHora(seguimiento.ultima_actualizacion_tiempo)}
              </p>
              {seguimiento.observaciones_ruta && <p className="text-body">{seguimiento.observaciones_ruta}</p>}
              <a
                href={`https://www.google.com/maps?q=${seguimiento.ultima_latitud_gps},${seguimiento.ultima_longitud_gps}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-1 font-semibold text-brand-700 hover:underline"
              >
                Ver en el mapa →
              </a>
            </div>
          )}

          {cierre && (
            <div className="bg-brand-50 border border-brand-100 rounded-lg p-3">
              <p className="flex items-center gap-2 font-semibold text-brand-700">
                <Check className="w-4 h-4" />
                {cierre.concluido_con_exito ? 'Entrega concluida con éxito' : 'Entrega finalizada con incidencias'}
              </p>
              <p className="text-body">
                Recibido por <span className="font-semibold">{cierre.recibido_por_nombre}</span> el{' '}
                {fechaHora(cierre.fecha_llegada_real)}
                {cierre.distancia_recorrida_km != null ? ` · ${cierre.distancia_recorrida_km} km recorridos` : ''}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export const PedidoCard = ({ orden }) => {
  const pedido = uno(orden.pedido_entrega)

  return (
    <article className="bg-white border border-line rounded-2xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-xs text-muted">Pedido · {fechaHora(orden.creado_en)}</p>
          <p className="flex items-center gap-1 text-sm text-body">
            <MapPin className="w-3.5 h-3.5 text-muted" />
            {orden.direccion_envio} <span className="text-muted">({orden.pluscode})</span>
          </p>
        </div>
        <div className="text-right">
          <span className="inline-block text-xs font-semibold bg-mint border border-line rounded-full px-3 py-1 text-strong">
            {ESTADO_ORDEN[orden.estado_orden] ?? orden.estado_orden}
          </span>
          <p className="text-lg font-bold text-ink mt-1">{formatCordobas(orden.total_monto)}</p>
        </div>
      </div>

      <ul className="text-sm text-body space-y-1">
        {orden.carrito?.map((linea) => {
          const lote = uno(linea.lotes)
          const cosecha = uno(lote?.cosechas)
          const unidad = cosecha?.unidad_medida === 'libras' ? 'lb' : 'u'
          return (
            <li key={linea.id} className="flex justify-between">
              <span>
                {linea.cantidad} {unidad} · {uno(cosecha?.cultivo)?.nombre ?? 'Producto'} ({lote?.calidad_clasificacion})
              </span>
              <span className="text-muted">
                {formatCordobas(linea.precio_unitario_guardado)}/{unidad}
              </span>
            </li>
          )
        })}
      </ul>

      <EntregaSection pedido={pedido} />
    </article>
  )
}