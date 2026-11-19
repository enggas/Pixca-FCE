import { useState } from 'react'
import { Package, Plus } from 'lucide-react'
import { useCosechas, useCrearCosecha, useCrearLote, useCultivos, useSiembras } from '../hooks/useProductor'
import { useToast } from '../hooks/toastContext'
import { CosechaForm } from '../components/CosechaForm'
import { LoteModal } from '../components/LoteModal'
import { Cargando, ErrorCarga, Vacio } from '../components/Estados'
import { formatCordobas, formatFecha, unidadCorta, unwrap } from '../utils/helpers'
import { btnPrimario } from '../utils/estilos'

export const CosechasPage = () => {
  const toast = useToast()
  const { data: cosechas = [], isLoading, error } = useCosechas()
  const { data: cultivos = [] } = useCultivos()
  const { data: siembras = [] } = useSiembras()
  const crearCosecha = useCrearCosecha()
  const crearLote = useCrearLote()

  const [mostrarForm, setMostrarForm] = useState(false)
  const [cosechaLote, setCosechaLote] = useState(null)

  const handleCrearCosecha = async (payload) => {
    try {
      await crearCosecha.mutateAsync(payload)
      toast('Cosecha registrada. Ahora puedes desglosarla en lotes.')
      setMostrarForm(false)
    } catch (err) {
      toast(`No se pudo registrar la cosecha: ${err.message}`, 'error')
    }
  }

  const handleCrearLote = async (payload) => {
    try {
      await crearLote.mutateAsync(payload)
      toast('Lote creado y publicado en la tienda.')
      setCosechaLote(null)
    } catch (err) {
      toast(`No se pudo crear el lote: ${err.message}`, 'error')
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Cosechas y Lotes</h1>
          <p className="text-sm text-gray-500 mt-1">
            Registra tus cosechas y clasifícalas en lotes comerciales por calidad.
          </p>
        </div>
        {!mostrarForm && (
          <button type="button" onClick={() => setMostrarForm(true)} className={btnPrimario}>
            <Plus className="w-4 h-4" />
            Registrar cosecha
          </button>
        )}
      </div>

      {mostrarForm && (
        <CosechaForm
          cultivos={cultivos}
          siembras={siembras}
          enviando={crearCosecha.isPending}
          onSubmit={handleCrearCosecha}
          onCancel={() => setMostrarForm(false)}
        />
      )}

      {isLoading && <Cargando />}
      {error && <ErrorCarga error={error} />}
      {!isLoading && !error && cosechas.length === 0 && <Vacio icono={Package} mensaje="Aún no has registrado cosechas." />}

      <div className="space-y-5">
        {cosechas.map((cosecha) => {
          const unidad = unidadCorta(cosecha.unidad_medida)
          const lotes = cosecha.lotes ?? []
          const asignado = lotes.reduce((acc, lote) => acc + Number(lote.stock_disponible), 0)
          const porcentaje = Math.min(Math.round((asignado / Number(cosecha.cantidad_total)) * 100), 100)

          return (
            <article key={cosecha.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{unwrap(cosecha.cultivo)?.nombre}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Cosechada: {formatFecha(cosecha.fecha_cosecha)} · Caduca: {formatFecha(cosecha.fecha_caducidad_estimada)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-800">
                    {Number(cosecha.cantidad_total)} {unidad}
                  </div>
                  <div className="text-xs text-gray-500">{porcentaje}% asignado a lotes</div>
                </div>
              </div>

              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${porcentaje}%` }} />
              </div>

              {lotes.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-gray-500 text-xs uppercase border-b border-gray-100">
                      <tr>
                        <th className="py-2 pr-4">Calidad</th>
                        <th className="py-2 pr-4">Precio base</th>
                        <th className="py-2">Stock disponible</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {lotes.map((lote) => (
                        <tr key={lote.id}>
                          <td className="py-2 pr-4 font-semibold text-gray-800">{lote.calidad_clasificacion}</td>
                          <td className="py-2 pr-4">
                            {formatCordobas(lote.precio_base_lote)}/{unidad}
                          </td>
                          <td className="py-2">
                            {Number(lote.stock_disponible)} {unidad}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <button
                type="button"
                onClick={() => setCosechaLote(cosecha)}
                disabled={asignado >= Number(cosecha.cantidad_total)}
                className="bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-700 text-xs font-semibold px-3 py-2 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + Agregar lote
              </button>
            </article>
          )
        })}
      </div>

      {cosechaLote && (
        <LoteModal
          cosecha={cosechaLote}
          enviando={crearLote.isPending}
          onSubmit={handleCrearLote}
          onClose={() => setCosechaLote(null)}
        />
      )}
    </section>
  )
}