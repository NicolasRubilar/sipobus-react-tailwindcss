import { Check } from 'lucide-react'

const PASOS = ['Viaje', 'Asientos', 'Resumen', 'Pago']

export default function PasosCompra({ actual }) {
  return (
    <ol className="mb-8 flex items-center gap-2 text-xs font-medium sm:gap-3" aria-label="Pasos de la compra">
      {PASOS.map((paso, i) => {
        const estado = i < actual ? 'hecho' : i === actual ? 'actual' : 'pendiente'
        return (
          <li key={paso} className="flex flex-1 items-center gap-2 sm:gap-3" aria-current={estado === 'actual' ? 'step' : undefined}>
            <span
              className={`grid size-7 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                estado === 'hecho'
                  ? 'bg-brand-400 text-ink-950'
                  : estado === 'actual'
                    ? 'bg-white text-ink-950'
                    : 'border border-white/20 text-white/50'
              }`}
            >
              {estado === 'hecho' ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
            </span>
            <span className={`hidden sm:block ${estado === 'pendiente' ? 'text-white/45' : 'text-white'}`}>{paso}</span>
            {i < PASOS.length - 1 && (
              <span className={`h-px flex-1 ${i < actual ? 'bg-brand-400' : 'bg-white/15'}`} />
            )}
          </li>
        )
      })}
    </ol>
  )
}
