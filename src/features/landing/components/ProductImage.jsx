import { useState } from 'react'
import { Leaf } from 'lucide-react'

// `src` puede ser una ruta o una lista de rutas candidatas: usa la primera que cargue
export const ProductImage = ({ src, alt, className = '' }) => {
  const lista = Array.isArray(src) ? src : src ? [src] : []
  const firma = lista.join('|')
  const [estado, setEstado] = useState({ firma, idx: 0 })
  const idx = estado.firma === firma ? estado.idx : 0

  if (idx >= lista.length) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-mint text-brand-400 ${className}`}
      >
        <Leaf className="w-1/4 h-1/4" />
      </div>
    )
  }

  return (
    <img
      src={lista[idx]}
      alt={alt}
      loading="lazy"
      onError={() => setEstado({ firma, idx: idx + 1 })}
      className={`object-cover ${className}`}
    />
  )
}