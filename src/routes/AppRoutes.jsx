import { Routes, Route } from 'react-router-dom'
import { TransportistaHome } from '../features/transportista/pages/TransportistaHome'
import { LandingPage } from '../features/landing/pages/LandingPage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { SignupPage } from '../features/auth/pages/SignupPage'
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage'
import { TiendaPage } from '../features/tienda/pages/TiendaPage'
import { CarritoPage } from '../features/tienda/pages/CarritoPage'
import { MisPedidosPage } from '../features/tienda/pages/MisPedidosPage'
import { RutaProtegida } from '../features/auth/components/RutaProtegida'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<SignupPage />} />
      <Route path="/recuperar" element={<ForgotPasswordPage />} />
      <Route path="/tienda" element={<RutaProtegida rolPermitido="comprador"><TiendaPage /></RutaProtegida>} />
      <Route path="/carrito" element={<RutaProtegida rolPermitido="comprador"><CarritoPage /></RutaProtegida>} />
      <Route path="/mis-pedidos" element={<RutaProtegida rolPermitido="comprador"><MisPedidosPage /></RutaProtegida>} />
      <Route path="/transportista" element={<TransportistaHome />} />
    </Routes>
  )
}