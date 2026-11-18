import { Routes, Route } from 'react-router-dom'
import { LandingPage } from '../features/landing/pages/LandingPage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { SignupPage } from '../features/auth/pages/SignupPage'
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage'
import { TiendaPage } from '../features/tienda/pages/TiendaPage'
import { TransportistaLayout } from '../features/transportista/components/TransportistaLayout'
import { TransportistaHome } from '../features/transportista/pages/TransportistaHome'
import { HistorialTraslados } from '../features/transportista/pages/HistorialTraslados'
import { EditarUsuario } from '../features/transportista/pages/EditarUsuario'
import { PrimerTrasladoPage, FuncionamientoPage } from '../features/transportista/pages/InfoPages'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<SignupPage />} />
      <Route path="/recuperar" element={<ForgotPasswordPage />} />
      <Route path="/tienda" element={<TiendaPage />} />

      <Route path="/transportista" element={<TransportistaLayout />}>
        <Route index element={<TransportistaHome />} />
        <Route path="historial" element={<HistorialTraslados />} />
        <Route path="editar-usuario" element={<EditarUsuario />} />
        <Route path="ayuda/primer-traslado" element={<PrimerTrasladoPage />} />
        <Route path="ayuda/funcionamiento" element={<FuncionamientoPage />} />
      </Route>
    </Routes>
  )
}