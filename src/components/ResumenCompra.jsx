import { ArrowRight, CalendarDays, Clock, UtensilsCrossed } from 'lucide-react'
import { PRECIOS, PRECIO_COMIDA, TIPOS_ASIENTO, calcularTotales, formatearFecha, formatearPrecio } from '../lib/precios'

/** Detalle del viaje y desglose de precios; se usa en Resumen, Pago y Éxito. */
export default function ResumenCompra({ reserva }) {
  const { subtotalComida, descuento, total } = calcularTotales(reserva)

  return (
    <div>
      <div className="flex items-center gap-3 font-display text-xl font-bold sm:text-2xl">
        <span>{reserva.origen}</span>
        <ArrowRight className="size-5 shrink-0 text-brand-300" />
        <span>{reserva.destino}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/65">
        <span className="flex items-center gap-1.5">
          <CalendarDays className="size-4" /> {formatearFecha(reserva.fecha)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="size-4" /> {reserva.hora} hrs
        </span>
      </div>

      <ul className="mt-6 divide-y divide-white/10 border-y border-white/10 text-sm">
        {reserva.asientos.map((a) => (
          <li key={a.id} className="flex items-center justify-between py-3">
            <span>
              Asiento <strong className="font-semibold">{a.id}</strong>
              <span className="text-white/50"> · {TIPOS_ASIENTO[a.tipo].label}</span>
            </span>
            <span className="tabular-nums">{formatearPrecio(PRECIOS[a.tipo])}</span>
          </li>
        ))}
        {reserva.comida && (
          <li className="flex items-center justify-between py-3">
            <span className="flex items-center gap-2">
              <UtensilsCrossed className="size-4 text-brand-300" />
              Comida SipoBus
              <span className="text-white/50">
                · {reserva.asientos.length} × {formatearPrecio(PRECIO_COMIDA)}
              </span>
            </span>
            <span className="tabular-nums">{formatearPrecio(subtotalComida)}</span>
          </li>
        )}
        {descuento > 0 && (
          <li className="flex items-center justify-between py-3 text-emerald-300">
            <span>Cupón {reserva.cupon} (10%)</span>
            <span className="tabular-nums">−{formatearPrecio(descuento)}</span>
          </li>
        )}
      </ul>

      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-sm text-white/65">Total</span>
        <span className="font-display text-2xl font-extrabold tabular-nums">
          {formatearPrecio(total)} <span className="text-xs font-medium text-white/50">CLP</span>
        </span>
      </div>
    </div>
  )
}
