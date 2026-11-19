import { useMemo, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { Tractor, Sprout } from 'lucide-react'
import { useCultivos } from '../hooks/useProductor'
import { CATEGORIA_LABELS } from '../../tienda/utils/normalizarLote'
import { Cargando, ErrorCarga, Vacio } from '../components/Estados'

const CATEGORIAS = [{ value: null, label: 'Todos' }, ...Object.entries(CATEGORIA_LABELS).map(([value, label]) => ({ value, label }))]

export const CultivosPage = () => {
  const navigate = useNavigate()
  const { busqueda } = useOutletContext()
  const { data: cultivos = [], isLoading, error } = useCultivos()
  const [categoria, setCategoria] = useState(null)

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    return cultivos.filter(
      (c) => (!categoria || c.categoria === categoria) && (!texto || c.nombre.toLowerCase().includes(texto)),
    )
  }, [cultivos, categoria, busqueda])

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Mis Cultivos</h1>
        <p className="text-sm text-gray-500 mt-1">Especies disponibles para registrar una siembra.</p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {CATEGORIAS.map((opcion) => (
          <button
            key={opcion.label}
            type="button"
            onClick={() => setCategoria(opcion.value)}
            className={`px-4 py-1.5 rounded-full text-sm transition whitespace-nowrap ${
              categoria === opcion.value
                ? 'bg-emerald-700 text-white font-semibold shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 font-medium'
            }`}
          >
            {opcion.label}
          </button>
        ))}
      </div>

      {isLoading && <Cargando />}
      {error && <ErrorCarga error={error} />}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtrados.length === 0 && <Vacio icono={Sprout} mensaje="No se encontraron cultivos con esos filtros." />}

          {filtrados.map((cultivo) => (
            <div
              key={cultivo.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition"
            >
              <div>
                <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 mb-3">
                  {CATEGORIA_LABELS[cultivo.categoria] || cultivo.categoria}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{cultivo.nombre}</h3>
                <p className="text-xs text-gray-600 line-clamp-3 mb-4">{cultivo.descripcion}</p>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => navigate('/productor/siembras/nueva', { state: { cultivoId: cultivo.id } })}
                  className="w-full bg-emerald-900 hover:bg-emerald-950 text-white font-medium text-xs py-2 px-3 rounded-lg transition flex items-center justify-center gap-1.5"
                >
                  <Tractor className="w-4 h-4" />
                  Sembrar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}