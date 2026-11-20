import { useState } from 'react'
import { MapPin, ShoppingCart, Clock, Leaf } from 'lucide-react'
import { normalizarLote } from '../utils/normalizarLote'
import { useCarrito } from '../hooks/useCarrito'

// Prueba cada ruta candidata en orden hasta que una cargue
const ImagenProducto = ({ rutas, alt }) => {
  const [indice, setIndice] = useState(0)
  const lista = Array.isArray(rutas) ? rutas : rutas ? [rutas] : []

  if (indice >= lista.length) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="absolute inset-0 w-full h-full flex items-center justify-center bg-mint text-brand-400"
      >
        <Leaf className="w-10 h-10" />
      </div>
    )
  }

  return (
    <img
      key={lista[indice]}
      src={lista[indice]}
      alt={alt}
      onError={() => setIndice((actual) => actual + 1)}
      className="absolute inset-0 w-full h-full object-cover"
    />
  )
}

export const ProductoCard = ({ lote }) => {
  const producto = normalizarLote(lote)
  const { items, agregar } = useCarrito()
  const [cantidad, setCantidad] = useState(1)

  const enCarrito = items.find((i) => i.loteId === producto.id)?.cantidad ?? 0
  const disponible = producto.stock - enCarrito
  const cantidadValida = cantidad >= 1 && cantidad <= disponible

  const handleAgregar = () => {
    if (!cantidadValida) return
    agregar(producto, cantidad)
    setCantidad(1)
  }

  return (
    <div className="border border-line rounded-2xl overflow-hidden hover:shadow-md transition-shadow bg-white flex flex-col">
      <div className="relative aspect-square">
<<<<<<< HEAD
        <ImagenProducto rutas={producto.imagen} alt={producto.nombre} />
=======
        <ProductImage src={producto.imagen} alt={producto.nombre} className="absolute inset-0 w-full h-full" />
>>>>>>> 760c7ce (feat(images) modulo comprador con imagenes)
        {producto.descuentoTexto && (
          <span className="absolute top-2 left-2 bg-sale text-white text-xs font-bold rounded-lg px-2.5 py-1">
            {producto.descuentoTexto}
          </span>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <p className="font-semibold text-strong">{producto.nombre}</p>
        <p className="text-sm text-muted-2 mb-1">
          {producto.calidad}
          {producto.ubicacion ? ` · ${producto.ubicacion}` : ''}
        </p>
        <p className="flex items-center gap-1 text-xs text-muted mb-2">
          <MapPin className="w-3 h-3" />
          {producto.productorNombre}
        </p>

        <p className="text-lg font-bold text-brand-700 mb-1">
          {producto.tieneRemate ? producto.precioRemateTexto : producto.precioBaseTexto}{' '}
          {producto.tieneRemate && (
            <span className="text-sm text-faint line-through font-normal">{producto.precioBaseTexto}</span>
          )}
        </p>

        {producto.tieneRemate && (
          <p className="flex items-start gap-1 text-xs text-sale mb-1">
            <Clock className="w-3 h-3 mt-0.5 shrink-0" />
            <span>
              {producto.remateMotivo} · hasta {producto.remateFinTexto}
            </span>
          </p>
        )}

        <p className="text-xs text-muted mb-3">
          {producto.stock} {producto.unidad} disponibles
          {enCarrito > 0 ? ` · ${enCarrito} en tu carrito` : ''}
        </p>

        <div className="mt-auto flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={Math.max(disponible, 1)}
            value={cantidad}
            onChange={(event) => setCantidad(Number(event.target.value))}
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
  )
}