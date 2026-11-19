import { Flame } from 'lucide-react'
import { ProductoCard } from './ProductoCard'

export const RematesDestacados = ({ lotes }) => {
  if (lotes.length === 0) return null

  return (
    <section className="mb-10 bg-sale/5 border border-sale/30 rounded-2xl p-6">
      <h2 className="flex items-center gap-2 text-xl font-bold text-sale mb-1">
        <Flame className="w-5 h-5" /> Semáforo de remate
      </h2>
      <p className="text-sm text-body mb-5">Ofertas por cercanía a caducidad: aprovechalas antes de que venza el plazo.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {lotes.map((lote) => (
          <ProductoCard key={lote.id} lote={lote} />
        ))}
      </div>
    </section>
  )
}