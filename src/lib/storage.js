// Única capa que toca localStorage. Cuando exista el backend,
// estas funciones se reemplazan por llamadas a la API sin tocar los componentes.

const KEYS = {
  usuarios: 'sipobus:usuarios',
  sesion: 'sipobus:sesion',
  reserva: 'sipobus:reserva',
  ultimaCompra: 'sipobus:ultima-compra',
  mensajes: 'sipobus:mensajes-contacto',
  solicitudes: 'sipobus:solicitudes',
}

function leer(key, porDefecto) {
  try {
    const valor = localStorage.getItem(key)
    return valor ? JSON.parse(valor) : porDefecto
  } catch {
    return porDefecto
  }
}

function escribir(key, valor) {
  try {
    if (valor === null || valor === undefined) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(valor))
  } catch {
    // Modo privado o almacenamiento lleno: la app sigue funcionando en memoria
  }
}

const normalizarCorreo = (correo) => correo.trim().toLowerCase()

/* ---------- Usuarios ---------- */

export const obtenerUsuarios = () => leer(KEYS.usuarios, [])

export function buscarUsuario(correo) {
  return obtenerUsuarios().find((u) => u.correo === normalizarCorreo(correo)) ?? null
}

export function crearUsuario(datos) {
  const correo = normalizarCorreo(datos.correo)
  if (buscarUsuario(correo)) throw new Error('Ya existe una cuenta con ese correo.')
  const usuario = {
    ...datos,
    correo,
    cupones: [],
    cuponesUsados: [],
    viajes: [],
    viajesAnulados: [],
  }
  escribir(KEYS.usuarios, [...obtenerUsuarios(), usuario])
  return usuario
}

export function guardarUsuario(correoOriginal, usuario) {
  const usuarios = obtenerUsuarios()
  const actualizado = { ...usuario, correo: normalizarCorreo(usuario.correo) }
  if (
    actualizado.correo !== correoOriginal &&
    usuarios.some((u) => u.correo === actualizado.correo)
  ) {
    throw new Error('Ese correo ya está en uso por otra cuenta.')
  }
  escribir(
    KEYS.usuarios,
    usuarios.map((u) => (u.correo === correoOriginal ? actualizado : u)),
  )
  return actualizado
}

/* ---------- Sesión ---------- */

export const obtenerSesion = () => leer(KEYS.sesion, null)
export const guardarSesion = (correo) => escribir(KEYS.sesion, correo)

/* ---------- Compra en curso ---------- */

export const obtenerReserva = () => leer(KEYS.reserva, null)
export const guardarReserva = (reserva) => escribir(KEYS.reserva, reserva)

export const obtenerUltimaCompra = () => leer(KEYS.ultimaCompra, null)
export const guardarUltimaCompra = (compra) => escribir(KEYS.ultimaCompra, compra)

/** Asientos ya vendidos para un mismo servicio (origen, destino, fecha y hora). */
export function asientosOcupados({ origen, destino, fecha, hora }) {
  return obtenerUsuarios()
    .flatMap((u) => u.viajes)
    .filter((v) => v.origen === origen && v.destino === destino && v.fecha === fecha && v.hora === hora)
    .flatMap((v) => v.asientos.map((a) => a.id))
}

/* ---------- Formularios sin sesión ---------- */

export function guardarMensajeContacto(mensaje) {
  escribir(KEYS.mensajes, [...leer(KEYS.mensajes, []), { ...mensaje, fecha: new Date().toISOString() }])
}

export function guardarSolicitud(solicitud) {
  escribir(KEYS.solicitudes, [
    ...leer(KEYS.solicitudes, []),
    { ...solicitud, fecha: new Date().toISOString() },
  ])
}
