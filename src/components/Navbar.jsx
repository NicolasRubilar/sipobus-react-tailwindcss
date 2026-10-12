import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { LogOut, Menu, Search, User, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/comprar', label: 'Comprar' },
  { to: '/cambiar', label: 'Cambiar' },
  { to: '/anular', label: 'Anular' },
  { to: '/cupones', label: 'Cupones' },
  { to: '/contacto', label: 'Contacto' },
]

export default function Navbar() {
  const { usuario, cerrarSesion } = useAuth()
  const [abierto, setAbierto] = useState(false)
  const [conFondo, setConFondo] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setAbierto(false)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setConFondo(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const iniciales = usuario ? `${usuario.nombre[0] ?? ''}${usuario.apellido[0] ?? ''}`.toUpperCase() : ''

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        conFondo || abierto ? 'border-b border-white/10 bg-ink-950/75 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-10">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="SipoBus, ir al inicio">
          <span
            className="size-8 rounded-full bg-white bg-[url(/logo.png)] bg-[length:200%] bg-[position:46%_24%] bg-no-repeat"
            aria-hidden="true"
          />
          <span className="font-display text-lg font-bold tracking-tight text-brand-300">SipoBus</span>
        </Link>

        <ul className="ml-auto hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `relative block px-3 py-2 text-[13px] font-medium transition-colors ${
                    isActive
                      ? 'text-brand-300 after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-brand-300'
                      : 'text-white/80 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-1 md:ml-2">
          <Link
            to="/comprar"
            className="grid size-9 place-items-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
            aria-label="Buscar viaje"
          >
            <Search className="size-[18px]" />
          </Link>

          {usuario ? (
            <>
              <Link
                to="/perfil"
                className="flex items-center gap-2 rounded-full py-1 pr-1 pl-1 transition hover:bg-white/10 sm:pr-3"
                aria-label="Mi perfil"
              >
                <span className="grid size-7 place-items-center rounded-full bg-brand-400 text-[11px] font-bold text-ink-950">
                  {iniciales}
                </span>
                <span className="hidden text-[13px] font-medium sm:block">{usuario.nombre}</span>
              </Link>
              <button
                type="button"
                onClick={cerrarSesion}
                className="hidden size-9 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white sm:grid"
                aria-label="Cerrar sesión"
                title="Cerrar sesión"
              >
                <LogOut className="size-[17px]" />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="grid size-9 place-items-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
              aria-label="Iniciar sesión"
            >
              <User className="size-[18px]" />
            </Link>
          )}

          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            className="grid size-9 place-items-center rounded-full text-white transition hover:bg-white/10 md:hidden"
            aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={abierto}
          >
            {abierto ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {abierto && (
        <div className="border-t border-white/10 px-4 pb-4 md:hidden">
          <ul className="flex flex-col py-2">
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-3 text-sm font-medium ${
                      isActive ? 'bg-white/10 text-brand-300' : 'text-white/85'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          {usuario && (
            <button type="button" onClick={cerrarSesion} className="btn btn-ghost w-full">
              <LogOut className="size-4" /> Cerrar sesión
            </button>
          )}
        </div>
      )}
    </header>
  )
}
