import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Tag } from 'lucide-react'
import { useCambiarEstadoRemate, useCosechas, useGuardarRemate } from '../hooks/useProductor'
import { useToast } from '../hooks/toastContext'
import { RemateModal } from '../components/RemateModal'
import { Cargando, ErrorCarga, Vacio } from '../components/Estados'
import { diasHasta, formatCordobas, formatFecha, remateVigente, unidadCorta, unwrap } from '../utils/helpers'

export const RematesPage = () => {
  const { busqueda } = useOutletContext()
  const toast = useToast()
  const { data: cosechas = [], isLoading, error } = useCosechas()
  const guardarRemate = useGuardarRemate()
  const cambiarEstado = useCambiarEstadoRemate()
  const [loteModal, setLoteModal] = useState(null)

  const lotes = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    return cosechas
      .flatMap((cosecha) =>
        (cosecha.lotes ?? []).map((lote) => ({
          ...lote,
          cosecha: { ...cosecha, cultivo: unwrap(cosecha.cultivo) },
          remate: unwrap(lote.alerta_remates),
        })),
      )
      .filter((lote) => !texto || lote.cosecha.cultivo?.nombre.toLowerCase().includes(texto))
  }, [cosechas, busqueda])

  const vigentes = lotes.filter((lote) => remateVigente(lote.remate))

  const handleGuardar = async (payload) => {
    try {
      await guardarRemate.mutateAsync(payload)
      toast('Remate publicado correctamente.')
      setLoteModal(null)
    } catch (err) {
      toast(`No se pudo guardar el remate: ${err.message}`, 'error')
    }
  }

  const handleDesactivar = async (remateId) => {
    try {
      await cambiarEstado.mutateAsync({ remateId, activa: false })
      toast('Remate desactivado.', 'info')
    } catch (err) {
      toast(`No se pudo desactivar: ${err.message}`, 'error')
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Semáforo de Remate</h1>
        <p className="text-sm text-gray-500 mt-1">
          Crea ofertas por cercanía a la caducidad para evitar el desperdicio de alimentos.
        </p>
      </div>

      {isLoading && <Cargando />}
      {error && <ErrorCarga error={error} />}

      {!isLoading && !error && (
        <>
          <div>
            <h2 className="text-base font-bold text-gray-800 mb-3">Remates vigentes ({vigentes.length})</h2>
            {vigentes.length === 0 ? (
              <p className="text-sm text-gray-400">No tienes remates activos en este momento.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {vigentes.map((lote) => {
                  const unidad = unidadCorta(lote.cosecha.unidad_medida)
                  return (
                    <div key={lote.id} className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">{lote.cosecha.cultivo?.nombre}</span>
                        <span className="text-xs font-bold bg-red-600 text-white rounded-lg px-2 py-0.5">
                          -{Math.round((1 - lote.remate.precio_descuento / lote.precio_base_lote) * 100)}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{lote.calidad_clasificacion}</p>
                      <p className="text-lg font-bold text-emerald-800">
                        {formatCordobas(lote.remate.precio_descuento)}/{unidad}{' '}
                        <span className="text-sm text-gray-400 line-through font-normal">
                          {formatCordobas(lote.precio_base_lote)}
                        </span>
                      </p>
                      <p className="text-xs text-gray-600">{lote.remate.motivo_remate}</p>
                      <p className="text-xs text-amber-800 font-medium">Hasta {formatFecha(lote.remate.fecha_fin)}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-800 text-base">Mis lotes</h2>
            </div>

            {lotes.length === 0 ? (
              <div className="p-6">
                <Vacio icono={Tag} mensaje="Aún no tienes lotes. Crea uno desde Cosechas y Lotes." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase border-b border-gray-100">
                    <tr>
                      <th className="px-5 py-3">Producto</th>
                      <th className="px-5 py-3">Calidad</th>
                      <th className="px-5 py-3">Precio base</th>
                      <th className="px-5 py-3">Stock</th>
                      <th className="px-5 py-3">Caducidad</th>
                      <th className="px-5 py-3">Remate</th>
                      <th className="px-5 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {lotes.map((lote) => {
                      const unidad = unidadCorta(lote.cosecha.unidad_medida)
                      const dias = diasHasta(lote.cosecha.fecha_caducidad_estimada)
                      const vigente = remateVigente(lote.remate)

                      return (
                        <tr key={lote.id} className="hover:bg-gray-50/80 transition">
                          <td className="px-5 py-3 font-semibold text-gray-800">{lote.cosecha.cultivo?.nombre}</td>
                          <td className="px-5 py-3">{lote.calidad_clasificacion}</td>
                          <td className="px-5 py-3">
                            {formatCordobas(lote.precio_base_lote)}/{unidad}
                          </td>
                          <td className="px-5 py-3">
                            {Number(lote.stock_disponible)} {unidad}
                          </td>
                          <td className="px-5 py-3">
                            <span className="text-xs">{formatFecha(lote.cosecha.fecha_caducidad_estimada)}</span>
                            {dias <= 7 && (
                              <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                                {dias < 0 ? 'Vencida' : `${dias} d`}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3">
                            {vigente ? (
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                                {formatCordobas(lote.remate.precio_descuento)}/{unidad}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">{lote.remate ? 'Inactivo' : 'Sin remate'}</span>
                            )}
                          </td>
                          <td className="px-5 py-3 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setLoteModal(lote)}
                              className="text-xs font-semibold text-emerald-700 hover:underline"
                            >
                              {lote.remate ? 'Editar' : 'Crear remate'}
                            </button>
                            {vigente && (
                              <button
                                type="button"
                                onClick={() => handleDesactivar(lote.remate.id)}
                                className="ml-3 text-xs font-semibold text-red-600 hover:underline"
                              >
                                Desactivar
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {loteModal && (
        <RemateModal
          lote={loteModal}
          enviando={guardarRemate.isPending}
          onSubmit={handleGuardar}
          onClose={() => setLoteModal(null)}
        />
      )}
    </section>
  )
}