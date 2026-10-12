import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowRight, Armchair, UtensilsCrossed } from 'lucide-react'
import PageShell from '../components/PageShell'
import PasosCompra from '../components/PasosCompra'
import ResumenCompra from '../components/ResumenCompra'
import { Card } from '../components/ui'
import { buscarDestino } from '../lib/destinos'
import { PRECIOS, PRECIO_COMIDA, TIPOS_ASIENTO, formatearPrecio } from '../lib/precios'
import { asientosOcupados, guardarReserva, obtenerReserva } from '../lib/storage'

const FILAS = 8
const COLUMNAS = 4

// Primeras 2 filas preferenciales, filas 3 a 6 normales, últimas 2 sillón cama
const tipoPorFila = (fila) => (fila < 2 ? 'discapacitado' : fila < 6 ? 'normal' : 'sillon-cama')

const FILAS_BUS = Array.from({ length: FILAS }, (_, f) =>
  Array.from({ length: COLUMNAS }, (_, c) => ({ id: f * COLUMNAS + c + 1, tipo: tipoPorFila(f) })),
)

export default function Asientos() {
  const navigate = useNavigate()
  const [reserva] = useState(obtenerReserva)
  const [seleccion, setSeleccion] = useState(() => reserva?.asientos ?? [])
  const [comida, setComida] = useState(() => reserva?.comida ?? false)
  const ocupados = useMemo(() => (reserva ? new Set(asientosOcupados(reserva)) : new Set()), [reserva])

  if (!reserva?.origen) return <Navigate to="/comprar" replace />

  const alternar = (asiento) => {
    setSeleccion((actual) =>
      actual.some((a) => a.id === asiento.id)
        ? actual.filter((a) => a.id !== asiento.id)
        : [...actual, asiento].sort((a, b) => a.id - b.id),
    )
  }

  const continuar = () => {
    if (!seleccion.length) {
      toast.error('Selecciona al menos un asiento para continuar.')
      return
    }
    guardarReserva({ ...reserva, asientos: seleccion, comida })
    navigate('/resumen')
  }

  return (
    <PageShell
      eyebrow={`${reserva.origen} → ${reserva.destino}`}
      titulo="Elige tus asientos"
      fondo={buscarDestino(reserva.destino)?.imagen}
      ancho="max-w-5xl"
    >
      <PasosCompra actual={1} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,26rem)_1fr]">
        <Card className="!p-5 sm:!p-7">
          <div className="mb-5 flex items-center justify-between rounded-2xl border border-white/10 px-4 py-2.5 text-xs text-white/50">
            <span>Puerta</span>
            <span className="flex items-center gap-1.5">
              <span className="grid size-6 place-items-center rounded-full border border-white/25 text-[9px]">◎</span>
              Conductor
            </span>
          </div>

          <div className="space-y-2.5" role="group" aria-label="Plano de asientos del bus">
            {FILAS_BUS.map((fila, f) => (
              <div key={f} className="grid grid-cols-[1fr_1fr_0.6fr_1fr_1fr] gap-2.5">
                {fila.map((asiento, c) => {
                  const ocupado = ocupados.has(asiento.id)
                  const elegido = seleccion.some((a) => a.id === asiento.id)
                  return (
                    <button
                      key={asiento.id}
                      type="button"
                      disabled={ocupado}
                      onClick={() => alternar(asiento)}
                      aria-pressed={elegido}
                      aria-label={`Asiento ${asiento.id}, ${TIPOS_ASIENTO[asiento.tipo].label}${ocupado ? ', ocupado' : ''}`}
                      style={{ gridColumn: c < 2 ? c + 1 : c + 2 }}
                      className={`relative aspect-square rounded-xl border text-xs font-semibold transition duration-150 active:scale-90 ${
                        ocupado
                          ? 'cursor-not-allowed border-white/5 bg-white/[0.03] text-white/20 line-through'
                          : elegido
                            ? 'border-brand-200 bg-brand-400 text-ink-950 shadow-lg shadow-brand-500/40'
                            : `${TIPOS_ASIENTO[asiento.tipo].clase} hover:border-white/60`
                      }`}
                    >
                      {asiento.id}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>

          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-white/60">
            {Object.entries(TIPOS_ASIENTO).map(([tipo, { label, clase }]) => (
              <li key={tipo} className="flex items-center gap-1.5">
                <span className={`size-3.5 rounded border ${clase}`} />
                {label} · {formatearPrecio(PRECIOS[tipo])}
              </li>
            ))}
            <li className="flex items-center gap-1.5">
              <span className="size-3.5 rounded border border-white/5 bg-white/[0.03]" /> Ocupado
            </li>
          </ul>
        </Card>

        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Card>
            {seleccion.length ? (
              <ResumenCompra reserva={{ ...reserva, asientos: seleccion, comida, cupon: null }} />
            ) : (
              <div className="flex flex-col items-center py-6 text-center text-white/55">
                <Armchair className="size-10 text-white/25" />
                <p className="mt-3 text-sm">Toca un asiento del plano para agregarlo a tu compra.</p>
              </div>
            )}
          </Card>

          <label className="glass flex cursor-pointer items-center gap-4 rounded-3xl p-5 transition hover:bg-white/10">
            <UtensilsCrossed className="size-5 shrink-0 text-brand-300" />
            <span className="flex-1 text-sm">
              <span className="block font-medium">Agregar comida SipoBus</span>
              <span className="text-white/55">+ {formatearPrecio(PRECIO_COMIDA)} por pasajero</span>
            </span>
            <input
              type="checkbox"
              checked={comida}
              onChange={(e) => setComida(e.target.checked)}
              className="size-5 accent-brand-400"
            />
          </label>

          <button type="button" onClick={continuar} className="btn btn-primary w-full">
            Continuar al resumen <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </PageShell>
  )
}
