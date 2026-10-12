import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { CircleCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { CIUDADES, HORARIOS } from '../lib/destinos'
import { hoyISO } from '../lib/precios'
import { guardarSolicitud } from '../lib/storage'
import { anularViaje, cambiarViaje, describirViaje, viajeVigente } from '../lib/viajes'
import { Card, Field } from './ui'

const HORAS_MINIMAS = 4

const horasParaSalida = (v) => (new Date(`${v.fecha}T${v.hora}`) - new Date()) / 36e5

const MANUAL_VACIO = { origen: '', destino: '', fecha: '', hora: '', asientos: '' }

/** Formulario compartido de "Cambiar pasaje" y "Anular pasaje". */
export default function GestionPasaje({ modo }) {
  const esCambio = modo === 'cambiar'
  const { usuario, actualizarUsuario } = useAuth()
  const { state } = useLocation()
  const viajes = usuario?.viajes.filter(viajeVigente) ?? []

  const [viajeId, setViajeId] = useState(() =>
    viajes.some((v) => v.id === state?.viajeId) ? state.viajeId : (viajes[0]?.id ?? ''),
  )
  const [manual, setManual] = useState(viajes.length === 0)
  const [datosManual, setDatosManual] = useState(MANUAL_VACIO)
  const [correo, setCorreo] = useState(usuario?.correo ?? '')
  const [nueva, setNueva] = useState({ fecha: '', hora: '' })
  const [motivo, setMotivo] = useState('')
  const [errores, setErrores] = useState({})
  const [listo, setListo] = useState(null)

  const limpiar = (campo) => setErrores((e) => ({ ...e, [campo]: undefined }))

  const enviar = (e) => {
    e.preventDefault()
    const err = {}
    const viaje = viajes.find((v) => v.id === viajeId)

    if (manual) {
      if (!datosManual.origen) err.origen = 'Selecciona el origen.'
      if (!datosManual.destino) err.destino = 'Selecciona el destino.'
      if (!datosManual.fecha) err.fecha = 'Ingresa la fecha.'
      if (!datosManual.hora) err.hora = 'Selecciona el horario.'
      if (!datosManual.asientos.trim()) err.asientos = 'Indica tus asientos.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo.trim())) err.correo = 'Ingresa un correo válido.'
    } else if (!viaje) {
      err.viaje = 'Selecciona un viaje.'
    } else if (horasParaSalida(viaje) < HORAS_MINIMAS) {
      err.viaje = `Solo puedes ${esCambio ? 'cambiar' : 'anular'} hasta ${HORAS_MINIMAS} horas antes de la salida.`
    }

    if (esCambio) {
      if (!nueva.fecha) err.nuevaFecha = 'Elige la nueva fecha.'
      else if (nueva.fecha < hoyISO()) err.nuevaFecha = 'La fecha no puede ser anterior a hoy.'
      if (!nueva.hora) err.nuevaHora = 'Elige el nuevo horario.'
    }

    setErrores(err)
    if (Object.keys(err).length) return

    if (manual) {
      guardarSolicitud({ tipo: modo, viaje: datosManual, correo: correo.trim(), motivo, ...(esCambio && { nueva }) })
      setListo('Recibimos tu solicitud. Te enviaremos la confirmación por correo.')
    } else {
      actualizarUsuario((u) =>
        esCambio ? cambiarViaje(u, viaje.id, { ...nueva, motivo }) : anularViaje(u, viaje.id, motivo),
      )
      setListo(esCambio ? 'Tu viaje quedó actualizado con la nueva fecha y horario.' : 'Tu pasaje fue anulado.')
    }
    toast.success(esCambio ? 'Cambio registrado.' : 'Anulación registrada.')
  }

  if (listo) {
    return (
      <Card className="flex flex-col items-center text-center">
        <CircleCheck className="size-12 text-emerald-300" />
        <p className="mt-4 max-w-sm text-sm text-white/75">{listo}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {usuario && <Link to="/perfil" className="btn btn-primary">Ver mis viajes</Link>}
          <Link to="/" className="btn btn-ghost">Volver al inicio</Link>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <form onSubmit={enviar} noValidate className="grid gap-5 sm:grid-cols-2">
        {!manual ? (
          <Field
            label="Tu viaje"
            as="select"
            className="sm:col-span-2"
            value={viajeId}
            onChange={(e) => {
              setViajeId(e.target.value)
              limpiar('viaje')
            }}
            error={errores.viaje}
          >
            {viajes.map((v) => (
              <option key={v.id} value={v.id}>{describirViaje(v)}</option>
            ))}
          </Field>
        ) : (
          <>
            {[
              ['origen', 'Origen'],
              ['destino', 'Destino'],
            ].map(([campo, label]) => (
              <Field
                key={campo}
                label={label}
                as="select"
                value={datosManual[campo]}
                onChange={(e) => {
                  setDatosManual((d) => ({ ...d, [campo]: e.target.value }))
                  limpiar(campo)
                }}
                error={errores[campo]}
              >
                <option value="" disabled>Selecciona</option>
                {CIUDADES.map((c) => <option key={c}>{c}</option>)}
              </Field>
            ))}
            <Field
              label="Fecha del viaje"
              type="date"
              value={datosManual.fecha}
              onChange={(e) => {
                setDatosManual((d) => ({ ...d, fecha: e.target.value }))
                limpiar('fecha')
              }}
              error={errores.fecha}
            />
            <Field
              label="Horario"
              as="select"
              value={datosManual.hora}
              onChange={(e) => {
                setDatosManual((d) => ({ ...d, hora: e.target.value }))
                limpiar('hora')
              }}
              error={errores.hora}
            >
              <option value="" disabled>Selecciona</option>
              {HORARIOS.map((h) => <option key={h}>{h}</option>)}
            </Field>
            <Field
              label="Asiento(s)"
              placeholder="Ej: 12, 13"
              value={datosManual.asientos}
              onChange={(e) => {
                setDatosManual((d) => ({ ...d, asientos: e.target.value }))
                limpiar('asientos')
              }}
              error={errores.asientos}
            />
            <Field
              label="Correo electrónico"
              type="email"
              value={correo}
              onChange={(e) => {
                setCorreo(e.target.value)
                limpiar('correo')
              }}
              error={errores.correo}
            />
          </>
        )}

        {viajes.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setManual((m) => !m)
              setErrores({})
            }}
            className="justify-self-start text-xs font-semibold text-brand-300 hover:underline sm:col-span-2"
          >
            {manual ? '← Elegir uno de mis viajes' : '¿Tu pasaje no aparece? Ingrésalo manualmente'}
          </button>
        )}

        {esCambio && (
          <>
            <Field
              label="Nueva fecha"
              type="date"
              min={hoyISO()}
              value={nueva.fecha}
              onChange={(e) => {
                setNueva((n) => ({ ...n, fecha: e.target.value }))
                limpiar('nuevaFecha')
              }}
              error={errores.nuevaFecha}
            />
            <Field
              label="Nuevo horario"
              as="select"
              value={nueva.hora}
              onChange={(e) => {
                setNueva((n) => ({ ...n, hora: e.target.value }))
                limpiar('nuevaHora')
              }}
              error={errores.nuevaHora}
            >
              <option value="" disabled>Selecciona</option>
              {HORARIOS.map((h) => <option key={h}>{h}</option>)}
            </Field>
          </>
        )}

        <Field
          label={esCambio ? 'Motivo del cambio (opcional)' : 'Motivo de la anulación (opcional)'}
          as="textarea"
          className="sm:col-span-2"
          rows={3}
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />

        <button type="submit" className={`btn sm:col-span-2 ${esCambio ? 'btn-primary' : 'btn-danger'}`}>
          {esCambio ? 'Cambiar pasaje' : 'Anular pasaje'}
        </button>
      </form>
    </Card>
  )
}
