const TONOS = {
  emerald: { caja: 'bg-emerald-50 text-emerald-700', hint: 'text-emerald-600' },
  blue: { caja: 'bg-blue-50 text-blue-600', hint: 'text-blue-600' },
  amber: { caja: 'bg-amber-50 text-amber-600', hint: 'text-amber-600' },
  purple: { caja: 'bg-purple-50 text-purple-600', hint: 'text-purple-600' },
}

export const StatCard = ({ etiqueta, valor, nota, icono: Icono, tono = 'emerald' }) => {
  const estilo = TONOS[tono]
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
      <div>
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{etiqueta}</span>
        <div className="text-3xl font-bold text-gray-800 mt-1">{valor}</div>
        <span className={`text-xs font-medium ${estilo.hint}`}>{nota}</span>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${estilo.caja}`}>
        <Icono className="w-6 h-6" />
      </div>
    </div>
  )
}