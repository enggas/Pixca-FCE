import { useState } from 'react'
import { MapPin, Truck, CheckCircle2, AlertTriangle } from 'lucide-react'
import { WhatsAppButton } from '../../contacto/components/WhatsappButton'
import { useConfirmarUbicacion } from '../hooks/useEntregas'

export const EntregaCard = ({ entrega, userId }) => {
  const { mutate, isPending, error } = useConfirmarUbicacion()
  const miReporte = entrega.confirmacion_ubicacion?.find((c) => c.reportado_por === userId)
  const [comentario, setComentario] = useState(miReporte?.comentario || '')

  const nombre = entrega.distribuidor?.nombre_completo || 'transportista'
  const pedido = entrega.pedido_entrega

  const reportar = (comparto) =>
    mutate({ detEntregaId: entrega.id, userId, comparto, comentario })

  return (
    <div className="bg-white border border-line rounded-2xl p-5 space-y-4">
      <div>
        <p className="font-semibold text-strong">{pedido.descripcion_carga}</p>
        <p className="flex items-center gap-1.5 text-sm text-body mt-1">
          <MapPin className="w-4 h-4 text-brand-500" /> {pedido.destino_direccion}
        </p>
        <p className="flex items-center gap-1.5 text-sm text-body">
          <Truck className="w-4 h-4 text-brand-500" />
          {nombre} · {entrega.vehiculo?.tipo_vehiculo} ({entrega.vehiculo?.placa})
        </p>
      </div>

      <WhatsAppButton
        destinoId={entrega.distribuidor_id}
        label="Contactar y pedir ubicación"
        mensaje={`Hola ${nombre}, te escribo desde Pixca por la entrega "${pedido.descripcion_carga}". ¿Podés compartirme tu ubicación en tiempo real, por favor?`}
      />

      <div className="border-t border-line pt-4">
        <p className="text-sm font-medium text-ink mb-2">¿El transportista compartió su ubicación en tiempo real?</p>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() => reportar(true)}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium border transition-colors ${
              miReporte?.compartio_ubicacion === true
                ? 'bg-brand-500 border-brand-500 text-white'
                : 'border-line text-body hover:bg-mint'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" /> Sí la compartió
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => reportar(false)}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium border transition-colors ${
              miReporte?.compartio_ubicacion === false
                ? 'bg-sale border-sale text-white'
                : 'border-line text-body hover:bg-mint'
            }`}
          >
            <AlertTriangle className="w-4 h-4" /> Se negó (reportar)
          </button>
        </div>

        <input
          type="text"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Comentario opcional (se guarda al marcar una opción)"
          className="mt-2 w-full px-3 py-2 border border-line rounded-lg text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500"
        />

        {error && <p role="alert" className="mt-2 text-xs text-sale">{error.message}</p>}
      </div>
    </div>
  )
}