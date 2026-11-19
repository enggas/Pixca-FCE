import { Receipt } from 'lucide-react'
import { useVentas } from '../hooks/useProductor'
import { StatCard } from '../components/StatCard'
import { Cargando, ErrorCarga, Vacio } from '../components/Estados'
import { formatCordobas, formatFecha, unidadCorta, unwrap } from '../utils/helpers'

export const VentasPage = () => {
  const { data: ventas = [], isLoading, error } = useVentas()

  const totalNeto = ventas.reduce((acc, venta) => acc + Number(venta.monto_total_neto), 0)

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Historial de Ventas</h1>
        <p className="text-sm text-gray-500 mt-1">Registro de tus ventas confirmadas, que mantiene actualizado el stock del sitio.</p>
      </div>

      {isLoading && <Cargando />}
      {error && <ErrorCarga error={error} />}

      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            <StatCard etiqueta="Ventas realizadas" valor={ventas.length} nota="Órdenes confirmadas" icono={Receipt} tono="blue" />
            <StatCard etiqueta="Monto neto total" valor={formatCordobas(totalNeto)} nota="Acumulado" icono={Receipt} tono="emerald" />
          </div>

          {ventas.length === 0 ? (
            <Vacio icono={Receipt} mensaje="Aún no tienes ventas registradas." />
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase border-b border-gray-100">
                  <tr>
                    <th className="px-5 py-3">Fecha</th>
                    <th className="px-5 py-3">Producto</th>
                    <th className="px-5 py-3">Calidad</th>
                    <th className="px-5 py-3">Cantidad</th>
                    <th className="px-5 py-3">Monto neto</th>
                    <th className="px-5 py-3">Orden</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {ventas.map((venta) => {
                    const lote = unwrap(venta.lotes)
                    const cosecha = unwrap(lote?.cosechas)
                    return (
                      <tr key={venta.id} className="hover:bg-gray-50/80 transition">
                        <td className="px-5 py-3">{formatFecha(venta.fecha_venta)}</td>
                        <td className="px-5 py-3 font-semibold text-gray-800">{unwrap(cosecha?.cultivo)?.nombre}</td>
                        <td className="px-5 py-3">{lote?.calidad_clasificacion}</td>
                        <td className="px-5 py-3">
                          {Number(venta.cantidad_vendida)} {unidadCorta(cosecha?.unidad_medida)}
                        </td>
                        <td className="px-5 py-3 font-semibold text-emerald-800">{formatCordobas(venta.monto_total_neto)}</td>
                        <td className="px-5 py-3 font-mono text-xs text-gray-500">#{venta.orden_id.slice(0, 8)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  )
}