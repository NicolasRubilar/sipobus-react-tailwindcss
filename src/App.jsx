import { Suspense, lazy, useEffect } from 'react'
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import RutaProtegida from './components/RutaProtegida'
import Inicio from './pages/Inicio'

// La portada va en el bundle principal; el resto de páginas se descarga al visitarlas
const Comprar = lazy(() => import('./pages/Comprar'))
const Asientos = lazy(() => import('./pages/Asientos'))
const Resumen = lazy(() => import('./pages/Resumen'))
const Pago = lazy(() => import('./pages/Pago'))
const Exito = lazy(() => import('./pages/Exito'))
const Login = lazy(() => import('./pages/Login'))
const Registro = lazy(() => import('./pages/Registro'))
const Perfil = lazy(() => import('./pages/Perfil'))
const Cupones = lazy(() => import('./pages/Cupones'))
const Cambiar = lazy(() => import('./pages/Cambiar'))
const Anular = lazy(() => import('./pages/Anular'))
const Contacto = lazy(() => import('./pages/Contacto'))
const NoEncontrada = lazy(() => import('./pages/NoEncontrada'))

function Layout() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <Navbar />
      <main>
        <Suspense fallback={<div className="min-h-dvh" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <Toaster theme="dark" position="top-center" richColors closeButton />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="comprar" element={<Comprar />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route path="cambiar" element={<Cambiar />} />
        <Route path="anular" element={<Anular />} />
        <Route path="contacto" element={<Contacto />} />

        <Route element={<RutaProtegida />}>
          <Route path="asientos" element={<Asientos />} />
          <Route path="resumen" element={<Resumen />} />
          <Route path="pago" element={<Pago />} />
          <Route path="exito" element={<Exito />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="cupones" element={<Cupones />} />
        </Route>

        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  )
}
