import { useState } from 'react'
import {
  MapPin,
  ShoppingCart,
  Clock,
  Info,
  MessageCircle,
} from 'lucide-react'

import { ProductImage } from '../../landing/components/ProductImage'
import { normalizarLote } from '../utils/normalizarLote'
import { generarEnlaceWhatsApp } from '../utils/whatsapp'
import { useCarrito } from '../hooks/useCarrito'
import { DetallesProductoModal } from './ProductoDetalleModal'

export const ProductoCard = ({ lote }) => {
  const producto = normalizarLote(lote)

  const { items, agregar } = useCarrito()

  const [cantidad, setCantidad] = useState(1)
  const [verDetalles, setVerDetalles] = useState(false)

  const enCarrito =
    items.find((i) => i.loteId === producto.id)?.cantidad ?? 0

  const disponible = producto.stock - enCarrito

  const cantidadValida =
    cantidad >= 1 && cantidad <= disponible

  const handleAgregar = () => {
    if (!cantidadValida) return

    agregar(producto, cantidad)
    setCantidad(1)
  }

  // Mensaje que se enviará al productor
  const mensajeWhatsApp = `Hola ${producto.productorNombre}, estoy interesado en el producto ${producto.nombre}.

Calidad: ${producto.calidad}
Precio: ${
    producto.tieneRemate
      ? producto.precioRemateTexto
      : producto.precioBaseTexto
  }
Disponibilidad: ${producto.stock} ${producto.unidad}

Me gustaría obtener más información sobre este producto.`

  const enlaceWhatsApp = generarEnlaceWhatsApp(
    producto.productorTelefono,
    mensajeWhatsApp,
  )

  const contactarWhatsApp = () => {
    if (!enlaceWhatsApp) return

    window.open(
      enlaceWhatsApp,
      '_blank',
      'noopener,noreferrer',
    )
  }

  return (
    <div className="border border-line rounded-2xl overflow-hidden hover:shadow-md transition-shadow bg-white flex flex-col">

      {/* Imagen del producto */}
      <div className="relative aspect-square">
        <ProductImage
          src={producto.imagen}
          alt={producto.nombre}
          className="absolute inset-0 w-full h-full"
        />

        {producto.descuentoTexto && (
          <span className="absolute top-2 left-2 bg-sale text-white text-xs font-bold rounded-lg px-2.5 py-1">
            {producto.descuentoTexto}
          </span>
        )}
      </div>

      {/* Información del producto */}
      <div className="p-4 flex-1 flex flex-col">

        <p className="font-semibold text-strong">
          {producto.nombre}
        </p>

        <p className="text-sm text-muted-2 mb-1">
          {producto.calidad}
          {producto.ubicacion
            ? ` · ${producto.ubicacion}`
            : ''}
        </p>

        <p className="flex items-center gap-1 text-xs text-muted mb-2">
          <MapPin className="w-3 h-3" />
          {producto.productorNombre}
        </p>

        {/* Precio */}
        <p className="text-lg font-bold text-brand-700 mb-1">
          {producto.tieneRemate
            ? producto.precioRemateTexto
            : producto.precioBaseTexto}

          {producto.tieneRemate && (
            <span className="text-sm text-faint line-through font-normal">
              {producto.precioBaseTexto}
            </span>
          )}
        </p>

        {/* Información del remate */}
        {producto.tieneRemate && (
          <p className="flex items-start gap-1 text-xs text-sale mb-1">
            <Clock className="w-3 h-3 mt-0.5 shrink-0" />

            <span>
              {producto.remateMotivo} · hasta {producto.remateFinTexto}
            </span>
          </p>
        )}

        {/* Stock */}
        <p className="text-xs text-muted mb-3">
          {producto.stock} {producto.unidad} disponibles

          {enCarrito > 0
            ? ` · ${enCarrito} en tu carrito`
            : ''}
        </p>

        {/* Botones de acción */}
        <div className="mt-auto space-y-2">

          {/* Ver detalles */}
          <button
            type="button"
            onClick={() => setVerDetalles(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2 border-2 border-brand-500 text-brand-700 hover:bg-brand-50 text-sm font-semibold rounded-lg transition-colors"
          >
            <Info className="w-4 h-4" />
            Ver detalles
          </button>

          {/* Contactar por WhatsApp */}
          {enlaceWhatsApp && (
            <button
              type="button"
              onClick={contactarWhatsApp}
              className="w-full flex items-center justify-center gap-1.5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Contactar por WhatsApp
            </button>
          )}

          {/* Agregar al carrito */}
          <div className="flex items-center gap-2">

            <input
              type="number"
              min={1}
              max={Math.max(disponible, 1)}
              value={cantidad}
              onChange={(event) =>
                setCantidad(Number(event.target.value))
              }
              aria-label={`Cantidad de ${producto.nombre}`}
              className="w-16 px-2 py-1.5 border border-line rounded-lg text-sm text-ink"
            />

            <button
              type="button"
              onClick={handleAgregar}
              disabled={!cantidadValida}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-brand-500 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-4 h-4" />
              Agregar
            </button>
          </div>

        </div>
      </div>

      {/* Modal de detalles: se conserva */}
      {verDetalles && (
        <DetallesProductoModal
          producto={producto}
          onClose={() => setVerDetalles(false)}
        />
      )}

    </div>
  )
}