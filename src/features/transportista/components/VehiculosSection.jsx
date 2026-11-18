import { useState } from 'react'
import { Truck } from 'lucide-react'
import { useVehiculos, useCrearVehiculo } from '../hooks/useTransportista'
import { Cargando, ErrorMsg, Vacio, SeccionTitulo, Campo, BotonPrimario } from './TransportistaUI'

const FORM_VACIO = { placa: '', tipo_vehiculo: '', capacidad_carga_libras: '', volumen_disponible_m3: '' }

export const VehiculosSection = () => {
  const { data: vehiculos, isLoading, error } = useVehiculos()
  const crear = useCrearVehiculo()
  const [form, setForm] = useState(FORM_VACIO)

  const handleChange = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    crear.mutate(form, { onSuccess: () => setForm(FORM_VACIO) })
  }

  return (
    <section>
      <SeccionTitulo
        titulo="Mis vehículos"
        descripcion="Registrá las especificaciones de tus vehículos de transporte."
      />

      <form onSubmit={handleSubmit} className="bg-white border border-line rounded-2xl p-5 mb-8 space-y-4">
        {crear.error && <ErrorMsg error={crear.error} />}

        <div className="grid sm:grid-cols-2 gap-4">
          <Campo id="placa" label="Placa" required maxLength={15} value={form.placa} onChange={handleChange} placeholder="M-123456" />
          <Campo id="tipo_vehiculo" label="Tipo de transporte" required value={form.tipo_vehiculo} onChange={handleChange} placeholder="Pick-up, camión…" />
          <Campo
            id="capacidad_carga_libras"
            label="Capacidad máxima (libras)"
            type="number"
            min="1"
            step="0.01"
            required
            value={form.capacidad_carga_libras}
            onChange={handleChange}
          />
          <Campo
            id="volumen_disponible_m3"
            label="Volumen disponible (m³)"
            type="number"
            min="0"
            step="0.01"
            value={form.volumen_disponible_m3}
            onChange={handleChange}
          />
        </div>

        <BotonPrimario type="submit" disabled={crear.isPending}>
          {crear.isPending ? 'Guardando…' : 'Registrar vehículo'}
        </BotonPrimario>
      </form>

      {isLoading && <Cargando texto="Cargando vehículos…" />}
      {error && <ErrorMsg error={error} />}
      {vehiculos?.length === 0 && <Vacio texto="Aún no registraste vehículos." />}

      <div className="grid sm:grid-cols-2 gap-4">
        {vehiculos?.map((vehiculo) => (
          <article key={vehiculo.id} className="bg-white border border-line rounded-2xl p-5 flex items-start gap-4">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-50 text-brand-700 shrink-0">
              <Truck className="w-5 h-5" />
            </span>
            <div>
              <p className="font-semibold text-ink">{vehiculo.placa}</p>
              <p className="text-sm text-body">{vehiculo.tipo_vehiculo}</p>
              <p className="text-xs text-muted mt-1">
                {Number(vehiculo.capacidad_carga_libras).toLocaleString('es-NI')} lb
                {vehiculo.volumen_disponible_m3 != null && ` · ${vehiculo.volumen_disponible_m3} m³`}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}