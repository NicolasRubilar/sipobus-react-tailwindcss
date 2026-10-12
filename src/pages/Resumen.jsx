import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, CreditCard, TicketPercent, X } from 'lucide-react'
import PageShell from '../components/PageShell'
import PasosCompra from '../components/PasosCompra'
import ResumenCompra from '../components/ResumenCompra'
import { Card, Field } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { buscarDestino } from '../lib/destinos'
import { guardarReserva, obtenerReserva } from '../lib/storage'

export default function Resumen() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [reserva, setReserva] = useState(obtenerReserva)
  const [codigo, setCodigo] = useState('')
  const [error, setError] = useState('')

  if (!reserva?.asientos?.length) return <Navigate to="/asientos" replace />

  const actualizar = (cambios) => {
    const nueva = { ...reserva, ...cambios }
    setReserva(nueva)
    guardarReserva(nueva)
  }

  const disponibles = usuario.cupones.filter((c) => !usuario.cuponesUsados.includes(c))

  const aplicarCupon = (e) => {
    e.preventDefault()
    const cupon = codigo.trim().toUpperCase()
    if (!cupon) return
    if (usuario.cuponesUsados.includes(cupon)) {
      setError('Ya usaste este cupón en una compra anterior.')
    } else if (!usuario.cupones.includes(cupon)) {
      setError('No tienes ese cupón. Agrégalo primero en “Mis cupones”.')
    } else {
      setError('')
      setCodigo('')
      actualizar({ cupon })
      toast.success(`Cupón ${cupon} aplicado: 10% de descuento.`)
    }
  }

  return (
    <PageShell
      eyebrow="Confirma tu compra"
      titulo="Resumen del viaje"
      fondo={buscarDestino(reserva.destino)?.imagen}
    >
      <PasosCompra actual={2} />

      <Card>
        <ResumenCompra reserva={reserva} />
      </Card>

      <Card className="mt-6">
        <h2 className="flex items-center gap-2 font-semibold">
          <TicketPercent className="size-5 text-brand-300" /> ¿Tienes un cupón?
        </h2>

        {reserva.cupon ? (
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200 ring-1 ring-emerald-300/25">
            <span>
              Cupón <strong>{reserva.cupon}</strong> aplicado
            </span>
            <button
              type="button"
              onClick={() => actualizar({ cupon: null })}
              className="grid size-8 place-items-center rounded-full hover:bg-white/10"
              aria-label="Quitar cupón"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={aplicarCupon} className="mt-4 flex items-start gap-3">
              <Field
                label="Código"
                className="flex-1"
                placeholder="BIENVENIDO10"
                value={codigo}
                onChange={(e) => {
                  setCodigo(e.target.value)
                  setError('')
                }}
                error={error}
                autoCapitalize="characters"
              />
              <button type="submit" className="btn btn-ghost mt-[1.375rem]">Aplicar</button>
            </form>
            {disponibles.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/55">
                Tus cupones:
                {disponibles.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => actualizar({ cupon: c })}
                    className="rounded-full border border-dashed border-brand-300/50 px-3 py-1 font-semibold text-brand-200 hover:bg-brand-400/10"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </Card>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Link to="/asientos" className="btn btn-ghost">
          <ArrowLeft className="size-4" /> Cambiar asientos
        </Link>
        <button type="button" onClick={() => navigate('/pago')} className="btn btn-primary">
          <CreditCard className="size-4" /> Ir a pagar
        </button>
      </div>
    </PageShell>
  )
}
