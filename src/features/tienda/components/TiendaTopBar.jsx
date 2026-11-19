import { Link, useNavigate } from 'react-router-dom'
import { Search, LogOut, ShoppingCart, ClipboardList } from 'lucide-react'
import { signOut } from '../../auth/services/authService'
import { useCarrito } from '../hooks/useCarrito'

export const TiendaTopBar = ({ busqueda = '', onBusquedaChange }) => {
  const navigate = useNavigate()
  const { cantidadItems, vaciar } = useCarrito()

  const handleCerrarSesion = async () => {
    await signOut()
    vaciar()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-sm border-b border-line">
      <div className="max-w-6xl mx-auto flex items-center gap-4 px-6 py-4">
        <Link to="/tienda" className="flex items-center gap-2 shrink-0">
          <img src="/logo.svg" alt="Pixca" className="h-7 w-auto" />
          <span className="text-xl font-semibold text-brand-700 tracking-wide">PIXCA</span>
        </Link>

        {onBusquedaChange ? (
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="search"
              value={busqueda}
              onChange={(event) => onBusquedaChange(event.target.value)}
              placeholder="Buscar productos frescos..."
              className="w-full pl-10 pr-3 py-2 border border-line rounded-lg text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
        ) : (
          <div className="flex-1" />
        )}

        <nav className="ml-auto flex items-center gap-5 text-sm font-semibold text-body">
          <Link to="/mis-pedidos" className="flex items-center gap-1.5 hover:text-ink transition-colors">
            <ClipboardList className="w-4 h-4" />
            <span className="hidden sm:inline">Mis pedidos</span>
          </Link>

          <Link to="/carrito" className="relative flex items-center gap-1.5 hover:text-ink transition-colors">
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Carrito</span>
            {cantidadItems > 0 && (
              <span className="absolute -top-2 -right-3 sm:-right-4 bg-sale text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cantidadItems}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={handleCerrarSesion}
            className="flex items-center gap-1.5 hover:text-ink transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </nav>
      </div>
    </header>
  )
}