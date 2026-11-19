// src/routes/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom'
import { TransportistaHome } from '../features/transportista/pages/TransportistaHome'
import { LandingPage } from '../features/landing/pages/LandingPage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { SignupPage } from '../features/auth/pages/SignupPage'
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage'
import { TiendaPage } from '../features/tienda/pages/TiendaPage'
import { ProductorLayout } from '../features/productor/components/ProductorLayout'
import { DashboardPage } from '../features/productor/pages/DashboardPage'
import { CultivosPage } from '../features/productor/pages/CultivosPage'
import { NuevaSiembraPage } from '../features/productor/pages/NuevaSiembraPage'
import { EstadoSiembrasPage } from '../features/productor/pages/EstadoSiembraPage'
import { CosechasPage } from '../features/productor/pages/CosechasPage'
import { RematesPage } from '../features/productor/pages/RematesPage'
import { VentasPage } from '../features/productor/pages/VentasPage'
import { EntregasPage } from '../features/entregas/pages/EntregasPage'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/registro" element={<SignupPage/>} />
      <Route path="/recuperar" element={<ForgotPasswordPage/>} />
      <Route path="/tienda" element={<TiendaPage/>} />
      <Route path="/transportista" element={<TransportistaHome/>} />
      <Route path="/mis-entregas" element={<EntregasPage/>} />

      <Route path="/productor" element={<ProductorLayout/>}>
        <Route index element={<DashboardPage/>} />
        <Route path="cultivos" element={<CultivosPage/>} />
        <Route path="siembras" element={<EstadoSiembrasPage/>} />
        <Route path="siembras/nueva" element={<NuevaSiembraPage/>} />
        <Route path="cosechas" element={<CosechasPage/>} />
        <Route path="remates" element={<RematesPage/>} />
        <Route path="ventas" element={<VentasPage/>} />
      </Route>
    </Routes>
  )
}