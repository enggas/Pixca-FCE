import { Link } from 'react-router-dom'
import { Search, LogOut } from 'lucide-react'

export const ProductorTopBar = ({ busqueda, onBusquedaChange, onCerrarSesion }) => (
  <header className="bg-[#FDFBF7] border-b border-gray-200 px-4 md:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
    <div className="flex items-center gap-6">
      <Link to="/productor" className="flex items-center gap-2">
        <img src="/logo.svg" alt="Pixca" className="h-8 w-auto" />
        <span className="text-2xl font-black tracking-tight text-emerald-900">PIXCA</span>
      </Link>

      <div className="hidden md:flex items-center bg-white border border-gray-200 rounded-full px-4 py-1.5 w-64 lg:w-80 text-sm shadow-inner focus-within:border-emerald-700">
        <Search className="w-4 h-4 text-gray-400 mr-2.5 shrink-0" />
        <input
          type="search"
          value={busqueda}
          onChange={(event) => onBusquedaChange(event.target.value)}
          placeholder="Buscar mis cultivos, siembras..."
          className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
        />
      </div>
    </div>

    <div className="flex items-center gap-3">
      <span className="hidden sm:inline-block bg-emerald-100 text-emerald-900 font-medium px-3 py-1 rounded-full text-xs">
        Módulo Productor
      </span>
      <button
        type="button"
        onClick={onCerrarSesion}
        className="bg-emerald-900 hover:bg-emerald-950 text-white font-medium text-sm px-4 py-2 rounded-lg transition-all shadow-sm flex items-center gap-1.5"
      >
        <LogOut className="w-4 h-4" />
        <span>Cerrar Sesión</span>
      </button>
    </div>
  </header>
)