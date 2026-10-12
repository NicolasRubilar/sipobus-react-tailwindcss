import { hoyISO } from './precios'

export const viajeVigente = (viaje) => viaje.fecha >= hoyISO()

export const describirViaje = (v) =>
  `${v.origen} → ${v.destino} · ${v.fecha} ${v.hora} · Asientos ${v.asientos.map((a) => a.id).join(', ')}`

/** Mueve un viaje de "viajes" a "viajesAnulados". */
export function anularViaje(usuario, id, motivo = '') {
  const viaje = usuario.viajes.find((v) => v.id === id)
  if (!viaje) return usuario
  return {
    ...usuario,
    viajes: usuario.viajes.filter((v) => v.id !== id),
    viajesAnulados: [...usuario.viajesAnulados, { ...viaje, motivo, anuladoEl: new Date().toISOString() }],
  }
}

/** Cambia fecha y hora de un viaje guardando el historial del cambio. */
export function cambiarViaje(usuario, id, { fecha, hora, motivo = '' }) {
  return {
    ...usuario,
    viajes: usuario.viajes.map((v) =>
      v.id === id
        ? {
            ...v,
            fecha,
            hora,
            cambios: [...(v.cambios ?? []), { desde: { fecha: v.fecha, hora: v.hora }, motivo, el: new Date().toISOString() }],
          }
        : v,
    ),
  }
}
