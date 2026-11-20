import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, MapPin, Phone, Calendar, Clock, Package, Tag, User } from 'lucide-react'
import { ProductImage } from '../../landing/components/ProductImage'

const Fila = ({ icono: Icono, etiqueta, children }) => (
  <div className="flex items-start gap-3 py-3 border-b border-line last:border-b-0">
    <Icono className="w-4 h-4 text-brand-700 mt-0.5 shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-xs text-muted">{etiqueta}</p>
      <div className="text-sm text-strong">{children}</div>
    </div>
  </div>
)

export const DetallesProductoModal = ({ producto, onClose }) => {
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const dias = producto.diasParaCaducar

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Detalles de ${producto.nombre}`}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-line shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative aspect-video">
          <ProductImage src={producto.imagen} alt={producto.nombre} className="absolute inset-0 w-full h-full" />
          {producto.descuentoTexto && (
            <span className="absolute top-3 left-3 bg-sale text-white text-xs font-bold rounded-lg px-2.5 py-1">
              {producto.descuentoTexto}
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-white/90 text-body hover:text-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-ink">{producto.nombre}</h3>
          <p className="text-sm text-muted-2 mb-3">
            Calidad: {producto.calidad}
            {producto.categoriaTexto ? ` · ${producto.categoriaTexto}` : ''}
          </p>

          <p className="text-2xl font-bold text-brand-700 mb-1">
            {producto.tieneRemate ? producto.precioRemateTexto : producto.precioBaseTexto}{' '}
            {producto.tieneRemate && (
              <span className="text-sm text-faint line-through font-normal">{producto.precioBaseTexto}</span>
            )}
          </p>
          {producto.tieneRemate && (
            <p className="text-xs text-sale mb-3">
              {producto.remateMotivo} · hasta {producto.remateFinTexto}
            </p>
          )}

          {producto.descripcion && (
            <p className="text-sm text-body mt-3 mb-2">{producto.descripcion}</p>
          )}

          <div className="mt-3">
            <Fila icono={Package} etiqueta="Disponibilidad">
              {producto.stock} {producto.unidad} disponibles en este lote
              {producto.cantidadTotal != null && (
                <span className="text-muted"> (cosecha total: {producto.cantidadTotal} {producto.unidad})</span>
              )}
            </Fila>

            {producto.categoriaTexto && (
              <Fila icono={Tag} etiqueta="Categoría">{producto.categoriaTexto}</Fila>
            )}

            {producto.fechaCosechaTexto && (
              <Fila icono={Calendar} etiqueta="Fecha de cosecha">{producto.fechaCosechaTexto}</Fila>
            )}

            {producto.fechaCaducidadTexto && (
              <Fila icono={Clock} etiqueta="Caducidad estimada">
                {producto.fechaCaducidadTexto}
                {dias != null && (
                  <span className={dias <= 7 ? 'text-sale font-semibold' : 'text-muted'}>
                    {' '}
                    · {dias < 0 ? 'vencida' : dias === 0 ? 'vence hoy' : `faltan ${dias} día(s)`}
                  </span>
                )}
              </Fila>
            )}

            <Fila icono={User} etiqueta="Productor">{producto.productorNombre}</Fila>

            {producto.ubicacion && (
              <Fila icono={MapPin} etiqueta="Ubicación">{producto.ubicacion}</Fila>
            )}

            {producto.productorTelefono && (
              <Fila icono={Phone} etiqueta="Teléfono de contacto">{producto.productorTelefono}</Fila>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full mt-5 py-2.5 border border-line rounded-lg text-sm font-semibold text-ink hover:bg-mint transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}