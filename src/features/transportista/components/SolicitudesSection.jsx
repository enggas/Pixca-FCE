import { useState } from 'react'
import { MapPin, Package, Calendar } from 'lucide-react'
import { useSolicitudes, useVehiculos, useEnviarOferta } from '../hooks/useTransportista'
import { formatCordobas, formatFecha } from '../utils/formato'
import {
  Cargando, ErrorMsg, Vacio, SeccionTitulo, Modal, Campo, BotonPrimario, BotonSecundario, INPUT_CLASS,
} from './TransportistaUI'

const OfertaModal = ({ solicitud, vehiculos, onClose }) => {
  const enviar = useEnviarOferta()
  const [vehiculoId, setVehiculoId] = useState(vehiculos[0]?.id ?? '')
  const [precio, setPrecio] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    enviar.mutate({ pedidoId: solicitud.id, vehiculoId, precio }, { onSuccess: onClose })
  }

  return (
    <Modal titulo="Enviar oferta de acarreo" onClose={onClose}>
      <p className="text-sm text-body mb-1"><strong className="text-ink">Carga:</strong> {solicitud.descripcion_carga}</p>
      <p className="text-sm text-body mb-5"><strong className="text-ink">Destino:</strong> {solicitud.destino_direccion}</p>

      {vehiculos.length === 0 ? (
        <p className="text-sm text-sale bg-sale/10 border border-sale/30 rounded-lg px-3 py-2">
          Primero registrá un vehículo en la sección "Mis vehículos".
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {enviar.error && <ErrorMsg error={enviar.error} />}

          <div>
            <label htmlFor="vehiculo" className="block text-sm font-medium text-ink mb-1.5">Vehículo</label>
            <select
              id="vehiculo"
              required
              value={vehiculoId}
              onChange={(event) => setVehiculoId(event.target.value)}
              className={INPUT_CLASS}
            >
              {vehiculos.map((v) => (
                <option key={v.id} value={v.id}>{v.placa} · {v.tipo_vehiculo}</option>
              ))}
            </select>
          </div>

          <Campo
            id="precio"
            label="Precio del servicio (C$)"
            type="number"
            min="1"
            step="0.01"
            required
            value={precio}
            onChange={(event) => setPrecio(event.target.value)}
            placeholder="800"
          />

          <div className="flex justify-end gap-3 pt-2">
            <BotonSecundario type="button" onClick={onClose}>Cancelar</BotonSecundario>
            <BotonPrimario type="submit" disabled={enviar.isPending}>
              {enviar.isPending ? 'Enviando…' : 'Enviar oferta'}
            </BotonPrimario>
          </div>
        </form>
      )}
    </Modal>
  )
}

export const SolicitudesSection = () => {
  const { data: solicitudes, isLoading, error } = useSolicitudes()
  const { data: vehiculos = [] } = useVehiculos()
  const [seleccionada, setSeleccionada] = useState(null)

  return (
    <section>
      <SeccionTitulo
        titulo="Solicitudes de entrega"
        descripcion="Cargas disponibles. Enviá tu oferta con el precio de tu servicio de acarreo."
      />

      {isLoading && <Cargando texto="Cargando solicitudes…" />}
      {error && <ErrorMsg error={error} />}
      {solicitudes?.length === 0 && <Vacio texto="No hay solicitudes disponibles en este momento." />}

      <div className="space-y-4">
        {solicitudes?.map((solicitud) => (
          <article
            key={solicitud.id}
            className="bg-white border border-line rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className="flex-1 space-y-2">
              <p className="flex items-start gap-2 text-sm text-strong">
                <Package className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />
                <span><strong className="text-ink">Carga:</strong> {solicitud.descripcion_carga}</span>
              </p>
              <p className="flex items-start gap-2 text-sm text-body">
                <MapPin className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />
                <span><strong className="text-ink">Destino:</strong> {solicitud.destino_direccion}</span>
              </p>
              <p className="flex items-center gap-2 text-xs text-muted">
                <Calendar className="w-4 h-4 text-brand-500" />
                Publicada el {formatFecha(solicitud.creado_en)} · {solicitud.totalOfertas} oferta(s)
              </p>
            </div>

            {solicitud.miOferta ? (
              <div className="text-center md:text-right">
                <p className="text-xs text-muted">Tu oferta</p>
                <p className="text-lg font-bold text-brand-700">
                  {formatCordobas(solicitud.miOferta.precio_oferta_acarreo)}
                </p>
              </div>
            ) : (
              <BotonPrimario type="button" onClick={() => setSeleccionada(solicitud)}>
                Ofertar
              </BotonPrimario>
            )}
          </article>
        ))}
      </div>

      {seleccionada && (
        <OfertaModal solicitud={seleccionada} vehiculos={vehiculos} onClose={() => setSeleccionada(null)} />
      )}
    </section>
  )
}