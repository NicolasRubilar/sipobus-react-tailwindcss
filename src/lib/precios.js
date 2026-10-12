export const PRECIOS = {
  normal: 2000,
  'sillon-cama': 3000,
  discapacitado: 2000,
}

export const PRECIO_COMIDA = 1000
export const DESCUENTO_CUPON = 0.1

export const TIPOS_ASIENTO = {
  discapacitado: { label: 'Preferencial', clase: 'bg-emerald-400/15 border-emerald-300/40 text-emerald-100' },
  normal: { label: 'Normal', clase: 'bg-white/8 border-white/20 text-white/80' },
  'sillon-cama': { label: 'Sillón cama', clase: 'bg-amber-400/15 border-amber-300/40 text-amber-100' },
}

export const formatearPrecio = (monto) => `$${Math.round(monto).toLocaleString('es-CL')}`

export function calcularTotales({ asientos = [], comida = false, cupon = null }) {
  const subtotalAsientos = asientos.reduce((suma, a) => suma + (PRECIOS[a.tipo] ?? 0), 0)
  const subtotalComida = comida ? asientos.length * PRECIO_COMIDA : 0
  const subtotal = subtotalAsientos + subtotalComida
  const descuento = cupon ? Math.round(subtotal * DESCUENTO_CUPON) : 0
  return { subtotalAsientos, subtotalComida, subtotal, descuento, total: subtotal - descuento }
}

export const formatearFecha = (iso) => {
  if (!iso) return '—'
  const [anio, mes, dia] = iso.split('-').map(Number)
  return new Date(anio, mes - 1, dia).toLocaleDateString('es-CL', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export const hoyISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
