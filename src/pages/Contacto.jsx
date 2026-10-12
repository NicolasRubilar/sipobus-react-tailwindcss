import { useState } from 'react'
import { toast } from 'sonner'
import { Clock, Mail, MapPin, Send } from 'lucide-react'
import PageShell from '../components/PageShell'
import { Card, Field } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { DESTINOS } from '../lib/destinos'
import { guardarMensajeContacto } from '../lib/storage'

export default function Contacto() {
  const { usuario } = useAuth()
  const [datos, setDatos] = useState({
    nombre: usuario ? `${usuario.nombre} ${usuario.apellido}` : '',
    email: usuario?.correo ?? '',
    mensaje: '',
  })
  const [errores, setErrores] = useState({})

  const cambiar = (campo) => (e) => {
    setDatos((d) => ({ ...d, [campo]: e.target.value }))
    setErrores((err) => ({ ...err, [campo]: undefined }))
  }

  const enviar = (e) => {
    e.preventDefault()
    const err = {}
    if (!datos.nombre.trim()) err.nombre = 'Ingresa tu nombre.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(datos.email.trim())) err.email = 'Ingresa un correo válido.'
    if (datos.mensaje.trim().length < 10) err.mensaje = 'Cuéntanos un poco más (mínimo 10 caracteres).'
    setErrores(err)
    if (Object.keys(err).length) return

    guardarMensajeContacto(datos)
    setDatos((d) => ({ ...d, mensaje: '' }))
    toast.success('¡Gracias por escribirnos! Te responderemos pronto.')
  }

  return (
    <PageShell
      eyebrow="Estamos para ayudarte"
      titulo="Contacto"
      descripcion="¿Dudas con tu pasaje, equipaje o un cupón? Escríbenos."
      fondo={DESTINOS[2].imagen}
      ancho="max-w-5xl"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <Card>
          <form onSubmit={enviar} noValidate className="grid gap-5 sm:grid-cols-2">
            <Field label="Nombre" autoComplete="name" value={datos.nombre} onChange={cambiar('nombre')} error={errores.nombre} />
            <Field label="Correo electrónico" type="email" autoComplete="email" value={datos.email} onChange={cambiar('email')} error={errores.email} />
            <Field
              label="Mensaje"
              as="textarea"
              className="sm:col-span-2"
              rows={5}
              placeholder="¿En qué podemos ayudarte?"
              value={datos.mensaje}
              onChange={cambiar('mensaje')}
              error={errores.mensaje}
            />
            <button type="submit" className="btn btn-primary sm:col-span-2">
              <Send className="size-4" /> Enviar mensaje
            </button>
          </form>
        </Card>

        <Card className="space-y-5 text-sm lg:self-start">
          <p className="flex gap-3"><MapPin className="size-5 shrink-0 text-brand-300" /><span className="text-white/70">Av. Libertador Bernardo O'Higgins 3850, Estación Central, Santiago</span></p>
          <p className="flex gap-3"><Mail className="size-5 shrink-0 text-brand-300" /><span className="text-white/70">contacto@sipobus.cl</span></p>
          <p className="flex gap-3"><Clock className="size-5 shrink-0 text-brand-300" /><span className="text-white/70">Lunes a domingo, 07:00 a 23:30</span></p>
        </Card>
      </div>
    </PageShell>
  )
}
