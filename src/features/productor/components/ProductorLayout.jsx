import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { signOut } from '../../auth/services/authService'
import { usePerfilProductor } from '../hooks/useProductor'
import { ProductorTopBar } from './ProductorTopBar'
import { ProductorSidebar } from './ProductorSideBar'
import { ToastProvider } from './ToastProvider'

export const ProductorLayout = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: perfil, error } = usePerfilProductor()
  const [busqueda, setBusqueda] = useState('')

  const sinAcceso = Boolean(error) || (perfil && perfil.rol !== 'productor')

  useEffect(() => {
    if (error) navigate('/login', { replace: true })
    else if (perfil && perfil.rol !== 'productor') navigate('/', { replace: true })
  }, [error, perfil, navigate])

  const handleCerrarSesion = async () => {
    await signOut()
    queryClient.clear()
    navigate('/login')
  }

  if (!perfil || sinAcceso) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] text-gray-500 text-sm">
        Cargando módulo de productor…
      </div>
    )
  }

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-gray-800">
        <ProductorTopBar busqueda={busqueda} onBusquedaChange={setBusqueda} onCerrarSesion={handleCerrarSesion} />

        <div className="flex-1 flex flex-col md:flex-row">
          <ProductorSidebar perfil={perfil} />
          <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
            <Outlet context={{ busqueda }} />
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}