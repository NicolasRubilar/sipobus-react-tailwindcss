import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import * as storage from '../lib/storage'

const AuthContext = createContext(null)

function cargarUsuarioSesion() {
  const correo = storage.obtenerSesion()
  return correo ? storage.buscarUsuario(correo) : null
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(cargarUsuarioSesion)

  const iniciarSesion = useCallback((correo, clave) => {
    const encontrado = storage.buscarUsuario(correo)
    if (!encontrado) throw new Error('No existe una cuenta con ese correo.')
    if (encontrado.clave !== clave) throw new Error('La contraseña es incorrecta.')
    storage.guardarSesion(encontrado.correo)
    setUsuario(encontrado)
    return encontrado
  }, [])

  const registrar = useCallback((datos) => {
    const nuevo = storage.crearUsuario(datos)
    storage.guardarSesion(nuevo.correo)
    setUsuario(nuevo)
    return nuevo
  }, [])

  const cerrarSesion = useCallback(() => {
    storage.guardarSesion(null)
    setUsuario(null)
  }, [])

  /** Recibe una función (usuarioActual) => usuarioNuevo y lo persiste. */
  const actualizarUsuario = useCallback((actualizar) => {
    const actual = cargarUsuarioSesion()
    if (!actual) return null
    const guardado = storage.guardarUsuario(actual.correo, actualizar(actual))
    storage.guardarSesion(guardado.correo)
    setUsuario(guardado)
    return guardado
  }, [])

  const valor = useMemo(
    () => ({ usuario, iniciarSesion, registrar, cerrarSesion, actualizarUsuario }),
    [usuario, iniciarSesion, registrar, cerrarSesion, actualizarUsuario],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
