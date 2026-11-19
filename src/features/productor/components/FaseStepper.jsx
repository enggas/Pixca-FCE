import { Check, Circle } from 'lucide-react'
import { FASES } from '../utils/constantes'
import { getFaseActivaIndex, getSiguienteFaseIndex } from '../utils/helpers'

// Solo se puede completar la siguiente fase pendiente, o revertir la última completada
export const FaseStepper = ({ estado, onToggle, disabled }) => {
  const siguiente = getSiguienteFaseIndex(estado)
  const ultima = getFaseActivaIndex(estado)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2">
      {FASES.map((fase, idx) => {
        const hecha = Boolean(estado?.[fase.key])
        const esSiguiente = idx === siguiente
        const puedeClic = !disabled && (esSiguiente || (hecha && idx === ultima))

        let estilo = 'bg-gray-100 text-gray-400 border-gray-200'
        if (hecha) estilo = 'bg-emerald-100 text-emerald-900 border-emerald-200 font-bold'
        else if (esSiguiente) estilo = 'bg-white text-emerald-700 border-emerald-400 border-dashed font-semibold'

        const titulo = hecha ? (puedeClic ? 'Clic para revertir' : 'Completada') : esSiguiente ? 'Clic para completar' : 'Pendiente'

        return (
          <button
            key={fase.key}
            type="button"
            disabled={!puedeClic}
            title={titulo}
            onClick={() => onToggle(fase.key, !hecha)}
            className={`border ${estilo} rounded-xl p-2.5 text-center flex flex-col items-center justify-center transition ${
              puedeClic ? 'hover:shadow-md cursor-pointer' : 'cursor-default'
            }`}
          >
            {hecha ? <Check className="w-4 h-4 mb-1" /> : <Circle className="w-4 h-4 mb-1" />}
            <span className="text-xs">{fase.label}</span>
          </button>
        )
      })}
    </div>
  )
}