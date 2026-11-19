export const Cargando = ({ texto = 'Cargando…' }) => (
  <div className="py-16 text-center text-gray-400 text-sm">{texto}</div>
)

export const ErrorCarga = ({ error }) => (
  <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">
    No se pudo cargar la información: {error?.message}
  </div>
)

export const Vacio = ({ icono: Icono, mensaje, children }) => (
  <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center col-span-full">
    {Icono && <Icono className="w-10 h-10 text-gray-300 mx-auto mb-2" />}
    <p className="text-gray-500 font-medium">{mensaje}</p>
    {children}
  </div>
)