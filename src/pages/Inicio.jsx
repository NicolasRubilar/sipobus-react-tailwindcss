import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, CalendarClock, Mail, Ticket, TicketX, UserRound } from 'lucide-react'
import HeroDestinos from '../components/HeroDestinos'
import BuscadorViaje from '../components/BuscadorViaje'
import { useAuth } from '../context/AuthContext'

const ACCIONES = [
  { to: '/cambiar', icono: CalendarClock, titulo: 'Cambia tu pasaje', texto: 'Mueve tu viaje a otra fecha u horario hasta 4 horas antes de la salida.' },
  { to: '/anular', icono: TicketX, titulo: 'Anula tu pasaje', texto: '¿Cambio de planes? Solicita la anulación en un par de pasos.' },
  { to: '/cupones', icono: Ticket, titulo: 'Tus cupones', texto: 'Guarda tus códigos de descuento y úsalos al pagar.' },
  { to: '/contacto', icono: Mail, titulo: 'Contáctanos', texto: 'Escríbenos y te respondemos a la brevedad.' },
]

export default function Inicio() {
  const { usuario } = useAuth()

  return (
    <>
      <HeroDestinos />

      <section id="buscar" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-10">
        <p className="text-xs font-medium tracking-[0.25em] text-brand-300 uppercase">Planifica tu viaje</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight uppercase sm:text-4xl">
          ¿A dónde vamos hoy?
        </h2>
        <p className="mt-3 max-w-lg text-sm text-white/60">
          “Recorriendo Chile contigo, kilómetro a kilómetro.” Elige tu ruta y reserva tu asiento en minutos.
        </p>
        <div className="glass mt-8 rounded-3xl p-5 sm:p-7">
          <BuscadorViaje horizontal />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-10">
        <h2 className="font-display text-2xl font-extrabold tracking-tight uppercase">Gestiona tus viajes</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ACCIONES.map(({ to, icono: Icono, titulo, texto }) => (
            <Link
              key={to}
              to={to}
              className="group glass relative rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:bg-white/10"
            >
              <span className="grid size-11 place-items-center rounded-2xl bg-brand-400/15 text-brand-300">
                <Icono className="size-5" />
              </span>
              <h3 className="mt-5 font-semibold">{titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{texto}</p>
              <ArrowUpRight className="absolute top-6 right-6 size-4 text-white/30 transition group-hover:text-white" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-ink-900 p-8 sm:p-12">
          <div className="absolute -top-24 -right-24 size-72 rounded-full bg-brand-300/20 blur-3xl" aria-hidden="true" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.25em] text-brand-200 uppercase">Cupón de bienvenida</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold uppercase sm:text-3xl">
                10% de descuento en tu primer viaje
              </h2>
              <p className="mt-2 text-sm text-white/75">
                Usa el código{' '}
                <span className="rounded-md bg-white px-2 py-0.5 font-bold text-brand-700">BIENVENIDO10</span> al
                pagar tu pasaje.
              </p>
            </div>
            {usuario ? (
              <Link to="/cupones" className="btn shrink-0 bg-white text-brand-700 hover:bg-brand-200">
                <Ticket className="size-4" /> Ir a mis cupones
              </Link>
            ) : (
              <Link to="/registro" className="btn shrink-0 bg-white text-brand-700 hover:bg-brand-200">
                <UserRound className="size-4" /> Crear cuenta <ArrowRight className="size-4" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
