import { X } from 'lucide-react'

export const Modal = ({ titulo, descripcion, onClose, children }) => (
  <div
    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-lg text-gray-900">{titulo}</h3>
        <button type="button" onClick={onClose} aria-label="Cerrar" className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>
      {descripcion && <p className="text-xs text-gray-500 mb-4">{descripcion}</p>}
      {children}
    </div>
  </div>
)