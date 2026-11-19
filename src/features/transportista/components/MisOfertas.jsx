import { useState } from 'react'
import { Pencil, Check, X, Truck } from 'lucide-react'
import { useMisOfertas, useActualizarOferta } from '../hooks/useMisOfertas'

export const MisOfertas = () => {
  const { data: ofertas, isLoading, error } = useMisOfertas()
  const { mutate, isPending, error: errorGuardar, reset } = useActualizarOferta()
  const [editandoId, setEditandoId] = useState(null)
  const [precio, setPrecio] = useState('')

  const iniciarEdicion = (oferta) => {
    reset()
    setEditandoId(oferta.id)
    setPrecio(String(oferta.precio_oferta_acarreo))
  }

  const cancelar = () => {
    reset()
    setEditandoId(null)
  }

  const guardar = (id) => {
    mutate({ id, precio: Number(precio) }, { onSuccess: () => setEditandoId(null) })
  }

  return (
    <section className="max-w-4xl mx-auto mt-12 space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Mis ofertas de acarreo</h2>

      {isLoading && <p className="text-slate-500">Cargando ofertas…</p>}
      {error && <p className="p-3 bg-red-50 text-red-600 rounded-lg border border-red-200">{error.message}</p>}
      {ofertas?.length === 0 && (
        <p className="p-6 text-center text-slate-500 bg-white rounded-xl border">Todavía no has enviado ofertas.</p>
      )}

      {ofertas?.map((oferta) => {
        const editando = editandoId === oferta.id
        return (
          <div key={oferta.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 space-y-1 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">{oferta.pedido_entrega?.descripcion_carga}</p>
              <p>Destino: {oferta.pedido_entrega?.destino_direccion}</p>
              <p className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                {oferta.vehiculo?.tipo_vehiculo} · {oferta.vehiculo?.placa}
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2">
              {editando ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">C$</span>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={precio}
                      onChange={(e) => setPrecio(e.target.value)}
                      className="w-28 px-2 py-1.5 border border-slate-300 rounded-md text-sm"
                    />
                    <button type="button" onClick={() => guardar(oferta.id)} disabled={isPending} aria-label="Guardar" className="p-1.5 bg-emerald-700 text-white rounded-md disabled:opacity-60">
                      <Check className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={cancelar} aria-label="Cancelar" className="p-1.5 border border-slate-300 rounded-md">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {errorGuardar && <p role="alert" className="text-xs text-red-600">{errorGuardar.message}</p>}
                </>
              ) : (
                <>
                  <p className="text-lg font-bold text-emerald-800">C$ {Number(oferta.precio_oferta_acarreo).toLocaleString('es-NI')}</p>
                  {oferta.esta_aceptada ? (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">Aceptada</span>
                  ) : (
                    <button type="button" onClick={() => iniciarEdicion(oferta)} className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700">
                      <Pencil className="w-4 h-4" />
                      Editar oferta
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )
      })}
    </section>
  )
}