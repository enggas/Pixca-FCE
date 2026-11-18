import { X } from 'lucide-react'

export const INPUT_CLASS =
  'w-full px-3 py-2.5 border border-line rounded-lg text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white'

export const Campo = ({ id, label, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-ink mb-1.5">{label}</label>
    <input id={id} name={id} className={INPUT_CLASS} {...props} />
  </div>
)

export const BotonPrimario = ({ children, className = '', ...props }) => (
  <button
    {...props}
    className={`px-5 py-2.5 bg-brand-500 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
)

export const BotonSecundario = ({ children, className = '', ...props }) => (
  <button
    {...props}
    className={`px-5 py-2.5 border border-line text-ink text-sm font-semibold rounded-lg hover:bg-mint transition-colors ${className}`}
  >
    {children}
  </button>
)

export const Modal = ({ titulo, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4" role="dialog" aria-modal="true">
    <div className="w-full max-w-md bg-white rounded-2xl border border-line shadow-lg">
      <div className="flex items-center justify-between px-6 py-4 border-b border-line">
        <h3 className="text-lg font-bold text-ink">{titulo}</h3>
        <button type="button" onClick={onClose} aria-label="Cerrar" className="text-muted hover:text-ink">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
)

export const Cargando = ({ texto = 'Cargando…' }) => (
  <div className="py-16 text-center text-muted">{texto}</div>
)

export const ErrorMsg = ({ error }) => (
  <p role="alert" className="text-sm text-sale bg-sale/10 border border-sale/30 rounded-lg px-3 py-2">
    {error.message}
  </p>
)

export const Vacio = ({ texto }) => (
  <div className="py-16 text-center text-muted bg-white rounded-2xl border border-line">{texto}</div>
)

export const SeccionTitulo = ({ titulo, descripcion }) => (
  <div className="mb-6">
    <h1 className="text-2xl font-bold text-ink">{titulo}</h1>
    {descripcion && <p className="text-sm text-muted">{descripcion}</p>}
  </div>
)

const ESTADOS = {
  pendiente: { texto: 'Oferta enviada', clase: 'bg-mint text-brand-600 border-line' },
  aceptada: { texto: 'Oferta aceptada', clase: 'bg-brand-50 text-brand-700 border-brand-100' },
  en_transito: { texto: 'En tránsito', clase: 'bg-brand-500 text-white border-brand-500' },
  descartada: { texto: 'No seleccionada', clase: 'bg-sale/10 text-sale border-sale/30' },
}

export const EstadoBadge = ({ estado }) => {
  const { texto, clase } = ESTADOS[estado]
  return (
    <span className={`inline-block text-xs font-semibold rounded-full px-3 py-1 border ${clase}`}>{texto}</span>
  )
}