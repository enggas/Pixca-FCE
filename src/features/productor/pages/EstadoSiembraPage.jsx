import { Link, useOutletContext } from 'react-router-dom'
import { Plus, Sprout, ChevronRight } from 'lucide-react'
import { useActualizarFase, useInformacion, useSiembras } from '../hooks/useProductor'
import { useToast } from '../hooks/toastContext'
import { FaseStepper } from '../components/FaseStepper'
import { ConsejoFitosanitario } from '../components/ConsejoFitosanitario'
import { Cargando, ErrorCarga, Vacio } from '../components/Estados'
import { FASES } from '../utils/constantes'
import { formatFecha, getFaseActivaIndex, getSiguienteFaseIndex, unwrap } from '../utils/helpers'
import { btnPrimario } from '../utils/estilos'

export const EstadoSiembrasPage = () => {
  const { busqueda } = useOutletContext()
  const toast = useToast()
  const { data: siembras = [], isLoading, error } = useSiembras()
  const { data: informacion = [] } = useInformacion()
  const actualizarFase = useActualizarFase()

  const handleToggle = async (estadoId, fase, valor) => {
    try {
      await actualizarFase.mutateAsync({ estadoId, fase, valor })
      const etiqueta = FASES.find((f) => f.key === fase)?.label
      toast(valor ? `Fase completada: ${etiqueta}` : `Fase revertida: ${etiqueta}`, valor ? 'success' : 'info')
    } catch (err) {
      toast(`No se pudo actualizar la fase: ${err.message}`, 'error')
    }
  }

  const texto = busqueda.trim().toLowerCase()
  const visibles = siembras.filter((s) => !texto || unwrap(s.cultivo)?.nombre.toLowerCase().includes(texto))

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Estado de las Siembras</h1>
          <p className="text-sm text-gray-500 mt-1">
            Semáforo de producción y consulta fitosanitaria según la fase activa.
          </p>
        </div>
        <Link to="/productor/siembras/nueva" className={btnPrimario}>
          <Plus className="w-4 h-4" />
          Nueva Siembra
        </Link>
      </div>

      {isLoading && <Cargando />}
      {error && <ErrorCarga error={error} />}

      {!isLoading && !error && visibles.length === 0 && (
        <Vacio icono={Sprout} mensaje="No hay siembras para mostrar.">
          <Link to="/productor/siembras/nueva" className="inline-block mt-4 bg-emerald-700 text-white text-xs px-4 py-2 rounded-xl">
            Registrar primera siembra
          </Link>
        </Vacio>
      )}

      <div className="space-y-5">
        {visibles.map((siembra) => {
          const cultivo = unwrap(siembra.cultivo)
          const estado = unwrap(siembra.estado_siembra)
          const faseIdx = getFaseActivaIndex(estado)
          const siguiente = getSiguienteFaseIndex(estado)
          const infoCultivo = informacion.filter((i) => i.cultivo_id === cultivo?.id)

          return (
            <article key={siembra.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
                <div>
                  <span className="bg-emerald-100 text-emerald-900 font-bold text-xs px-2.5 py-0.5 rounded-full">
                    Siembra #{siembra.id.slice(0, 8)}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">{cultivo?.nombre}</h3>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <span className="bg-gray-100 px-3 py-1.5 rounded-lg">
                    <strong>Hectáreas:</strong> {siembra.hectareas_ocupadas} ha
                  </span>
                  <span className="bg-gray-100 px-3 py-1.5 rounded-lg">
                    <strong>Suelo:</strong> {siembra.tipo_suelo || '—'}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  <span>Cronograma de producción</span>
                  <span>Inicio: {formatFecha(siembra.fecha_siembra)}</span>
                </div>
                <FaseStepper
                  estado={estado}
                  disabled={!estado || actualizarFase.isPending}
                  onToggle={(fase, valor) => handleToggle(estado.id, fase, valor)}
                />
              </div>

              <ConsejoFitosanitario informacion={infoCultivo} faseIdx={faseIdx} />

              <div className="flex justify-end">
                {siguiente >= 0 ? (
                  <button
                    type="button"
                    disabled={!estado || actualizarFase.isPending}
                    onClick={() => handleToggle(estado.id, FASES[siguiente].key, true)}
                    className={btnPrimario}
                  >
                    Completar: {FASES[siguiente].label}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    to="/productor/cosechas"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition"
                  >
                    Lista para cosecha → Registrar cosecha
                  </Link>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}