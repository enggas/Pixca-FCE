import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Navigation, ShoppingBag } from 'lucide-react'
import { TiendaTopBar } from '../components/TiendaTopBar'
import { useCarrito } from '../hooks/useCarrito'
import { useCheckout } from '../hooks/useCheckout'
import { formatCordobas } from '../utils/normalizarLote'
import { coordenadasValidas, generarPlusCode } from '../utils/plusCode'

export const CarritoPage = () => {
  const navigate = useNavigate()
  const { items, total, actualizar, quitar, vaciar } = useCarrito()
  const checkout = useCheckout()

  const [direccion, setDireccion] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [localizando, setLocalizando] = useState(false)
  const [errorGeo, setErrorGeo] = useState(null)

  const latNum = Number(lat)
  const lngNum = Number(lng)
  const ubicacionValida = lat !== '' && lng !== '' && coordenadasValidas(latNum, lngNum)
  const pluscode = ubicacionValida ? generarPlusCode(latNum, lngNum) : ''

  const obtenerUbicacion = () => {
    if (!navigator.geolocation) {
      setErrorGeo('Tu navegador no soporta geolocalización. Ingresa las coordenadas manualmente.')
      return
    }
    setLocalizando(true)
    setErrorGeo(null)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLat(coords.latitude.toFixed(6))
        setLng(coords.longitude.toFixed(6))
        setLocalizando(false)
      },
      () => {
        setErrorGeo('No se pudo obtener tu ubicación. Ingresa las coordenadas manualmente.')
        setLocalizando(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!ubicacionValida || !direccion.trim() || items.length === 0) return

    checkout.mutate(
      {
        items: items.map(({ loteId, cantidad }) => ({ lote_id: loteId, cantidad })),
        direccion: direccion.trim(),
        latitud: latNum,
        longitud: lngNum,
        pluscode,
      },
      {
        onSuccess: () => {
          vaciar()
          navigate('/mis-pedidos')
        },
      },
    )
  }

  const inputClase =
    'w-full px-3 py-2.5 border border-line rounded-lg text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'

  return (
    <div className="min-h-screen bg-cream">
      <TiendaTopBar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-ink mb-6">Tu carrito</h1>

        {items.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-line">
            <ShoppingBag className="w-10 h-10 text-muted mx-auto mb-3" />
            <p className="text-muted mb-4">Tu carrito está vacío.</p>
            <Link to="/tienda" className="px-5 py-2.5 bg-brand-500 hover:bg-brand-700 text-white font-semibold rounded-lg transition-colors">
              Ir al catálogo
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <div key={item.loteId} className="bg-white border border-line rounded-2xl p-4 flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-40">
                    <p className="font-semibold text-strong">{item.nombre}</p>
                    <p className="text-sm text-muted-2">
                      {item.calidad} · {item.productorNombre}
                    </p>
                    <p className="text-sm text-brand-700 font-semibold">
                      {formatCordobas(item.precioUnitario)}/{item.unidad}
                    </p>
                  </div>

                  <input
                    type="number"
                    min={1}
                    max={item.stock}
                    value={item.cantidad}
                    onChange={(event) => actualizar(item.loteId, event.target.value)}
                    aria-label={`Cantidad de ${item.nombre}`}
                    className="w-24 px-2 py-1.5 border border-line rounded-lg text-sm text-ink"
                  />

                  <p className="w-28 text-right font-bold text-ink">
                    {formatCordobas(item.precioUnitario * item.cantidad)}
                  </p>

                  <button
                    type="button"
                    onClick={() => quitar(item.loteId)}
                    aria-label={`Quitar ${item.nombre}`}
                    className="text-muted hover:text-sale transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </section>

            <form onSubmit={handleSubmit} className="bg-white border border-line rounded-2xl p-6 space-y-4 h-fit">
              <h2 className="text-lg font-bold text-ink">Datos de envío</h2>

              {checkout.error && (
                <p role="alert" className="text-sm text-sale bg-sale/10 border border-sale/30 rounded-lg px-3 py-2">
                  {checkout.error.message}
                </p>
              )}

              <div>
                <label htmlFor="direccion" className="block text-sm font-medium text-ink mb-1.5">
                  Dirección de entrega
                </label>
                <textarea
                  id="direccion"
                  required
                  rows={2}
                  value={direccion}
                  onChange={(event) => setDireccion(event.target.value)}
                  placeholder="Barrio, calle, referencias…"
                  className={inputClase}
                />
              </div>

              <button
                type="button"
                onClick={obtenerUbicacion}
                disabled={localizando}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-line rounded-lg text-sm font-medium text-ink hover:bg-mint transition-colors disabled:opacity-60"
              >
                <Navigation className="w-4 h-4" />
                {localizando ? 'Obteniendo ubicación…' : 'Usar mi ubicación actual'}
              </button>

              {errorGeo && <p className="text-xs text-sale">{errorGeo}</p>}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="lat" className="block text-xs font-medium text-body mb-1">Latitud</label>
                  <input id="lat" type="number" step="any" required value={lat} onChange={(e) => setLat(e.target.value)} className={inputClase} />
                </div>
                <div>
                  <label htmlFor="lng" className="block text-xs font-medium text-body mb-1">Longitud</label>
                  <input id="lng" type="number" step="any" required value={lng} onChange={(e) => setLng(e.target.value)} className={inputClase} />
                </div>
              </div>

              <p className="text-xs text-muted">
                Plus Code: <span className="font-semibold text-ink">{pluscode || '—'}</span>
              </p>

              <div className="border-t border-line pt-4 flex items-center justify-between">
                <span className="text-body">Total</span>
                <span className="text-xl font-bold text-ink">{formatCordobas(total)}</span>
              </div>
              <p className="text-xs text-muted">
                El precio final se confirma al procesar la compra (se aplican remates vigentes).
              </p>

              <button
                type="submit"
                disabled={checkout.isPending || !ubicacionValida || !direccion.trim()}
                className="w-full py-3 bg-ink hover:bg-strong text-white font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {checkout.isPending ? 'Procesando…' : 'Confirmar compra'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}