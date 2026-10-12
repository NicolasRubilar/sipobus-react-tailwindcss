import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Loader2, Lock } from 'lucide-react'
import PageShell from '../components/PageShell'
import PasosCompra from '../components/PasosCompra'
import ResumenCompra from '../components/ResumenCompra'
import { Card, Field } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { buscarDestino } from '../lib/destinos'
import { calcularTotales, formatearPrecio } from '../lib/precios'
import { guardarReserva, guardarUltimaCompra, obtenerReserva } from '../lib/storage'

const formatearTarjeta = (valor) =>
  valor.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')

const formatearVencimiento = (valor) => {
  const digitos = valor.replace(/\D/g, '').slice(0, 4)
  return digitos.length > 2 ? `${digitos.slice(0, 2)}/${digitos.slice(2)}` : digitos
}

function validar({ numero, vencimiento, cvv, titular }) {
  const errores = {}
  if (!titular.trim()) errores.titular = 'Ingresa el nombre que aparece en la tarjeta.'
  if (!/^\d{16}$/.test(numero.replace(/\s/g, ''))) errores.numero = 'El número debe tener 16 dígitos.'

  const [mes, anio] = vencimiento.split('/').map(Number)
  const ahora = new Date()
  const anioActual = ahora.getFullYear() % 100
  if (!/^\d{2}\/\d{2}$/.test(vencimiento) || mes < 1 || mes > 12) {
    errores.vencimiento = 'Usa el formato MM/AA.'
  } else if (anio < anioActual || (anio === anioActual && mes < ahora.getMonth() + 1)) {
    errores.vencimiento = 'La tarjeta está vencida.'
  }

  if (!/^\d{3,4}$/.test(cvv)) errores.cvv = 'El CVV tiene 3 o 4 dígitos.'
  return errores
}

export default function Pago() {
  const navigate = useNavigate()
  const { actualizarUsuario } = useAuth()
  const [reserva] = useState(obtenerReserva)
  const [tarjeta, setTarjeta] = useState({ titular: '', numero: '', vencimiento: '', cvv: '' })
  const [errores, setErrores] = useState({})
  const [procesando, setProcesando] = useState(false)

  if (!reserva?.asientos?.length) return <Navigate to="/comprar" replace />

  const { total, descuento } = calcularTotales(reserva)

  const cambiar = (campo, formatear = (v) => v) => (e) => {
    setTarjeta((t) => ({ ...t, [campo]: formatear(e.target.value) }))
    setErrores((err) => ({ ...err, [campo]: undefined }))
  }

  const pagar = (e) => {
    e.preventDefault()
    const nuevos = validar(tarjeta)
    setErrores(nuevos)
    if (Object.keys(nuevos).length) return

    setProcesando(true)
    // Simula la respuesta de la pasarela de pago
    setTimeout(() => {
      const viaje = {
        id: crypto.randomUUID(),
        origen: reserva.origen,
        destino: reserva.destino,
        fecha: reserva.fecha,
        hora: reserva.hora,
        asientos: reserva.asientos,
        comida: reserva.comida,
        cupon: reserva.cupon,
        descuento,
        total,
        compradoEl: new Date().toISOString(),
      }
      actualizarUsuario((u) => ({
        ...u,
        viajes: [...u.viajes, viaje],
        cuponesUsados: reserva.cupon ? [...u.cuponesUsados, reserva.cupon] : u.cuponesUsados,
      }))
      guardarUltimaCompra(viaje)
      guardarReserva(null)
      toast.success('¡Pago aprobado! Gracias por viajar con SipoBus.')
      navigate('/exito', { replace: true })
    }, 2200)
  }

  const mascara = '•••• •••• •••• ••••'
  const numeroVisible = tarjeta.numero + mascara.slice(tarjeta.numero.length)

  return (
    <PageShell eyebrow="Pago seguro" titulo="Datos de pago" fondo={buscarDestino(reserva.destino)?.imagen} ancho="max-w-5xl">
      <PasosCompra actual={3} />

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,24rem)]">
        <Card>
          {/* Vista previa de la tarjeta */}
          <div className="relative mb-8 aspect-[1.586] max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 via-brand-700 to-ink-900 p-6 shadow-2xl shadow-brand-700/30">
            <div className="absolute -top-16 -right-16 size-48 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
            <div className="flex h-full flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="h-7 w-10 rounded-md bg-gradient-to-br from-amber-200 to-amber-400" />
                <span className="font-display text-sm font-bold">SipoPay</span>
              </div>
              <p className="font-mono text-lg tracking-widest sm:text-xl">{numeroVisible}</p>
              <div className="flex items-end justify-between text-xs uppercase">
                <span className="truncate pr-4">{tarjeta.titular || 'Nombre del titular'}</span>
                <span className="shrink-0 font-mono">{tarjeta.vencimiento || 'MM/AA'}</span>
              </div>
            </div>
          </div>

          <form onSubmit={pagar} noValidate className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Titular de la tarjeta"
              className="sm:col-span-2"
              autoComplete="cc-name"
              value={tarjeta.titular}
              onChange={cambiar('titular')}
              error={errores.titular}
            />
            <Field
              label="Número de tarjeta"
              className="sm:col-span-2"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="0000 0000 0000 0000"
              value={tarjeta.numero}
              onChange={cambiar('numero', formatearTarjeta)}
              error={errores.numero}
            />
            <Field
              label="Vencimiento"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/AA"
              value={tarjeta.vencimiento}
              onChange={cambiar('vencimiento', formatearVencimiento)}
              error={errores.vencimiento}
            />
            <Field
              label="CVV"
              type="password"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="•••"
              maxLength={4}
              value={tarjeta.cvv}
              onChange={cambiar('cvv', (v) => v.replace(/\D/g, ''))}
              error={errores.cvv}
            />
            <button type="submit" disabled={procesando} className="btn btn-primary sm:col-span-2">
              {procesando ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Procesando pago…
                </>
              ) : (
                <>
                  <Lock className="size-4" /> Pagar {formatearPrecio(total)}
                </>
              )}
            </button>
            <p className="text-center text-xs text-white/40 sm:col-span-2">
              Pago simulado: no se realiza ningún cargo real.
            </p>
          </form>
        </Card>

        <Card className="lg:sticky lg:top-24 lg:self-start">
          <ResumenCompra reserva={reserva} />
        </Card>
      </div>
    </PageShell>
  )
}
