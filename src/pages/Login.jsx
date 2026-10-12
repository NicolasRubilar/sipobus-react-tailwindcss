import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { LogIn } from 'lucide-react'
import PageShell from '../components/PageShell'
import { Card, Field } from '../components/ui'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { iniciarSesion } = useAuth()
  const navigate = useNavigate()
  const { state } = useLocation()
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')

  const enviar = (e) => {
    e.preventDefault()
    if (!correo.trim() || !clave) {
      setError('Ingresa tu correo y contraseña.')
      return
    }
    try {
      const usuario = iniciarSesion(correo, clave)
      toast.success(`¡Hola de nuevo, ${usuario.nombre}!`)
      navigate(state?.desde ?? '/perfil', { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <PageShell eyebrow="Bienvenido de vuelta" titulo="Iniciar sesión" ancho="max-w-md">
      {state?.aviso && (
        <p className="mb-6 rounded-2xl bg-brand-400/10 px-4 py-3 text-sm text-brand-200 ring-1 ring-brand-300/25">
          Inicia sesión para continuar con tu compra o ver tu perfil.
        </p>
      )}
      <Card>
        <form onSubmit={enviar} noValidate className="space-y-5">
          <Field
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            value={correo}
            onChange={(e) => {
              setCorreo(e.target.value)
              setError('')
            }}
          />
          <Field
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            value={clave}
            onChange={(e) => {
              setClave(e.target.value)
              setError('')
            }}
          />
          {error && (
            <p role="alert" className="text-sm text-red-300">{error}</p>
          )}
          <button type="submit" className="btn btn-primary w-full">
            <LogIn className="size-4" /> Ingresar
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-white/60">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" state={state} className="font-semibold text-brand-300 hover:underline">
            Crea una aquí
          </Link>
        </p>
      </Card>
    </PageShell>
  )
}
