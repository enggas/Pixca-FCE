import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Package, HelpCircle, BookOpen, UserCog, LogOut } from 'lucide-react'
import { signOut } from '@/features/auth/services/authService'

const linkInfo =
  'flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#3d7289] transition-colors'

export const TransportistaLayout = () => {
  const navigate = useNavigate()

  const handleCerrarSesion = async () => {
    try {
      await signOut()
    } finally {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-[#dfe3df]">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto flex items-center gap-8 px-6 py-3">
          <Link to="/transportista" className="flex items-center gap-2 shrink-0">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#3d7289] text-white">
              <Package className="w-5 h-5" />
            </span>
            <span className="text-xl font-bold text-[#3d7289] tracking-wide">PIXCA</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/transportista/ayuda/primer-traslado" className={linkInfo}>
              <HelpCircle className="w-4 h-4" />
              ¿Cómo Hacer Mi Primer Traslado?
            </NavLink>
            <NavLink to="/transportista/ayuda/funcionamiento" className={linkInfo}>
              <BookOpen className="w-4 h-4" />
              Funcionamiento General
            </NavLink>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <Link
              to="/transportista/editar-usuario"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 border border-slate-300 text-sm font-medium text-[#3d7289] hover:bg-slate-200 transition-colors"
            >
              <UserCog className="w-4 h-4" />
              Editar Usuario
            </Link>
            <button
              type="button"
              onClick={handleCerrarSesion}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}