import { useState } from 'react'
import { MapPin, Package, Truck, Radio } from 'lucide-react'
import { useViajes, useIniciarViaje, useCerrarEntrega, useTelemetria } from '../hooks/useTransportista'
import { formatCordobas, formatFechaHora } from '../utils/formato'
import {
  Cargando, ErrorMsg, Vacio, SeccionTitulo, Modal, Campo, BotonPrimario, BotonSecundario, EstadoBadge,
} from './TransportistaUI'

const estadoViaje = (viaje) => {
  const estadoPedido = viaje.pedido_entrega?.estado_entrega
  if (viaje.esta_aceptada && estadoPedido === 'en_transito') return 'en_transito'
  if (viaje.esta_aceptada && estadoPedido === 'asignado') return 'aceptada'
  if (!viaje.esta_aceptada && estadoPedido === 'buscando_distribuidor') return 'pendiente'
  if (!viaje.esta_aceptada && ['asignado', 'en_transito'].includes(estadoPedido)) return 'descartada'
  return null
}

const MENSAJES_TELEMETRIA = {
  buscando: 'Obteniendo ubicación…',
  activo: 'Compartiendo ubicación',
  'sin-permiso': 'Permití el acceso a tu ubicación en el navegador',
  'no-soportado': 'Tu dispositivo no soporta geolocalización',
  error: 'No se pudo enviar la ubicación, reintentando…',
}

const IndicadorTelemetria = ({ detEntregaId }) => {
  const { estado, ultimoEnvio } = useTelemetria(detEntregaId)
  const ok = estado === 'activo'

  return (
    <p className={`flex items-center gap-2 text-xs ${ok ? 'text-brand-700' : 'text-sale'}`}>
      <Radio className="w-4 h-4" />
      {MENSAJES_TELEMETRIA[estado]}
      {ok && ultimoEnvio && ` · último envío ${formatFechaHora(ultimoEnvio.toISOString())}`}
    </p>
  )
}

const CierreModal = ({ viaje, onClose }) => {
  const cerrar = useCerrarEntrega()
  const [recibidoPor, setRecibidoPor] = useState('')
  const [distanciaKm, setDistanciaKm] = useState('')
  const [exito, setExito] = useState(true)

  const handleSubmit = (event) => {
    event.preventDefault()
    cerrar.mutate({ viaje, recibidoPor, distanciaKm, exito }, { onSuccess: onClose })
  }

  return (
    <Modal titulo="Finalizar entrega" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {cerrar.error && <ErrorMsg error={cerrar.error} />}

        <Campo
          id="recibidoPor"
          label="Nombre de quien recibe"
          required
          value={recibidoPor}
          onChange={(event) => setRecibidoPor(event.target.value)}
          placeholder="Nombre y apellido"
        />
        <Campo
          id="distanciaKm"
          label="Distancia real recorrida (km)"
          type="number"
          min="0"
          max="9999.99"
          step="0.01"
          required
          value={distanciaKm}
          onChange={(event) => setDistanciaKm(event.target.value)}
        />

        <label className="flex items-center gap-2 text-sm text-body cursor-pointer">
          <input
            type="checkbox"
            checked={exito}
            onChange={(event) => setExito(event.target.checked)}
            className="w-4 h-4 rounded border-line text-brand-500 focus:ring-brand-500"
          />
          La entrega se concluyó con éxito
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <BotonSecundario type="button" onClick={onClose}>Cancelar</BotonSecundario>
          <BotonPrimario type="submit" disabled={cerrar.isPending}>
            {cerrar.isPending ? 'Guardando…' : 'Confirmar cierre'}
          </BotonPrimario>
        </div>
      </form>
    </Modal>
  )
}

const ViajeCard = ({ viaje, estado }) => {
  const iniciar = useIniciarViaje()
  const [cerrando, setCerrando] = useState(false)
  const pedido = viaje.pedido_entrega

  return (
    <article className="bg-white border border-line rounded-2xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="flex items-start gap-2 text-sm text-strong">
            <Package className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />
            <span><strong className="text-ink">Carga:</strong> {pedido.descripcion_carga}</span>
          </p>
          <p className="flex items-start gap-2 text-sm text-body">
            <MapPin className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />
            <span><strong className="text-ink">Destino:</strong> {pedido.destino_direccion}</span>
          </p>
          <p className="flex items-center gap-2 text-xs text-muted">
            <Truck className="w-4 h-4 text-brand-500" />
            {viaje.vehiculo?.placa} · {viaje.vehiculo?.tipo_vehiculo} · {formatCordobas(viaje.precio_oferta_acarreo)}
          </p>
        </div>
        <EstadoBadge estado={estado} />
      </div>

      {iniciar.error && <ErrorMsg error={iniciar.error} />}

      {estado === 'aceptada' && (
        <BotonPrimario
          type="button"
          disabled={iniciar.isPending}
          onClick={() => iniciar.mutate({ detEntregaId: viaje.id, pedidoId: pedido.id })}
        >
          {iniciar.isPending ? 'Iniciando…' : 'Iniciar viaje'}
        </BotonPrimario>
      )}

      {estado === 'en_transito' && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-line">
          <IndicadorTelemetria detEntregaId={viaje.id} />
          <BotonPrimario type="button" onClick={() => setCerrando(true)}>Finalizar entrega</BotonPrimario>
        </div>
      )}

      {cerrando && <CierreModal viaje={viaje} onClose={() => setCerrando(false)} />}
    </article>
  )
}

export const ViajesSection = () => {
  const { data: viajes, isLoading, error } = useViajes()

  const visibles = (viajes ?? [])
    .map((viaje) => ({ viaje, estado: estadoViaje(viaje) }))
    .filter(({ estado }) => estado !== null)

  return (
    <section>
      <SeccionTitulo
        titulo="Mis viajes"
        descripcion="Tus ofertas, entregas aceptadas y viajes en curso."
      />

      {isLoading && <Cargando texto="Cargando viajes…" />}
      {error && <ErrorMsg error={error} />}
      {viajes && visibles.length === 0 && <Vacio texto="Todavía no tenés ofertas ni viajes activos." />}

      <div className="space-y-4">
        {visibles.map(({ viaje, estado }) => (
          <ViajeCard key={viaje.id} viaje={viaje} estado={estado} />
        ))}
      </div>
    </section>
  )
}