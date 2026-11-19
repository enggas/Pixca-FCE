import { Stethoscope } from 'lucide-react'
import { getConsejoPorFase, getEtapaConsejo } from '../utils/helpers'

export const ConsejoFitosanitario = ({ informacion, faseIdx }) => (
  <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200/80 space-y-2">
    <div className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
      <Stethoscope className="w-4 h-4 text-emerald-600" />
      Consulta fitosanitaria
    </div>

    {informacion.length === 0 && (
      <p className="text-xs text-gray-500">Aún no hay información fitosanitaria registrada para este cultivo.</p>
    )}

    {faseIdx < 0 && informacion.length > 0 && (
      <p className="text-xs text-amber-700">
        Marca la primera fase del cronograma para recibir consejos según la etapa activa.
      </p>
    )}

    {informacion.map((info) => {
      const consejo = getConsejoPorFase(info, faseIdx)
      return (
        <div key={info.id} className="bg-white p-3 rounded-lg border border-gray-100 text-xs space-y-1">
          <div className="font-bold text-gray-800">{info.enfermedad_nombre}</div>
          <p className="text-gray-600">
            <strong>Síntomas:</strong> {info.sintomas}
          </p>
          {consejo && (
            <p className="text-blue-800">
              <strong>Consejo (etapa de {getEtapaConsejo(faseIdx)}):</strong> {consejo}
            </p>
          )}
          <p className="text-emerald-800">
            <strong>Tratamiento sugerido:</strong> {info.tratamiento_sugerido}
          </p>
        </div>
      )
    })}
  </div>
)