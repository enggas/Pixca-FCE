import { useCallback, useState } from 'react'
import { Check, Info, X } from 'lucide-react'
import { ToastContext } from '../hooks/toastContext'

const ESTILOS = {
  success: { clase: 'bg-emerald-900', Icono: Check },
  error: { clase: 'bg-red-700', Icono: X },
  info: { clase: 'bg-blue-600', Icono: Info },
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const mostrar = useCallback((mensaje, tipo = 'success') => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { id, mensaje, tipo }])
    setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), 3500)
  }, [])

  return (
    <ToastContext.Provider value={mostrar}>
      {children}
      <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2 pointer-events-none">
        {toasts.map(({ id, mensaje, tipo }) => {
          const { clase, Icono } = ESTILOS[tipo] || ESTILOS.success
          return (
            <div
              key={id}
              className={`${clase} text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 pointer-events-auto`}
            >
              <Icono className="w-4 h-4 shrink-0" />
              <span>{mensaje}</span>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}