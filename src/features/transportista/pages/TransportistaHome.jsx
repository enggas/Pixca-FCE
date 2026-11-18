import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Route, Truck, History, LogOut } from 'lucide-react'
import { signOut } from '../../auth/services/authService'
import { SolicitudesSection } from '../components/SolicitudesSection'
import { ViajesSection } from '../components/ViajesSection'
import { VehiculosSection } from '../components/VehiculosSection'
import { HistorialSection } from '../components/HistorialSection'

const SECCIONES = [
  { id: 'solicitudes', label: 'Solicitudes', icono: Package, componente: SolicitudesSection },
  { id: 'viajes', label: 'Mis viajes', icono: Route, componente: ViajesSection },
  { id: 'vehiculos', label: 'Mis vehículos', icono: Truck, componente: VehiculosSection },
  { id: 'historial', label: 'Historial', icono: History, componente: HistorialSection },
]

export const TransportistaHome = () => {
  const navigate = useNavigate()
  const [activa, setActiva] = useState('solicitudes')
  const { componente: Seccion } = SECCIONES.find((s) => s.id === activa)

  const handleCerrarSesion = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-cream md:flex">
      {/* Sidebar (escritorio) */}
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-mint border-r border-line p-6">
        <div className="flex items-center gap-2 mb-8">
          <img src="/logo.svg" alt="Pixca" className="h-7 w-auto" />
          <span className="text-xl font-semibold text-brand-700 tracking-wide">PIXCA</span>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {SECCIONES.map(({ id, label, icono: Icono }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiva(id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-left transition-colors ${
                activa === id ? 'bg-brand-500 text-white' : 'text-body hover:bg-white'
              }`}
            >
              <Icono className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleCerrarSesion}
          className="flex items-center gap-2 text-sm font-semibold text-body hover:text-ink transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </aside>

      <div className="flex-1 min-w-0">
        {/* Barra superior (móvil) */}
        <header className="md:hidden sticky top-0 z-40 bg-cream/90 backdrop-blur-sm border-b border-line">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="Pixca" className="h-6 w-auto" />
              <span className="text-lg font-semibold text-brand-700">PIXCA</span>
            </div>
            <button
              type="button"
              onClick={handleCerrarSesion}
              aria-label="Cerrar sesión"
              className="text-body hover:text-ink"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex overflow-x-auto gap-2 px-4 pb-3">
            {SECCIONES.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiva(id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border whitespace-nowrap transition-colors ${
                  activa === id ? 'bg-brand-500 border-brand-500 text-white' : 'border-line text-body'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </header>

        <main className="max-w-4xl mx-auto px-4 md:px-8 py-8">
          <Seccion />
        </main>
      </div>
    </div>
  )
}