import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { UserPlus } from 'lucide-react'
import PageShell from '../components/PageShell'
import { Card, Field } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { hoyISO } from '../lib/precios'
import { validarPerfil } from '../lib/validaciones'

const VACIO = {
  nombre: '',
  apellido: '',
  correo: '',
  telefono: '',
  fechaNacimiento: '',
  direccion: '',
  clave: '',
  confirmar: '',
  terminos: false,
}

export default function Registro() {
  const { registrar } = useAuth()
  const navigate = useNavigate()
  const { state } = useLocation()
  const [datos, setDatos] = useState(VACIO)
  const [errores, setErrores] = useState({})

  const cambiar = (campo) => (e) => {
    const valor = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setDatos((d) => ({ ...d, [campo]: valor }))
    setErrores((err) => ({ ...err, [campo]: undefined }))
  }

  const enviar = (e) => {
    e.preventDefault()
    const nuevos = validarPerfil(datos)
    if (datos.clave.length < 8) nuevos.clave = 'Mínimo 8 caracteres.'
    if (datos.confirmar !== datos.clave) nuevos.confirmar = 'Las contraseñas no coinciden.'
    if (!datos.terminos) nuevos.terminos = 'Debes aceptar los términos y condiciones.'
    setErrores(nuevos)
    if (Object.keys(nuevos).length) return

    const { confirmar: _confirmar, terminos: _terminos, ...perfil } = datos
    try {
      registrar({ ...perfil, nombre: perfil.nombre.trim(), apellido: perfil.apellido.trim() })
      toast.success('¡Cuenta creada! Bienvenido a SipoBus.')
      navigate(state?.desde ?? '/perfil', { replace: true })
    } catch (err) {
      setErrores({ correo: err.message })
    }
  }

  return (
    <PageShell
      eyebrow="Únete a SipoBus"
      titulo="Crear cuenta"
      descripcion="Guarda tus viajes, acumula cupones de descuento y compra más rápido."
      ancho="max-w-2xl"
    >
      <Card>
        <form onSubmit={enviar} noValidate className="grid gap-5 sm:grid-cols-2">
          <Field label="Nombre" autoComplete="given-name" value={datos.nombre} onChange={cambiar('nombre')} error={errores.nombre} />
          <Field label="Apellido" autoComplete="family-name" value={datos.apellido} onChange={cambiar('apellido')} error={errores.apellido} />
          <Field label="Correo electrónico" type="email" autoComplete="email" placeholder="ejemplo@correo.com" value={datos.correo} onChange={cambiar('correo')} error={errores.correo} />
          <Field label="Teléfono" type="tel" autoComplete="tel" placeholder="+56 9 1234 5678" value={datos.telefono} onChange={cambiar('telefono')} error={errores.telefono} />
          <Field label="Fecha de nacimiento" type="date" max={hoyISO()} value={datos.fechaNacimiento} onChange={cambiar('fechaNacimiento')} error={errores.fechaNacimiento} />
          <Field label="Dirección" autoComplete="street-address" value={datos.direccion} onChange={cambiar('direccion')} error={errores.direccion} />
          <Field label="Contraseña" type="password" autoComplete="new-password" hint="Mínimo 8 caracteres." value={datos.clave} onChange={cambiar('clave')} error={errores.clave} />
          <Field label="Confirmar contraseña" type="password" autoComplete="new-password" value={datos.confirmar} onChange={cambiar('confirmar')} error={errores.confirmar} />

          <div className="sm:col-span-2">
            <label className="flex cursor-pointer items-center gap-3 text-sm text-white/75">
              <input type="checkbox" checked={datos.terminos} onChange={cambiar('terminos')} className="size-4 accent-brand-400" />
              Acepto los términos y condiciones
            </label>
            {errores.terminos && <p className="mt-1.5 text-xs text-red-300">{errores.terminos}</p>}
          </div>

          <button type="submit" className="btn btn-primary sm:col-span-2">
            <UserPlus className="size-4" /> Registrarme
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-white/60">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" state={state} className="font-semibold text-brand-300 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </Card>
    </PageShell>
  )
}
