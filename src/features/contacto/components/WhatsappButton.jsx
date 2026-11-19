import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { abrirWhatsApp } from '../services/contactoService'

export const WhatsAppButton = ({ destinoId, mensaje, label = 'WhatsApp', className = '' }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleClick = async () => {
    setError(null)
    setLoading(true)
    try {
      await abrirWhatsApp(destinoId, mensaje)
    } catch (err) {
      setError(err.message || 'No se pudo abrir WhatsApp')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-2 bg-brand-500 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
      >
        <MessageCircle className="w-4 h-4" />
        {loading ? 'Abriendo…' : label}
      </button>
      {error && <p role="alert" className="mt-1 text-xs text-sale">{error}</p>}
    </div>
  )
}