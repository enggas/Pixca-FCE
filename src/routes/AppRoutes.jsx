// src/routes/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom'
import { RutaProtegida } from '../features/auth/components/RutaProtegida'
import { TransportistaHome } from '../features/transportista/pages/TransportistaHome'
import { LandingPage } from '../features/landing/pages/LandingPage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { SignupPage } from '../features/auth/pages/SignupPage'
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage'
import { TiendaPage } from '../features/tienda/pages/TiendaPage'
import { CarritoPage } from '../features/tienda/pages/CarritoPage'
import { MisPedidosPage } from '../features/tienda/pages/MisPedidosPage'
import { ProductorLayout } from '../features/productor/components/ProductorLayout'
import { DashboardPage } from '../features/productor/pages/DashboardPage'
import { CultivosPage } from '../features/productor/pages/CultivosPage'
import { NuevaSiembraPage } from '../features/productor/pages/NuevaSiembraPage'
import { EstadoSiembrasPage } from '../features/productor/pages/EstadoSiembraPage'
import { CosechasPage } from '../features/productor/pages/CosechasPage'
import { RematesPage } from '../features/productor/pages/RematesPage'
import { VentasPage } from '../features/productor/pages/VentasPage'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<SignupPage />} />
      <Route path="/recuperar" element={<ForgotPasswordPage />} />

      {/* Módulo comprador */}
      <Route
        path="/tienda"
        element={
          <RutaProtegida rolPermitido="comprador">
            <TiendaPage />
          </RutaProtegida>
        }
      />
      <Route
        path="/carrito"
        element={
          <RutaProtegida rolPermitido="comprador">
            <CarritoPage />
          </RutaProtegida>
        }
      />
      <Route
        path="/mis-pedidos"
        element={
          <RutaProtegida rolPermitido="comprador">
            <MisPedidosPage />
          </RutaProtegida>
        }
      />

      {/* Módulo transportista */}
      <Route
        path="/transportista"
        element={
          <RutaProtegida rolPermitido="distribuidor">
            <TransportistaHome />
          </RutaProtegida>
        }
      />

      {/* Módulo productor */}
      <Route path="/productor" element={<ProductorLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="cultivos" element={<CultivosPage />} />
        <Route path="siembras" element={<EstadoSiembrasPage />} />
        <Route path="siembras/nueva" element={<NuevaSiembraPage />} />
        <Route path="cosechas" element={<CosechasPage />} />
        <Route path="remates" element={<RematesPage />} />
        <Route path="ventas" element={<VentasPage />} />
      </Route>
    </Routes>
  )
}